import { nanoid } from 'nanoid';
import {
  Disposable,
  EventEmitter,
  ExtensionContext,
  Uri,
  window,
  workspace
} from 'vscode';

import { TabActiveStateHandler } from '../handlers/tab-active-state';
import { TabCollectionStateHandler } from '../handlers/tab-collection-state';
import { TabStateContainerHandler } from '../handlers/tab-state-container';
import { PersistenceMediator } from '../mediators/persistence';
import { transform as migrate } from '../transformers/migration';
import {
  toAbsoluteTabStateFile,
  toRelativeTabStateFile
} from '../transformers/tab-uris';
import { GitIntegrationMode } from '../types/config';
import {
  ExtensionNotificationKind,
  ExtensionNotificationMessage,
  ExtensionTabsSyncMessage
} from '../types/messages';
import {
  createEmptyStateContainer,
  CURRENT_STATE_FILE_VERSION,
  ITabManagerService,
  QuickSlotIndex,
  RenderingItem,
  StateContainer,
  TabStateFileContent
} from '../types/tab-manager';
import {
  closeAllEditors,
  focusTabInGroup,
  getEditorLayout,
  moveTab,
  pinEditor,
  setEditorLayout,
  unpinEditor
} from '../utils/commands';
import { isLayoutEqual } from '../utils/is-layout-equal';
import {
  closeTab,
  countTabs,
  findTabByViewColumnAndIndex,
  findTabGroupByViewColumn,
  isTabStateEqual
} from '../utils/tab-utils';
import { ConfigService } from './config';
import { EditorLayoutService } from './editor-layout';
import { getLogger, ScopedLogger } from './logger';
import {
  GitBranchChangeEvent,
  GitRepositoryOpenEvent,
  GitService
} from './git';

export class TabManagerService implements ITabManagerService {
  private _rendering: boolean;
  private _nextRenderingItem: RenderingItem;

  private _context: ExtensionContext;
  private _activeStateHandler: TabActiveStateHandler | null;
  private _stateContainerHandler: TabStateContainerHandler | null;
  private _collectionHandler: TabCollectionStateHandler | null;
  private _persistenceMediator: PersistenceMediator | null;

  private _layoutService: EditorLayoutService;
  private _configService: ConfigService;
  private _gitService: GitService;

  private _renderCompleteEmitter: EventEmitter<void>;

  private _syncViewEmitter: EventEmitter<
    Omit<ExtensionTabsSyncMessage, 'type'>
  >;

  private _notifyViewEmitter: EventEmitter<
    Omit<ExtensionNotificationMessage, 'type'>
  >;

  private _disposables: Disposable[] = [];
  private _log: ScopedLogger;

  constructor(
    context: ExtensionContext,
    layoutService: EditorLayoutService,
    configService: ConfigService,
    gitService: GitService
  ) {
    this._context = context;
    this._nextRenderingItem = null;
    this._activeStateHandler = null;
    this._stateContainerHandler = null;
    this._collectionHandler = null;
    this._persistenceMediator = null;
    this._rendering = false;
    this._layoutService = layoutService;
    this._configService = configService;
    this._gitService = gitService;
    this._syncViewEmitter = new EventEmitter<
      Omit<ExtensionTabsSyncMessage, 'type'>
    >();
    this._notifyViewEmitter = new EventEmitter<
      Omit<ExtensionNotificationMessage, 'type'>
    >();
    this._renderCompleteEmitter = new EventEmitter<void>();
    this._log = getLogger().child('TabManager');

    this.initializeEvents();
  }

  get config() {
    return this._configService;
  }

  get state() {
    return {
      groups: this._collectionHandler?.groups ?? {},
      history: this._collectionHandler?.history ?? {},
      addons: this._collectionHandler?.addons ?? {},
      quickSlots: this._collectionHandler?.quickSlots ?? {},
      stateContainer:
        this._stateContainerHandler?.currentStateContainer ?? null,
      previousStateContainer:
        this._stateContainerHandler?.previousStateContainer ?? null
    };
  }

  get onDidSyncTabs() {
    return this._syncViewEmitter.event;
  }

  get onDidNotify() {
    return this._notifyViewEmitter.event;
  }

  get onDidCompleteRender() {
    return this._renderCompleteEmitter.event;
  }

  async attachStateHandler() {
    this._log.info('attaching state handlers');
    // Dispose old handlers
    this._activeStateHandler?.dispose();
    this._stateContainerHandler?.dispose();
    this._collectionHandler?.dispose();

    // Create new handlers
    this._activeStateHandler = new TabActiveStateHandler(
      this._layoutService,
      this._configService
    );
    this._stateContainerHandler = new TabStateContainerHandler();
    this._collectionHandler = new TabCollectionStateHandler();

    // Setup persistence
    this._persistenceMediator = new PersistenceMediator(
      this._context,
      this._configService
    );
    await this._persistenceMediator.load();

    const fileState = this._persistenceMediator.get();

    this._collectionHandler.initialize({
      groups: fileState.groups,
      history: fileState.history,
      addons: fileState.addons,
      quickSlots: fileState.quickSlots
    });

    // Set current state container
    let currentStateContainer =
      fileState.selectedGroup in fileState.groups
        ? fileState.groups[fileState.selectedGroup]
        : null;
    const previousStateContainer =
      fileState.previousSelectedGroup in fileState.groups
        ? fileState.groups[fileState.previousSelectedGroup]
        : null;

    if (currentStateContainer == null) {
      this._activeStateHandler.syncTabs();
      currentStateContainer = createEmptyStateContainer();
      currentStateContainer.state =
        this._activeStateHandler.getTabManagerState();
    }

    this._stateContainerHandler.initialize(
      currentStateContainer,
      previousStateContainer
    );

    this.applyState(null);

    // Connect handlers
    this._activeStateHandler.onDidChangeState((tabManagerState) => {
      this._stateContainerHandler.updateTabState(tabManagerState);
    });

    this._stateContainerHandler.onDidChangeState(
      ({ currentStateContainer }) => {
        if (currentStateContainer.id in this._collectionHandler.groups) {
          this._collectionHandler.updateGroup(
            currentStateContainer.id,
            currentStateContainer
          );
        }

        void this.save();
        this.triggerSync();
      }
    );

    this._collectionHandler.onDidChangeState(() => {
      void this.save();
      this.triggerSync();
    });

    void this.save();
    this.triggerSync();
  }

  private async save(): Promise<void> {
    if (
      !this._persistenceMediator ||
      !this._collectionHandler ||
      !this._stateContainerHandler
    ) {
      return;
    }

    const selectedGroupId =
      this._stateContainerHandler.currentStateContainer?.id in
      this._collectionHandler.groups
        ? this._stateContainerHandler.currentStateContainer?.id
        : null;
    const previousSelectedGroupId =
      this._stateContainerHandler.previousStateContainer?.id in
      this._collectionHandler.groups
        ? this._stateContainerHandler.previousStateContainer?.id
        : null;

    this._persistenceMediator.save({
      version: CURRENT_STATE_FILE_VERSION,
      groups: this._collectionHandler.groups,
      history: this._collectionHandler.history,
      addons: this._collectionHandler.addons,
      selectedGroup: selectedGroupId,
      previousSelectedGroup: previousSelectedGroupId,
      quickSlots: this._collectionHandler.quickSlots
    });
  }

  async waitForRenderComplete(): Promise<void> {
    if (!this._rendering) {
      return;
    }

    return new Promise((resolve) => {
      const disposable = this.onDidCompleteRender(() => {
        disposable.dispose();
        resolve();
      });
    });
  }

  private initializeEvents() {
    // No longer need to listen to tab events here - TabActiveStateHandler does this
    this._disposables.push(
      this._configService.onDidChangeConfig(async (changes) => {
        if (changes.masterWorkspaceFolder !== undefined) {
          await this.attachStateHandler();
          this._gitService.updateRepository();
        }
      })
    );
    this._disposables.push(
      this._gitService.onDidChangeBranch(
        (event) => void this._handleBranchChange(event)
      )
    );
    this._disposables.push(
      this._gitService.onDidOpenRepository(
        (event) => void this._handleBranchChange(event)
      )
    );
  }

  private _handleBranchChange(
    event: GitBranchChangeEvent | GitRepositoryOpenEvent
  ) {
    const gitConfig = this._configService.getGitIntegrationConfig();

    if (!gitConfig.enabled) return;

    if (!event.currentBranch) {
      return;
    }

    const groupName = `${gitConfig.groupPrefix}${event.currentBranch}`;
    const groups = this._collectionHandler?.groups ?? {};
    const correlatingGroupId = Object.values(groups).find(
      (g) => g.name === groupName
    )?.id;

    switch (gitConfig.mode) {
      case GitIntegrationMode.AutoSwitch:
        // Only switch if group exists
        if (correlatingGroupId) {
          this.switchToGroup(correlatingGroupId);
        }
        break;

      case GitIntegrationMode.AutoCreate:
        // Create group if it doesn't exist
        if (!correlatingGroupId) {
          this.createGroup(groupName);
        }
        break;

      case GitIntegrationMode.FullAuto:
        // Create if doesn't exist, then switch
        if (!correlatingGroupId) {
          this.createGroup(groupName);
        } else {
          this.switchToGroup(correlatingGroupId);
        }
        break;
    }
  }

  private notify(kind: ExtensionNotificationKind, message: string) {
    this._notifyViewEmitter.fire({ kind, message });

    switch (kind) {
      case ExtensionNotificationKind.Error:
        void window.showErrorMessage(message);
        break;
      case ExtensionNotificationKind.Warning:
        void window.showWarningMessage(message);
        break;
      case ExtensionNotificationKind.Info:
      default:
        void window.showInformationMessage(message);
        break;
    }
  }

  applyState(rollbackStateContainer: StateContainer) {
    if (!this._stateContainerHandler) return;
    if (this._stateContainerHandler.currentStateContainer == null) return;

    this._nextRenderingItem = {
      stateContainer: this._stateContainerHandler.currentStateContainer,
      rollbackStateContainer
    };

    if (this._rendering) return;

    this.next().catch(console.error);
  }

  private async next() {
    this._rendering = true;
    this._stateContainerHandler?.lockState();

    while (this._nextRenderingItem !== null) {
      try {
        const currentTabState = this._activeStateHandler?.getTabState();
        if (
          currentTabState &&
          isTabStateEqual(
            currentTabState,
            this._nextRenderingItem.stateContainer.state.tabState
          ) &&
          isLayoutEqual(
            await getEditorLayout(),
            this._nextRenderingItem.stateContainer.state.layout,
            true
          )
        ) {
          this._activeStateHandler.mergeTabState(
            this._nextRenderingItem.stateContainer.state.tabState
          );
          this._nextRenderingItem = null;
          continue;
        }

        await this.render();
      } catch (error) {
        this.notify(ExtensionNotificationKind.Error, 'Failed to rerender tabs');
      }
    }

    this._stateContainerHandler?.unlockState();
    this._rendering = false;
    this._renderCompleteEmitter.fire();
    this._stateContainerHandler.updateTabState(
      this._activeStateHandler.getTabManagerState()
    );
  }

  private async render() {
    const currentStateContainer = this._nextRenderingItem.stateContainer;
    const previousStateContainer =
      this._nextRenderingItem.rollbackStateContainer;

    this._log.info(`render: applying state "${currentStateContainer.name}" (${currentStateContainer.id})`);
    this._nextRenderingItem = null;

    if (countTabs() > 0) {
      await closeAllEditors();

      if (countTabs() > 0) {
        this._stateContainerHandler?.setCurrentStateContainer(
          previousStateContainer ?? createEmptyStateContainer()
        );
        return;
      }
    }

    this._layoutService.setLayout(currentStateContainer.state.layout);
    await setEditorLayout(currentStateContainer.state.layout);

    // Use the TabActiveStateHandler to apply the tab state
    if (this._activeStateHandler) {
      await this._activeStateHandler.applyTabState(
        currentStateContainer.state.tabState,
        {
          preserveActiveTab: true,
          preservePinnedTabs: true,
          preserveTabFocus: true
        }
      );
    }
  }

  async toggleTabPin(viewColumn: number, index: number): Promise<void> {
    const targetTab = findTabByViewColumnAndIndex(viewColumn, index);

    if (!targetTab) {
      this.notify(ExtensionNotificationKind.Warning, 'Tab not found');
      return;
    }

    try {
      // Toggle pin state using VS Code command
      if (targetTab.isPinned) {
        await unpinEditor(viewColumn, index);
      } else {
        await pinEditor(viewColumn, index);
      }
    } catch (error) {
      this.notify(ExtensionNotificationKind.Error, 'Failed to toggle tab pin');
    }
  }

  async openTab(viewColumn: number, index: number): Promise<void> {
    const targetGroup = findTabGroupByViewColumn(viewColumn);

    if (!targetGroup) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Tab group ${viewColumn} not found`
      );
      return;
    }

    try {
      await focusTabInGroup(viewColumn, index);
    } catch (error) {
      this.notify(ExtensionNotificationKind.Error, 'Failed to open tab');
    }
  }

  async closeTab(viewColumn: number, index: number): Promise<void> {
    const targetTab = findTabByViewColumnAndIndex(viewColumn, index);

    if (!targetTab) {
      this.notify(ExtensionNotificationKind.Warning, 'Tab not found');
      return;
    }

    await closeTab(targetTab);
  }

  async moveTab(
    fromViewColumn: number,
    fromIndex: number,
    toViewColumn: number,
    toIndex: number
  ): Promise<void> {
    const targetTab = findTabByViewColumnAndIndex(fromViewColumn, fromIndex);

    if (!targetTab) {
      this.notify(ExtensionNotificationKind.Warning, 'Tab not found');
      return;
    }

    try {
      await moveTab(fromViewColumn, fromIndex, toViewColumn, toIndex);
    } catch (error) {
      this.notify(ExtensionNotificationKind.Error, 'Failed to move tab');
      console.error('Error moving tab:', error);
    }
  }

  async clearAllTabs(): Promise<void> {
    await closeAllEditors();
  }

  async exportStateFile(exportUri: string): Promise<void> {
    if (!this._collectionHandler || !this._stateContainerHandler) return;

    const fileContent = toRelativeTabStateFile({
      version: CURRENT_STATE_FILE_VERSION,
      groups: this._collectionHandler.groups,
      history: this._collectionHandler.history,
      addons: this._collectionHandler.addons,
      quickSlots: this._collectionHandler.quickSlots,
      selectedGroup:
        this._stateContainerHandler.currentStateContainer?.id || null,
      previousSelectedGroup:
        this._stateContainerHandler.previousStateContainer?.id || null
    });
    const data = new TextEncoder().encode(JSON.stringify(fileContent, null, 2));
    await workspace.fs.writeFile(Uri.parse(exportUri), data);
    this.notify(
      ExtensionNotificationKind.Info,
      'Tab Stack collections exported successfully.'
    );
  }

  async importStateFile(importUri: string): Promise<void> {
    if (!this._collectionHandler) return;

    const data = await workspace.fs.readFile(Uri.file(importUri));
    let fileContent: TabStateFileContent | null = null;

    try {
      fileContent = JSON.parse(
        new TextDecoder().decode(data)
      ) as TabStateFileContent;
    } catch {
      this.notify(
        ExtensionNotificationKind.Error,
        'Invalid export file. Could not parse JSON.'
      );
      return;
    }

    const workspaceFolder = this._configService.getMasterWorkspaceFolder();
    if (!workspaceFolder) {
      return;
    }

    const newContent = toAbsoluteTabStateFile(
      migrate(fileContent),
      Uri.parse(workspaceFolder)
    );

    this._collectionHandler.initialize({
      groups: newContent.groups,
      history: newContent.history,
      addons: newContent.addons,
      quickSlots: newContent.quickSlots
    });

    // Apply the imported state
    this.applyState(null);
  }

  triggerSync() {
    if (
      !this._collectionHandler ||
      !this._stateContainerHandler ||
      !this._activeStateHandler
    )
      return;
    if (this._stateContainerHandler.currentStateContainer == null) return;

    const groups = this._collectionHandler.groups;
    const history = this._collectionHandler.history;
    const addons = this._collectionHandler.addons;
    const quickSlots = this._collectionHandler.quickSlots;
    const groupValues = Object.values(groups);

    groupValues.sort((a, b) => {
      const timeA = a.lastSelectedAt || 0;
      const timeB = b.lastSelectedAt || 0;
      return timeB - timeA;
    });

    const historyValues = Object.values(history);
    const addonValues = Object.values(addons);

    addonValues.sort((a, b) => {
      const timeA = a.createdAt || 0;
      const timeB = b.createdAt || 0;
      return timeB - timeA;
    });

    historyValues.sort((a, b) => {
      const timeA = a.createdAt || 0;
      const timeB = b.createdAt || 0;
      return timeB - timeA;
    });

    const masterWorkspaceFolder =
      this._configService.getMasterWorkspaceFolder();
    const gitIntegration = this._configService.getGitIntegrationConfig();
    const availableWorkspaceFolders = this._configService
      .getAvailableWorkspaceFolders()
      .map((folder) => ({
        name: folder.name,
        path: folder.uri.toString()
      }));

    this._syncViewEmitter.fire({
      tabState:
        this._stateContainerHandler.currentStateContainer.state.tabState,
      histories: historyValues.map((entry) => {
        const tabGroupsArray = Object.values(entry.state.tabState.tabGroups);
        const tabCount = tabGroupsArray.reduce(
          (sum, group) => sum + group.tabs.length,
          0
        );
        return {
          historyId: entry.id,
          name: entry.name,
          tabCount,
          columnCount: tabGroupsArray.length
        };
      }),
      groups: groupValues.map((group) => {
        const tabGroupsArray = Object.values(group.state.tabState.tabGroups);
        const tabCount = tabGroupsArray.reduce(
          (sum, tabGroup) => sum + tabGroup.tabs.length,
          0
        );
        return {
          groupId: group.id,
          name: group.name,
          tabCount,
          columnCount: tabGroupsArray.length
        };
      }),
      addons: addonValues.map((addon) => {
        const tabGroupsArray = Object.values(addon.state.tabState.tabGroups);
        const tabCount = tabGroupsArray.reduce(
          (sum, group) => sum + group.tabs.length,
          0
        );
        return {
          addonId: addon.id,
          name: addon.name,
          tabCount,
          columnCount: tabGroupsArray.length
        };
      }),
      selectedGroup:
        this._stateContainerHandler.currentStateContainer.id in groups
          ? this._stateContainerHandler.currentStateContainer.id
          : null,
      quickSlots,
      masterWorkspaceFolder,
      availableWorkspaceFolders,
      gitIntegration,
      historyMaxEntries: this._configService.getHistoryMaxEntries(),
      storageType: this._configService.getStorageType(),
      rendering: this._rendering
    });
  }

  createAddon(name: string): void {
    if (!this._collectionHandler || !this._stateContainerHandler) return;
    const currentState =
      this._stateContainerHandler.currentStateContainer?.state;
    if (!currentState) return;

    const isNameAlreadyExisting = Object.values(
      this._collectionHandler.addons
    ).some((it) => it.name === name);
    if (isNameAlreadyExisting) {
      return;
    }

    const stateContainer: StateContainer = {
      id: nanoid(),
      name,
      state: currentState,
      createdAt: Date.now(),
      lastSelectedAt: 0
    };

    this._collectionHandler.addAddon(stateContainer);
  }

  deleteAddon(addonId: string): void {
    if (!this._collectionHandler) return;
    this._collectionHandler.removeAddon(addonId);
  }

  renameAddon(addonId: string, newName: string): void {
    if (!this._collectionHandler) return;
    this._collectionHandler.renameAddon(addonId, newName);
  }

  async applyAddon(addonId: string): Promise<void> {
    if (!this._collectionHandler || !this._activeStateHandler) return;
    const addons = this._collectionHandler.addons;
    const addon = addons[addonId];
    if (!addon) {
      this.notify(ExtensionNotificationKind.Warning, 'Add-on not found');
      return;
    }

    await this._activeStateHandler.applyTabState(addon.state.tabState, {
      preserveActiveTab: false,
      preservePinnedTabs: true,
      preserveTabFocus: false
    });
  }

  switchToGroup(groupId: string | null) {
    if (!this._stateContainerHandler || !this._collectionHandler) {
      return;
    }

    if (this._stateContainerHandler.currentStateContainer?.id === groupId) {
      this._log.debug(`switchToGroup: already on group ${groupId}, skipping`);
      return;
    }

    this._log.info(`switchToGroup: ${groupId ?? 'fork (no group)'}`);

    if (groupId == null) {
      this._stateContainerHandler.forkState();
      return;
    }

    const rollbackStateContainer =
      this._stateContainerHandler.currentStateContainer;
    const groups = this._collectionHandler.groups;
    const targetGroup = groups[groupId];

    if (!targetGroup) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Group "${groupId}" not found`
      );
      return;
    }

    // Update collection to mark group as loaded
    this._collectionHandler.loadGroup(groupId);

    // Set the new state container
    this._stateContainerHandler.setCurrentStateContainer(targetGroup);

    this.applyState(rollbackStateContainer);
  }

  createGroup(groupId: string) {
    if (!this._collectionHandler || !this._stateContainerHandler) {
      return;
    }

    this._log.info(`createGroup: "${groupId}"`);

    const isNameAlreadyExisting = Object.values(
      this._collectionHandler.groups
    ).some((it) => it.name === groupId);
    if (isNameAlreadyExisting) {
      return;
    }

    const currentState =
      this._stateContainerHandler.currentStateContainer?.state;
    if (!currentState) return;

    const stateContainer: StateContainer = {
      id: nanoid(),
      name: groupId,
      state: currentState,
      createdAt: Date.now(),
      lastSelectedAt: Date.now()
    };

    this._collectionHandler.addGroup(stateContainer);
    this._stateContainerHandler.setCurrentStateContainer(stateContainer);
  }

  renameGroup(groupId: string, nextGroupId: string) {
    if (!this._collectionHandler) {
      return;
    }

    this._collectionHandler.renameGroup(groupId, nextGroupId);
  }

  takeSnapshot() {
    if (!this._collectionHandler || !this._stateContainerHandler) {
      return;
    }

    const currentState =
      this._stateContainerHandler.currentStateContainer?.state;
    if (!currentState) return;

    const stateContainer: StateContainer = {
      id: nanoid(),
      name: new Date().toISOString(),
      state: currentState,
      createdAt: Date.now(),
      lastSelectedAt: Date.now()
    };

    this._collectionHandler.addHistory(stateContainer);

    const maxEntries = this._configService.getHistoryMaxEntries();
    this._collectionHandler.pruneHistory(maxEntries);
  }

  recoverSnapshot(historyId: string) {
    if (!this._stateContainerHandler || !this._collectionHandler) {
      return;
    }

    const rollbackStateContainer =
      this._stateContainerHandler.currentStateContainer;
    const history = this._collectionHandler.history;
    const targetHistory = history[historyId];

    if (!targetHistory) {
      this.notify(ExtensionNotificationKind.Warning, 'History entry not found');
      return;
    }

    this._stateContainerHandler.setCurrentStateContainer(targetHistory);
    this.applyState(rollbackStateContainer);
  }

  deleteGroup(groupId: string) {
    this._log.info(`deleteGroup: ${groupId}`);
    if (!this._collectionHandler) {
      return;
    }
    this._collectionHandler.removeGroup(groupId);
  }

  deleteSnapshot(historyId: string) {
    if (!this._collectionHandler) {
      return;
    }
    this._collectionHandler.removeHistory(historyId);
  }

  assignQuickSlot(slot: QuickSlotIndex, groupId: string | null) {
    if (!this._collectionHandler) {
      return;
    }
    this._collectionHandler.setQuickSlot(slot, groupId);
  }

  applyQuickSlot(slot: QuickSlotIndex) {
    if (!this._collectionHandler || !this._stateContainerHandler) {
      return;
    }

    const groupId = this._collectionHandler.getQuickSlotAssignment(slot);

    if (!groupId) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Quick slot ${slot} is not assigned`
      );
      return;
    }

    const rollbackStateContainer =
      this._stateContainerHandler.currentStateContainer;
    const groups = this._collectionHandler.groups;
    const targetGroup = groups[groupId];

    if (!targetGroup) {
      this._collectionHandler.setQuickSlot(slot, null);
      this.notify(
        ExtensionNotificationKind.Warning,
        `Saved group "${groupId}" was not found. Quick slot ${slot} was cleared.`
      );
      return;
    }

    // Update collection to mark group as loaded
    this._collectionHandler.loadGroup(groupId);
    this._stateContainerHandler.setCurrentStateContainer(targetGroup);

    this.applyState(rollbackStateContainer);
  }

  quickSwitch(): void {
    this._log.info('quickSwitch');
    if (!this._stateContainerHandler) {
      return;
    }

    const rollbackStateContainer =
      this._stateContainerHandler.currentStateContainer;
    const previousContainer =
      this._stateContainerHandler.previousStateContainer;

    if (previousContainer) {
      this._stateContainerHandler.setCurrentStateContainer(previousContainer);
      this.applyState(rollbackStateContainer);
    }
  }

  async selectWorkspaceFolder(folderPath: string | null): Promise<void> {
    await this._configService.setMasterWorkspaceFolder(folderPath);
  }

  async clearWorkspaceFolder(): Promise<void> {
    await this._configService.setMasterWorkspaceFolder(null);
  }

  dispose() {
    this._disposables.forEach((d) => d.dispose());
    this._disposables = [];
    this._syncViewEmitter.dispose();
    this._notifyViewEmitter.dispose();
    this._renderCompleteEmitter.dispose();

    this._activeStateHandler?.dispose();
    this._stateContainerHandler?.dispose();
    this._collectionHandler?.dispose();

    this._activeStateHandler = null;
    this._stateContainerHandler = null;
    this._collectionHandler = null;
    this._persistenceMediator = null;
    this._layoutService = null;
    this._configService = null;
    this._gitService = null;
  }
}

import { nanoid } from 'nanoid';
import {
  commands,
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
import { TabChangeProxyService } from './tab-change-proxy';
import { transform as migrate } from '../transformers/migration';
import {
  toAbsoluteTabStateFile,
  toRelativeTabStateFile,
  toRelativeStateContainer,
  toAbsoluteStateContainer
} from '../transformers/tab-uris';
import { GitIntegrationMode } from '../types/config';
import {
  ExtensionNotificationKind,
  ExtensionNotificationMessage,
  ExtensionTabStateSyncMessage,
  ExtensionCollectionsSyncMessage,
  ExtensionConfigSyncMessage,
  CollectionTabSummary
} from '../types/messages';
import {
  createEmptyStateContainer,
  CURRENT_STATE_FILE_VERSION,
  ITabManagerService,
  QuickSlotIndex,
  RenderingItem,
  StateContainer,
  TabStackGroupFile,
  TabStateFileContent
} from '../types/tab-manager';
import {
  closeAllEditors,
  focusTabInGroup,
  moveTab,
  pinEditor,
  unpinEditor
} from '../utils/commands';
import { getEditorLayout, setEditorLayout } from '../utils/layout';
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
import { TabRecoveryService } from './tab-recovery-resolver';

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
  private _tabRecoveryService: TabRecoveryService;
  private _tabChangeProxy: TabChangeProxyService;

  private _renderCompleteEmitter: EventEmitter<void>;

  private _tabStateSyncEmitter: EventEmitter<
    Omit<ExtensionTabStateSyncMessage, 'type'>
  >;

  private _collectionsSyncEmitter: EventEmitter<
    Omit<ExtensionCollectionsSyncMessage, 'type'>
  >;

  private _configSyncEmitter: EventEmitter<
    Omit<ExtensionConfigSyncMessage, 'type'>
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
    gitService: GitService,
    tabRecoveryService: TabRecoveryService
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
    this._tabRecoveryService = tabRecoveryService;
    this._tabChangeProxy = new TabChangeProxyService();
    this._tabStateSyncEmitter = new EventEmitter<
      Omit<ExtensionTabStateSyncMessage, 'type'>
    >();
    this._collectionsSyncEmitter = new EventEmitter<
      Omit<ExtensionCollectionsSyncMessage, 'type'>
    >();
    this._configSyncEmitter = new EventEmitter<
      Omit<ExtensionConfigSyncMessage, 'type'>
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

  get onDidSyncTabState() {
    return this._tabStateSyncEmitter.event;
  }

  get onDidSyncCollections() {
    return this._collectionsSyncEmitter.event;
  }

  get onDidSyncConfig() {
    return this._configSyncEmitter.event;
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
      this._tabRecoveryService,
      this._tabChangeProxy
    );
    this._stateContainerHandler = new TabStateContainerHandler();
    this._collectionHandler = new TabCollectionStateHandler();

    // Setup persistence
    this._persistenceMediator = new PersistenceMediator(
      this._context,
      this._configService
    );
    const persistenceMediator = this._persistenceMediator;
    await persistenceMediator.load();

    if (
      this._persistenceMediator !== persistenceMediator ||
      !this._activeStateHandler ||
      !this._stateContainerHandler ||
      !this._collectionHandler
    ) {
      return;
    }

    const fileState = persistenceMediator.get();

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
      this._activeStateHandler.rehydrateTabs();
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
        this.triggerTabStateSync();
      }
    );

    this._collectionHandler.onDidChangeState(() => {
      void this.save();
      this.triggerCollectionsSync();
    });

    void this.save();
    this.triggerTabStateSync();
    this.triggerCollectionsSync();
    this.triggerConfigSync();
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
        const shouldReattachStateHandlers =
          changes.masterWorkspaceFolder !== undefined ||
          changes.storageType !== undefined;

        if (shouldReattachStateHandlers) {
          await this.attachStateHandler();
        }

        if (
          changes.masterWorkspaceFolder !== undefined ||
          changes.gitIntegration !== undefined
        ) {
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

    this._rendering = false;
    this._stateContainerHandler?.unlockState();
    this._renderCompleteEmitter.fire();

    if (!this._stateContainerHandler || !this._activeStateHandler) {
      return;
    }

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

  async closeOtherTabs(viewColumn: number, index: number): Promise<void> {
    const targetTab = findTabByViewColumnAndIndex(viewColumn, index);

    if (!targetTab) {
      this.notify(ExtensionNotificationKind.Warning, 'Tab not found');
      return;
    }

    try {
      const tabsToClose = window.tabGroups.all.flatMap((group) =>
        group.tabs.filter((tab) => tab !== targetTab)
      );
      await window.tabGroups.close(tabsToClose, true);
    } catch (error) {
      this.notify(ExtensionNotificationKind.Error, 'Failed to close other tabs');
    }
  }

  async closeOtherTabsInGroup(viewColumn: number, index: number): Promise<void> {
    const targetTab = findTabByViewColumnAndIndex(viewColumn, index);
    const targetGroup = findTabGroupByViewColumn(viewColumn);

    if (!targetTab || !targetGroup) {
      this.notify(ExtensionNotificationKind.Warning, 'Tab not found');
      return;
    }

    try {
      const tabsToClose = targetGroup.tabs.filter((tab) => tab !== targetTab);
      await window.tabGroups.close(tabsToClose, true);
    } catch (error) {
      this.notify(ExtensionNotificationKind.Error, 'Failed to close other tabs in group');
    }
  }

  async closeColumn(viewColumn: number): Promise<void> {
    const targetGroup = findTabGroupByViewColumn(viewColumn);

    if (!targetGroup) {
      this.notify(ExtensionNotificationKind.Warning, 'Column not found');
      return;
    }

    try {
      await window.tabGroups.close(targetGroup.tabs, true);
    } catch (error) {
      this.notify(ExtensionNotificationKind.Error, 'Failed to close column');
    }
  }

  async closeColumnTabs(viewColumn: number, indices: number[]): Promise<void> {
    const targetGroup = findTabGroupByViewColumn(viewColumn);

    if (!targetGroup) {
      this.notify(ExtensionNotificationKind.Warning, 'Column not found');
      return;
    }

    try {
      const tabsToClose = indices
        .map((i) => targetGroup.tabs[i])
        .filter((tab): tab is typeof targetGroup.tabs[number] => tab != null);

      if (tabsToClose.length > 0) {
        await window.tabGroups.close(tabsToClose, true);
      }
    } catch (error) {
      this.notify(ExtensionNotificationKind.Error, 'Failed to close tabs');
    }
  }

  async moveColumn(fromViewColumn: number, toViewColumn: number): Promise<void> {
    if (fromViewColumn === toViewColumn) return;

    const fromGroup = findTabGroupByViewColumn(fromViewColumn);
    const toGroup = findTabGroupByViewColumn(toViewColumn);

    if (!fromGroup || !toGroup) {
      this.notify(ExtensionNotificationKind.Warning, 'Column not found');
      return;
    }

    try {
      await this._activeStateHandler?.moveEditorGroup(fromViewColumn, toViewColumn);
    } catch (error) {
      this.notify(ExtensionNotificationKind.Error, 'Failed to move column');
    }
  }

  async mergeColumns(fromViewColumn: number, toViewColumn: number): Promise<void> {
    if (fromViewColumn === toViewColumn) return;

    const fromGroup = findTabGroupByViewColumn(fromViewColumn);
    const toGroup = findTabGroupByViewColumn(toViewColumn);

    if (!fromGroup || !toGroup) {
      this.notify(ExtensionNotificationKind.Warning, 'Column not found');
      return;
    }

    try {
      const tabCount = fromGroup.tabs.length;
      const toOffset = toGroup.tabs.length;

      for (let i = 0; i < tabCount; i++) {
        // Always move index 0 since tabs shift after each move
        await moveTab(fromViewColumn, 0, toViewColumn, toOffset + i);
      }
    } catch (error) {
      this.notify(ExtensionNotificationKind.Error, 'Failed to merge columns');
    }
  }

  async moveTabsToNewColumn(viewColumn: number, indices: number[]): Promise<void> {
    const targetGroup = findTabGroupByViewColumn(viewColumn);

    if (!targetGroup) {
      this.notify(ExtensionNotificationKind.Warning, 'Column not found');
      return;
    }

    try {
      // Sort descending so that removing from higher indices first
      // doesn't shift lower indices
      const sorted = [...indices].sort((a, b) => b - a);

      // The new column will be created by moving the first tab to a new group
      // We use moveEditorToNextGroup which creates a new group if last
      const firstIndex = sorted.pop()!; // smallest index (last after sort desc)

      // Move the first tab to create the new column
      await focusTabInGroup(viewColumn, firstIndex);
      const allGroups = window.tabGroups.all;
      const currentGroupIndex = allGroups.findIndex(g => g.viewColumn === viewColumn);
      const isLastGroup = currentGroupIndex === allGroups.length - 1;

      if (isLastGroup) {
        // Moving to next group will create a new one
        await commands.executeCommand('workbench.action.moveEditorToNextGroup');
      } else {
        // Need to create a new group explicitly
        await commands.executeCommand('workbench.action.newGroupRight');
        await moveTab(viewColumn, firstIndex, window.tabGroups.activeTabGroup.viewColumn, 0);
      }

      const newViewColumn = window.tabGroups.activeTabGroup.viewColumn;

      // Now move remaining tabs (indices adjusted for removals)
      // Since we removed firstIndex, adjust remaining indices
      let movedCount = 1;
      for (const idx of sorted) {
        // Adjust index: if idx > firstIndex, it shifted down by 1
        const adjustedIdx = idx > firstIndex ? idx - 1 : idx;
        await moveTab(viewColumn, adjustedIdx, newViewColumn, movedCount);
        movedCount++;
      }
    } catch (error) {
      this.notify(ExtensionNotificationKind.Error, 'Failed to move tabs to new column');
    }
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
    if (!this._collectionHandler || !this._stateContainerHandler) return;

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

    const currentStateContainer =
      newContent.selectedGroup in newContent.groups
        ? newContent.groups[newContent.selectedGroup]
        : this._stateContainerHandler.currentStateContainer ??
          createEmptyStateContainer();
    const previousStateContainer =
      newContent.previousSelectedGroup in newContent.groups
        ? newContent.groups[newContent.previousSelectedGroup]
        : null;

    this._stateContainerHandler.initialize(
      currentStateContainer,
      previousStateContainer
    );

    if (newContent.selectedGroup in newContent.groups) {
      this.applyState(null);
      return;
    }

    this.triggerTabStateSync();
    this.triggerCollectionsSync();
    this.triggerConfigSync();
  }

  async exportGroup(groupId: string, exportUri: string): Promise<void> {
    if (!this._collectionHandler) return;

    const group = this._collectionHandler.groups[groupId];
    if (!group) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Group "${groupId}" not found`
      );
      return;
    }

    const fileContent: TabStackGroupFile = {
      version: CURRENT_STATE_FILE_VERSION,
      type: 'tabstack-group',
      group: toRelativeStateContainer(group)
    };

    const data = new TextEncoder().encode(JSON.stringify(fileContent, null, 2));
    await workspace.fs.writeFile(Uri.parse(exportUri), data);
    this.notify(
      ExtensionNotificationKind.Info,
      `Group "${group.name}" exported successfully.`
    );
  }

  async importGroup(importUri: string): Promise<void> {
    if (!this._collectionHandler || !this._stateContainerHandler) return;

    const data = await workspace.fs.readFile(Uri.file(importUri));
    let fileContent: TabStackGroupFile | null = null;

    try {
      fileContent = JSON.parse(
        new TextDecoder().decode(data)
      ) as TabStackGroupFile;
    } catch {
      this.notify(
        ExtensionNotificationKind.Error,
        'Invalid group file. Could not parse JSON.'
      );
      return;
    }

    if (fileContent.type !== 'tabstack-group' || !fileContent.group) {
      this.notify(
        ExtensionNotificationKind.Error,
        'Invalid group file. Missing type or group data.'
      );
      return;
    }

    const workspaceFolder = this._configService.getMasterWorkspaceFolder();
    if (!workspaceFolder) {
      return;
    }

    const importedGroup = toAbsoluteStateContainer(
      fileContent.group,
      Uri.parse(workspaceFolder)
    );

    // Assign a new ID to avoid collisions with existing groups
    const newGroup: StateContainer = {
      ...importedGroup,
      id: nanoid(),
      lastSelectedAt: Date.now()
    };

    // Check if a group with the same name already exists
    const existingGroup = Object.values(this._collectionHandler.groups).find(
      (g) => g.name === newGroup.name
    );

    if (existingGroup) {
      const overwrite = await window.showQuickPick(['Yes', 'No'], {
        title: `A group named "${newGroup.name}" already exists. Overwrite?`
      });

      if (overwrite === 'Yes') {
        this._collectionHandler.removeGroup(existingGroup.id);
      } else {
        return;
      }
    }

    this._collectionHandler.addGroup(newGroup);
    this._stateContainerHandler.setCurrentStateContainer(newGroup);
    this.applyState(null);
    this.notify(
      ExtensionNotificationKind.Info,
      `Group "${newGroup.name}" imported successfully.`
    );
  }

  triggerTabStateSync() {
    if (
      !this._stateContainerHandler ||
      !this._collectionHandler
    )
      return;
    if (this._stateContainerHandler.currentStateContainer == null) return;

    const groups = this._collectionHandler.groups;

    this._tabStateSyncEmitter.fire({
      tabState:
        this._stateContainerHandler.currentStateContainer.state.tabState,
      selectedGroup:
        this._stateContainerHandler.currentStateContainer.id in groups
          ? this._stateContainerHandler.currentStateContainer.id
          : null,
      rendering: this._rendering
    });
  }

  triggerCollectionsSync() {
    if (
      !this._collectionHandler ||
      !this._stateContainerHandler
    )
      return;

    const groups = this._collectionHandler.groups;

    this._collectionsSyncEmitter.fire({
      groups: this.buildGroupSummaries(),
      histories: this.buildHistorySummaries(),
      addons: this.buildAddonSummaries(),
      selectedGroup:
        this._stateContainerHandler.currentStateContainer?.id in groups
          ? this._stateContainerHandler.currentStateContainer?.id
          : null,
      quickSlots: this._collectionHandler.quickSlots
    });
  }

  triggerConfigSync() {
    if (!this._configService) return;

    this._configSyncEmitter.fire({
      masterWorkspaceFolder:
        this._configService.getMasterWorkspaceFolder(),
      availableWorkspaceFolders: this._configService
        .getAvailableWorkspaceFolders()
        .map((folder) => ({
          name: folder.name,
          path: folder.uri.toString()
        })),
      gitIntegration: this._configService.getGitIntegrationConfig(),
      historyMaxEntries: this._configService.getHistoryMaxEntries(),
      storageType: this._configService.getStorageType(),
      tabKindColors: this._configService.getTabKindColors()
    });
  }

  private buildTabsByColumn(container: StateContainer): CollectionTabSummary[][] {
    const tabGroups = Object.values(container.state.tabState.tabGroups);

    return tabGroups.map((group) =>
      group.tabs.map((tab) => ({
        label: tab.label,
        kind: tab.kind,
        uri: 'uri' in tab ? tab.uri : undefined
      }))
    );
  }

  private buildGroupSummaries() {
    const groups = this._collectionHandler!.groups;
    const groupValues = Object.values(groups);

    return groupValues.sort((a, b) => {
      const timeA = a.lastSelectedAt || 0;
      const timeB = b.lastSelectedAt || 0;
      return timeB - timeA;
    }).map((group) => {
      const tabGroupsArray = Object.values(group.state.tabState.tabGroups);
      const tabCount = tabGroupsArray.reduce(
        (sum, tabGroup) => sum + tabGroup.tabs.length,
        0
      );
      return {
        groupId: group.id,
        name: group.name,
        tabCount,
        columnCount: tabGroupsArray.length,
        layout: group.state.layout,
        tabsByColumn: this.buildTabsByColumn(group)
      };
    });
  }

  private buildHistorySummaries() {
    const history = this._collectionHandler!.history;
    const historyValues = Object.values(history);

    return historyValues.sort((a, b) => {
      const timeA = a.lastSelectedAt || 0;
      const timeB = b.lastSelectedAt || 0;
      return timeB - timeA;
    }).map((entry) => {
      const tabGroupsArray = Object.values(entry.state.tabState.tabGroups);
      const tabCount = tabGroupsArray.reduce(
        (sum, group) => sum + group.tabs.length,
        0
      );
      return {
        historyId: entry.id,
        name: entry.name,
        tabCount,
        columnCount: tabGroupsArray.length,
        layout: entry.state.layout,
        tabsByColumn: this.buildTabsByColumn(entry)
      };
    });
  }

  private buildAddonSummaries() {
    const addons = this._collectionHandler!.addons;
    const addonValues = Object.values(addons);

    return addonValues.sort((a, b) => {
      const timeA = a.lastSelectedAt || 0;
      const timeB = b.lastSelectedAt || 0;
      return timeB - timeA;
    }).map((addon) => {
      const tabGroupsArray = Object.values(addon.state.tabState.tabGroups);
      const tabCount = tabGroupsArray.reduce(
        (sum, group) => sum + group.tabs.length,
        0
      );
      return {
        addonId: addon.id,
        name: addon.name,
        tabCount,
        columnCount: tabGroupsArray.length,
        layout: addon.state.layout,
        tabsByColumn: this.buildTabsByColumn(addon)
      };
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

    if (this._stateContainerHandler) {
      this._stateContainerHandler.updateTabState(
        this._activeStateHandler.getTabManagerState()
      );
    }

    this.triggerTabStateSync();
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
      this.triggerCollectionsSync();
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

  async resetState(): Promise<void> {
    if (!this._collectionHandler || !this._stateContainerHandler || !this._persistenceMediator) {
      return;
    }

    this._collectionHandler.initialize({
      groups: {},
      history: {},
      addons: {},
      quickSlots: {}
    });

    const emptyContainer = createEmptyStateContainer();
    this._stateContainerHandler.initialize(emptyContainer, null);

    this._persistenceMediator.save({
      version: CURRENT_STATE_FILE_VERSION,
      groups: {},
      history: {},
      addons: {},
      selectedGroup: null,
      previousSelectedGroup: null,
      quickSlots: {}
    });

    await this._persistenceMediator.write({
      version: CURRENT_STATE_FILE_VERSION,
      groups: {},
      history: {},
      addons: {},
      selectedGroup: null,
      previousSelectedGroup: null,
      quickSlots: {}
    });
  }

  dispose() {
    this._disposables.forEach((d) => d.dispose());
    this._disposables = [];
    this._tabStateSyncEmitter.dispose();
    this._collectionsSyncEmitter.dispose();
    this._configSyncEmitter.dispose();
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

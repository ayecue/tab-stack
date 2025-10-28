import debounce, { DebouncedFunction } from 'debounce';
import {
  Disposable,
  EventEmitter,
  Uri,
  window as vsWindow,
  window,
  workspace
} from 'vscode';

import { TabStateHandler } from '../handlers/tab-state';
import { GitIntegrationMode } from '../types/config';
import {
  ExtensionNotificationKind,
  ExtensionNotificationMessage,
  ExtensionTabsSyncMessage
} from '../types/messages';
import {
  ITabManagerService,
  QuickSlotIndex,
  RenderingItem,
  TabStateFileContent
} from '../types/tab-manager';
import {
  closeAllEditors,
  focusTabInGroup,
  getEditorLayout,
  pinEditor,
  setEditorLayout,
  unpinEditor
} from '../utils/commands';
import { delay } from '../utils/delay';
import { isLayoutEqual } from '../utils/is-layout-equal';
import {
  applyTabState,
  closeTab,
  countTabs,
  findTabByViewColumnAndIndex,
  findTabGroupByViewColumn,
  getTabState,
  isTabStateEqual
} from '../utils/tab-utils';
import { ConfigService } from './config';
import { EditorLayoutService } from './editor-layout';
import {
  GitBranchChangeEvent,
  GitRepositoryOpenEvent,
  GitService
} from './git';

export class TabManagerService implements ITabManagerService {
  static readonly RENDER_COOLDOWN_MS = 100;
  static readonly REFRESH_DEBOUNCE_DELAY = 100;

  private _rendering: boolean;
  private _nextRenderingItem: RenderingItem;

  private _stateHandler: TabStateHandler;
  private _layoutService: EditorLayoutService;
  private _configService: ConfigService;
  private _gitService: GitService | null;

  private _syncViewEmitter: EventEmitter<
    Omit<ExtensionTabsSyncMessage, 'type'>
  >;

  private _notifyViewEmitter: EventEmitter<
    Omit<ExtensionNotificationMessage, 'type'>
  >;

  private _disposables: Disposable[] = [];

  refresh: DebouncedFunction<() => Promise<void>>;

  constructor(
    layoutService: EditorLayoutService,
    configService: ConfigService,
    gitService: GitService | null = null
  ) {
    this.refresh = debounce(
      this._refresh.bind(this),
      TabManagerService.REFRESH_DEBOUNCE_DELAY
    );
    this._nextRenderingItem = null;
    this._stateHandler = null;
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

    this.initializeEvents();
  }

  get config() {
    return this._configService;
  }

  get state() {
    return this._stateHandler;
  }

  get onDidSyncTabs() {
    return this._syncViewEmitter.event;
  }

  get onDidNotify() {
    return this._notifyViewEmitter.event;
  }

  async attachStateHandler() {
    this._stateHandler = null;
    const newStateHandler = new TabStateHandler(this._configService);
    await newStateHandler.initialize();
    this._stateHandler = newStateHandler;
    await this.applyState();
    await this.triggerSync();
  }

  private initializeEvents() {
    this._disposables.push(
      window.tabGroups.onDidChangeTabs(() => void this.refresh())
    );
    this._disposables.push(
      window.tabGroups.onDidChangeTabGroups(() => void this.refresh())
    );
    this._disposables.push(
      this._layoutService.onDidChangeLayout(() => void this.refresh())
    );
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

  private async _handleBranchChange(
    event: GitBranchChangeEvent | GitRepositoryOpenEvent
  ) {
    const gitConfig = this._configService.getGitIntegrationConfig();

    if (!gitConfig.enabled) return;

    if (!event.currentBranch) {
      return;
    }

    const groupName = `${gitConfig.groupPrefix}${event.currentBranch}`;
    const groups = await this._stateHandler.getGroups();
    const correlatingGroupId = Object.values(groups).find(
      (g) => g.name === groupName
    )?.id;

    switch (gitConfig.mode) {
      case GitIntegrationMode.AutoSwitch:
        // Only switch if group exists
        if (correlatingGroupId) {
          await this.switchToGroup(correlatingGroupId);
        }
        break;

      case GitIntegrationMode.AutoCreate:
        // Create group if it doesn't exist
        if (!correlatingGroupId) {
          await this.createGroup(groupName);
        }
        break;

      case GitIntegrationMode.FullAuto:
        // Create if doesn't exist, then switch
        if (!correlatingGroupId) {
          await this.createGroup(groupName);
        } else {
          await this.switchToGroup(correlatingGroupId);
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

  private async _refresh(): Promise<void> {
    if (!this._stateHandler) {
      return;
    }
    if (this._rendering) {
      return;
    }

    await this._stateHandler.refreshState();
    await this.triggerSync();
  }

  async applyState() {
    if (!this._stateHandler) return;

    this._nextRenderingItem = {
      stateContainer: this._stateHandler.stateContainer,
      previousStateContainer: this._stateHandler.previousStateContainer
    };

    if (this._rendering) return;

    this.next().catch(console.error);
  }

  private async next() {
    this._rendering = true;
    await this.triggerSync().catch(console.error);

    while (this._nextRenderingItem !== null) {
      try {
        if (
          isTabStateEqual(
            getTabState(),
            this._nextRenderingItem.stateContainer.state.tabState
          ) &&
          isLayoutEqual(
            await getEditorLayout(),
            this._nextRenderingItem.stateContainer.state.layout,
            true
          )
        ) {
          this._nextRenderingItem = null;
          continue;
        }

        await this.render();
        // Introduce a small delay to allow VS Code to process UI updates
        await delay(TabManagerService.RENDER_COOLDOWN_MS);
      } catch (error) {
        this.notify(ExtensionNotificationKind.Error, 'Failed to rerender tabs');
      }
    }

    this._rendering = false;
    await this.triggerSync().catch(console.error);
  }

  private async render() {
    const currentStateContainer = this._nextRenderingItem.stateContainer;
    const previousStateContainer =
      this._nextRenderingItem.previousStateContainer;

    this._nextRenderingItem = null;

    if (countTabs() > 0) {
      await closeAllEditors();

      if (countTabs() > 0) {
        this._stateHandler.setState(previousStateContainer);
        return;
      }
    }

    this._layoutService.setLayout(currentStateContainer.state.layout);
    await setEditorLayout(currentStateContainer.state.layout);
    await applyTabState(currentStateContainer.state.tabState, {
      preserveActiveTab: true,
      preservePinnedTabs: true,
      preserveTabFocus: true
    });
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

  async clearAllTabs(): Promise<void> {
    await closeAllEditors();
  }

  async exportStateFile(exportUri: string): Promise<void> {
    if (!this._stateHandler) return;

    const fileContent = await this._stateHandler.exportStateFile();
    const data = await workspace.encode(JSON.stringify(fileContent, null, 2));
    await workspace.fs.writeFile(Uri.parse(exportUri), data);
    this.notify(
      ExtensionNotificationKind.Info,
      'Tab Stack collections exported successfully.'
    );
  }

  async importStateFile(importUri: string): Promise<void> {
    if (!this._stateHandler) return;

    const data = await workspace.fs.readFile(Uri.file(importUri));
    let fileContent: TabStateFileContent | null = null;

    try {
      fileContent = JSON.parse(
        await workspace.decode(data)
      ) as TabStateFileContent;
    } catch {
      this.notify(
        ExtensionNotificationKind.Error,
        'Invalid export file. Could not parse JSON.'
      );
      return;
    }

    const result = await this._stateHandler.importStateFile(fileContent);

    if (!result) {
      this.notify(
        ExtensionNotificationKind.Warning,
        'No workspace to make paths absolute. Set Tab Stack master workspace first.'
      );
      return;
    }

    await this.triggerSync();
  }

  async triggerSync() {
    if (!this._stateHandler) {
      return;
    }

    const [groups, history, addons, quickSlots] = await Promise.all([
      this._stateHandler.getGroups(),
      this._stateHandler.getHistory(),
      this._stateHandler.getAddons(),
      this._stateHandler.getQuickSlots()
    ]);
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
      tabState: this._stateHandler.stateContainer.state.tabState,
      histories: historyValues.map((entry) => ({
        historyId: entry.id,
        name: entry.name
      })),
      groups: groupValues.map((group) => ({
        groupId: group.id,
        name: group.name
      })),
      addons: addonValues.map((addon) => ({
        addonId: addon.id,
        name: addon.name
      })),
      selectedGroup:
        this._stateHandler.stateContainer.id in groups
          ? this._stateHandler.stateContainer.id
          : null,
      quickSlots,
      masterWorkspaceFolder,
      availableWorkspaceFolders,
      gitIntegration,
      rendering: this._rendering
    });
  }

  async createAddon(name: string): Promise<void> {
    if (!this._stateHandler) return;
    const currentState = this._stateHandler.stateContainer.state;
    const id = await this._stateHandler.addToAddons(currentState, name);
    if (!id) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Add-on "${name}" already exists`
      );
      return;
    }
    await this.triggerSync();
  }

  async deleteAddon(addonId: string): Promise<void> {
    if (!this._stateHandler) return;
    const deleted = await this._stateHandler.deleteAddon(addonId);
    if (!deleted) {
      this.notify(ExtensionNotificationKind.Warning, 'Add-on not found');
      return;
    }
    await this.triggerSync();
  }

  async renameAddon(addonId: string, newName: string): Promise<void> {
    if (!this._stateHandler) return;
    const renamed = await this._stateHandler.renameAddon(addonId, newName);
    if (!renamed) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Renaming "${addonId}" failed`
      );
      return;
    }
    await this.triggerSync();
  }

  async applyAddon(addonId: string): Promise<void> {
    if (!this._stateHandler) return;
    const addons = await this._stateHandler.getAddons();
    const addon = addons[addonId];
    if (!addon) {
      this.notify(ExtensionNotificationKind.Warning, 'Add-on not found');
      return;
    }

    await applyTabState(addon.state.tabState, {
      preserveActiveTab: false,
      preservePinnedTabs: true,
      preserveTabFocus: false
    });

    await this._stateHandler.refreshState();
    await this.triggerSync();
  }

  async switchToGroup(groupId: string | null) {
    if (!this._stateHandler) {
      return;
    }

    if (this._stateHandler.stateContainer.id === groupId) {
      return;
    }

    if (groupId == null) {
      await this._stateHandler.forkState();
      await this.triggerSync();
      return;
    }

    const loaded = await this._stateHandler.loadState(groupId);

    if (!loaded) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Group "${groupId}" not found`
      );
      return;
    }

    await this.applyState();
  }

  async createGroup(groupId: string) {
    if (!this._stateHandler) {
      return;
    }

    const createdGroup = await this._stateHandler.createGroup(groupId);

    if (!createdGroup) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Group "${groupId}" already exists`
      );
      return;
    }

    await this.triggerSync();
  }

  async renameGroup(groupId: string, nextGroupId: string) {
    if (!this._stateHandler) {
      return;
    }

    const result = await this._stateHandler.renameGroup(groupId, nextGroupId);

    if (!result) {
      this.notify(
        ExtensionNotificationKind.Error,
        `Renaming "${groupId}" failed`
      );
      return;
    }

    await this.triggerSync();
  }

  async takeSnapshot() {
    if (!this._stateHandler) {
      return;
    }

    await this._stateHandler.addCurrentStateToHistory();
    await this.triggerSync();
  }

  async recoverSnapshot(historyId: string) {
    if (!this._stateHandler) {
      return;
    }

    const loaded = await this._stateHandler.loadHistoryState(historyId);

    if (!loaded) {
      this.notify(ExtensionNotificationKind.Warning, 'History entry not found');
      return;
    }

    await this.applyState();
  }

  async deleteGroup(groupId: string) {
    if (!this._stateHandler) {
      return;
    }

    const deleted = await this._stateHandler.deleteGroup(groupId);

    if (!deleted) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Group "${groupId}" not found`
      );
      return;
    }

    await this.triggerSync();
  }

  async deleteSnapshot(historyId: string) {
    if (!this._stateHandler) {
      return;
    }

    const deleted = await this._stateHandler.deleteHistoryEntry(historyId);

    if (!deleted) {
      this.notify(ExtensionNotificationKind.Warning, 'History entry not found');
      return;
    }

    await this.triggerSync();
  }

  async assignQuickSlot(slot: QuickSlotIndex, groupId: string | null) {
    if (!this._stateHandler) {
      return;
    }

    await this._stateHandler.setQuickSlot(slot, groupId);
    await this.triggerSync();
  }

  async applyQuickSlot(slot: QuickSlotIndex) {
    if (!this._stateHandler) {
      return;
    }

    const groupId = await this._stateHandler.getQuickSlotAssignment(slot);

    if (!groupId) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Quick slot ${slot} is not assigned`
      );
      return;
    }

    const loaded = await this._stateHandler.loadState(groupId);

    if (!loaded) {
      await this._stateHandler.setQuickSlot(slot, null);
      this.notify(
        ExtensionNotificationKind.Warning,
        `Saved group "${groupId}" was not found. Quick slot ${slot} was cleared.`
      );
      await this.triggerSync();
      return;
    }

    await this.applyState();
    await this.triggerSync();
  }

  async quickSwitch(): Promise<void> {
    if (!this._stateHandler) {
      return;
    }

    this._stateHandler.setState(this._stateHandler.previousStateContainer);
    await this.applyState();
    await this.triggerSync();
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
    this._stateHandler?.dispose();

    this._stateHandler = null;
    this._layoutService = null;
    this._configService = null;
    this._gitService = null;
    this._configService = null;
  }
}

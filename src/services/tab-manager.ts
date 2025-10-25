import { Disposable, EventEmitter, window } from 'vscode';

import { GitIntegrationMode } from '../types/config';
import {
  ExtensionNotificationKind,
  ExtensionNotificationMessage,
  ExtensionTabsSyncMessage
} from '../types/messages';
import {
  ITabManagerService,
  QuickSlotIndex,
  RenderingItem
} from '../types/tab-manager';
import { TabInfo } from '../types/tabs';
import {
  closeAllEditors,
  focusTabInGroup,
  openTab,
  pinEditor,
  setEditorLayout,
  unpinEditor
} from '../utils/commands';
import { delay } from '../utils/delay';
import {
  closeTab,
  countTabs,
  findTabByViewColumnAndIndex,
  findTabGroupByViewColumn
} from '../utils/tab-utils';
import { ConfigService } from './config';
import { EditorLayoutService } from './editor-layout';
import {
  GitBranchChangeEvent,
  GitRepositoryOpenEvent,
  GitService
} from './git';
import { TabStateService } from './tab-state';

export class TabManagerService implements ITabManagerService {
  static readonly RENDER_COOLDOWN_MS = 100;

  private _rendering: boolean;
  private _nextRenderingItem: RenderingItem;

  private _stateService: TabStateService;
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

  constructor(
    layoutService: EditorLayoutService,
    configService: ConfigService,
    gitService: GitService | null = null
  ) {
    this._nextRenderingItem = null;
    this._stateService = null;
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
    return this._stateService;
  }

  get onDidSyncTabs() {
    return this._syncViewEmitter.event;
  }

  get onDidNotify() {
    return this._notifyViewEmitter.event;
  }

  async attachStateService() {
    if (this._stateService != null) this._stateService.dispose();
    this._stateService = null;
    const newStateService = new TabStateService(this._configService);
    await newStateService.initialize();
    this._stateService = newStateService;
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
      window.onDidChangeActiveTextEditor(() => void this.refresh())
    );
    this._disposables.push(
      window.onDidChangeTextEditorOptions(() => void this.refresh())
    );
    this._disposables.push(
      this._layoutService.onDidChangeLayout(() => void this.refresh())
    );
    this._disposables.push(
      this._configService.onDidChangeConfig(async (changes) => {
        if (changes.masterWorkspaceFolder !== undefined) {
          await this.attachStateService();
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
    const groups = await this._stateService.getGroups();
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

  async refresh() {
    if (!this._stateService) {
      return;
    }
    if (this._rendering) {
      return;
    }

    await this._stateService.refreshState();
    await this.triggerSync();
  }

  async applyState() {
    if (!this._stateService) return;

    this._nextRenderingItem = {
      state: this._stateService.stateContainer,
      previousState: this._stateService.previousStateContainer
    };

    if (this._rendering) return;

    this.next().catch(console.error);
  }

  private async next() {
    this._rendering = true;

    while (this._nextRenderingItem !== null) {
      try {
        await this.render();
        // Introduce a small delay to allow VS Code to process UI updates
        await delay(TabManagerService.RENDER_COOLDOWN_MS);
      } catch (error) {
        this.notify(ExtensionNotificationKind.Error, 'Failed to rerender tabs');
      }
    }

    await this.triggerSync().catch(console.error);
    this._rendering = false;
  }

  private async render() {
    const currentState = this._nextRenderingItem.state;
    const previousState = this._nextRenderingItem.previousState;

    this._nextRenderingItem = null;

    if (countTabs() > 0) {
      await closeAllEditors();

      if (countTabs() > 0) {
        this._stateService.setState(previousState);
        return;
      }
    }

    console.log('Rendering tabs for group:', currentState);

    this._layoutService.setLayout(currentState.state.layout);
    await setEditorLayout(currentState.state.layout);

    const tabGroupItems = Object.values(currentState.state.tabState.tabGroups);
    const pinnedTabs: { tab: TabInfo; index: number }[] = [];
    const activeTabs: { tab: TabInfo; index: number }[] = [];
    const focusedViewColumn =
      currentState.state.tabState.tabGroups[
        currentState.state.tabState.activeGroup
      ].viewColumn;
    const focusedIndex = currentState.state.tabState.tabGroups[
      currentState.state.tabState.activeGroup
    ].tabs.findIndex((tab) => tab.isActive);

    await Promise.all(
      tabGroupItems.map(async (group) => {
        return await Promise.all(
          group.tabs.map(async (tab, index) => {
            if (tab.isActive) activeTabs.push({ tab, index });
            await openTab(tab);
            if (tab.isPinned) pinnedTabs.push({ tab, index });
          })
        );
      })
    );

    for (let i = 0; i < pinnedTabs.length; i++) {
      const { tab, index } = pinnedTabs[i];
      await pinEditor(tab.viewColumn, index, false);
    }

    for (let i = 0; i < activeTabs.length; i++) {
      const { tab, index } = activeTabs[i];
      if (tab.viewColumn === focusedViewColumn && index === focusedIndex) {
        continue;
      }
      await focusTabInGroup(tab.viewColumn, index);
    }

    await focusTabInGroup(focusedViewColumn, focusedIndex);
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

  async triggerSync() {
    if (!this._stateService) {
      return;
    }

    const [groups, history, quickSlots] = await Promise.all([
      this._stateService.getGroups(),
      this._stateService.getHistory(),
      this._stateService.getQuickSlots()
    ]);
    const groupValues = Object.values(groups);

    groupValues.sort((a, b) => {
      const timeA = a.lastSelectedAt || 0;
      const timeB = b.lastSelectedAt || 0;
      return timeB - timeA;
    });

    const historyValues = Object.values(history);

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
      tabState: this._stateService.stateContainer.state.tabState,
      histories: historyValues.map((entry) => ({
        historyId: entry.id,
        name: entry.name
      })),
      groups: groupValues.map((group) => ({
        groupId: group.id,
        name: group.name
      })),
      selectedGroup:
        this._stateService.stateContainer.id in groups
          ? this._stateService.stateContainer.id
          : null,
      quickSlots,
      masterWorkspaceFolder,
      availableWorkspaceFolders,
      gitIntegration
    });
  }

  async switchToGroup(groupId: string | null) {
    if (!this._stateService) {
      return;
    }

    if (this._stateService.stateContainer.id === groupId) {
      return;
    }

    if (groupId == null) {
      await this._stateService.forkState();
      await this.triggerSync();
      return;
    }

    const loaded = await this._stateService.loadState(groupId);

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
    if (!this._stateService) {
      return;
    }

    const createdGroup = await this._stateService.createGroup(groupId);

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
    if (!this._stateService) {
      return;
    }

    const normalizedNextGroupId = nextGroupId.trim();
    const result = await this._stateService.renameGroup(
      groupId,
      normalizedNextGroupId
    );

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
    if (!this._stateService) {
      return;
    }

    await this._stateService.addCurrentStateToHistory();
    await this.triggerSync();
  }

  async recoverSnapshot(historyId: string) {
    if (!this._stateService) {
      return;
    }

    const loaded = await this._stateService.loadHistoryState(historyId);

    if (!loaded) {
      this.notify(ExtensionNotificationKind.Warning, 'History entry not found');
      return;
    }

    await this.applyState();
  }

  async deleteGroup(groupId: string) {
    if (!this._stateService) {
      return;
    }

    const deleted = await this._stateService.deleteGroup(groupId);

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
    if (!this._stateService) {
      return;
    }

    const deleted = await this._stateService.deleteHistoryEntry(historyId);

    if (!deleted) {
      this.notify(ExtensionNotificationKind.Warning, 'History entry not found');
      return;
    }

    await this.triggerSync();
  }

  async assignQuickSlot(slot: QuickSlotIndex, groupId: string | null) {
    if (!this._stateService) {
      return;
    }

    await this._stateService.setQuickSlot(slot, groupId);
    await this.triggerSync();
  }

  async applyQuickSlot(slot: QuickSlotIndex) {
    if (!this._stateService) {
      return;
    }

    const groupId = await this._stateService.getQuickSlotAssignment(slot);

    if (!groupId) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Quick slot ${slot} is not assigned`
      );
      return;
    }

    const loaded = await this._stateService.loadState(groupId);

    if (!loaded) {
      await this._stateService.setQuickSlot(slot, null);
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
    if (!this._stateService) {
      return;
    }

    this._stateService.setState(this._stateService.previousStateContainer);

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
    this._stateService?.dispose();

    this._stateService = null;
    this._layoutService = null;
    this._configService = null;
    this._gitService = null;
    this._configService = null;
  }
}

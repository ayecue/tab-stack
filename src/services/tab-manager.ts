import { Disposable, EventEmitter, Tab, TabGroup, window } from 'vscode';

import {
  ExtensionNotificationKind,
  ExtensionNotificationMessage,
  ExtensionTabsSyncMessage
} from '../types/messages';
import {
  EMPTY_GROUP_SELECTION,
  ITabManagerService,
  QuickSlotIndex,
  TabManagerState
} from '../types/tab-manager';
import { TabInfo } from '../types/tabs';
import {
  focusTabInGroup,
  openTab,
  pinEditor,
  setEditorLayout,
  unpinEditor
} from '../utils/commands';
import { delay } from '../utils/delay';
import { EditorLayoutService } from './editor-layout';
import { TabStateService } from './tab-state';

export class TabManagerService implements ITabManagerService {
  static readonly RENDER_COOLDOWN_MS = 100;

  private _rendering: boolean;
  private _nextRenderingItem: TabManagerState;

  private _stateService: TabStateService;
  private _layoutService: EditorLayoutService;

  private _syncViewEmitter: EventEmitter<
    Omit<ExtensionTabsSyncMessage, 'type'>
  >;

  private _notifyViewEmitter: EventEmitter<
    Omit<ExtensionNotificationMessage, 'type'>
  >;

  private _onDidChangeTabsListener?: Disposable;
  private _onDidChangeTabGroupsListener?: Disposable;
  private _onDidChangeActiveEditorListener?: Disposable;
  private _onDidChangeTextEditorOptionsListener?: Disposable;
  private _onDidChangeEditorLayoutListener?: Disposable;

  constructor(
    stateService: TabStateService,
    layoutService: EditorLayoutService
  ) {
    this._nextRenderingItem = null;
    this._stateService = stateService;
    this._rendering = false;
    this._layoutService = layoutService;
    this._syncViewEmitter = new EventEmitter<
      Omit<ExtensionTabsSyncMessage, 'type'>
    >();
    this._notifyViewEmitter = new EventEmitter<
      Omit<ExtensionNotificationMessage, 'type'>
    >();

    this.initializeEvents();
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

  private initializeEvents() {
    this._onDidChangeTabsListener = window.tabGroups.onDidChangeTabs(
      () => void this.refresh()
    );
    this._onDidChangeTabGroupsListener = window.tabGroups.onDidChangeTabGroups(
      () => void this.refresh()
    );
    this._onDidChangeActiveEditorListener = window.onDidChangeActiveTextEditor(
      () => void this.refresh()
    );
    this._onDidChangeTextEditorOptionsListener =
      window.onDidChangeTextEditorOptions(() => void this.refresh());
    this._onDidChangeEditorLayoutListener =
      this._layoutService.onDidChangeLayout(() => void this.refresh());
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

  findTabGroupByViewColumn(viewColumn: number): TabGroup | null {
    if (!this._stateService) {
      return null;
    }

    const targetGroup = window.tabGroups.all.find(
      (group) => group.viewColumn === viewColumn
    );

    return targetGroup || null;
  }

  findTabByViewColumnAndIndex(viewColumn: number, index: number): Tab | null {
    if (!this._stateService) {
      return null;
    }

    const targetGroup = this.findTabGroupByViewColumn(viewColumn);

    if (!targetGroup) {
      return null;
    }

    return targetGroup.tabs[index] || null;
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

    this._nextRenderingItem = await this._stateService.getState();

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
    const currentState = this._nextRenderingItem;

    this._nextRenderingItem = null;
    this._layoutService.setLayout(currentState.layout);

    if (window.tabGroups.all.length > 0) {
      await Promise.all(
        window.tabGroups.all.map((tab) => window.tabGroups.close(tab, true))
      );
    }

    await setEditorLayout(currentState.layout);

    const tabGroupItems = Object.values(currentState.tabState.tabGroups);
    const pinnedTabs: { tab: TabInfo; index: number }[] = [];
    const activeTabs: { tab: TabInfo; index: number }[] = [];
    const focusedViewColumn =
      currentState.tabState.tabGroups[currentState.tabState.activeGroup]
        .viewColumn;
    const focusedIndex = currentState.tabState.tabGroups[
      currentState.tabState.activeGroup
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
    const targetTab = this.findTabByViewColumnAndIndex(viewColumn, index);

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
    const targetGroup = this.findTabGroupByViewColumn(viewColumn);

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
    const targetTab = this.findTabByViewColumnAndIndex(viewColumn, index);

    if (!targetTab) {
      this.notify(ExtensionNotificationKind.Warning, 'Tab not found');
      return;
    }

    await window.tabGroups.close(targetTab);
  }

  async triggerSync() {
    if (!this._stateService) {
      return;
    }

    const [state, groups, history, quickSlots] = await Promise.all([
      this._stateService.getState(),
      this._stateService.getGroups(),
      this._stateService.getHistory(),
      this._stateService.getQuickSlots()
    ]);

    const groupNames = Object.keys(groups);
    const historyKeys = Object.keys(history);

    this._syncViewEmitter.fire({
      tabState: state.tabState,
      history: historyKeys,
      groups: groupNames,
      selectedGroup: this._stateService.selectedGroup ?? null,
      quickSlots
    });
  }

  async switchToGroup(groupId: string | null) {
    if (!this._stateService) {
      return;
    }

    if (!groupId || this._stateService.selectedGroup === groupId) {
      await this._stateService.setSelectedGroup(EMPTY_GROUP_SELECTION);
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

    const previousGroup = await this._stateService.getPreviousSelectedGroup();

    if (!previousGroup) {
      this.notify(
        ExtensionNotificationKind.Warning,
        'No previous group to switch to'
      );
      return;
    }

    const didSwitch = await this._stateService.loadState(previousGroup);

    if (!didSwitch) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Previous group "${previousGroup}" no longer exists`
      );
      await this.triggerSync();
      return;
    }

    await this.applyState();
    await this.triggerSync();
  }

  dispose() {
    this._onDidChangeTabsListener?.dispose();
    this._onDidChangeTabGroupsListener?.dispose();
    this._onDidChangeActiveEditorListener?.dispose();
    this._onDidChangeTextEditorOptionsListener?.dispose();
    this._onDidChangeEditorLayoutListener?.dispose();
    this._stateService?.dispose();
    this._layoutService?.dispose();

    this._stateService = null;
    this._layoutService = null;
  }
}

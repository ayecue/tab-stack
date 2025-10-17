import {
  CancellationToken,
  Disposable,
  ExtensionContext,
  Tab,
  TabGroup,
  WebviewView,
  WebviewViewResolveContext,
  window
} from 'vscode';

import {
  BaseWebviewMessage,
  ExtensionNotificationKind
} from '../types/messages';
import {
  EMPTY_GROUP_SELECTION,
  ITabManagerProvider,
  QuickSlotIndex
} from '../types/tab-manager';
import { TabInfo } from '../types/tabs';
import {
  focusGroup,
  focusTab,
  getEditorLayout,
  openTab,
  pinEditor,
  setEditorLayout,
  unpinEditor
} from '../utils/commands';
import { EditorLayoutProvider } from './editor-layout';
import { MessageHandlerProvider } from './message-handler';
import { TabStateProvider } from './tab-state';
import { WebviewProvider } from './webview';

export class TabManagerProvider implements ITabManagerProvider {
  static readonly VIEW_TYPE = 'tabStackView' as const;

  private _isRendering: boolean;

  private _context: ExtensionContext;
  private _view: WebviewProvider;
  private _state: TabStateProvider;
  private _messageHandler: MessageHandlerProvider;
  private _layoutProvider: EditorLayoutProvider;

  private _onDidChangeTabsListener?: Disposable;
  private _onDidChangeTabGroupsListener?: Disposable;
  private _onDidChangeActiveEditorListener?: Disposable;
  private _onDidChangeEditorLayoutListener?: Disposable;

  constructor(context: ExtensionContext) {
    this._context = context;
    this._view = null;
    this._state = null;
    this._isRendering = false;
    this._layoutProvider = new EditorLayoutProvider();

    this.initializeEvents();
  }

  get state() {
    return this._state;
  }

  get view() {
    return this._view;
  }

  private notify(kind: ExtensionNotificationKind, message: string) {
    if (this._view) {
      this._view.sendNotification(kind, message);
      return;
    }

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
    this._onDidChangeEditorLayoutListener =
      this._layoutProvider.onDidChangeLayout(() => void this.refresh());
  }

  async initializeState() {
    this._state = new TabStateProvider();
    await this._state.initialize();
    this._layoutProvider.setLayout(await getEditorLayout());
    this._layoutProvider.start();
  }

  findTabGroupByViewColumn(viewColumn: number): TabGroup | null {
    if (!this._state) {
      return null;
    }

    const targetGroup = window.tabGroups.all.find(
      (group) => group.viewColumn === viewColumn
    );

    return targetGroup || null;
  }

  findTabByViewColumnAndIndex(viewColumn: number, index: number): Tab | null {
    if (!this._state) {
      return null;
    }

    const targetGroup = this.findTabGroupByViewColumn(viewColumn);

    if (!targetGroup) {
      return null;
    }

    return targetGroup.tabs[index] || null;
  }

  async refresh() {
    if (!this._state) {
      return;
    }

    await this._state.refreshState();
    await this.syncWebview();
  }

  async applyState() {
    if (this._isRendering) return;
    if (!this._state) return;

    this._isRendering = true;

    try {
      const currentState = await this._state.getState();

      this._layoutProvider.setLayout(currentState.layout);

      if (window.tabGroups.all.length > 0) {
        await Promise.all(
          window.tabGroups.all.map((tab) => window.tabGroups.close(tab, true))
        );
      }

      await setEditorLayout(currentState.layout);

      const tabGroupItems = Object.values(currentState.tabState.tabGroups);
      const activeTabs: { tab: TabInfo; index: number }[] = [];
      const focusedViewColumn =
        currentState.tabState.tabGroups[currentState.tabState.activeGroup]
          .viewColumn;
      const focusedIndex = currentState.tabState.tabGroups[
        currentState.tabState.activeGroup
      ].tabs.findIndex((tab) => tab.isActive);

      await Promise.all(
        tabGroupItems.map(async (group) => {
          return group.tabs.flatMap(async (tab, index) => {
            if (tab.isActive) activeTabs.push({ tab, index });
            await openTab(tab);
          });
        })
      );

      await Promise.all(
        activeTabs.map(async ({ tab, index }) => {
          if (tab.viewColumn == focusedViewColumn) return;
          await focusGroup(tab.viewColumn);
          await focusTab(index);
        })
      );

      await focusGroup(focusedViewColumn);
      await focusTab(focusedIndex);
    } catch (error) {
      this.notify(ExtensionNotificationKind.Error, 'Failed to rerender tabs');
    } finally {
      this._isRendering = false;
      this.refresh().catch(console.error);
    }
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
      await focusGroup(viewColumn);
      await focusTab(index);
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

  async syncWebview() {
    if (!this._view || !this._state) {
      return;
    }

    const [state, groups, history, quickSlots] = await Promise.all([
      this._state.getState(),
      this._state.getGroups(),
      this._state.getHistory(),
      this._state.getQuickSlots()
    ]);

    const groupNames = Object.keys(groups);
    const historyKeys = Object.keys(history);

    this._view.sendSync({
      tabState: state.tabState,
      history: historyKeys,
      groups: groupNames,
      selectedGroup: this._state.selectedGroup ?? null,
      quickSlots
    });
  }

  async switchToGroup(groupId: string | null) {
    if (!this._state) {
      return;
    }

    if (!groupId || this._state.selectedGroup === groupId) {
      await this._state.setSelectedGroup(EMPTY_GROUP_SELECTION);
      await this.syncWebview();
      return;
    }

    const loaded = await this._state.loadState(groupId);

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
    if (!this._state) {
      return;
    }

    const createdGroup = await this._state.createGroup(groupId);

    if (!createdGroup) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Group "${groupId}" already exists`
      );
      return;
    }

    await this.syncWebview();
  }

  async takeSnapshot() {
    if (!this._state) {
      return;
    }

    await this._state.addCurrentStateToHistory();
    await this.syncWebview();
  }

  async recoverSnapshot(historyId: string) {
    if (!this._state) {
      return;
    }

    const loaded = await this._state.loadHistoryState(historyId);

    if (!loaded) {
      this.notify(ExtensionNotificationKind.Warning, 'History entry not found');
      return;
    }

    await this.applyState();
  }

  async deleteGroup(groupId: string) {
    if (!this._state) {
      return;
    }

    const deleted = await this._state.deleteGroup(groupId);

    if (!deleted) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Group "${groupId}" not found`
      );
      return;
    }

    await this.syncWebview();
  }

  async deleteSnapshot(historyId: string) {
    if (!this._state) {
      return;
    }

    const deleted = await this._state.deleteHistoryEntry(historyId);

    if (!deleted) {
      this.notify(ExtensionNotificationKind.Warning, 'History entry not found');
      return;
    }

    await this.syncWebview();
  }

  async assignQuickSlot(slot: QuickSlotIndex, groupId: string | null) {
    if (!this._state) {
      return;
    }

    await this._state.setQuickSlot(slot, groupId);
    await this.syncWebview();
  }

  async applyQuickSlot(slot: QuickSlotIndex) {
    if (!this._state) {
      return;
    }

    const groupId = await this._state.getQuickSlotAssignment(slot);

    if (!groupId) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Quick slot ${slot} is not assigned`
      );
      return;
    }

    const loaded = await this._state.loadState(groupId);

    if (!loaded) {
      await this._state.setQuickSlot(slot, null);
      this.notify(
        ExtensionNotificationKind.Warning,
        `Saved group "${groupId}" was not found. Quick slot ${slot} was cleared.`
      );
      await this.syncWebview();
      return;
    }

    await this.applyState();
    await this.syncWebview();
  }

  async quickSwitch(): Promise<void> {
    if (!this._state) {
      return;
    }

    const previousGroup = await this._state.getPreviousSelectedGroup();

    if (!previousGroup) {
      this.notify(
        ExtensionNotificationKind.Warning,
        'No previous group to switch to'
      );
      return;
    }

    const didSwitch = await this._state.loadState(previousGroup);

    if (!didSwitch) {
      this.notify(
        ExtensionNotificationKind.Warning,
        `Previous group "${previousGroup}" no longer exists`
      );
      await this.syncWebview();
      return;
    }

    await this.applyState();
    await this.syncWebview();
  }

  async resolveWebviewView(
    webviewView: WebviewView,
    _context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    this._view = new WebviewProvider(webviewView, this._context);
    this._messageHandler = new MessageHandlerProvider(this);
    await this._view.initialize();
    this._view.on('message', async (data: BaseWebviewMessage) => {
      await this._messageHandler.handle(data);
    });
  }

  dispose() {
    this._onDidChangeTabsListener?.dispose();
    this._onDidChangeTabGroupsListener?.dispose();
    this._onDidChangeActiveEditorListener?.dispose();
    this._onDidChangeEditorLayoutListener?.dispose();
    this._view?.dispose();
    this._state?.dispose();
    this._messageHandler?.dispose();
    this._layoutProvider?.dispose();

    this._view = null;
    this._state = null;
    this._messageHandler = null;
    this._layoutProvider = null;
  }
}

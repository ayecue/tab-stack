import debounce, { DebouncedFunction } from 'debounce';
import {
  commands,
  Disposable,
  EventEmitter,
  NotebookEditor,
  Terminal,
  TextEditor,
  Uri,
  window
} from 'vscode';

import { ConfigService } from '../services/config';
import { EditorLayoutService } from '../services/editor-layout';
import { getLogger, ScopedLogger } from '../services/logger';
import {
  createTabActiveStateStore,
  TabActiveStateStore
} from '../stores/tab-active-state';
import { transformTabToTabInfo } from '../transformers/tab';
import { TabManagerState } from '../types/tab-manager';
import {
  AssociatedTabInstance,
  OpenTabResult,
  TabInfo,
  TabInfoCustom,
  TabInfoId,
  TabInfoMetaNotebookEditor,
  TabInfoMetaTerminal,
  TabInfoMetaTextEditor,
  TabInfoNotebook,
  TabInfoNotebookDiff,
  TabInfoText,
  TabInfoTextDiff,
  TabInfoWebview,
  TabKind,
  TabState
} from '../types/tabs';
import { focusTabInGroup, moveTab, pinEditor } from '../utils/commands';
import { delay, delayImmediate } from '../utils/delay';
import { createSelectionRange, createTabKey, createTabKeyByViewColumn } from '../utils/tab-utils';
import { updatedDiff } from 'deep-object-diff';

export class TabActiveStateHandler implements Disposable {
  static readonly STATE_UPDATE_DEBOUNCE_DELAY = 10 as const;
  static readonly SYNC_TABS_DEBOUNCE_DELAY = 10 as const;

  private _tabActiveStateStore: TabActiveStateStore;
  private _associatedTabs: Map<string, TabInfoId>;
  private _associatedInstances: Map<AssociatedTabInstance, TabInfoId>;

  private _stateUpdateEmitter: EventEmitter<TabManagerState>;
  private _storeSubscription: { unsubscribe: () => void } | null;
  private _layoutService: EditorLayoutService;
  private _configService: ConfigService;

  private _disposables: Disposable[];
  private _cachedTabState: TabState | null;
  private _isStateLocked: boolean;
  private _log: ScopedLogger;

  public readonly triggerStateUpdate: DebouncedFunction<() => Promise<void>>;
  public readonly syncTabs: DebouncedFunction<() => void>;

  constructor(
    layoutService: EditorLayoutService,
    configService: ConfigService
  ) {
    this._tabActiveStateStore = createTabActiveStateStore();
    this._associatedTabs = new Map();
    this._associatedInstances = new Map();
    this._stateUpdateEmitter = new EventEmitter<TabManagerState>();
    this._layoutService = layoutService;
    this._configService = configService;
    this._disposables = [];
    this._storeSubscription = null;
    this._cachedTabState = null;
    this._isStateLocked = false;
    this._log = getLogger().child('ActiveStateHandler');

    this.triggerStateUpdate = debounce(
      this._triggerStateUpdate.bind(this),
      TabActiveStateHandler.STATE_UPDATE_DEBOUNCE_DELAY
    );
    this.syncTabs = debounce(
      this._syncTabs.bind(this),
      TabActiveStateHandler.SYNC_TABS_DEBOUNCE_DELAY
    );

    this.initializeEvents();
  }

  private initializeEvents() {
    this._disposables.push(
      // Sync tabs on tab group or tab changes
      window.tabGroups.onDidChangeTabGroups(() => {
        this.syncTabs();
      }),
      window.tabGroups.onDidChangeTabs(() => {
        this.syncTabs();
      }),

      // Associate Instances with TabIds by picking the currently active tab
      window.onDidChangeActiveTextEditor((editor) => {
        this.associateTextEditorWithTab(editor);
      }),
      window.onDidChangeActiveNotebookEditor((editor) => {
        this.associateNotebookEditorWithTab(editor);
      }),
      window.onDidChangeActiveTerminal((terminal) => {
        this.associateTerminalWithTab(terminal);
      }),

      // Listen for selection changes to update selection meta
      window.onDidChangeTextEditorSelection((event) => {
        this.updateTextEditorSelection(event.textEditor);
      }),
      window.onDidChangeNotebookEditorSelection((event) => {
        this.updateNotebookEditorSelection(event.notebookEditor);
      }),

      // Listen to layout changes
      this._layoutService.onDidChangeLayout(() => {
        void this.triggerStateUpdate();
      })
    );

    // Store subscription to emit state updates
    this._storeSubscription = this._tabActiveStateStore.subscribe(async () => {
      this._cachedTabState = null;
      void this.triggerStateUpdate();
    });
  }

  get onDidChangeState() {
    return this._stateUpdateEmitter.event;
  }

  private associateTextEditorWithTab(editor: TextEditor) {
    if (this._isStateLocked) return;

    const activeTabGroup = window.tabGroups.activeTabGroup;
    const activeTab = activeTabGroup?.activeTab;
    if (activeTab == null || activeTabGroup == null) return;

    const tabIndex = activeTabGroup.tabs.indexOf(activeTab);
    if (tabIndex === -1) return;

    const tabKey = createTabKey(activeTab, activeTabGroup, tabIndex);
    const tabId = this._associatedTabs.get(tabKey);
    if (tabId == null) return;

    const tabInfo = this._tabActiveStateStore.getSnapshot().context.tabs[tabId];

    if (tabInfo == null) {
      console.warn('No tab info found for tab ID:', tabId);
      return;
    }

    if (
      tabInfo.kind === TabKind.TabInputText ||
      tabInfo.kind === TabKind.TabInputTextDiff
    ) {
      this._associatedInstances.set(editor, tabId);
    }
  }

  private associateNotebookEditorWithTab(editor: NotebookEditor | undefined) {
    if (this._isStateLocked) return;

    const activeTabGroup = window.tabGroups.activeTabGroup;
    const activeTab = activeTabGroup?.activeTab;
    if (activeTab == null || activeTabGroup == null) return;

    const tabIndex = activeTabGroup.tabs.indexOf(activeTab);
    if (tabIndex === -1) return;

    const tabKey = createTabKey(activeTab, activeTabGroup, tabIndex);
    const tabId = this._associatedTabs.get(tabKey);
    if (tabId == null) return;

    const tabInfo = this._tabActiveStateStore.getSnapshot().context.tabs[tabId];

    if (tabInfo == null) {
      console.warn('No tab info found for tab ID:', tabId);
      return;
    }

    if (
      tabInfo.kind === TabKind.TabInputNotebook ||
      tabInfo.kind === TabKind.TabInputNotebookDiff
    ) {
      this._associatedInstances.set(editor, tabId);
    }
  }

  private associateTerminalWithTab(terminal: Terminal) {
    if (this._isStateLocked) return;

    const activeTabGroup = window.tabGroups.activeTabGroup;
    const activeTab = activeTabGroup?.activeTab;
    if (activeTab == null || activeTabGroup == null) return;

    const tabIndex = activeTabGroup.tabs.indexOf(activeTab);
    if (tabIndex === -1) return;

    const tabKey = createTabKey(activeTab, activeTabGroup, tabIndex);
    const tabId = this._associatedTabs.get(tabKey);
    if (tabId == null) return;

    const tabInfo = this._tabActiveStateStore.getSnapshot().context.tabs[tabId];

    if (tabInfo == null) {
      console.warn('No tab info found for tab ID:', tabId);
      return;
    }

    if (tabInfo.kind === TabKind.TabInputTerminal) {
      this._associatedInstances.set(terminal, tabId);
    }
  }

  private updateTextEditorSelection(editor: TextEditor) {
    if (this._isStateLocked) return;

    const tabId = this._associatedInstances.get(editor);
    if (!tabId) return;

    const tabInfo = this._tabActiveStateStore.getSnapshot().context.tabs[tabId];

    if (tabInfo == null) {
      console.warn('No tab info or meta found for tab ID:', tabId);
      return;
    }

    const updatedTabInfo: TabInfo = {
      ...tabInfo,
      meta: {
        ...tabInfo.meta,
        selection: createSelectionRange(
          editor.selection.start.line,
          editor.selection.start.character,
          editor.selection.end.line,
          editor.selection.end.character
        )
      } as TabInfoMetaTextEditor
    };

    this._tabActiveStateStore.send({
      type: 'UPDATE_TAB',
      payload: updatedTabInfo
    });
  }

  private updateNotebookEditorSelection(editor: NotebookEditor) {
    if (this._isStateLocked) return;

    const tabId = this._associatedInstances.get(editor);
    if (tabId == null) return;

    const tabInfo = this._tabActiveStateStore.getSnapshot().context.tabs[tabId];
    if (tabInfo == null) {
      console.warn('No tab info found for tab ID:', tabId);
      return;
    }

    const firstSelection = editor.selections[0];
    if (firstSelection == null) return;

    const updatedTabInfo: TabInfo = {
      ...tabInfo,
      meta: {
        ...tabInfo.meta,
        selection: createSelectionRange(
          firstSelection.start,
          0,
          firstSelection.end,
          0
        )
      } as TabInfoMetaNotebookEditor
    };

    this._tabActiveStateStore.send({
      type: 'UPDATE_TAB',
      payload: updatedTabInfo
    });
  }

  private _syncTabs(): void {
    if (this._isStateLocked) {
      this._log.debug('syncTabs skipped — state is locked');
      return;
    }

    this._log.debug('syncTabs starting');
    const tabsInState = this._tabActiveStateStore.getSnapshot().context.tabs;
    const activeTabIds = new Set<TabInfoId>();
    const newAssociatedTabs = new Map<string, TabInfoId>();

    window.tabGroups.all.forEach((tabGroup) => {
      tabGroup.tabs.forEach((tab, index) => {
        const tabKey = createTabKey(tab, tabGroup, index);
        const existingTabId = this._associatedTabs.get(tabKey);

        if (existingTabId != null) {
          const existingTabInfo = tabsInState[existingTabId];

          if (existingTabInfo) {
            const updatedTabInfo: Partial<TabInfo> = {
              label: tab.label,
              isActive: tab.isActive,
              isPinned: tab.isPinned,
              isDirty: tab.isDirty,
              index,
              viewColumn: tabGroup.viewColumn,
              isRecoverable: this.isTabRecoverable(existingTabInfo)
            };

            activeTabIds.add(existingTabId);
            newAssociatedTabs.set(tabKey, existingTabId);

            if (Object.keys(updatedDiff(existingTabInfo, updatedTabInfo)).length === 0) {
              return;
            }

            this._tabActiveStateStore.send({
              type: 'UPDATE_TAB',
              payload: {
                ...existingTabInfo,
                ...updatedTabInfo
              }
            });
            return;
          }
        }

        // Create new tab
        const baseTabInfo: TabInfo = transformTabToTabInfo(
          tab,
          tabGroup,
          index
        );
        // Compute isRecoverable flag
        const newTabInfo: TabInfo = {
          ...baseTabInfo,
          isRecoverable: this.isTabRecoverable(baseTabInfo)
        };

        this._tabActiveStateStore.send({
          type: 'ADD_TAB',
          payload: newTabInfo
        });

        this._log.debug(`tab added: "${newTabInfo.label}" (${newTabInfo.id}), kind=${newTabInfo.kind}`);
        activeTabIds.add(newTabInfo.id);
        newAssociatedTabs.set(tabKey, newTabInfo.id);
      });
    });

    // Remove tabs that are no longer present in VSCode
    Object.keys(tabsInState).forEach((tabId) => {
      if (!activeTabIds.has(tabId)) {
        const removedTab = tabsInState[tabId];
        this._log.debug(`tab removed: "${removedTab?.label ?? tabId}" (${tabId})`);
        this._tabActiveStateStore.send({
          type: 'REMOVE_TAB',
          payload: tabId
        });
      }
    });

    this._log.debug(`syncTabs complete — ${activeTabIds.size} active tab(s)`);
    // Update associated tabs map
    this._associatedTabs = newAssociatedTabs;

    // Clean up associated instances
    this._associatedInstances.forEach((tabId, instance) => {
      if (!activeTabIds.has(tabId)) this._associatedInstances.delete(instance);
    });
  }

  getTabManagerState(): TabManagerState {
    const tabState = this.getTabState();
    const layout = this._layoutService.currentLayout;

    return {
      tabState,
      layout
    };
  }

  getTabState(): TabState {
    // Return cached state if available
    if (this._cachedTabState !== null) {
      return this._cachedTabState;
    }

    const currentTabs = this._tabActiveStateStore.getSnapshot().context.tabs;
    const tabs = window.tabGroups.all.flatMap((group) => {
      return group.tabs.map((tab, index) => {
        const key = createTabKey(tab, group, index);
        const tabId = this._associatedTabs.get(key);
        if (tabId == null) {
          return transformTabToTabInfo(tab, group, index);
        }
        return currentTabs[tabId];
      });
    });

    // Group tabs by view column
    const tabsGroupedByColumn: Record<number, TabInfo[]> = {};
    tabs.forEach((tab) => {
      const column = tab.viewColumn ?? 0;
      tabsGroupedByColumn[column] ??= [];
      tabsGroupedByColumn[column].push(tab);
    });

    const tabState: TabState = {
      tabGroups: {},
      activeGroup: window.tabGroups.activeTabGroup.viewColumn
    };

    Object.entries(tabsGroupedByColumn).forEach(
      ([viewColumn, tabsInColumn]) => {
        const activeTabInColumn = tabsInColumn.find((tab) => tab.isActive);
        const sortedTabs: TabInfo[] = new Array(tabsInColumn.length);
        const viewColumnNumber = Number(viewColumn);

        tabsInColumn.forEach((tab) => {
          sortedTabs[tab.index] = tab;
        });

        tabState.tabGroups[viewColumnNumber] = {
          tabs: sortedTabs.filter((tab): tab is TabInfo => tab != null),
          viewColumn: viewColumnNumber,
          activeTab: activeTabInColumn
        };
      }
    );

    // Cache the computed state
    this._cachedTabState = tabState;
    return tabState;
  }

  private async _triggerStateUpdate(): Promise<void> {
    if (this._isStateLocked) return;
    this._stateUpdateEmitter.fire(this.getTabManagerState());
  }

  isTabRecoverable(tab: TabInfo): boolean {
    // Check if tab kind is recoverable
    switch (tab.kind) {
      case TabKind.TabInputText:
      case TabKind.TabInputTextDiff:
      case TabKind.TabInputNotebook:
      case TabKind.TabInputNotebookDiff:
      case TabKind.TabInputCustom:
        return true;
      case TabKind.TabInputTerminal:
      case TabKind.TabInputWebview:
      case TabKind.Unknown:
      default: {
        const mappings = this._configService.getTabRecoveryMappings();
        const regexPatterns = Object.keys(mappings);

        for (let i = 0; i < regexPatterns.length; i++) {
          const pattern = regexPatterns[i];
          try {
            const regex = new RegExp(pattern);
            if (regex.test(tab.label)) {
              return true;
            }
          } catch (error) {
            console.error(
              `Invalid regex pattern in recovery mapping: ${pattern}`,
              error
            );
          }
        }

        return false;
      }
    }
  }

  private lockState(): void {
    this._isStateLocked = true;
    this._tabActiveStateStore.send({ type: 'LOCK_STATE' });
  }

  private unlockState(): void {
    this._isStateLocked = false;
    this._tabActiveStateStore.send({ type: 'UNLOCK_STATE' });
    // Sync tabs after unlocking to capture the final state
    this.syncTabs();
  }

  private async openTab(tab: TabInfo): Promise<OpenTabResult> {
    // Fallback for older versions
    if (tab.kind == null) {
      return { success: false, instance: null };
    }

    switch (tab.kind) {
      case TabKind.TabInputText: {
        const textTab = tab as TabInfoText;
        await commands.executeCommand('vscode.open', Uri.parse(textTab.uri), {
          viewColumn: tab.viewColumn,
          preview: false,
          preserveFocus: true,
          selection: (tab.meta as TabInfoMetaTextEditor).selection
        });
        return { success: true, instance: window.activeTextEditor };
      }
      case TabKind.TabInputTextDiff: {
        const textDiffTab = tab as TabInfoTextDiff;
        await commands.executeCommand(
          'vscode.diff',
          Uri.parse(textDiffTab.originalUri),
          Uri.parse(textDiffTab.modifiedUri),
          tab.label,
          {
            viewColumn: tab.viewColumn,
            preview: false,
            preserveFocus: true,
            selection: (tab.meta as TabInfoMetaTextEditor).selection
          }
        );
        return { success: true, instance: window.activeTextEditor };
      }
      case TabKind.TabInputCustom: {
        const customTab = tab as TabInfoCustom;
        await commands.executeCommand(
          'vscode.openWith',
          Uri.parse(customTab.uri),
          customTab.viewType,
          {
            viewColumn: tab.viewColumn,
            preview: false,
            preserveFocus: true
          }
        );
        return { success: true, instance: window.activeTextEditor };
      }
      case TabKind.TabInputNotebook: {
        const notebookTab = tab as TabInfoNotebook;
        await commands.executeCommand(
          'vscode.openWith',
          Uri.parse(notebookTab.uri),
          notebookTab.notebookType,
          {
            viewColumn: tab.viewColumn,
            preview: false,
            preserveFocus: true,
            selection: (tab.meta as TabInfoMetaNotebookEditor).selection
          }
        );
        return { success: true, instance: window.activeNotebookEditor };
      }
      case TabKind.TabInputNotebookDiff: {
        const notebookDiffTab = tab as TabInfoNotebookDiff;
        await commands.executeCommand(
          'vscode.diff',
          Uri.parse(notebookDiffTab.originalUri),
          Uri.parse(notebookDiffTab.modifiedUri),
          tab.label,
          {
            viewColumn: tab.viewColumn,
            preview: false,
            preserveFocus: true,
            selection: (tab.meta as TabInfoMetaNotebookEditor).selection
          }
        );
        return { success: true, instance: window.activeNotebookEditor };
      }
      case TabKind.TabInputTerminal:
      case TabKind.TabInputWebview:
      case TabKind.Unknown:
      default: {
        // Check regex-command mapping for unknown tabs
        const mappings = this._configService.getTabRecoveryMappings();
        for (const [pattern, command] of Object.entries(mappings)) {
          try {
            const regex = new RegExp(pattern);
            if (regex.test(tab.label)) {
              this._log.debug(`executing recovery command: "${command}" for tab "${tab.label}"`);
              await commands.executeCommand(command);
              return { success: true, instance: null };
            }
          } catch (error) {
            this._log.error(
              `failed recovery command for tab "${tab.label}"`,
              error
            );
          }
        }

        return { success: false, instance: null };
      }
    }
  }

  private findAssociatedInstanceByTabId(
    tabId: TabInfoId
  ): AssociatedTabInstance | null {
    for (const [instance, id] of this._associatedInstances) {
      if (id === tabId) return instance;
    }
    return null;
  }

  mergeTabState(tabState: TabState): void {
    const newTabs: Record<TabInfoId, TabInfo> = {};
    const incomingTabStateGroups = Object.values(tabState.tabGroups);

    for (let i = 0; i < incomingTabStateGroups.length; i++) {
      const group = incomingTabStateGroups[i];
      const currentGroup = window.tabGroups.all[i];

      // Skip if the group doesn't exist in the current state
      if (!currentGroup) continue;

      for (let j = 0; j < group.tabs.length; j++) {
        const tabInfo = group.tabs[j];
        const tab = currentGroup.tabs[j];

        // Skip if the tab doesn't exist at this position
        if (!tab) continue;

        const tabKey = createTabKey(tab, currentGroup, j);
        const currentTabId = this._associatedTabs.get(tabKey);

        // Try to preserve the existing instance association
        const associatedInstance = currentTabId
          ? this.findAssociatedInstanceByTabId(currentTabId)
          : null;

        newTabs[tabInfo.id] = { ...tabInfo };

        this._associatedTabs.set(tabKey, tabInfo.id);
        if (associatedInstance) {
          this._associatedInstances.set(associatedInstance, tabInfo.id);
        }
      }
    }

    this._tabActiveStateStore.send({ type: 'SET_TABS', tabs: newTabs });
  }

  async applyTabState(
    tabState: TabState,
    options: {
      preservePinnedTabs: boolean;
      preserveTabFocus: boolean;
      preserveActiveTab: boolean;
    }
  ): Promise<void> {
    const tabCount = Object.values(tabState.tabGroups).reduce(
      (sum, g) => sum + g.tabs.length, 0
    );
    this._log.info(`applyTabState: restoring ${tabCount} tab(s) across ${Object.keys(tabState.tabGroups).length} group(s)`);
    this.lockState();
    const currentTabs = this._tabActiveStateStore.getSnapshot().context.tabs;
    const newTabs: Record<TabInfoId, TabInfo> = { ...currentTabs };
    const tabGroupItems = Object.values(tabState.tabGroups);
    const pinnedTabs: { tab: TabInfo; index: number }[] = [];
    const activeTabs: { tab: TabInfo; index: number }[] = [];
    const focusedViewColumn =
      tabState.tabGroups[tabState.activeGroup]?.viewColumn ?? 1;
    const focusedIndex =
      tabState.tabGroups[tabState.activeGroup]?.tabs.findIndex(
        (tab) => tab.isActive
      ) ?? 0;
    const misplacedTabs: {
      actualViewColumn: number;
      actualIndex: number;
      targetViewColumn: number;
      targetIndex: number;
    }[] = [];

    for (let i = 0; i < tabGroupItems.length; i++) {
      const group = tabGroupItems[i];
      let offset = window.tabGroups.all[i]?.tabs.length ?? 0;

      for (let j = 0; j < group.tabs.length; j++) {
        const tab = group.tabs[j];
        const targetViewColumn = group.viewColumn;
        const targetIndex = offset + j;
        const result = await this.openTab(tab);

        if (!result.success) {
          // If the tab couldn't be opened, we skip it but still need to adjust the offset for subsequent tabs
          offset--;
          this._log.warn(`failed to open tab "${tab.label}", skipping...`);
          continue;
        }

        const activeTabGroup = window.tabGroups.activeTabGroup;
        const currentTab = activeTabGroup.activeTab;

        if (currentTab == null || activeTabGroup == null) {
          // This can happen if the opened tab is immediately closed by the user or an extension, so we just skip it
          offset--;
          this._log.warn(`opened tab "${tab.label}" but it was not found in any tab group, skipping...`);
          continue;
        }

        const actualViewColumn = activeTabGroup.viewColumn;
        const actualIndex = activeTabGroup.tabs.indexOf(currentTab);
        const tabKey = createTabKeyByViewColumn(currentTab, targetViewColumn, targetIndex);

        newTabs[tab.id] = {
          ...tab,
          index: targetIndex
        };

        this._associatedTabs.set(tabKey, tab.id);

        // Preserve pinned and active states if needed
        if (tab.isPinned) pinnedTabs.push({ tab, index: targetIndex });
        // For active tab, we will focus it at the end to avoid multiple focus changes during restore
        if (tab.isActive) activeTabs.push({ tab, index: targetIndex });
        // Update associated instance mapping
        if (result.instance != null) this._associatedInstances.set(result.instance, tab.id);
        // Track if tab ended up in the wrong position
        if (actualViewColumn !== tab.viewColumn) {
          misplacedTabs.push({
            actualViewColumn,
            actualIndex,
            targetViewColumn,
            targetIndex
          });
        }
      }
    }

    // Move misplaced tabs to their correct viewColumn and index
    for (let i = 0; i < misplacedTabs.length; i++) {
      const { actualViewColumn, actualIndex, targetViewColumn, targetIndex } = misplacedTabs[i];
      this._log.debug(
        `moving tab from ${actualViewColumn}:${actualIndex} to ${targetViewColumn}:${targetIndex}`
      );
      await moveTab(actualViewColumn, actualIndex, targetViewColumn, targetIndex);
    }

    // Pin tabs if needed
    if (options.preservePinnedTabs) {
      for (let i = 0; i < pinnedTabs.length; i++) {
        const { tab, index } = pinnedTabs[i];
        await pinEditor(tab.viewColumn, index, false);
      }
    }

    // Activate tabs
    if (options.preserveActiveTab) {
      for (let i = 0; i < activeTabs.length; i++) {
        const { tab, index } = activeTabs[i];
        if (tab.viewColumn === focusedViewColumn && index === focusedIndex) {
          continue;
        }
        await focusTabInGroup(tab.viewColumn, index);
      }
    }

    // Focus the main tab
    if (options.preserveTabFocus) {
      await focusTabInGroup(focusedViewColumn, focusedIndex);
    }
    this.unlockState();

    this._tabActiveStateStore.send({ type: 'SET_TABS', tabs: newTabs });
    this._log.info('applyTabState complete');
  }

  dispose() {
    this._storeSubscription?.unsubscribe();
    this._disposables.forEach((d) => d.dispose());
    this._stateUpdateEmitter.dispose();
  }
}

import {
  NotebookEditor,
  TabInputNotebook,
  TabInputNotebookDiff,
  TabInputTerminal,
  TabInputText,
  TabInputTextDiff,
  Terminal,
  TerminalOptions,
  TextEditor,
  window
} from 'vscode';

import type { TabActiveStateStore } from '../stores/tab-active-state';
import type { AssociatedInstanceRegistry } from '../types/tab-active-state';
import {
  AssociatedTabInstance,
  TabInfo,
  TabInfoId,
  TabInfoMetaNotebookEditor,
  TabInfoMetaTerminal,
  TabInfoMetaTextEditor,
  TabKind
} from '../types/tabs';
import { createSelectionRange, createTabKey } from '../utils/tab-utils';
import { isTrackedTabInfoEqual } from '../utils/tracked-tab-equality';

export class TabInstanceBindingService implements AssociatedInstanceRegistry {
  readonly associatedInstances = new Map<AssociatedTabInstance, TabInfoId>();

  constructor(
    private readonly _tabActiveStateStore: TabActiveStateStore,
    private readonly _associatedTabs: Map<string, TabInfoId>
  ) {}

  registerAssociatedInstance(
    instance: AssociatedTabInstance,
    tabId: TabInfoId
  ): void {
    this.associatedInstances.set(instance, tabId);
  }

  pruneAssociatedInstances(liveTabIds: Set<TabInfoId>): void {
    this.associatedInstances.forEach((tabId, instance) => {
      if (!liveTabIds.has(tabId)) {
        this.associatedInstances.delete(instance);
      }
    });
  }

  findAssociatedInstanceByTabId(
    tabId: TabInfoId
  ): AssociatedTabInstance | null {
    for (const [instance, id] of this.associatedInstances) {
      if (id === tabId) return instance;
    }

    return null;
  }

  associateTextEditorWithTab(editor: TextEditor | undefined): void {
    this._resolveTextEditorTabId(editor);
  }

  associateNotebookEditorWithTab(editor: NotebookEditor | undefined): void {
    this._resolveNotebookEditorTabId(editor);
  }

  associateTerminalWithTab(terminal: Terminal | undefined): void {
    this._resolveTerminalTabId(terminal);
  }

  updateTextEditorSelection(editor: TextEditor): void {
    const tabId = this._resolveTextEditorTabId(editor);
    if (!tabId) return;

    const tabInfo = this._getTrackedTabInfo(tabId);

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

    if (isTrackedTabInfoEqual(tabInfo, updatedTabInfo)) {
      return;
    }

    this._tabActiveStateStore.send({
      type: 'UPDATE_TAB',
      payload: updatedTabInfo
    });
  }

  updateNotebookEditorSelection(editor: NotebookEditor): void {
    const tabId = this._resolveNotebookEditorTabId(editor);
    if (tabId == null) return;

    const tabInfo = this._getTrackedTabInfo(tabId);
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

    if (isTrackedTabInfoEqual(tabInfo, updatedTabInfo)) {
      return;
    }

    this._tabActiveStateStore.send({
      type: 'UPDATE_TAB',
      payload: updatedTabInfo
    });
  }

  updateTerminalMeta(terminal: Terminal): void {
    const tabId = this._resolveTerminalTabId(terminal);
    if (tabId == null) return;

    const tabInfo = this._getTrackedTabInfo(tabId);
    if (tabInfo == null) {
      console.warn('No tab info found for tab ID:', tabId);
      return;
    }

    const options = terminal.creationOptions as TerminalOptions;
    const updatedTabInfo: TabInfo = {
      ...tabInfo,
      meta: {
        ...tabInfo.meta,
        cwd: options.cwd?.toString(),
        isTransient: options.isTransient,
        shellPath: options.shellPath,
        terminalName: terminal.name
      } as TabInfoMetaTerminal
    };

    if (isTrackedTabInfoEqual(tabInfo, updatedTabInfo)) {
      return;
    }

    this._tabActiveStateStore.send({
      type: 'UPDATE_TAB',
      payload: updatedTabInfo
    });
  }

  private _resolveAssociatedInstanceTabId<T extends AssociatedTabInstance>(
    instance: T | undefined,
    matchesTrackedTab: (tabInfo: TabInfo) => boolean,
    findNextTabId: () => TabInfoId | null
  ): TabInfoId | null {
    if (instance == null) {
      return null;
    }

    const currentTabId = this.associatedInstances.get(instance);
    const currentTabInfo = this._getTrackedTabInfo(currentTabId);

    if (
      currentTabId != null &&
      currentTabInfo != null &&
      matchesTrackedTab(currentTabInfo)
    ) {
      return currentTabId;
    }

    if (currentTabId != null) {
      this.associatedInstances.delete(instance);
    }

    const nextTabId = findNextTabId();
    if (nextTabId == null) {
      return null;
    }

    this.associatedInstances.set(instance, nextTabId);
    return nextTabId;
  }

  private _pickAssociatedTabId(
    candidateTabIds: TabInfoId[],
    activeCandidate: TabInfoId | null
  ): TabInfoId | null {
    if (activeCandidate != null) {
      return activeCandidate;
    }

    if (candidateTabIds.length === 1) {
      return candidateTabIds[0];
    }

    return null;
  }

  private _matchesTextEditorTabInfo(
    editor: TextEditor,
    tabInfo: TabInfo
  ): boolean {
    const viewColumn = editor.viewColumn;
    if (viewColumn == null || tabInfo.viewColumn !== viewColumn) {
      return false;
    }

    const documentUri = editor.document.uri.toString();
    if (tabInfo.kind === TabKind.TabInputText && 'uri' in tabInfo) {
      return tabInfo.uri === documentUri;
    }

    if (tabInfo.kind === TabKind.TabInputTextDiff && 'modifiedUri' in tabInfo) {
      return tabInfo.modifiedUri === documentUri;
    }

    return false;
  }

  private _findTextEditorTabId(editor: TextEditor): TabInfoId | null {
    const viewColumn = editor.viewColumn;
    if (viewColumn == null) {
      return null;
    }

    const targetGroup = window.tabGroups.all.find(
      (group) => group.viewColumn === viewColumn
    );
    if (targetGroup == null) {
      return null;
    }

    const trackedTabs = this._tabActiveStateStore.getSnapshot().context.tabs;
    const candidateTabIds: TabInfoId[] = [];
    let activeCandidate: TabInfoId | null = null;
    const documentUri = editor.document.uri.toString();

    for (let index = 0; index < targetGroup.tabs.length; index++) {
      const tab = targetGroup.tabs[index];
      const matchesDocument =
        (tab.input instanceof TabInputText &&
          tab.input.uri.toString() === documentUri) ||
        (tab.input instanceof TabInputTextDiff &&
          tab.input.modified.toString() === documentUri);

      if (!matchesDocument) {
        continue;
      }

      const tabKey = createTabKey(tab, targetGroup, index);
      const tabId = this._associatedTabs.get(tabKey);
      if (tabId == null) {
        continue;
      }

      const trackedTab = trackedTabs[tabId];
      if (
        trackedTab == null ||
        !this._matchesTextEditorTabInfo(editor, trackedTab)
      ) {
        continue;
      }

      if (!candidateTabIds.includes(tabId)) {
        candidateTabIds.push(tabId);
      }

      if (tab === targetGroup.activeTab) {
        activeCandidate = tabId;
      }
    }

    return this._pickAssociatedTabId(candidateTabIds, activeCandidate);
  }

  private _resolveTextEditorTabId(
    editor: TextEditor | undefined
  ): TabInfoId | null {
    return this._resolveAssociatedInstanceTabId(
      editor,
      (tabInfo) =>
        this._matchesTextEditorTabInfo(editor as TextEditor, tabInfo),
      () => this._findTextEditorTabId(editor as TextEditor)
    );
  }

  private _matchesNotebookEditorTabInfo(
    editor: NotebookEditor,
    tabInfo: TabInfo
  ): boolean {
    const viewColumn = editor.viewColumn;
    if (viewColumn == null || tabInfo.viewColumn !== viewColumn) {
      return false;
    }

    const notebookUri = editor.notebook.uri.toString();
    if (tabInfo.kind === TabKind.TabInputNotebook && 'uri' in tabInfo) {
      return tabInfo.uri === notebookUri;
    }

    if (
      tabInfo.kind === TabKind.TabInputNotebookDiff &&
      'modifiedUri' in tabInfo
    ) {
      return tabInfo.modifiedUri === notebookUri;
    }

    return false;
  }

  private _findNotebookEditorTabId(editor: NotebookEditor): TabInfoId | null {
    const viewColumn = editor.viewColumn;
    if (viewColumn == null) {
      return null;
    }

    const targetGroup = window.tabGroups.all.find(
      (group) => group.viewColumn === viewColumn
    );
    if (targetGroup == null) {
      return null;
    }

    const trackedTabs = this._tabActiveStateStore.getSnapshot().context.tabs;
    const candidateTabIds: TabInfoId[] = [];
    let activeCandidate: TabInfoId | null = null;
    const notebookUri = editor.notebook.uri.toString();

    for (let index = 0; index < targetGroup.tabs.length; index++) {
      const tab = targetGroup.tabs[index];
      const matchesNotebook =
        (tab.input instanceof TabInputNotebook &&
          tab.input.uri.toString() === notebookUri) ||
        (tab.input instanceof TabInputNotebookDiff &&
          tab.input.modified.toString() === notebookUri);

      if (!matchesNotebook) {
        continue;
      }

      const tabKey = createTabKey(tab, targetGroup, index);
      const tabId = this._associatedTabs.get(tabKey);
      if (tabId == null) {
        continue;
      }

      const trackedTab = trackedTabs[tabId];
      if (
        trackedTab == null ||
        !this._matchesNotebookEditorTabInfo(editor, trackedTab)
      ) {
        continue;
      }

      if (!candidateTabIds.includes(tabId)) {
        candidateTabIds.push(tabId);
      }

      if (tab === targetGroup.activeTab) {
        activeCandidate = tabId;
      }
    }

    return this._pickAssociatedTabId(candidateTabIds, activeCandidate);
  }

  private _resolveNotebookEditorTabId(
    editor: NotebookEditor | undefined
  ): TabInfoId | null {
    return this._resolveAssociatedInstanceTabId(
      editor,
      (tabInfo) =>
        this._matchesNotebookEditorTabInfo(editor as NotebookEditor, tabInfo),
      () => this._findNotebookEditorTabId(editor as NotebookEditor)
    );
  }

  private _matchesTerminalTabInfo(
    terminal: Terminal,
    tabInfo: TabInfo
  ): boolean {
    if (
      tabInfo.kind !== TabKind.TabInputTerminal ||
      tabInfo.meta.type !== 'terminal'
    ) {
      return false;
    }

    const terminalMeta = tabInfo.meta as TabInfoMetaTerminal;
    const options = terminal.creationOptions as TerminalOptions;
    const cwd = options.cwd?.toString();

    if (terminalMeta.terminalName !== terminal.name) {
      return false;
    }

    if (terminalMeta.cwd != null && cwd != null && terminalMeta.cwd !== cwd) {
      return false;
    }

    if (
      terminalMeta.shellPath != null &&
      options.shellPath != null &&
      terminalMeta.shellPath !== options.shellPath
    ) {
      return false;
    }

    return true;
  }

  private _findTerminalTabId(terminal: Terminal): TabInfoId | null {
    const trackedTabs = this._tabActiveStateStore.getSnapshot().context.tabs;
    const candidateTabIds: TabInfoId[] = [];
    const activeTabGroup = window.tabGroups.activeTabGroup;
    const activeTab = activeTabGroup?.activeTab;
    let activeCandidate: TabInfoId | null = null;

    for (const group of window.tabGroups.all) {
      for (let index = 0; index < group.tabs.length; index++) {
        const tab = group.tabs[index];
        if (
          !(tab.input instanceof TabInputTerminal) ||
          tab.label !== terminal.name
        ) {
          continue;
        }

        const tabKey = createTabKey(tab, group, index);
        const tabId = this._associatedTabs.get(tabKey);
        if (tabId == null) {
          continue;
        }

        const trackedTab = trackedTabs[tabId];
        if (
          trackedTab == null ||
          !this._matchesTerminalTabInfo(terminal, trackedTab)
        ) {
          continue;
        }

        if (!candidateTabIds.includes(tabId)) {
          candidateTabIds.push(tabId);
        }

        if (group === activeTabGroup && tab === activeTab) {
          activeCandidate = tabId;
        }
      }
    }

    return this._pickAssociatedTabId(candidateTabIds, activeCandidate);
  }

  private _resolveTerminalTabId(
    terminal: Terminal | undefined
  ): TabInfoId | null {
    return this._resolveAssociatedInstanceTabId(
      terminal,
      (tabInfo) => this._matchesTerminalTabInfo(terminal as Terminal, tabInfo),
      () => this._findTerminalTabId(terminal as Terminal)
    );
  }

  private _getTrackedTabInfo(tabId: TabInfoId | undefined): TabInfo | null {
    if (tabId == null) {
      return null;
    }

    return this._tabActiveStateStore.getSnapshot().context.tabs[tabId] ?? null;
  }
}

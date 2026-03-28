import {
  Tab,
  TabGroup,
  TabInputCustom,
  TabInputNotebook,
  TabInputNotebookDiff,
  TabInputTerminal,
  TabInputText,
  TabInputTextDiff,
  TabInputWebview,
  window
} from 'vscode';

import { transformTabToTabInfo } from '../transformers/tab';
import {
  SelectionRange,
  TabGroupInfo,
  TabInfo,
  TabInfoNotebookDiff,
  TabInfoText,
  TabKind,
  TabState
} from '../types/tabs';

export function findTabByViewColumnAndIndex(
  viewColumn: number,
  index: number
): Tab | null {
  const targetGroup = findTabGroupByViewColumn(viewColumn);

  if (!targetGroup) {
    return null;
  }

  return targetGroup.tabs[index] || null;
}

export function findTabGroupByViewColumn(viewColumn: number): TabGroup | null {
  const targetGroup = window.tabGroups.all.find(
    (group) => group.viewColumn === viewColumn
  );

  return targetGroup || null;
}

export async function closeTab(tab: Tab): Promise<void> {
  await window.tabGroups.close(tab, true);
}

export async function closeAllTabs(): Promise<void> {
  for (let i = window.tabGroups.all.length - 1; i >= 0; i--) {
    const group = window.tabGroups.all[i];
    await window.tabGroups.close(group, true);
  }
}

export function countTabs(): number {
  return window.tabGroups.all.reduce(
    (total, group) => total + group.tabs.length,
    0
  );
}

export function isTabInfoEqual(tabA: TabInfo, tabB: TabInfo): boolean {
  if (tabA == null || tabB == null) return tabA == tabB;
  if (tabA.kind !== tabB.kind) return false;
  if (tabA.label !== tabB.label) return false;
  if (tabA.isPinned !== tabB.isPinned) return false;

  switch (tabA.kind) {
    case TabKind.TabInputText:
    case TabKind.TabInputNotebook:
    case TabKind.TabInputCustom:
    case TabKind.TabInputWebview: {
      const tabAText = tabA as TabInfoText;
      const tabBText = tabB as TabInfoText;
      return tabAText.uri === tabBText.uri;
    }
    case TabKind.TabInputTextDiff:
    case TabKind.TabInputNotebookDiff: {
      const tabADiff = tabA as TabInfoNotebookDiff;
      const tabBDiff = tabB as TabInfoNotebookDiff;
      return (
        tabADiff.originalUri === tabBDiff.originalUri &&
        tabADiff.modifiedUri === tabBDiff.modifiedUri
      );
    }
    case TabKind.TabInputTerminal:
      return true;
    default:
      return false;
  }
}

export function isTabStateEqual(stateA: TabState, stateB: TabState): boolean {
  const groupKeysA = Object.keys(stateA.tabGroups);
  const groupKeysB = Object.keys(stateB.tabGroups);

  if (groupKeysA.length !== groupKeysB.length) {
    return false;
  }

  for (let i = 0; i < groupKeysA.length; i++) {
    if (groupKeysA[i] !== groupKeysB[i]) {
      return false;
    }

    const groupA = stateA.tabGroups[groupKeysA[i]] as TabGroupInfo;
    const groupB = stateB.tabGroups[groupKeysB[i]] as TabGroupInfo;

    const recoverableTabsA = groupA.tabs.filter((tab) => tab.isRecoverable);
    const recoverableTabsB = groupB.tabs.filter((tab) => tab.isRecoverable);

    if (recoverableTabsA.length !== recoverableTabsB.length) {
      return false;
    }

    for (let j = 0; j < recoverableTabsA.length; j++) {
      if (!isTabInfoEqual(recoverableTabsA[j], recoverableTabsB[j])) {
        return false;
      }
    }

    const activeTabARecoverable = groupA.activeTab?.isRecoverable ?? false;
    const activeTabBRecoverable = groupB.activeTab?.isRecoverable ?? false;

    if (activeTabARecoverable && activeTabBRecoverable) {
      if (!isTabInfoEqual(groupA.activeTab, groupB.activeTab)) {
        return false;
      }
    } else if (activeTabARecoverable !== activeTabBRecoverable) {
      return false;
    }
  }

  return true;
}

export function isSelectionMapEqual(
  mapA: Record<string, SelectionRange>,
  mapB: Record<string, SelectionRange>
): boolean {
  if (mapA == null || mapB == null) return mapA == mapB;

  const keysA = Object.keys(mapA);
  const keysB = Object.keys(mapB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!(key in mapB)) {
      return false;
    }
    const rangeA = mapA[key];
    const rangeB = mapB[key];
    if (
      rangeA.start.line !== rangeB.start.line ||
      rangeA.start.character !== rangeB.start.character ||
      rangeA.end.line !== rangeB.end.line ||
      rangeA.end.character !== rangeB.end.character
    ) {
      return false;
    }
  }

  return true;
}

export function getTabState(): TabState {
  const tabState: TabState = {
    tabGroups: {},
    activeGroup: window.tabGroups.activeTabGroup.viewColumn ?? null
  };

  window.tabGroups.all.forEach((group) => {
    const viewColumn = group.viewColumn || 0;
    const tabGroupInfo: TabGroupInfo = {
      tabs: [],
      activeTab: undefined,
      viewColumn: viewColumn || 0
    };

    group.tabs.forEach((tab, index) => {
      const tabInfo: TabInfo = transformTabToTabInfo(tab, group, index);

      if (tab.isActive) {
        tabGroupInfo.activeTab = tabInfo;
      }

      tabGroupInfo.tabs.push(tabInfo);
    });

    tabState.tabGroups[viewColumn] = tabGroupInfo;
  });

  return tabState;
}

export function createTabKey(
  tab: Tab,
  tabGroup: TabGroup,
  index: number
): string {
  return createTabKeyByViewColumn(tab, tabGroup.viewColumn ?? 0, index);
}

export function createTabKeyByViewColumn(
  tab: Tab,
  viewColumn: number,
  index: number
): string {
  if (tab.input instanceof TabInputText) {
    return `${viewColumn}:text:${tab.input.uri.toString()}`;
  } else if (tab.input instanceof TabInputTextDiff) {
    return `${viewColumn}:textDiff:${tab.input.original.toString()}|${tab.input.modified.toString()}`;
  } else if (tab.input instanceof TabInputCustom) {
    return `${viewColumn}:custom:${tab.input.viewType}:${tab.input.uri.toString()}`;
  } else if (tab.input instanceof TabInputWebview) {
    return `${viewColumn}:${index}:webview:${tab.input.viewType}`;
  } else if (tab.input instanceof TabInputNotebook) {
    return `${viewColumn}:notebook:${tab.input.notebookType}:${tab.input.uri.toString()}`;
  } else if (tab.input instanceof TabInputNotebookDiff) {
    return `${viewColumn}:notebookDiff:${tab.input.notebookType}:${tab.input.original.toString()}|${tab.input.modified.toString()}`;
  } else if (tab.input instanceof TabInputTerminal) {
    return `${viewColumn}:${index}:terminal:${tab.label}`;
  }

  return `${viewColumn}:${index}:${tab.label}`;
}

export function createSelectionRange(
  startLine: number,
  startCharacter: number,
  endLine: number,
  endCharacter: number
): SelectionRange {
  return {
    start: { line: startLine, character: startCharacter },
    end: { line: endLine, character: endCharacter },
    isEmpty: startLine === endLine && startCharacter === endCharacter,
    isSingleLine: startLine === endLine
  };
}

import { Tab, TabGroup, window } from 'vscode';

import { transformTabToTabInfo } from '../transformers/tab';
import { SelectionRange } from '../types/selection-tracker';
import {
  TabGroupInfo,
  TabInfo,
  TabInfoNotebookDiff,
  TabInfoText,
  TabKind,
  TabState
} from '../types/tabs';
import { focusTabInGroup, openTab, pinEditor } from './commands';

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

    if (groupA.tabs.length !== groupB.tabs.length) {
      return false;
    }

    for (let j = 0; j < groupA.tabs.length; j++) {
      if (!isTabInfoEqual(groupA.tabs[j], groupB.tabs[j])) {
        return false;
      }
    }

    if (!isTabInfoEqual(groupA.activeTab, groupB.activeTab)) {
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

    group.tabs.forEach((tab) => {
      const tabInfo: TabInfo = transformTabToTabInfo(tab, group.viewColumn);

      if (tab.isActive) {
        tabGroupInfo.activeTab = tabInfo;
      }

      tabGroupInfo.tabs.push(tabInfo);
    });

    tabState.tabGroups[viewColumn] = tabGroupInfo;
  });

  return tabState;
}

export interface ApplyTabStateOptions {
  preservePinnedTabs: boolean;
  preserveTabFocus: boolean;
  preserveActiveTab: boolean;
}

export async function applyTabState(
  tabState: TabState,
  options: ApplyTabStateOptions,
  selectionMap?: Record<string, SelectionRange>
): Promise<void> {
  const tabGroupItems = Object.values(tabState.tabGroups);
  const pinnedTabs: { tab: TabInfo; index: number }[] = [];
  const activeTabs: { tab: TabInfo; index: number }[] = [];
  const focusedViewColumn = tabState.tabGroups[tabState.activeGroup].viewColumn;
  const focusedIndex = tabState.tabGroups[tabState.activeGroup].tabs.findIndex(
    (tab) => tab.isActive
  );

  await Promise.all(
    tabGroupItems.map(async (group) => {
      for (let i = 0; i < group.tabs.length; i++) {
        const tab = group.tabs[i];
        if (tab.isPinned) pinnedTabs.push({ tab, index: i });
        if (tab.isActive) activeTabs.push({ tab, index: i });
        await openTab(tab, selectionMap);
      }
    })
  );

  if (options.preservePinnedTabs) {
    for (let i = 0; i < pinnedTabs.length; i++) {
      const { tab, index } = pinnedTabs[i];
      await pinEditor(tab.viewColumn, index, false);
    }
  }

  if (options.preserveActiveTab) {
    for (let i = 0; i < activeTabs.length; i++) {
      const { tab, index } = activeTabs[i];
      if (tab.viewColumn === focusedViewColumn && index === focusedIndex) {
        continue;
      }
      await focusTabInGroup(tab.viewColumn, index);
    }
  }

  if (options.preserveTabFocus) {
    await focusTabInGroup(focusedViewColumn, focusedIndex);
  }
}

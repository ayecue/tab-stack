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
import { TabKeyKind } from '../types/tab-key';
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
  if (tabA == null || tabB == null) return tabA === tabB;
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
    default:
      return true;
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
  if (mapA == null || mapB == null) return mapA === mapB;

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

export function buildTabSnapshotClues(
  tab: Tab,
  viewColumn: number,
  index: number
): {
  exactKeyClue: string;
  localRefClue: string;
  globalRefClue: string;
} {
  if (tab.input instanceof TabInputText) {
    const uri = tab.input.uri.toString();

    return {
      exactKeyClue: `${viewColumn}:${TabKeyKind.Text}:${uri}`,
      localRefClue: `${viewColumn}:${TabKeyKind.Text}:${uri}`,
      globalRefClue: `${TabKeyKind.Text}:${uri}`
    };
  } else if (tab.input instanceof TabInputTextDiff) {
    const original = tab.input.original.toString();
    const modified = tab.input.modified.toString();

    return {
      exactKeyClue: `${viewColumn}:${TabKeyKind.TextDiff}:${original}|${modified}`,
      localRefClue: `${viewColumn}:${TabKeyKind.TextDiff}:${original}|${modified}`,
      globalRefClue: `${TabKeyKind.TextDiff}:${original}|${modified}`
    };
  } else if (tab.input instanceof TabInputCustom) {
    const uri = tab.input.uri.toString();
    const viewType = tab.input.viewType;

    return {
      exactKeyClue: `${viewColumn}:${TabKeyKind.Custom}:${viewType}:${uri}`,
      localRefClue: `${viewColumn}:${TabKeyKind.Custom}:${viewType}:${uri}`,
      globalRefClue: `${TabKeyKind.Custom}:${viewType}:${uri}`
    };
  } else if (tab.input instanceof TabInputWebview) {
    const viewType = tab.input.viewType;

    return {
      exactKeyClue: `${viewColumn}:${index}:${TabKeyKind.Webview}:${viewType}`,
      localRefClue: `${viewColumn}:${TabKeyKind.Webview}:${viewType}`,
      globalRefClue: `${TabKeyKind.Webview}:${viewType}`
    };
  } else if (tab.input instanceof TabInputNotebook) {
    const notebookType = tab.input.notebookType;
    const uri = tab.input.uri.toString();

    return {
      exactKeyClue: `${viewColumn}:${TabKeyKind.Notebook}:${notebookType}:${uri}`,
      localRefClue: `${viewColumn}:${TabKeyKind.Notebook}:${notebookType}:${uri}`,
      globalRefClue: `${TabKeyKind.Notebook}:${notebookType}:${uri}`
    };
  } else if (tab.input instanceof TabInputNotebookDiff) {
    const notebookType = tab.input.notebookType;
    const original = tab.input.original.toString();
    const modified = tab.input.modified.toString();

    return {
      exactKeyClue: `${viewColumn}:${TabKeyKind.NotebookDiff}:${notebookType}:${original}|${modified}`,
      localRefClue: `${viewColumn}:${TabKeyKind.NotebookDiff}:${notebookType}:${original}|${modified}`,
      globalRefClue: `${TabKeyKind.NotebookDiff}:${notebookType}:${original}|${modified}`
    };
  } else if (tab.input instanceof TabInputTerminal) {
    const encodedLabel = encodeURIComponent(tab.label);

    return {
      exactKeyClue: `${viewColumn}:${index}:${TabKeyKind.Terminal}:${encodedLabel}`,
      localRefClue: `${viewColumn}:${TabKeyKind.Terminal}:${encodedLabel}`,
      globalRefClue: `${TabKeyKind.Terminal}:${encodedLabel}`
    };
  }

  const constructorName = tab.input?.constructor.name ?? 'unknown';
  const encodedLabel = encodeURIComponent(tab.label);

  return {
    exactKeyClue: `${viewColumn}:${index}:${encodedLabel}`,
    localRefClue: `${constructorName}:${viewColumn}:${encodedLabel}`,
    globalRefClue: `${constructorName}:${encodedLabel}`
  };
}

export function createTabGlobalRefClue(tab: Tab): string {
  if (tab.input instanceof TabInputText) {
    return `${TabKeyKind.Text}:${tab.input.uri.toString()}`;
  } else if (tab.input instanceof TabInputTextDiff) {
    return `${TabKeyKind.TextDiff}:${tab.input.original.toString()}|${tab.input.modified.toString()}`;
  } else if (tab.input instanceof TabInputCustom) {
    return `${TabKeyKind.Custom}:${tab.input.viewType}:${tab.input.uri.toString()}`;
  } else if (tab.input instanceof TabInputWebview) {
    return `${TabKeyKind.Webview}:${tab.input.viewType}`;
  } else if (tab.input instanceof TabInputNotebook) {
    return `${TabKeyKind.Notebook}:${tab.input.notebookType}:${tab.input.uri.toString()}`;
  } else if (tab.input instanceof TabInputNotebookDiff) {
    return `${TabKeyKind.NotebookDiff}:${tab.input.notebookType}:${tab.input.original.toString()}|${tab.input.modified.toString()}`;
  } else if (tab.input instanceof TabInputTerminal) {
    return `${TabKeyKind.Terminal}:${encodeURIComponent(tab.label)}`;
  }

  return `${tab.input?.constructor.name ?? 'unknown'}:${encodeURIComponent(tab.label)}`;
}

/**
 * @deprecated Use createTabGlobalRefClue instead.
 */
export function createTabRefKey(tab: Tab): string {
  return createTabGlobalRefClue(tab);
}

export function createTabLocalRefClue(tab: Tab, viewColumn: number): string {
  if (tab.input instanceof TabInputText) {
    return `${viewColumn}:${TabKeyKind.Text}:${tab.input.uri.toString()}`;
  } else if (tab.input instanceof TabInputTextDiff) {
    return `${viewColumn}:${TabKeyKind.TextDiff}:${tab.input.original.toString()}|${tab.input.modified.toString()}`;
  } else if (tab.input instanceof TabInputCustom) {
    return `${viewColumn}:${TabKeyKind.Custom}:${tab.input.viewType}:${tab.input.uri.toString()}`;
  } else if (tab.input instanceof TabInputWebview) {
    return `${viewColumn}:${TabKeyKind.Webview}:${tab.input.viewType}`;
  } else if (tab.input instanceof TabInputNotebook) {
    return `${viewColumn}:${TabKeyKind.Notebook}:${tab.input.notebookType}:${tab.input.uri.toString()}`;
  } else if (tab.input instanceof TabInputNotebookDiff) {
    return `${viewColumn}:${TabKeyKind.NotebookDiff}:${tab.input.notebookType}:${tab.input.original.toString()}|${tab.input.modified.toString()}`;
  } else if (tab.input instanceof TabInputTerminal) {
    return `${viewColumn}:${TabKeyKind.Terminal}:${encodeURIComponent(tab.label)}`;
  }

  return `${tab.input?.constructor.name ?? 'unknown'}:${viewColumn}:${encodeURIComponent(tab.label)}`;
}

/**
 * Builds the strict exact-key clue for the tab's current addressing.
 */
export function createTabKeyByViewColumn(
  tab: Tab,
  viewColumn: number,
  index: number
): string {
  if (tab.input instanceof TabInputText) {
    return `${viewColumn}:${TabKeyKind.Text}:${tab.input.uri.toString()}`;
  } else if (tab.input instanceof TabInputTextDiff) {
    return `${viewColumn}:${TabKeyKind.TextDiff}:${tab.input.original.toString()}|${tab.input.modified.toString()}`;
  } else if (tab.input instanceof TabInputCustom) {
    return `${viewColumn}:${TabKeyKind.Custom}:${tab.input.viewType}:${tab.input.uri.toString()}`;
  } else if (tab.input instanceof TabInputWebview) {
    return `${viewColumn}:${index}:${TabKeyKind.Webview}:${tab.input.viewType}`;
  } else if (tab.input instanceof TabInputNotebook) {
    return `${viewColumn}:${TabKeyKind.Notebook}:${tab.input.notebookType}:${tab.input.uri.toString()}`;
  } else if (tab.input instanceof TabInputNotebookDiff) {
    return `${viewColumn}:${TabKeyKind.NotebookDiff}:${tab.input.notebookType}:${tab.input.original.toString()}|${tab.input.modified.toString()}`;
  } else if (tab.input instanceof TabInputTerminal) {
    return `${viewColumn}:${index}:${TabKeyKind.Terminal}:${encodeURIComponent(tab.label)}`;
  }

  return `${viewColumn}:${index}:${encodeURIComponent(tab.label)}`;
}

const TabKeyKindsWithIndex = [TabKeyKind.Webview, TabKeyKind.Terminal];
const TabKeyKindsWithoutIndex = [
  TabKeyKind.Text,
  TabKeyKind.TextDiff,
  TabKeyKind.Notebook,
  TabKeyKind.NotebookDiff,
  TabKeyKind.Custom
];

export const TabKeyTypePattern = new RegExp(
  `^\\d+:(?:\\d+:(${TabKeyKindsWithIndex.join('|')})|(${TabKeyKindsWithoutIndex.join('|')})):`
);

export const TabKeyPatterns = {
  [TabKeyKind.Text]: new RegExp(`^(\\d+):${TabKeyKind.Text}:(.+)$`),
  [TabKeyKind.TextDiff]: new RegExp(
    `^(\\d+):${TabKeyKind.TextDiff}:(.+)\\|(.+)$`
  ),
  [TabKeyKind.Custom]: new RegExp(`^(\\d+):${TabKeyKind.Custom}:(.+?):(.+)$`),
  [TabKeyKind.Webview]: new RegExp(
    `^(\\d+):(\\d+):${TabKeyKind.Webview}:(.+)$`
  ),
  [TabKeyKind.Notebook]: new RegExp(
    `^(\\d+):${TabKeyKind.Notebook}:(.+?):(.+)$`
  ),
  [TabKeyKind.NotebookDiff]: new RegExp(
    `^(\\d+):${TabKeyKind.NotebookDiff}:(.+?):(.+)\\|(.+)$`
  ),
  [TabKeyKind.Terminal]: new RegExp(
    `^(\\d+):(\\d+):${TabKeyKind.Terminal}:(.+)$`
  ),
  Unknown: /^(\d+):(\d+):(.+)$/
};

export type ParsedTabKey =
  | { viewColumn: number; kind: TabKind.TabInputText; uri: string }
  | {
      viewColumn: number;
      kind: TabKind.TabInputTextDiff;
      original: string;
      modified: string;
    }
  | {
      viewColumn: number;
      kind: TabKind.TabInputCustom;
      viewType: string;
      uri: string;
    }
  | {
      viewColumn: number;
      kind: TabKind.TabInputWebview;
      index: number;
      viewType: string;
    }
  | {
      viewColumn: number;
      kind: TabKind.TabInputNotebook;
      notebookType: string;
      uri: string;
    }
  | {
      viewColumn: number;
      kind: TabKind.TabInputNotebookDiff;
      notebookType: string;
      original: string;
      modified: string;
    }
  | {
      viewColumn: number;
      kind: TabKind.TabInputTerminal;
      index: number;
      label: string;
    }
  | { viewColumn: number; kind: TabKind.Unknown; index: number; label: string };

export function getTabKeyKindFromKey(key: string): TabKeyKind | null {
  const match = key.match(TabKeyTypePattern);
  return match ? ((match[1] || match[2]) as TabKeyKind) : null;
}

export function parseTabKey(key: string): ParsedTabKey {
  const patternType = (getTabKeyKindFromKey(key) ??
    'Unknown') as keyof typeof TabKeyPatterns;
  const pattern = TabKeyPatterns[patternType];
  const match = key.match(pattern);

  if (!match) {
    throw new Error(`Invalid tab key format: ${key}`);
  }

  switch (patternType) {
    case TabKeyKind.Text:
      return {
        viewColumn: Number(match[1]),
        kind: TabKind.TabInputText,
        uri: match[2]
      };
    case TabKeyKind.TextDiff:
      return {
        viewColumn: Number(match[1]),
        kind: TabKind.TabInputTextDiff,
        original: match[2],
        modified: match[3]
      };
    case TabKeyKind.Custom:
      return {
        viewColumn: Number(match[1]),
        kind: TabKind.TabInputCustom,
        viewType: match[2],
        uri: match[3]
      };
    case TabKeyKind.Webview:
      return {
        viewColumn: Number(match[1]),
        kind: TabKind.TabInputWebview,
        index: Number(match[2]),
        viewType: match[3]
      };
    case TabKeyKind.Notebook:
      return {
        viewColumn: Number(match[1]),
        kind: TabKind.TabInputNotebook,
        notebookType: match[2],
        uri: match[3]
      };
    case TabKeyKind.NotebookDiff:
      return {
        viewColumn: Number(match[1]),
        kind: TabKind.TabInputNotebookDiff,
        notebookType: match[2],
        original: match[3],
        modified: match[4]
      };
    case TabKeyKind.Terminal:
      return {
        viewColumn: Number(match[1]),
        kind: TabKind.TabInputTerminal,
        index: Number(match[2]),
        label: decodeURIComponent(match[3])
      };
    default:
      return {
        viewColumn: Number(match[1]),
        kind: TabKind.Unknown,
        index: Number(match[2]),
        label: decodeURIComponent(match[3])
      };
  }
}

export function rebuildTabKeyWithNewViewColumn(
  parsed: ParsedTabKey,
  viewColumn: number
): string {
  switch (parsed.kind) {
    case TabKind.TabInputText:
      return `${viewColumn}:${TabKeyKind.Text}:${parsed.uri}`;
    case TabKind.TabInputTextDiff:
      return `${viewColumn}:${TabKeyKind.TextDiff}:${parsed.original}|${parsed.modified}`;
    case TabKind.TabInputCustom:
      return `${viewColumn}:${TabKeyKind.Custom}:${parsed.viewType}:${parsed.uri}`;
    case TabKind.TabInputWebview:
      return `${viewColumn}:${parsed.index}:${TabKeyKind.Webview}:${parsed.viewType}`;
    case TabKind.TabInputNotebook:
      return `${viewColumn}:${TabKeyKind.Notebook}:${parsed.notebookType}:${parsed.uri}`;
    case TabKind.TabInputNotebookDiff:
      return `${viewColumn}:${TabKeyKind.NotebookDiff}:${parsed.notebookType}:${parsed.original}|${parsed.modified}`;
    case TabKind.TabInputTerminal:
      return `${viewColumn}:${parsed.index}:${TabKeyKind.Terminal}:${encodeURIComponent(parsed.label)}`;
    default:
      return `${viewColumn}:${parsed.index}:${encodeURIComponent(parsed.label)}`;
  }
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

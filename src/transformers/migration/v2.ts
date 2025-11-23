import { nanoid } from 'nanoid';
import { SelectionRange } from 'vscode';

import { Layout } from '../../types/commands';
import {
  QuickSlotAssignments,
  TabStateFileContent
} from '../../types/tab-manager';
import { TabInfo, TabInfoMeta, TabState } from '../../types/tabs';

export enum TabKind {
  TabInputText = 'tabInputText',
  TabInputTextDiff = 'tabInputTextDiff',
  TabInputCustom = 'tabInputCustom',
  TabInputWebview = 'tabInputWebview',
  TabInputNotebook = 'tabInputNotebook',
  TabInputNotebookDiff = 'tabInputNotebookDiff',
  TabInputTerminal = 'tabInputTerminal',
  Unknown = 'unknown'
}

export interface TabInfoBaseV2 {
  readonly label: string;
  readonly kind: TabKind;
  readonly isActive: boolean;
  readonly isPinned: boolean;
  readonly isDirty?: boolean;
  readonly viewColumn: number | undefined;
}

export interface TabInfoTextV2 extends TabInfoBaseV2 {
  readonly uri: string;
  readonly kind: TabKind.TabInputText;
}

export interface TabInfoTextDiffV2 extends TabInfoBaseV2 {
  readonly originalUri: string;
  readonly modifiedUri: string;
  readonly kind: TabKind.TabInputTextDiff;
}

export interface TabInfoCustomV2 extends TabInfoBaseV2 {
  readonly uri: string;
  readonly viewType: string;
  readonly kind: TabKind.TabInputCustom;
}

export interface TabInfoWebviewV2 extends TabInfoBaseV2 {
  readonly viewType: string;
  readonly kind: TabKind.TabInputWebview;
}

export interface TabInfoNotebookV2 extends TabInfoBaseV2 {
  readonly uri: string;
  readonly notebookType: string;
  readonly kind: TabKind.TabInputNotebook;
}

export interface TabInfoNotebookDiffV2 extends TabInfoBaseV2 {
  readonly originalUri: string;
  readonly modifiedUri: string;
  readonly notebookType: string;
  readonly kind: TabKind.TabInputNotebookDiff;
}

export interface TabInfoTerminalV2 extends TabInfoBaseV2 {
  readonly kind: TabKind.TabInputTerminal;
}

export type TabInfoV2 =
  | TabInfoBaseV2
  | TabInfoTextV2
  | TabInfoTextDiffV2
  | TabInfoCustomV2
  | TabInfoWebviewV2
  | TabInfoNotebookV2
  | TabInfoNotebookDiffV2
  | TabInfoTerminalV2;

export interface TabGroupInfoV2 {
  readonly tabs: TabInfoV2[];
  readonly viewColumn: number;

  activeTab: TabInfoV2 | undefined;
}

export interface TabStateV2 {
  tabGroups: Record<number, TabGroupInfoV2>;
  activeGroup: number | null;
}

export interface TabManagerStateV2 {
  tabState: TabStateV2;
  layout: Layout;
  selectionMap: Record<string, SelectionRange>;
}

export interface StateContainerV2 {
  id: string;
  name: string;
  state: TabManagerStateV2;
  createdAt: number;
  lastSelectedAt: number;
}

export interface TabStateFileContentV2 {
  version: number;
  groups: Record<string, StateContainerV2>;
  history: Record<string, StateContainerV2>;
  addons: Record<string, StateContainerV2>;
  selectedGroup: string | null;
  previousSelectedGroup: string | null;
  quickSlots: QuickSlotAssignments;
}

function determineMetaType(tab: TabInfoV2): TabInfoMeta {
  switch (tab.kind) {
    case TabKind.TabInputText:
    case TabKind.TabInputTextDiff:
    case TabKind.TabInputCustom:
    case TabKind.TabInputNotebook:
    case TabKind.TabInputNotebookDiff:
      return tab.kind === TabKind.TabInputNotebook ||
        tab.kind === TabKind.TabInputNotebookDiff
        ? { type: 'notebookEditor' }
        : { type: 'textEditor' };
    case TabKind.TabInputTerminal:
      return { type: 'terminal', terminalName: tab.label };
    default:
      return { type: 'unknown' };
  }
}

function isTabRecoverable(tab: TabInfoV2): boolean {
  // Text editors, notebooks, custom editors, and terminals are recoverable
  if (
    tab.kind === TabKind.TabInputText ||
    tab.kind === TabKind.TabInputTextDiff ||
    tab.kind === TabKind.TabInputCustom ||
    tab.kind === TabKind.TabInputNotebook ||
    tab.kind === TabKind.TabInputNotebookDiff ||
    tab.kind === TabKind.TabInputTerminal
  ) {
    return true;
  }
  // Webviews are not recoverable by default
  return false;
}

function migrateTabInfo(tabV2: TabInfoV2, index: number): TabInfo {
  const meta = determineMetaType(tabV2);
  const isRecoverable = isTabRecoverable(tabV2);

  const base = {
    id: nanoid(),
    label: tabV2.label,
    kind: tabV2.kind,
    isActive: tabV2.isActive,
    isPinned: tabV2.isPinned,
    isDirty: tabV2.isDirty,
    index,
    viewColumn: tabV2.viewColumn,
    isRecoverable,
    meta
  };

  // Cast to specific types based on kind
  switch (tabV2.kind) {
    case TabKind.TabInputText:
      return { ...base, uri: (tabV2 as TabInfoTextV2).uri } as TabInfo;
    case TabKind.TabInputTextDiff:
      return {
        ...base,
        originalUri: (tabV2 as TabInfoTextDiffV2).originalUri,
        modifiedUri: (tabV2 as TabInfoTextDiffV2).modifiedUri
      } as TabInfo;
    case TabKind.TabInputCustom:
      return {
        ...base,
        uri: (tabV2 as TabInfoCustomV2).uri,
        viewType: (tabV2 as TabInfoCustomV2).viewType
      } as TabInfo;
    case TabKind.TabInputWebview:
      return {
        ...base,
        viewType: (tabV2 as TabInfoWebviewV2).viewType
      } as TabInfo;
    case TabKind.TabInputNotebook:
      return {
        ...base,
        uri: (tabV2 as TabInfoNotebookV2).uri,
        notebookType: (tabV2 as TabInfoNotebookV2).notebookType
      } as TabInfo;
    case TabKind.TabInputNotebookDiff:
      return {
        ...base,
        originalUri: (tabV2 as TabInfoNotebookDiffV2).originalUri,
        modifiedUri: (tabV2 as TabInfoNotebookDiffV2).modifiedUri,
        notebookType: (tabV2 as TabInfoNotebookDiffV2).notebookType
      } as TabInfo;
    default:
      return base as TabInfo;
  }
}

function migrateTabState(tabStateV2: TabStateV2): TabState {
  const migratedTabGroups: TabState['tabGroups'] = {};

  for (const [viewColumn, tabGroupV2] of Object.entries(tabStateV2.tabGroups)) {
    const migratedTabs = tabGroupV2.tabs.map((tab, index) =>
      migrateTabInfo(tab, index)
    );
    const migratedActiveTab = tabGroupV2.activeTab
      ? migrateTabInfo(
          tabGroupV2.activeTab,
          tabGroupV2.tabs.indexOf(tabGroupV2.activeTab)
        )
      : undefined;

    migratedTabGroups[Number(viewColumn)] = {
      tabs: migratedTabs,
      viewColumn: Number(viewColumn),
      activeTab: migratedActiveTab
    };
  }

  return {
    tabGroups: migratedTabGroups,
    activeGroup: tabStateV2.activeGroup
  };
}

export function transform(payload: any): TabStateFileContent {
  const content = payload as TabStateFileContentV2;
  const migratedContent: TabStateFileContent = {
    version: 3,
    groups: {},
    history: {},
    addons: {},
    selectedGroup: content.selectedGroup,
    previousSelectedGroup: content.previousSelectedGroup,
    quickSlots: content.quickSlots
  };

  if (content.groups) {
    for (const [groupId, groupState] of Object.entries(content.groups)) {
      migratedContent.groups[groupId] = {
        ...groupState,
        state: {
          tabState: migrateTabState(groupState.state.tabState),
          layout: groupState.state.layout
        }
      };
    }
  }

  if (content.history) {
    for (const [historyId, historyState] of Object.entries(content.history)) {
      migratedContent.history[historyId] = {
        ...historyState,
        state: {
          tabState: migrateTabState(historyState.state.tabState),
          layout: historyState.state.layout
        }
      };
    }
  }

  if (content.addons) {
    for (const [addonId, addonState] of Object.entries(content.addons)) {
      migratedContent.addons[addonId] = {
        ...addonState,
        state: {
          tabState: migrateTabState(addonState.state.tabState),
          layout: addonState.state.layout
        }
      };
    }
  }

  return migratedContent;
}

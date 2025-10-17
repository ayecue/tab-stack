import {
  Tab,
  TabInputCustom,
  TabInputNotebook,
  TabInputNotebookDiff,
  TabInputTerminal,
  TabInputText,
  TabInputTextDiff,
  TabInputWebview
} from 'vscode';

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

export interface TabInfoBase {
  readonly label: string;
  readonly kind: TabKind;
  readonly isActive: boolean;
  readonly isPinned: boolean;
  readonly viewColumn: number | undefined;
}

export interface TabInfoText extends TabInfoBase {
  readonly uri: string;
  readonly kind: TabKind.TabInputText;
}

export interface TabInfoTextDiff extends TabInfoBase {
  readonly originalUri: string;
  readonly modifiedUri: string;
  readonly kind: TabKind.TabInputTextDiff;
}

export interface TabInfoCustom extends TabInfoBase {
  readonly uri: string;
  readonly viewType: string;
  readonly kind: TabKind.TabInputCustom;
}

export interface TabInfoWebview extends TabInfoBase {
  readonly viewType: string;
  readonly kind: TabKind.TabInputWebview;
}

export interface TabInfoNotebook extends TabInfoBase {
  readonly uri: string;
  readonly notebookType: string;
  readonly kind: TabKind.TabInputNotebook;
}

export interface TabInfoNotebookDiff extends TabInfoBase {
  readonly originalUri: string;
  readonly modifiedUri: string;
  readonly notebookType: string;
  readonly kind: TabKind.TabInputNotebookDiff;
}

export interface TabInfoTerminal extends TabInfoBase {
  readonly kind: TabKind.TabInputTerminal;
}

export type TabInfo =
  | TabInfoBase
  | TabInfoText
  | TabInfoTextDiff
  | TabInfoCustom
  | TabInfoWebview
  | TabInfoNotebook
  | TabInfoNotebookDiff
  | TabInfoTerminal;

export function transformTabToTabInfo(tab: Tab, viewColumn: number): TabInfo {
  const base: TabInfoBase = {
    label: tab.label,
    isActive: tab.isActive,
    isPinned: tab.isPinned,
    viewColumn,
    kind: TabKind.Unknown
  };

  if (tab.input instanceof TabInputText) {
    return {
      ...base,
      uri: tab.input.uri.toString(),
      kind: TabKind.TabInputText
    };
  } else if (tab.input instanceof TabInputTextDiff) {
    return {
      ...base,
      originalUri: tab.input.original.toString(),
      modifiedUri: tab.input.modified.toString(),
      kind: TabKind.TabInputTextDiff
    };
  } else if (tab.input instanceof TabInputCustom) {
    return {
      ...base,
      uri: tab.input.uri.toString(),
      viewType: tab.input.viewType,
      kind: TabKind.TabInputCustom
    };
  } else if (tab.input instanceof TabInputWebview) {
    return {
      ...base,
      viewType: tab.input.viewType,
      kind: TabKind.TabInputWebview
    };
  } else if (tab.input instanceof TabInputNotebook) {
    return {
      ...base,
      uri: tab.input.uri.toString(),
      notebookType: tab.input.notebookType,
      kind: TabKind.TabInputNotebook
    };
  } else if (tab.input instanceof TabInputNotebookDiff) {
    return {
      ...base,
      originalUri: tab.input.original.toString(),
      modifiedUri: tab.input.modified.toString(),
      notebookType: tab.input.notebookType,
      kind: TabKind.TabInputNotebookDiff
    };
  } else if (tab.input instanceof TabInputTerminal) {
    return {
      ...base,
      kind: TabKind.TabInputTerminal
    };
  }

  return base;
}

export interface TabGroupInfo {
  readonly tabs: TabInfo[];
  readonly viewColumn: number;

  activeTab: TabInfo | undefined;
}

export interface TabState {
  tabGroups: Record<number, TabGroupInfo>;
  activeGroup: number | null;
}

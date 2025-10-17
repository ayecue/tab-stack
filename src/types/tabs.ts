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

export interface TabGroupInfo {
  readonly tabs: TabInfo[];
  readonly viewColumn: number;

  activeTab: TabInfo | undefined;
}

export interface TabState {
  tabGroups: Record<number, TabGroupInfo>;
  activeGroup: number | null;
}

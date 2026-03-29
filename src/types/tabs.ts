import { NotebookEditor, Tab, Terminal, TextEditor } from 'vscode';

export interface SelectionRange {
  start: {
    line: number;
    character: number;
  };
  end: {
    line: number;
    character: number;
  };
  isEmpty?: boolean;
  isSingleLine?: boolean;
}

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

export type TabInfoId = string;

export interface TabInfoMetaTerminal {
  type: 'terminal';
  terminalName: string;
}

export interface TabInfoMetaTextEditor {
  type: 'textEditor';
  selection?: SelectionRange;
}

export interface TabInfoMetaNotebookEditor {
  type: 'notebookEditor';
  selection?: SelectionRange;
}

export interface TabInfoMetaUnknown {
  type: 'unknown';
}

export type TabInfoMeta =
  | TabInfoMetaTerminal
  | TabInfoMetaTextEditor
  | TabInfoMetaNotebookEditor
  | TabInfoMetaUnknown;

export interface TabInfoBase {
  readonly id: TabInfoId;
  readonly label: string;
  readonly kind: TabKind;
  readonly isActive: boolean;
  readonly isPinned: boolean;
  readonly isDirty?: boolean;
  readonly index: number | undefined;
  readonly viewColumn: number | undefined;
  readonly isRecoverable: boolean;
  meta: TabInfoMeta;
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

export interface TabAssociatedWithTextEditor {
  tab: Tab;
  editor: TextEditor | null;
}

export interface TabAssociatedWithNotebookEditor {
  tab: Tab;
  editor: NotebookEditor | null;
}

export type TabAssociatedEditor =
  | TabAssociatedWithTextEditor
  | TabAssociatedWithNotebookEditor;

export type AssociatedTabInstance = TextEditor | NotebookEditor | Terminal;

export interface OpenTabResult {
  success: boolean;
  handle: AssociatedTabInstance | null;
  tab: Tab;
}

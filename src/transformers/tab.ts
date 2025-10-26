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

import { TabInfo, TabInfoBase, TabKind } from '../types/tabs';

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

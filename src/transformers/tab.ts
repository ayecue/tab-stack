import { nanoid } from 'nanoid';
import {
  Tab,
  TabGroup,
  TabInputCustom,
  TabInputNotebook,
  TabInputNotebookDiff,
  TabInputTerminal,
  TabInputText,
  TabInputTextDiff,
  TabInputWebview
} from 'vscode';

import { TabInfo, TabInfoBase, TabKind } from '../types/tabs';

export function transformTabToTabInfo(
  tab: Tab,
  tabGroup: TabGroup,
  index: number
): TabInfo {
  const base: TabInfoBase = {
    id: nanoid(),
    label: tab.label,
    isActive: tab.isActive,
    isPinned: tab.isPinned,
    isDirty: tab.isDirty,
    index,
    viewColumn: tabGroup.viewColumn,
    kind: TabKind.Unknown,
    isRecoverable: false, // Will be computed by handler
    meta: { type: 'unknown' }
  };

  if (tab.input instanceof TabInputText) {
    return {
      ...base,
      uri: tab.input.uri.toString(),
      kind: TabKind.TabInputText,
      meta: { type: 'textEditor' }
    };
  } else if (tab.input instanceof TabInputTextDiff) {
    return {
      ...base,
      originalUri: tab.input.original.toString(),
      modifiedUri: tab.input.modified.toString(),
      kind: TabKind.TabInputTextDiff,
      meta: { type: 'textEditor' }
    };
  } else if (tab.input instanceof TabInputCustom) {
    return {
      ...base,
      uri: tab.input.uri.toString(),
      viewType: tab.input.viewType,
      kind: TabKind.TabInputCustom,
      meta: { type: 'textEditor' }
    };
  } else if (tab.input instanceof TabInputWebview) {
    return {
      ...base,
      viewType: tab.input.viewType,
      kind: TabKind.TabInputWebview,
      meta: { type: 'unknown' }
    };
  } else if (tab.input instanceof TabInputNotebook) {
    return {
      ...base,
      uri: tab.input.uri.toString(),
      notebookType: tab.input.notebookType,
      kind: TabKind.TabInputNotebook,
      meta: { type: 'notebookEditor' }
    };
  } else if (tab.input instanceof TabInputNotebookDiff) {
    return {
      ...base,
      originalUri: tab.input.original.toString(),
      modifiedUri: tab.input.modified.toString(),
      notebookType: tab.input.notebookType,
      kind: TabKind.TabInputNotebookDiff,
      meta: { type: 'notebookEditor' }
    };
  } else if (tab.input instanceof TabInputTerminal) {
    return {
      ...base,
      kind: TabKind.TabInputTerminal,
      meta: { type: 'terminal', terminalName: tab.label }
    };
  }

  return base;
}

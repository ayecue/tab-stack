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
import { extractUnknownTabIdentity } from '../utils/unknown-tab-identity';
import { inferCursorEditorViewType } from '../utils/cursor-editors';

function isTabInput<T>(input: unknown, ctor: abstract new (...args: never[]) => T): input is T {
  return typeof ctor === 'function' && input instanceof ctor;
}

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

  if (isTabInput(tab.input, TabInputText)) {
    return {
      ...base,
      uri: tab.input.uri.toString(),
      kind: TabKind.TabInputText,
      meta: { type: 'textEditor' }
    };
  } else if (isTabInput(tab.input, TabInputTextDiff)) {
    return {
      ...base,
      originalUri: tab.input.original.toString(),
      modifiedUri: tab.input.modified.toString(),
      kind: TabKind.TabInputTextDiff,
      meta: { type: 'textEditor' }
    };
  } else if (isTabInput(tab.input, TabInputCustom)) {
    return {
      ...base,
      uri: tab.input.uri.toString(),
      viewType: tab.input.viewType,
      kind: TabKind.TabInputCustom,
      meta: { type: 'textEditor' }
    };
  } else if (isTabInput(tab.input, TabInputWebview)) {
    return {
      ...base,
      viewType: tab.input.viewType,
      kind: TabKind.TabInputWebview,
      meta: { type: 'unknown' }
    };
  } else if (isTabInput(tab.input, TabInputNotebook)) {
    return {
      ...base,
      uri: tab.input.uri.toString(),
      notebookType: tab.input.notebookType,
      kind: TabKind.TabInputNotebook,
      meta: { type: 'notebookEditor' }
    };
  } else if (isTabInput(tab.input, TabInputNotebookDiff)) {
    return {
      ...base,
      originalUri: tab.input.original.toString(),
      modifiedUri: tab.input.modified.toString(),
      notebookType: tab.input.notebookType,
      kind: TabKind.TabInputNotebookDiff,
      meta: { type: 'notebookEditor' }
    };
  } else if (isTabInput(tab.input, TabInputTerminal)) {
    return {
      ...base,
      kind: TabKind.TabInputTerminal,
      meta: { type: 'terminal', terminalName: tab.label }
    };
  }

  const identity = extractUnknownTabIdentity(tab.input);
  const inferredViewType = inferCursorEditorViewType({
    uri: identity.uri,
    viewType: identity.viewType,
    label: tab.label
  });

  return {
    ...base,
    kind: TabKind.Unknown,
    ...(identity.uri ? { uri: identity.uri } : {}),
    ...(identity.viewType || inferredViewType
      ? { viewType: identity.viewType ?? inferredViewType }
      : {}),
    meta: { type: 'unknown' }
  };
}

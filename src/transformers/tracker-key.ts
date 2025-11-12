import {
  NotebookEditor,
  Tab,
  TabInputNotebook,
  TabInputNotebookDiff,
  TabInputText,
  TabInputTextDiff,
  TextEditor,
  window
} from 'vscode';

import {
  TabInfo,
  TabInfoNotebook,
  TabInfoNotebookDiff,
  TabInfoText,
  TabInfoTextDiff,
  TabKind,
  TabState
} from '../types/tabs';
import {
  isNotebookEditorWithDiffInformation,
  isTextEditorWithDiffInformation
} from '../types/vscode';

export function findAssociatedTab(
  condition: (tab: Tab) => boolean
): Tab | null {
  for (const group of window.tabGroups.all) {
    for (const tab of group.tabs) {
      if (condition(tab)) {
        return tab;
      }
    }
  }
  return null;
}

export function getTabTrackerKeyFromRawTextEditor(editor: TextEditor): string {
  if (isTextEditorWithDiffInformation(editor)) {
    const diffInformation = editor.diffInformation[0];
    const modifiedUri = diffInformation.modified.toString();
    const originalUri = diffInformation.original.toString();
    let viewColumn = editor.viewColumn;

    if (viewColumn == null) {
      const tab = findAssociatedTab((tab) => {
        return (
          tab.input instanceof TabInputTextDiff &&
          tab.input.modified.toString() === modifiedUri &&
          tab.input.original.toString() === originalUri
        );
      });

      if (tab != null) {
        viewColumn = tab.group.viewColumn;
      }
    }

    return `${modifiedUri}::${originalUri}::${viewColumn ?? 1}::text`;
  }

  const uri = editor.document.uri.toString();
  const viewColumn = editor.viewColumn;

  return `${uri}::${viewColumn}::text`;
}

export function getTabTrackerKeyFromRawNotebookEditor(
  editor: NotebookEditor
): string {
  const uri = editor.notebook.uri.toString();
  const viewColumn = editor.viewColumn;

  if (isNotebookEditorWithDiffInformation(editor)) {
    const diffInformation = editor.diffInformation[0];
    const modifiedUri = diffInformation.modified.toString();
    const originalUri = diffInformation.original.toString();
    let viewColumn = editor.viewColumn;

    if (viewColumn == null) {
      const tab = findAssociatedTab((tab) => {
        return (
          tab.input instanceof TabInputTextDiff &&
          tab.input.modified.toString() === modifiedUri &&
          tab.input.original.toString() === originalUri
        );
      });

      if (tab != null) {
        viewColumn = tab.group.viewColumn;
      }
    }

    return `${modifiedUri}::${originalUri}::${viewColumn ?? 1}::notebook`;
  }

  return `${uri}::${viewColumn}::notebook`;
}

export function getTabTrackerKey(tab: Tab): string | null {
  if (tab.input instanceof TabInputText) {
    return `${tab.input.uri.toString()}::${tab.group.viewColumn}::text`;
  }
  if (tab.input instanceof TabInputTextDiff) {
    return `${tab.input.modified.toString()}::${tab.input.original.toString()}::${tab.group.viewColumn}::text`;
  } else if (tab.input instanceof TabInputNotebook) {
    return `${tab.input.uri.toString()}::${tab.group.viewColumn}::notebook`;
  } else if (tab.input instanceof TabInputNotebookDiff) {
    return `${tab.input.modified.toString()}::${tab.input.original.toString()}::${tab.group.viewColumn}::notebook`;
  }

  return null;
}

export function getTabInfoTrackerKey(tabInfo: TabInfo): string | null {
  switch (tabInfo.kind) {
    case TabKind.TabInputText: {
      const textTab = tabInfo as TabInfoText;
      return `${textTab.uri}::${tabInfo.viewColumn}::text`;
    }
    case TabKind.TabInputTextDiff: {
      const textDiffTab = tabInfo as TabInfoTextDiff;
      return `${textDiffTab.modifiedUri}::${textDiffTab.originalUri}::${tabInfo.viewColumn ?? 0}::text`;
    }
    case TabKind.TabInputNotebook: {
      const notebookTab = tabInfo as TabInfoNotebook;
      return `${notebookTab.uri}::${tabInfo.viewColumn ?? 0}::notebook`;
    }
    case TabKind.TabInputNotebookDiff: {
      const notebookDiffTab = tabInfo as TabInfoNotebookDiff;
      return `${notebookDiffTab.modifiedUri}::${notebookDiffTab.originalUri}::${tabInfo.viewColumn ?? 0}::notebook`;
    }
    default:
      return null;
  }
}

export function aggregateTrackerKeysFromTabState(tabState: TabState): string[] {
  const items = new Set<string>();

  Object.values(tabState.tabGroups).forEach((tabGroup) => {
    tabGroup.tabs.forEach((tab) => {
      const key = getTabInfoTrackerKey(tab);
      if (key !== null) {
        items.add(key);
      }
    });
  });

  return Array.from(items);
}

import { commands, Uri, window } from 'vscode';

import { Layout } from '../types/commands';
import {
  TabInfo,
  TabInfoCustom,
  TabInfoNotebook,
  TabInfoNotebookDiff,
  TabInfoText,
  TabInfoTextDiff,
  TabKind
} from '../types/tabs';

export async function closeAllEditors(): Promise<void> {
  await commands.executeCommand('workbench.action.closeAllEditors');
}

export async function getEditorLayout(): Promise<Layout> {
  return await commands.executeCommand('vscode.getEditorLayout');
}

export async function setEditorLayout(layout: Layout): Promise<void> {
  await commands.executeCommand('vscode.setEditorLayout', layout);
}

export async function pinCurrentEditor(): Promise<void> {
  await commands.executeCommand('workbench.action.pinEditor');
}

export async function unpinCurrentEditor(): Promise<void> {
  await commands.executeCommand('workbench.action.unpinEditor');
}

export async function pinEditor(
  viewColumn: number,
  index: number,
  returnToPreviousEditor: boolean = true
): Promise<void> {
  const currentViewColumn = window.activeTextEditor?.viewColumn;
  const currentIndex = window.tabGroups.activeTabGroup.tabs.findIndex(
    (tab) => tab.isActive
  );

  await focusTabInGroup(viewColumn, index);
  await pinCurrentEditor();
  if (returnToPreviousEditor)
    await focusTabInGroup(currentViewColumn, currentIndex);
}

export async function unpinEditor(
  viewColumn: number,
  index: number,
  returnToPreviousEditor: boolean = true
): Promise<void> {
  const currentViewColumn = window.activeTextEditor?.viewColumn;
  const currentIndex = window.tabGroups.activeTabGroup.tabs.findIndex(
    (tab) => tab.isActive
  );

  await focusTabInGroup(viewColumn, index);
  await unpinCurrentEditor();
  if (returnToPreviousEditor)
    await focusTabInGroup(currentViewColumn, currentIndex);
}

export async function focusTabInGroup(
  viewColumn: number,
  index: number
): Promise<void> {
  await focusGroup(viewColumn);
  await focusTab(index);
}

const FOCUS_GROUP_COMMANDS_BY_INDEX: Record<number, string> = {
  1: 'workbench.action.focusFirstEditorGroup',
  2: 'workbench.action.focusSecondEditorGroup',
  3: 'workbench.action.focusThirdEditorGroup',
  4: 'workbench.action.focusFourthEditorGroup',
  5: 'workbench.action.focusFifthEditorGroup',
  6: 'workbench.action.focusSixthEditorGroup',
  7: 'workbench.action.focusSeventhEditorGroup',
  8: 'workbench.action.focusEighthEditorGroup',
  9: 'workbench.action.focusLastEditorGroup'
};

export async function focusGroup(index: number): Promise<void> {
  if (index in FOCUS_GROUP_COMMANDS_BY_INDEX) {
    await commands.executeCommand(FOCUS_GROUP_COMMANDS_BY_INDEX[index]);
    return;
  }

  throw new Error(`No command found to focus editor group at index ${index}`);
}

export async function focusTab(index: number): Promise<void> {
  await commands.executeCommand('workbench.action.openEditorAtIndex', index);
}

export async function openTab(tab: TabInfo): Promise<boolean> {
  // just a fallback for older versions of tab stack
  if (tab.kind == null) {
    // @ts-ignore
    tab.kind = TabKind.TabInputText;
  }

  switch (tab.kind) {
    case TabKind.TabInputText: {
      const textTab = tab as TabInfoText;
      await commands.executeCommand('vscode.open', Uri.parse(textTab.uri), {
        viewColumn: tab.viewColumn,
        preview: false,
        preserveFocus: true
      });
      return true;
    }
    case TabKind.TabInputTextDiff: {
      const textDiffTab = tab as TabInfoTextDiff;
      await commands.executeCommand(
        'vscode.diff',
        Uri.parse(textDiffTab.originalUri),
        Uri.parse(textDiffTab.modifiedUri),
        tab.label,
        {
          viewColumn: tab.viewColumn,
          preview: false,
          preserveFocus: true
        }
      );
      return true;
    }
    case TabKind.TabInputCustom: {
      const customTab = tab as TabInfoCustom;
      await commands.executeCommand(
        'vscode.openWith',
        Uri.parse(customTab.uri),
        customTab.viewType,
        {
          viewColumn: tab.viewColumn,
          preview: false,
          preserveFocus: true
        }
      );
      return true;
    }
    case TabKind.TabInputNotebook: {
      const notebookTab = tab as TabInfoNotebook;
      await commands.executeCommand(
        'vscode.openWith',
        Uri.parse(notebookTab.uri),
        notebookTab.notebookType,
        {
          viewColumn: tab.viewColumn,
          preview: false,
          preserveFocus: true
        }
      );
      return true;
    }
    case TabKind.TabInputNotebookDiff: {
      const notebookDiffTab = tab as TabInfoNotebookDiff;
      await commands.executeCommand(
        'vscode.diff',
        Uri.parse(notebookDiffTab.originalUri),
        Uri.parse(notebookDiffTab.modifiedUri),
        tab.label,
        {
          viewColumn: tab.viewColumn,
          preview: false,
          preserveFocus: true
        }
      );
      return true;
    }
    case TabKind.TabInputWebview:
    case TabKind.TabInputTerminal:
    case TabKind.Unknown:
    default:
      console.error(`Unsupported tab kind: ${tab.kind}`);
      return false;
  }
}

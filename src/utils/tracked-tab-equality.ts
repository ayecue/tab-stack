import {
  SelectionRange,
  TabInfo,
  TabInfoMeta,
  TabInfoMetaNotebookEditor,
  TabInfoMetaTerminal,
  TabInfoMetaTextEditor,
  TabInfoMetaUnknown
} from '../types/tabs';

export function isTrackedSelectionRangeEqual(
  currentSelection: SelectionRange | undefined,
  nextSelection: SelectionRange | undefined
): boolean {
  if (currentSelection == null || nextSelection == null) {
    return currentSelection === nextSelection;
  }

  return (
    currentSelection.start.line === nextSelection.start.line &&
    currentSelection.start.character === nextSelection.start.character &&
    currentSelection.end.line === nextSelection.end.line &&
    currentSelection.end.character === nextSelection.end.character &&
    (currentSelection.isEmpty ?? false) === (nextSelection.isEmpty ?? false) &&
    (currentSelection.isSingleLine ?? false) ===
      (nextSelection.isSingleLine ?? false)
  );
}

export function isTrackedTabMetaEqual(
  currentMeta: TabInfoMeta,
  nextMeta: TabInfoMeta
): boolean {
  if (currentMeta.type !== nextMeta.type) {
    return false;
  }

  switch (currentMeta.type) {
    case 'textEditor': {
      const leftMeta = currentMeta as TabInfoMetaTextEditor;
      const rightMeta = nextMeta as TabInfoMetaTextEditor;
      return isTrackedSelectionRangeEqual(
        leftMeta.selection,
        rightMeta.selection
      );
    }
    case 'notebookEditor': {
      const leftMeta = currentMeta as TabInfoMetaNotebookEditor;
      const rightMeta = nextMeta as TabInfoMetaNotebookEditor;
      return isTrackedSelectionRangeEqual(
        leftMeta.selection,
        rightMeta.selection
      );
    }
    case 'terminal': {
      const leftMeta = currentMeta as TabInfoMetaTerminal;
      const rightMeta = nextMeta as TabInfoMetaTerminal;
      return (
        leftMeta.cwd === rightMeta.cwd &&
        leftMeta.shellPath === rightMeta.shellPath &&
        leftMeta.terminalName === rightMeta.terminalName &&
        leftMeta.isTransient === rightMeta.isTransient
      );
    }
    case 'unknown': {
      return true;
    }
    default: {
      const leftMeta = currentMeta as TabInfoMetaUnknown;
      const rightMeta = nextMeta as TabInfoMetaUnknown;
      return leftMeta.type === rightMeta.type;
    }
  }
}

export function isTrackedTabInfoEqual(
  currentTab: TabInfo | undefined,
  nextTab: TabInfo | undefined
): boolean {
  if (currentTab == null || nextTab == null) {
    return currentTab === nextTab;
  }

  return (
    currentTab.id === nextTab.id &&
    currentTab.label === nextTab.label &&
    currentTab.kind === nextTab.kind &&
    currentTab.isActive === nextTab.isActive &&
    currentTab.isPinned === nextTab.isPinned &&
    currentTab.isDirty === nextTab.isDirty &&
    currentTab.index === nextTab.index &&
    currentTab.viewColumn === nextTab.viewColumn &&
    currentTab.isRecoverable === nextTab.isRecoverable &&
    isTrackedTabMetaEqual(currentTab.meta, nextTab.meta)
  );
}
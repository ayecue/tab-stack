import { Uri, workspace } from 'vscode';

import { StateContainer, TabStateFileContent } from '../types/tab-manager';
import {
  TabGroupInfo,
  TabInfo,
  TabInfoText,
  TabInfoTextDiff,
  TabKind,
  TabState
} from '../types/tabs';

export type TabUriTransformer = (uri: string) => string;

function toRelativeUriString(absolutePath: string): string {
  return workspace.asRelativePath(absolutePath, false);
}

function toAbsoluteUriString(
  relativePath: string,
  workspaceFolder: Uri
): string {
  return Uri.joinPath(workspaceFolder, relativePath).toString();
}

function transformTabUris(
  tab: TabInfo,
  transformer: TabUriTransformer
): TabInfo {
  switch (tab.kind) {
    case TabKind.TabInputText:
    case TabKind.TabInputCustom:
    case TabKind.TabInputNotebook: {
      const tabEntity = tab as TabInfoText;
      return {
        ...tabEntity,
        uri: transformer(tabEntity.uri)
      };
    }
    case TabKind.TabInputTextDiff:
    case TabKind.TabInputNotebookDiff: {
      const tabEntity = tab as TabInfoTextDiff;
      return {
        ...tabEntity,
        originalUri: transformer(tabEntity.originalUri),
        modifiedUri: transformer(tabEntity.modifiedUri)
      };
    }
    case TabKind.TabInputWebview:
    case TabKind.TabInputTerminal:
    default: {
      return { ...tab };
    }
  }
}

function mapTabStateUris(
  tabState: TabState,
  mapper: TabUriTransformer
): TabState {
  const newTabGroups: Record<string, TabGroupInfo> = {};

  for (const [key, group] of Object.entries(tabState.tabGroups)) {
    newTabGroups[key] = {
      ...group,
      tabs: group.tabs.map((t) => transformTabUris(t, mapper)),
      activeTab: group.activeTab
        ? transformTabUris(group.activeTab, mapper)
        : undefined
    };
  }

  return {
    ...tabState,
    tabGroups: newTabGroups
  };
}

function transformStateContainerUris(
  container: StateContainer,
  mapper: TabUriTransformer
): StateContainer {
  return {
    ...container,
    state: {
      ...container.state,
      tabState: mapTabStateUris(container.state.tabState, mapper)
    }
  };
}

function transformTabStateFileContentUris(
  file: TabStateFileContent,
  mapper: TabUriTransformer
): TabStateFileContent {
  const result: TabStateFileContent = {
    version: file.version,
    groups: {},
    history: {},
    addons: {},
    selectedGroup: file.selectedGroup,
    previousSelectedGroup: file.previousSelectedGroup,
    quickSlots: { ...file.quickSlots }
  };

  for (const [key, group] of Object.entries(file.groups)) {
    result.groups[key] = transformStateContainerUris(group, mapper);
  }

  for (const [key, history] of Object.entries(file.history)) {
    result.history[key] = transformStateContainerUris(history, mapper);
  }

  for (const [key, addons] of Object.entries(file.addons)) {
    result.history[key] = transformStateContainerUris(addons, mapper);
  }

  return result;
}

export function toRelativeTabStateFile(
  file: TabStateFileContent
): TabStateFileContent {
  return transformTabStateFileContentUris(file, (u) => toRelativeUriString(u));
}

export function toAbsoluteTabStateFile(
  file: TabStateFileContent,
  base: Uri
): TabStateFileContent {
  return transformTabStateFileContentUris(file, (u) =>
    toAbsoluteUriString(u, base)
  );
}

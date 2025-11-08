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
  return workspace.asRelativePath(Uri.parse(absolutePath), false);
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
  if ('uri' in tab && typeof tab.uri === 'string') {
    return {
      ...tab,
      uri: transformer(tab.uri)
    };
  } else if ('originalUri' in tab && 'modifiedUri' in tab) {
    return {
      ...tab,
      originalUri: transformer(tab.originalUri),
      modifiedUri: transformer(tab.modifiedUri)
    };
  }
  
  return { ...tab };
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

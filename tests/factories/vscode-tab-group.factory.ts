import type { Tab as VSCodeTab, TabGroup as VSCodeTabGroup } from 'vscode';
import { window } from 'vscode';

export interface VSCodeTabGroupFactoryOptions {
  viewColumn?: number;
  tabs?: readonly VSCodeTab[];
  isActive?: boolean;
  activeTab?: VSCodeTab;
}

let groupSequence = 0;

export function createVSCodeTabGroup(
  options: VSCodeTabGroupFactoryOptions = {}
): VSCodeTabGroup {
  groupSequence += 1;

  const tabs = [...(options.tabs ?? [])];
  const group = {
    viewColumn: options.viewColumn ?? groupSequence,
    isActive: options.isActive ?? false,
    activeTab: options.activeTab ?? tabs.find((tab) => tab.isActive) ?? tabs[0],
    tabs,
  } as unknown as VSCodeTabGroup;

  for (const tab of tabs) {
    (tab as { group?: VSCodeTabGroup }).group = group;
  }

  return group;
}

export function setWindowTabGroups(
  groups: VSCodeTabGroup[],
  activeGroup: VSCodeTabGroup | undefined = groups.find((group) => group.isActive) ?? groups[0]
): void {
  const current = window.tabGroups as unknown as Record<string, unknown>;

  (window.tabGroups as unknown as Record<string, unknown>) = {
    ...current,
    all: groups,
    activeTabGroup: activeGroup,
  };
}
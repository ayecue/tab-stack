import {
  Tab,
  TabGroup,
  window
} from 'vscode';

export function findTabByViewColumnAndIndex(
  viewColumn: number,
  index: number
): Tab | null {
  const targetGroup = findTabGroupByViewColumn(viewColumn);

  if (!targetGroup) {
    return null;
  }

  return targetGroup.tabs[index] || null;
}

export function findTabGroupByViewColumn(viewColumn: number): TabGroup | null {
  const targetGroup = window.tabGroups.all.find(
    (group) => group.viewColumn === viewColumn
  );

  return targetGroup || null;
}

export async function closeTab(tab: Tab): Promise<void> {
  await window.tabGroups.close(tab, true);
}

export async function closeAllTabs(): Promise<void> {
  for (const group of window.tabGroups.all) {
    await window.tabGroups.close(group, true);
  }
}

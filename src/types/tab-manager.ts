import { Tab, TabGroup, WebviewViewProvider } from 'vscode';

import { Layout } from './commands';
import { TabState } from './tabs';

export type QuickSlotIndex = number;

export type QuickSlotAssignments = Partial<Record<QuickSlotIndex, string>>;

export interface TabManagerState {
  tabState: TabState;
  layout: Layout;
}

export const EMPTY_GROUP_SELECTION = undefined;
export type GroupSelectionValue = string | typeof EMPTY_GROUP_SELECTION;

export interface TabStateFileContent {
  groups: Record<string, TabManagerState>;
  history: Record<string, TabManagerState>;
  selectedGroup: GroupSelectionValue;
  previousSelectedGroup: GroupSelectionValue;
  quickSlots: QuickSlotAssignments;
}

export function createDefaultTabStateFileContent(): TabStateFileContent {
  return {
    groups: {},
    history: {},
    selectedGroup: EMPTY_GROUP_SELECTION,
    previousSelectedGroup: EMPTY_GROUP_SELECTION,
    quickSlots: {}
  };
}

export interface ITabManagerProvider extends WebviewViewProvider {
  findTabGroupByViewColumn(viewColumn: number): TabGroup | null;
  findTabByViewColumnAndIndex(viewColumn: number, index: number): Tab | null;

  refresh: () => Promise<void>;
  applyState(): Promise<void>;
  toggleTabPin(viewColumn: number, index: number): Promise<void>;
  openTab(viewColumn: number, index: number): Promise<void>;
  closeTab(viewColumn: number, index: number): Promise<void>;
  syncWebview(): Promise<void>;
  createGroup(groupId: string): Promise<void>;
  deleteGroup(groupId: string): Promise<void>;
  renameGroup(groupId: string, nextGroupId: string): Promise<void>;
  switchToGroup(groupId: string | null): Promise<void>;
  takeSnapshot(): Promise<void>;
  recoverSnapshot(historyId: string): Promise<void>;
  deleteSnapshot(historyId: string): Promise<void>;
  assignQuickSlot(slot: QuickSlotIndex, groupId: string | null): Promise<void>;
  applyQuickSlot(slot: QuickSlotIndex): Promise<void>;
  quickSwitch(): Promise<void>;
}

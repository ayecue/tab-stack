import { DebouncedFunction } from 'debounce';
import { nanoid } from 'nanoid';
import { Disposable, Event } from 'vscode';

import { TabStateHandler } from '../handlers/tab-state';
import { ConfigService } from '../services/config';
import { Layout } from './commands';
import {
  ExtensionNotificationMessage,
  ExtensionTabsSyncMessage
} from './messages';
import { SelectionRange } from './selection-tracker';
import { TabInfo, TabState } from './tabs';

export type QuickSlotIndex = string;

export type QuickSlotAssignments = Partial<Record<QuickSlotIndex, string>>;

export interface TabManagerState {
  selectionMap: Record<string, SelectionRange>;
  tabState: TabState;
  layout: Layout;
}

export interface StateContainer {
  id: string;
  name: string;
  state: TabManagerState;
  createdAt: number;
  lastSelectedAt: number;
}

export function createEmptyStateContainer(): StateContainer {
  return {
    id: nanoid(),
    name: 'untitled',
    state: {
      tabState: {
        tabGroups: {
          0: {
            tabs: [] as TabInfo[],
            viewColumn: 0,
            activeTab: undefined
          }
        },
        activeGroup: 0
      },
      layout: {
        orientation: 0,
        groups: []
      },
      selectionMap: {}
    },
    lastSelectedAt: 0,
    createdAt: Date.now()
  };
}

export const CURRENT_STATE_FILE_VERSION = 2;

export interface TabStateFileContent {
  version?: number;
  groups: Record<string, StateContainer>;
  history: Record<string, StateContainer>;
  addons: Record<string, StateContainer>;
  selectedGroup: string;
  previousSelectedGroup: string;
  quickSlots: QuickSlotAssignments;
}

export function createDefaultTabStateFileContent(): TabStateFileContent {
  return {
    version: CURRENT_STATE_FILE_VERSION,
    groups: {},
    history: {},
    addons: {},
    selectedGroup: null,
    previousSelectedGroup: null,
    quickSlots: {}
  };
}

export interface RenderingItem {
  stateContainer: StateContainer;
  rollbackStateContainer: StateContainer;
}

export interface ITabManagerService extends Disposable {
  readonly state: TabStateHandler;
  readonly config: ConfigService;

  refresh: DebouncedFunction<() => Promise<void>>;
  applyState(oldStateContainer: StateContainer): void;
  toggleTabPin(viewColumn: number, index: number): Promise<void>;
  openTab(viewColumn: number, index: number): Promise<void>;
  closeTab(viewColumn: number, index: number): Promise<void>;
  moveTab(
    fromViewColumn: number,
    fromIndex: number,
    toViewColumn: number,
    toIndex: number
  ): Promise<void>;
  clearAllTabs(): Promise<void>;
  createGroup(groupId: string): void;
  deleteGroup(groupId: string): void;
  renameGroup(groupId: string, newName: string): void;
  switchToGroup(groupId: string | null): void;
  takeSnapshot(): void;
  recoverSnapshot(historyId: string): void;
  deleteSnapshot(historyId: string): void;
  createAddon(name: string): void;
  renameAddon(addonId: string, newName: string): void;
  deleteAddon(addonId: string): void;
  applyAddon(addonId: string): Promise<void>;
  assignQuickSlot(slot: QuickSlotIndex, groupId: string | null): void;
  applyQuickSlot(slot: QuickSlotIndex): void;
  quickSwitch(): void;
  selectWorkspaceFolder(folderPath: string | null): Promise<void>;
  clearWorkspaceFolder(): Promise<void>;

  triggerSync(): void;

  exportStateFile(exportUri: string): Promise<void>;
  importStateFile(importUri: string): Promise<void>;

  onDidSyncTabs: Event<Omit<ExtensionTabsSyncMessage, 'type'>>;
  onDidNotify: Event<Omit<ExtensionNotificationMessage, 'type'>>;
}

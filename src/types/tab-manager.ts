import { DebouncedFunction } from 'debounce';
import { nanoid } from 'nanoid';
import { Disposable, Event } from 'vscode';

import { ConfigService } from '../services/config';
import { TabStateService } from '../services/tab-state';
import { Layout } from './commands';
import {
  ExtensionNotificationMessage,
  ExtensionTabsSyncMessage
} from './messages';
import { TabInfo, TabState } from './tabs';

export type QuickSlotIndex = number;

export type QuickSlotAssignments = Partial<Record<QuickSlotIndex, string>>;

export interface TabManagerState {
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
      }
    },
    lastSelectedAt: 0,
    createdAt: Date.now()
  };
}

export const CURRENT_STATE_FILE_VERSION = 1;

export interface TabStateFileContent {
  version?: number;
  groups: Record<string, StateContainer>;
  history: Record<string, StateContainer>;
  selectedGroup: string;
  previousSelectedGroup: string;
  quickSlots: QuickSlotAssignments;
}

export function createDefaultTabStateFileContent(): TabStateFileContent {
  return {
    version: CURRENT_STATE_FILE_VERSION,
    groups: {},
    history: {},
    selectedGroup: null,
    previousSelectedGroup: null,
    quickSlots: {}
  };
}

export interface RenderingItem {
  state: StateContainer;
  previousState: StateContainer | null;
}

export interface ITabManagerService extends Disposable {
  readonly state: TabStateService;
  readonly config: ConfigService;

  refresh: DebouncedFunction<() => Promise<void>>;
  applyState(): Promise<void>;
  toggleTabPin(viewColumn: number, index: number): Promise<void>;
  openTab(viewColumn: number, index: number): Promise<void>;
  closeTab(viewColumn: number, index: number): Promise<void>;
  clearAllTabs(): Promise<void>;
  createGroup(groupId: string): Promise<void>;
  deleteGroup(groupId: string): Promise<void>;
  renameGroup(groupId: string, newName: string): Promise<void>;
  switchToGroup(groupId: string | null): Promise<void>;
  takeSnapshot(): Promise<void>;
  recoverSnapshot(historyId: string): Promise<void>;
  deleteSnapshot(historyId: string): Promise<void>;
  assignQuickSlot(slot: QuickSlotIndex, groupId: string | null): Promise<void>;
  applyQuickSlot(slot: QuickSlotIndex): Promise<void>;
  quickSwitch(): Promise<void>;
  selectWorkspaceFolder(folderPath: string | null): Promise<void>;
  clearWorkspaceFolder(): Promise<void>;

  triggerSync(): Promise<void>;

  onDidSyncTabs: Event<Omit<ExtensionTabsSyncMessage, 'type'>>;
  onDidNotify: Event<Omit<ExtensionNotificationMessage, 'type'>>;
}

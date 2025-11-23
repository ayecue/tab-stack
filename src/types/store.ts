import {
  QuickSlotAssignments,
  StateContainer,
  TabStateFileContent
} from './tab-manager';
import { TabInfo, TabInfoId } from './tabs';

export interface TabActiveStateStoreContext {
  tabs: Record<TabInfoId, TabInfo>;
  isLocked: boolean;
}

export type TabActiveStateSetTabsEvent = {
  type: 'SET_TABS';
  tabs: Record<TabInfoId, TabInfo>;
};

export type TabActiveStateAddTabEvent = {
  type: 'ADD_TAB';
  payload: TabInfo;
};

export type TabActiveStateUpdateTabEvent = {
  type: 'UPDATE_TAB';
  payload: TabInfo;
};

export type TabActiveStateRemoveTabEvent = {
  type: 'REMOVE_TAB';
  payload: TabInfoId;
};

export type TabActiveStateResetEvent = {
  type: 'RESET';
};

export type TabActiveStateLockEvent = {
  type: 'LOCK_STATE';
};

export type TabActiveStateUnlockEvent = {
  type: 'UNLOCK_STATE';
};

export type TabActiveStateStoreEvents =
  | TabActiveStateSetTabsEvent
  | TabActiveStateAddTabEvent
  | TabActiveStateUpdateTabEvent
  | TabActiveStateRemoveTabEvent
  | TabActiveStateResetEvent
  | TabActiveStateLockEvent
  | TabActiveStateUnlockEvent;

export interface TabStateContainerStoreContext {
  currentStateContainer: StateContainer | null;
  previousStateContainer: StateContainer | null;
  isLocked: boolean;
}

export type TabStateContainerInitializeEvent = {
  type: 'INITIALIZE';
  stateContainer: StateContainer;
  previousStateContainer?: StateContainer;
};

export type TabStateContainerSetStateEvent = {
  type: 'SET_STATE';
  stateContainer: StateContainer;
};

export type TabStateContainerSyncStateEvent = {
  type: 'SYNC_STATE';
  stateContainer: StateContainer;
};

export type TabStateContainerForkStateEvent = {
  type: 'FORK_STATE';
};

export type TabStateContainerLockStateEvent = {
  type: 'LOCK_STATE';
};

export type TabStateContainerUnlockStateEvent = {
  type: 'UNLOCK_STATE';
};

export type TabStateContainerResetEvent = {
  type: 'RESET';
};

export type TabStateContainerStoreEvents =
  | TabStateContainerInitializeEvent
  | TabStateContainerSetStateEvent
  | TabStateContainerSyncStateEvent
  | TabStateContainerForkStateEvent
  | TabStateContainerLockStateEvent
  | TabStateContainerUnlockStateEvent
  | TabStateContainerResetEvent;

export interface TabCollectionStateStoreContext {
  groups: Record<string, StateContainer>;
  history: Record<string, StateContainer>;
  addons: Record<string, StateContainer>;
  quickSlots: QuickSlotAssignments;
}

export type TabCollectionStateInitializeEvent = {
  type: 'INITIALIZE';
  data: TabCollectionStateStoreContext;
};

export type TabCollectionStateCreateGroupEvent = {
  type: 'CREATE_GROUP';
  stateContainer: StateContainer;
};

export type TabCollectionStateUpdateGroupEvent = {
  type: 'UPDATE_GROUP';
  groupId: string;
  stateContainer: StateContainer;
};

export type TabCollectionStateRenameGroupEvent = {
  type: 'RENAME_GROUP';
  groupId: string;
  newName: string;
};

export type TabCollectionStateDeleteGroupEvent = {
  type: 'DELETE_GROUP';
  groupId: string;
};

export type TabCollectionStateLoadGroupEvent = {
  type: 'LOAD_GROUP';
  groupId: string;
  timestamp: number;
};

export type TabCollectionStateAddToHistoryEvent = {
  type: 'ADD_TO_HISTORY';
  stateContainer: StateContainer;
};

export type TabCollectionStatePruneHistoryEvent = {
  type: 'PRUNE_HISTORY';
  maxEntries: number;
};

export type TabCollectionStateDeleteHistoryEntryEvent = {
  type: 'DELETE_HISTORY_ENTRY';
  historyId: string;
};

export type TabCollectionStateCreateAddonEvent = {
  type: 'CREATE_ADDON';
  stateContainer: StateContainer;
};

export type TabCollectionStateRenameAddonEvent = {
  type: 'RENAME_ADDON';
  addonId: string;
  newName: string;
};

export type TabCollectionStateDeleteAddonEvent = {
  type: 'DELETE_ADDON';
  addonId: string;
};

export type TabCollectionStateSetQuickSlotEvent = {
  type: 'SET_QUICK_SLOT';
  slot: string;
  groupId: string;
};

export type TabCollectionStateClearQuickSlotEvent = {
  type: 'CLEAR_QUICK_SLOT';
  slot: string;
};

export type TabCollectionStateResetEvent = {
  type: 'RESET';
};

export type TabCollectionStateStoreEvents =
  | TabCollectionStateInitializeEvent
  | TabCollectionStateCreateGroupEvent
  | TabCollectionStateUpdateGroupEvent
  | TabCollectionStateRenameGroupEvent
  | TabCollectionStateDeleteGroupEvent
  | TabCollectionStateLoadGroupEvent
  | TabCollectionStateAddToHistoryEvent
  | TabCollectionStatePruneHistoryEvent
  | TabCollectionStateDeleteHistoryEntryEvent
  | TabCollectionStateCreateAddonEvent
  | TabCollectionStateRenameAddonEvent
  | TabCollectionStateDeleteAddonEvent
  | TabCollectionStateSetQuickSlotEvent
  | TabCollectionStateClearQuickSlotEvent
  | TabCollectionStateResetEvent;

export interface FileStoreContext {
  data: TabStateFileContent | null;
  isLoading: boolean;
}

export type FileStoreLoadStartEvent = {
  type: 'LOAD';
};

export type FileStoreLoadSuccessEvent = {
  type: 'DONE';
  data: TabStateFileContent;
  success: boolean;
};

export type FileStoreSaveEvent = {
  type: 'SAVE';
  data: TabStateFileContent;
};

export type FileStoreClearEvent = {
  type: 'CLEAR';
};

export type FileStoreResetEvent = {
  type: 'RESET';
};

export type FileStoreEvents =
  | FileStoreLoadStartEvent
  | FileStoreLoadSuccessEvent
  | FileStoreSaveEvent
  | FileStoreClearEvent
  | FileStoreResetEvent;

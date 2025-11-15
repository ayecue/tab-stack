import {
  QuickSlotAssignments,
  QuickSlotIndex,
  StateContainer,
  TabStateFileContent
} from './tab-manager';

// Tab State Store Context
export interface TabStateStoreContext {
  groups: Record<string, StateContainer>;
  history: Record<string, StateContainer>;
  addons: Record<string, StateContainer>;
  quickSlots: QuickSlotAssignments;
  currentStateContainer: StateContainer | null;
  previousStateContainer: StateContainer | null;
  isInitialized: boolean;
  isLoading: boolean;
  isLocked: boolean;
}

// File Store Context
export interface FileStoreContext {
  data: TabStateFileContent | null;
  isLoading: boolean;
}

// Tab State Store Event Types
export type TabStateInitializeEvent = {
  type: 'INITIALIZE';
  data: TabStateFileContent;
};

export type TabStateSyncEvent = {
  type: 'SYNC_STATE';
  stateContainer: StateContainer;
};

export type TabStateSetStateEvent = {
  type: 'SET_STATE';
  stateContainer: StateContainer;
};

export type TabStateForkStateEvent = {
  type: 'FORK_STATE';
};

export type TabStateCreateGroupEvent = {
  type: 'CREATE_GROUP';
  stateContainer: StateContainer;
};

export type TabStateRenameGroupEvent = {
  type: 'RENAME_GROUP';
  groupId: string;
  newName: string;
};

export type TabStateDeleteGroupEvent = {
  type: 'DELETE_GROUP';
  groupId: string;
};

export type TabStateLoadGroupEvent = {
  type: 'LOAD_GROUP';
  groupId: string;
  timestamp: number;
};

export type TabStateAddToHistoryEvent = {
  type: 'ADD_TO_HISTORY';
  stateContainer: StateContainer;
};

export type TabStateDeleteHistoryEntryEvent = {
  type: 'DELETE_HISTORY_ENTRY';
  historyId: string;
};

export type TabStateLoadHistoryStateEvent = {
  type: 'LOAD_HISTORY_STATE';
  historyId: string;
};

export type TabStatePruneHistoryEvent = {
  type: 'PRUNE_HISTORY';
  maxEntries: number;
};

export type TabStateCreateAddonEvent = {
  type: 'CREATE_ADDON';
  stateContainer: StateContainer;
};

export type TabStateRenameAddonEvent = {
  type: 'RENAME_ADDON';
  addonId: string;
  newName: string;
};

export type TabStateDeleteAddonEvent = {
  type: 'DELETE_ADDON';
  addonId: string;
};

export type TabStateSetQuickSlotEvent = {
  type: 'SET_QUICK_SLOT';
  slot: QuickSlotIndex;
  groupId: string | null;
};

export type TabStateClearQuickSlotEvent = {
  type: 'CLEAR_QUICK_SLOT';
  slot: QuickSlotIndex;
};

export type TabStateResetStateEvent = {
  type: 'RESET_STATE';
};

export type TabStateImportStateEvent = {
  type: 'IMPORT_STATE';
  data: TabStateFileContent;
};

export type TabStateLockEvent = {
  type: 'LOCK_STATE';
};

export type TabStateUnlockEvent = {
  type: 'UNLOCK_STATE';
};

// Tab State Store Events Union
export type TabStateStoreEvents =
  | TabStateInitializeEvent
  | TabStateSyncEvent
  | TabStateSetStateEvent
  | TabStateForkStateEvent
  | TabStateCreateGroupEvent
  | TabStateRenameGroupEvent
  | TabStateDeleteGroupEvent
  | TabStateLoadGroupEvent
  | TabStateAddToHistoryEvent
  | TabStateDeleteHistoryEntryEvent
  | TabStateLoadHistoryStateEvent
  | TabStatePruneHistoryEvent
  | TabStateCreateAddonEvent
  | TabStateRenameAddonEvent
  | TabStateDeleteAddonEvent
  | TabStateSetQuickSlotEvent
  | TabStateClearQuickSlotEvent
  | TabStateResetStateEvent
  | TabStateImportStateEvent
  | TabStateLockEvent
  | TabStateUnlockEvent;

// File Store Event Types
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

// File Store Events Union
export type FileStoreEvents =
  | FileStoreLoadStartEvent
  | FileStoreLoadSuccessEvent
  | FileStoreSaveEvent
  | FileStoreClearEvent
  | FileStoreResetEvent;

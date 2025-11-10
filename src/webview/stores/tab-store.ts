import { createStore } from '@xstate/store';

import { GitIntegrationConfig, StorageType } from '../../types/config';
import {
  ExtensionMessageType,
  ExtensionNotificationKind,
  ExtensionNotificationMessage,
  ExtensionTabsSyncMessage
} from '../../types/messages';
import { QuickSlotAssignments } from '../../types/tab-manager';
import { TabState as TabStatePayload } from '../../types/tabs';
import { VSCodeMessenger } from '../lib/vscode-messenger';

enum ConnectionStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Connecting = 'connecting'
}

export interface TabStoreContext {
  payload: TabStatePayload | null;
  loading: boolean;
  rendering: boolean;
  error: string | null;
  connectionStatus: ConnectionStatus;
  groups: Array<{
    groupId: string;
    name: string;
    tabCount: number;
    columnCount: number;
  }>;
  histories: Array<{
    historyId: string;
    name: string;
    tabCount: number;
    columnCount: number;
  }>;
  addons: Array<{
    addonId: string;
    name: string;
    tabCount: number;
    columnCount: number;
  }>;
  selectedGroup: string | null;
  quickSlots: QuickSlotAssignments;
  masterWorkspaceFolder: string | null;
  availableWorkspaceFolders: Array<{ name: string; path: string }>;
  gitIntegration: GitIntegrationConfig | undefined;
  historyMaxEntries: number | undefined;
  storageType: StorageType | undefined;
}

type SyncEvent = { type: 'sync'; data: ExtensionTabsSyncMessage };
type NotificationEvent = {
  type: 'notification';
  data: ExtensionNotificationMessage;
};
type RequestRefreshEvent = { type: 'requestRefresh' };
type ClearErrorEvent = { type: 'clearError' };

export type TabStoreEvents =
  | SyncEvent
  | NotificationEvent
  | RequestRefreshEvent
  | ClearErrorEvent;

export const createTabStore = () => {
  const store = createStore({
    context: {
      payload: null,
      loading: true,
      rendering: false,
      error: null,
      connectionStatus: ConnectionStatus.Connecting,
      groups: [],
      histories: [],
      addons: [],
      selectedGroup: null,
      quickSlots: {},
      masterWorkspaceFolder: null,
      availableWorkspaceFolders: [],
      gitIntegration: undefined,
      historyMaxEntries: undefined,
      storageType: undefined
    } as TabStoreContext,
    on: {
      sync: (context, event: SyncEvent) => ({
        ...context,
        payload: event.data.tabState,
        loading: false,
        rendering: event.data.rendering,
        error: null,
        connectionStatus: ConnectionStatus.Connected,
        groups: event.data.groups,
        histories: event.data.histories,
        addons: event.data.addons,
        selectedGroup: event.data.selectedGroup,
        quickSlots: event.data.quickSlots,
        masterWorkspaceFolder: event.data.masterWorkspaceFolder,
        availableWorkspaceFolders: event.data.availableWorkspaceFolders,
        gitIntegration: event.data.gitIntegration,
        historyMaxEntries: event.data.historyMaxEntries,
        storageType: event.data.storageType
      }),

      notification: (context, event: NotificationEvent) => {
        if (event.data.kind !== ExtensionNotificationKind.Error) {
          return context;
        }

        return {
          ...context,
          error: event.data.message,
          connectionStatus: ConnectionStatus.Connected
        };
      },

      requestRefresh: (context) => ({
        ...context,
        loading: true,
        error: null
      }),

      clearError: (context) => ({
        ...context,
        error: null
      })
    }
  });

  if (process.env.NODE_ENV === 'development') {
    store.inspect((inspectionEvent) => {
      console.log('[TabStore]', inspectionEvent);
    });
  }

  return store;
};

export type TabStore = ReturnType<typeof createTabStore>;

export const setupStoreMessengerSync = (
  store: TabStore,
  messenger: VSCodeMessenger
) => {
  // Listen to messenger events and update store
  messenger.on(ExtensionMessageType.Sync, (event: ExtensionTabsSyncMessage) => {
    store.send({ type: 'sync', data: event });
  });

  messenger.on(
    ExtensionMessageType.Notification,
    (event: ExtensionNotificationMessage) => {
      store.send({ type: 'notification', data: event });
    }
  );

  // Subscribe to store events and trigger messaging actions
  store.subscribe((snapshot) => {
    // Auto-clear error after 3 seconds
    if (snapshot.context.error) {
      setTimeout(() => {
        store.send({ type: 'clearError' });
      }, 3000);
    }
  });

  return () => {
    messenger.removeAllListeners(ExtensionMessageType.Sync);
    messenger.removeAllListeners(ExtensionMessageType.Notification);
  };
};

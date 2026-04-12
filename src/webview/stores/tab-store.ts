import { createStore } from '@xstate/store';

import { Layout } from '../../types/commands';
import {
  GitIntegrationConfig,
  StorageType,
  TabKindColors
} from '../../types/config';
import {
  AddonSummary,
  ExtensionCollectionsSyncMessage,
  ExtensionConfigSyncMessage,
  ExtensionMessageType,
  ExtensionNotificationKind,
  ExtensionNotificationMessage,
  ExtensionTabStateSyncMessage,
  GroupSummary,
  HistorySummary
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
  groups: GroupSummary[];
  histories: HistorySummary[];
  addons: AddonSummary[];
  selectedGroup: string | null;
  quickSlots: QuickSlotAssignments;
  masterWorkspaceFolder: string | null;
  availableWorkspaceFolders: Array<{ name: string; path: string }>;
  gitIntegration: GitIntegrationConfig | undefined;
  historyMaxEntries: number | undefined;
  storageType: StorageType | undefined;
  tabKindColors: TabKindColors;
}

type TabStateSyncEvent = {
  type: 'tabStateSync';
  data: ExtensionTabStateSyncMessage;
};
type CollectionsSyncEvent = {
  type: 'collectionsSync';
  data: ExtensionCollectionsSyncMessage;
};
type ConfigSyncEvent = { type: 'configSync'; data: ExtensionConfigSyncMessage };
type NotificationEvent = {
  type: 'notification';
  data: ExtensionNotificationMessage;
};
type RequestRefreshEvent = { type: 'requestRefresh' };
type ClearErrorEvent = { type: 'clearError' };

export type TabStoreEvents =
  | TabStateSyncEvent
  | CollectionsSyncEvent
  | ConfigSyncEvent
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
      storageType: undefined,
      tabKindColors: []
    } as TabStoreContext,
    on: {
      tabStateSync: (context, event: TabStateSyncEvent) => ({
        ...context,
        payload: event.data.tabState,
        loading: false,
        rendering: event.data.rendering,
        error: null,
        connectionStatus: ConnectionStatus.Connected,
        selectedGroup: event.data.selectedGroup
      }),

      collectionsSync: (context, event: CollectionsSyncEvent) => ({
        ...context,
        groups: event.data.groups,
        histories: event.data.histories,
        addons: event.data.addons,
        selectedGroup: event.data.selectedGroup,
        quickSlots: event.data.quickSlots,
        connectionStatus: ConnectionStatus.Connected
      }),

      configSync: (context, event: ConfigSyncEvent) => ({
        ...context,
        masterWorkspaceFolder: event.data.masterWorkspaceFolder,
        availableWorkspaceFolders: event.data.availableWorkspaceFolders,
        gitIntegration: event.data.gitIntegration,
        historyMaxEntries: event.data.historyMaxEntries,
        storageType: event.data.storageType,
        tabKindColors: event.data.tabKindColors ?? [],
        connectionStatus: ConnectionStatus.Connected
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
  messenger.on(
    ExtensionMessageType.TabStateSync,
    (event: ExtensionTabStateSyncMessage) => {
      store.send({ type: 'tabStateSync', data: event });
    }
  );

  messenger.on(
    ExtensionMessageType.CollectionsSync,
    (event: ExtensionCollectionsSyncMessage) => {
      store.send({ type: 'collectionsSync', data: event });
    }
  );

  messenger.on(
    ExtensionMessageType.ConfigSync,
    (event: ExtensionConfigSyncMessage) => {
      store.send({ type: 'configSync', data: event });
    }
  );

  messenger.on(
    ExtensionMessageType.Notification,
    (event: ExtensionNotificationMessage) => {
      store.send({ type: 'notification', data: event });
    }
  );

  // Subscribe to store events and trigger messaging actions
  let errorTimeoutId: ReturnType<typeof setTimeout> | null = null;
  const subscription = store.subscribe((snapshot) => {
    // Auto-clear error after 3 seconds
    if (snapshot.context.error) {
      if (errorTimeoutId) {
        clearTimeout(errorTimeoutId);
      }
      errorTimeoutId = setTimeout(() => {
        errorTimeoutId = null;
        store.send({ type: 'clearError' });
      }, 3000);
    }
  });

  return () => {
    if (errorTimeoutId) {
      clearTimeout(errorTimeoutId);
    }
    subscription.unsubscribe();
    messenger.removeAllListeners(ExtensionMessageType.TabStateSync);
    messenger.removeAllListeners(ExtensionMessageType.CollectionsSync);
    messenger.removeAllListeners(ExtensionMessageType.ConfigSync);
    messenger.removeAllListeners(ExtensionMessageType.Notification);
  };
};

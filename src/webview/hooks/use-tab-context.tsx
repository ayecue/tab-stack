import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore
} from 'react';

import { GitIntegrationConfig, StorageType } from '../../types/config';
import { QuickSlotAssignments } from '../../types/tab-manager';
import { TabState as TabStatePayload } from '../../types/tabs';
import {
  createTabMessagingService,
  TabMessagingService
} from '../lib/tab-messaging-service';
import { getDefaultMessenger, VSCodeMessenger } from '../lib/vscode-messenger';
import {
  createTabStore,
  setupStoreMessengerSync,
  TabStore
} from '../stores/tab-store';

enum ConnectionStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Connecting = 'connecting'
}

interface TabState {
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
  gitIntegration?: GitIntegrationConfig;
  historyMaxEntries?: number;
  storageType?: StorageType;
}

interface TabContextValue {
  state: TabState;
  messagingService: TabMessagingService;
  messenger: VSCodeMessenger;
  store: TabStore;
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;
}

export const TabProvider: React.FC<TabProviderProps> = ({ children }) => {
  const [messenger] = useState(() =>
    getDefaultMessenger({
      enableLogging: process.env.NODE_ENV === 'development'
    })
  );
  const [messagingService] = useState(() =>
    createTabMessagingService(messenger)
  );
  const [store] = useState(() => createTabStore());

  // Subscribe to store state using React's useSyncExternalStore
  const state = useSyncExternalStore(
    (callback) => store.subscribe(callback).unsubscribe,
    () => store.getSnapshot().context
  );

  useEffect(() => {
    // Set up sync between messenger and store
    const cleanup = setupStoreMessengerSync(store, messenger);

    // Request initial sync
    messagingService.refreshTabs();

    return cleanup;
  }, [store, messenger, messagingService]);

  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'r':
            event.preventDefault();
            store.send({ type: 'requestRefresh' });
            messagingService.refreshTabs();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [store, messagingService]);

  const contextValue: TabContextValue = {
    state,
    messagingService,
    messenger,
    store
  };

  return (
    <TabContext.Provider value={contextValue}>{children}</TabContext.Provider>
  );
};

export const useTabContext = (): TabContextValue => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};

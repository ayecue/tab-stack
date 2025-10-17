import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

import {
  ExtensionMessageType,
  ExtensionNotificationKind,
  ExtensionNotificationMessage,
  ExtensionTabsSyncMessage
} from '../../types/messages';
import { QuickSlotAssignments, QuickSlotIndex } from '../../types/tab-manager';
import { TabInfo, TabState as TabStatePayload } from '../../types/tabs';
import { createTabMessagingService } from '../lib/tab-messaging-service';
import { getDefaultMessenger, VSCodeMessenger } from '../lib/vscode-messenger';

enum ConnectionStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Connecting = 'connecting'
}

interface TabState {
  payload: TabStatePayload | null;
  loading: boolean;
  error: string | null;
  connectionStatus: ConnectionStatus;
  groupIds: string[];
  historyIds: string[];
  selectedGroup: string | null;
  quickSlots: QuickSlotAssignments;
}

interface TabContextValue {
  state: TabState;
  actions: {
    requestRefresh: () => Promise<void>;
    openTab: (index: number, tab: TabInfo) => Promise<void>;
    closeTab: (index: number, tab: TabInfo) => Promise<void>;
    togglePin: (index: number, tab: TabInfo) => Promise<void>;
    saveGroup: (groupId: string) => Promise<void>;
    switchGroup: (groupId: string | null) => Promise<void>;
    clearSelection: () => Promise<void>;
    captureHistory: () => Promise<void>;
    recoverHistory: (historyId: string) => Promise<void>;
    deleteGroup: (groupId: string) => Promise<void>;
    deleteHistory: (historyId: string) => Promise<void>;
    assignQuickSlot: (slot: QuickSlotIndex, groupId: string) => Promise<void>;
    clearQuickSlot: (slot: QuickSlotIndex) => Promise<void>;
  };
  messenger: VSCodeMessenger;
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;
}

export const TabProvider: React.FC<TabProviderProps> = ({ children }) => {
  const [state, setState] = useState<TabState>({
    payload: null,
    loading: true,
    error: null,
    connectionStatus: ConnectionStatus.Connecting,
    groupIds: [],
    historyIds: [],
    selectedGroup: null,
    quickSlots: {}
  });

  const [messenger] = useState(() =>
    getDefaultMessenger({
      enableLogging: process.env.NODE_ENV === 'development'
    })
  );
  const messagingService = createTabMessagingService(messenger);

  useEffect(() => {
    messenger.on(
      ExtensionMessageType.Sync,
      (event: ExtensionTabsSyncMessage) => {
        setState((prev) => ({
          ...prev,
          payload: event.tabState,
          loading: false,
          error: null,
          connectionStatus: ConnectionStatus.Connected,
          groupIds: event.groups,
          historyIds: event.history,
          selectedGroup: event.selectedGroup,
          quickSlots: event.quickSlots
        }));
      }
    );

    messenger.on(
      ExtensionMessageType.Notification,
      (event: ExtensionNotificationMessage) => {
        if (event.kind !== ExtensionNotificationKind.Error) {
          return;
        }

        setState((prev) => ({
          ...prev,
          error: event.message,
          connectionStatus: ConnectionStatus.Connected
        }));

        setTimeout(() => {
          setState((prev) => ({ ...prev, error: null }));
        }, 3000);
      }
    );

    return () => {
      messenger.removeAllListeners(ExtensionMessageType.Sync);
      messenger.removeAllListeners(ExtensionMessageType.Notification);
    };
  }, [messenger]);

  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'r':
            event.preventDefault();
            actions.requestRefresh().catch(console.error);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  // Helper function to handle errors
  const handleError = useCallback((error: any, operation: string) => {
    const errorMessage =
      error instanceof Error ? error.message : `Failed to ${operation}`;
    setState((prev) => ({ ...prev, error: errorMessage }));

    // Clear error after 3 seconds
    setTimeout(() => {
      setState((prev) => ({ ...prev, error: null }));
    }, 3000);
  }, []);

  // Action handlers using the messenger - now sending events instead of requests
  const actions = {
    requestRefresh: useCallback(async (): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        messagingService.refreshTabs();
      } catch (error) {
        handleError(error, 'sync tabs');
        throw error;
      }
    }, [messagingService, handleError]),

    openTab: useCallback(
      async (index: number, tab: TabInfo): Promise<void> => {
        try {
          messagingService.openTab(index, tab.viewColumn);
        } catch (error) {
          handleError(error, 'open tab');
          throw error;
        }
      },
      [messagingService, handleError, state.payload]
    ),

    closeTab: useCallback(
      async (index: number, tab: TabInfo): Promise<void> => {
        try {
          messagingService.closeTab(index, tab.viewColumn);
        } catch (error) {
          handleError(error, 'close tab');
          throw error;
        }
      },
      [messagingService, handleError, state.payload]
    ),

    togglePin: useCallback(
      async (index: number, tab: TabInfo): Promise<void> => {
        try {
          messagingService.toggleTabPin(index, tab.viewColumn);
        } catch (error) {
          handleError(error, 'toggle pin');
          throw error;
        }
      },
      [messagingService, handleError, state.payload]
    ),

    saveGroup: useCallback(
      async (groupId: string): Promise<void> => {
        try {
          messagingService.createGroup(groupId);
        } catch (error) {
          handleError(error, 'create group');
          throw error;
        }
      },
      [messagingService, handleError]
    ),

    switchGroup: useCallback(
      async (groupId: string | null): Promise<void> => {
        try {
          messagingService.switchToGroup(groupId);
        } catch (error) {
          handleError(error, 'switch group');
          throw error;
        }
      },
      [messagingService, handleError]
    ),

    clearSelection: useCallback(async (): Promise<void> => {
      try {
        messagingService.switchToGroup(null);
      } catch (error) {
        handleError(error, 'clear group selection');
        throw error;
      }
    }, [messagingService, handleError]),

    captureHistory: useCallback(async (): Promise<void> => {
      try {
        messagingService.addToHistory();
      } catch (error) {
        handleError(error, 'capture history');
        throw error;
      }
    }, [messagingService, handleError]),

    recoverHistory: useCallback(
      async (historyId: string): Promise<void> => {
        try {
          messagingService.recoverState(historyId);
        } catch (error) {
          handleError(error, 'recover state');
          throw error;
        }
      },
      [messagingService, handleError]
    ),

    deleteGroup: useCallback(
      async (groupId: string): Promise<void> => {
        try {
          messagingService.deleteGroup(groupId);
        } catch (error) {
          handleError(error, 'delete group');
          throw error;
        }
      },
      [messagingService, handleError]
    ),

    deleteHistory: useCallback(
      async (historyId: string): Promise<void> => {
        try {
          messagingService.deleteHistory(historyId);
        } catch (error) {
          handleError(error, 'delete history');
          throw error;
        }
      },
      [messagingService, handleError]
    ),

    assignQuickSlot: useCallback(
      async (slot: QuickSlotIndex, groupId: string): Promise<void> => {
        try {
          messagingService.assignQuickSlot(slot, groupId);
        } catch (error) {
          handleError(error, 'assign quick slot');
          throw error;
        }
      },
      [messagingService, handleError]
    ),

    clearQuickSlot: useCallback(
      async (slot: QuickSlotIndex): Promise<void> => {
        try {
          messagingService.assignQuickSlot(slot, null);
        } catch (error) {
          handleError(error, 'clear quick slot');
          throw error;
        }
      },
      [messagingService, handleError]
    )
  };

  const contextValue: TabContextValue = {
    state,
    actions,
    messenger
  };

  useEffect(() => {
    actions.requestRefresh().catch(console.error);
  }, []); // Initial load

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

import { createStore, Store } from '@xstate/store';
import { excludeKeys } from 'filter-obj';
import { nanoid } from 'nanoid';

import {
  TabStateAddToHistoryEvent,
  TabStateClearQuickSlotEvent,
  TabStateCreateAddonEvent,
  TabStateCreateGroupEvent,
  TabStateDeleteAddonEvent,
  TabStateDeleteGroupEvent,
  TabStateDeleteHistoryEntryEvent,
  TabStateImportStateEvent,
  TabStateInitializeEvent,
  TabStateLoadGroupEvent,
  TabStateLoadHistoryStateEvent,
  TabStatePruneHistoryEvent,
  TabStateRenameAddonEvent,
  TabStateRenameGroupEvent,
  TabStateSetQuickSlotEvent,
  TabStateSetStateEvent,
  TabStateStoreContext,
  TabStateStoreEvents,
  TabStateSyncEvent
} from '../types/store';
import { createEmptyStateContainer } from '../types/tab-manager';

// Initial state
export const createInitialTabStateContext = (): TabStateStoreContext => ({
  groups: {},
  history: {},
  addons: {},
  quickSlots: {},
  currentStateContainer: null,
  previousStateContainer: null,
  isInitialized: false,
  isLoading: false
});

// Create the store
export const createTabStateStore = (): Store<
  TabStateStoreContext,
  TabStateStoreEvents,
  any
> => {
  return createStore({
    context: createInitialTabStateContext(),
    on: {
      /**
       * State Management Events
       */
      INITIALIZE: (
        context: TabStateStoreContext,
        event: TabStateInitializeEvent
      ) => {
        const currentStateContainer =
          event.data.selectedGroup in event.data.groups
            ? event.data.groups[event.data.selectedGroup]
            : null;
        const previousStateContainer =
          event.data.previousSelectedGroup in event.data.groups
            ? event.data.groups[event.data.previousSelectedGroup]
            : null;

        return {
          ...context,
          groups: event.data.groups,
          history: event.data.history,
          addons: event.data.addons,
          quickSlots: event.data.quickSlots,
          currentStateContainer,
          previousStateContainer,
          isInitialized: true,
          isLoading: false
        };
      },

      SYNC_STATE: (context: TabStateStoreContext, event: TabStateSyncEvent) => {
        const currentStateContainer = event.stateContainer;
        const changes: Partial<TabStateStoreContext> = {
          currentStateContainer
        };

        if (currentStateContainer.id in context.groups) {
          changes.groups = {
            ...context.groups,
            [currentStateContainer.id]: currentStateContainer
          };
        }

        return {
          ...context,
          ...changes
        };
      },

      SET_STATE: (
        context: TabStateStoreContext,
        event: TabStateSetStateEvent
      ) => {
        const currentStateContainer = event.stateContainer;
        const changes: Partial<TabStateStoreContext> = {
          currentStateContainer,
          previousStateContainer: context.currentStateContainer
        };

        if (currentStateContainer.id in context.groups) {
          changes.groups = {
            ...context.groups,
            [currentStateContainer.id]: currentStateContainer
          };
        }

        return {
          ...context,
          ...changes
        };
      },

      FORK_STATE: (context: TabStateStoreContext) => {
        const newStateContainer =
          context.currentStateContainer ?? createEmptyStateContainer();

        return {
          ...context,
          previousStateContainer: context.currentStateContainer,
          currentStateContainer: {
            ...newStateContainer,
            id: nanoid(),
            name: 'untitled',
            lastSelectedAt: Date.now()
          }
        };
      },

      RESET_STATE: () => createInitialTabStateContext(),

      IMPORT_STATE: (
        context: TabStateStoreContext,
        event: TabStateImportStateEvent
      ) => {
        const currentStateContainer =
          event.data.selectedGroup in event.data.groups
            ? event.data.groups[event.data.selectedGroup]
            : null;
        const previousStateContainer =
          event.data.previousSelectedGroup in event.data.groups
            ? event.data.groups[event.data.previousSelectedGroup]
            : null;

        return {
          ...context,
          groups: event.data.groups,
          history: event.data.history,
          addons: event.data.addons,
          quickSlots: event.data.quickSlots,
          currentStateContainer,
          previousStateContainer
        };
      },

      /**
       * Group Events
       */
      CREATE_GROUP: (
        context: TabStateStoreContext,
        event: TabStateCreateGroupEvent
      ) => {
        const newStateContainer = event.stateContainer;

        return {
          ...context,
          groups: {
            ...context.groups,
            [newStateContainer.id]: newStateContainer
          },
          previousStateContainer: context.currentStateContainer,
          currentStateContainer: newStateContainer
        };
      },

      RENAME_GROUP: (
        context: TabStateStoreContext,
        event: TabStateRenameGroupEvent
      ) => {
        const group = context.groups[event.groupId];

        if (!group) {
          return context;
        }

        const newGroup = {
          ...group,
          name: event.newName
        };
        const changes: Partial<TabStateStoreContext> = {
          groups: {
            ...context.groups,
            [event.groupId]: newGroup
          }
        };

        if (context.currentStateContainer.id === newGroup.id) {
          changes.currentStateContainer = newGroup;
        }

        return {
          ...context,
          ...changes
        };
      },

      DELETE_GROUP: (
        context: TabStateStoreContext,
        event: TabStateDeleteGroupEvent
      ) => {
        const group = context.groups[event.groupId];

        if (!group) {
          return context;
        }

        const existingSlotIndexes = Object.keys(context.quickSlots).filter(
          (index) => context.quickSlots[index] === event.groupId
        );
        const changes: Partial<TabStateStoreContext> = {
          currentStateContainer:
            context.currentStateContainer?.id === event.groupId
              ? null
              : context.currentStateContainer,
          groups: excludeKeys(context.groups, [event.groupId]),
          quickSlots: excludeKeys(context.quickSlots, existingSlotIndexes)
        };

        return {
          ...context,
          ...changes
        };
      },

      LOAD_GROUP: (
        context: TabStateStoreContext,
        event: TabStateLoadGroupEvent
      ) => {
        const group = context.groups[event.groupId];

        if (!group) {
          return context;
        }

        const selectedGroup = {
          ...group,
          lastSelectedAt: event.timestamp
        };

        return {
          ...context,
          groups: {
            ...context.groups,
            [event.groupId]: selectedGroup
          },
          previousStateContainer: context.currentStateContainer,
          currentStateContainer: selectedGroup
        };
      },

      /**
       * History Events
       */
      ADD_TO_HISTORY: (
        context: TabStateStoreContext,
        event: TabStateAddToHistoryEvent
      ) => {
        const newStateContainer = event.stateContainer;

        return {
          ...context,
          history: {
            ...context.history,
            [newStateContainer.id]: newStateContainer
          }
        };
      },

      DELETE_HISTORY_ENTRY: (
        context: TabStateStoreContext,
        event: TabStateDeleteHistoryEntryEvent
      ) => {
        const historyEntry = context.history[event.historyId];

        if (!historyEntry) {
          return context;
        }

        return {
          ...context,
          history: excludeKeys(context.history, [event.historyId])
        };
      },

      LOAD_HISTORY_STATE: (
        context: TabStateStoreContext,
        event: TabStateLoadHistoryStateEvent
      ) => {
        const historyEntry = context.history[event.historyId];

        if (!historyEntry) {
          return context;
        }

        const newStateContainer = { ...historyEntry };

        return {
          ...context,
          currentStateContainer: newStateContainer
        };
      },

      PRUNE_HISTORY: (
        context: TabStateStoreContext,
        event: TabStatePruneHistoryEvent
      ) => {
        const entries = Object.values(context.history);

        if (entries.length <= event.maxEntries) {
          return context;
        }

        const keyToExclude = entries
          .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
          .slice(0, entries.length - event.maxEntries)
          .map((it) => it.id);

        return {
          ...context,
          history: excludeKeys(context.history, keyToExclude)
        };
      },

      /**
       * Addon Events
       */
      CREATE_ADDON: (
        context: TabStateStoreContext,
        event: TabStateCreateAddonEvent
      ) => {
        const newStateContainer = event.stateContainer;

        return {
          ...context,
          addons: {
            ...context.addons,
            [newStateContainer.id]: newStateContainer
          }
        };
      },

      RENAME_ADDON: (
        context: TabStateStoreContext,
        event: TabStateRenameAddonEvent
      ) => {
        const addon = context.addons[event.addonId];

        if (!addon) {
          return context;
        }

        const newAddon = {
          ...addon,
          name: event.newName
        };

        return {
          ...context,
          addons: {
            ...context.addons,
            [newAddon.id]: newAddon
          }
        };
      },

      DELETE_ADDON: (
        context: TabStateStoreContext,
        event: TabStateDeleteAddonEvent
      ) => {
        const addon = context.addons[event.addonId];

        if (!addon) {
          return context;
        }

        return {
          ...context,
          addons: excludeKeys(context.addons, [event.addonId])
        };
      },

      /**
       * Quick Slot Events
       */
      SET_QUICK_SLOT: (
        context: TabStateStoreContext,
        event: TabStateSetQuickSlotEvent
      ) => {
        const existingIndexes = Object.keys(context.quickSlots).filter(
          (index) => context.quickSlots[index] === event.groupId
        );
        const quickSlots = excludeKeys(context.quickSlots, existingIndexes);

        return {
          ...context,
          quickSlots: {
            ...quickSlots,
            [event.slot]: event.groupId
          }
        };
      },

      CLEAR_QUICK_SLOT: (
        context: TabStateStoreContext,
        event: TabStateClearQuickSlotEvent
      ) => {
        return {
          ...context,
          quickSlots: excludeKeys(context.quickSlots, [event.slot])
        };
      }
    }
  });
};

// Type for the store instance
export type TabStateStore = ReturnType<typeof createTabStateStore>;

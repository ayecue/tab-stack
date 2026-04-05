import { createStore, Store } from '@xstate/store';
import { excludeKeys } from 'filter-obj';

import { getLogger, inspectStore } from '../services/logger';
import {
  TabCollectionStateAddToHistoryEvent,
  TabCollectionStateClearQuickSlotEvent,
  TabCollectionStateCreateAddonEvent,
  TabCollectionStateCreateGroupEvent,
  TabCollectionStateDeleteAddonEvent,
  TabCollectionStateDeleteGroupEvent,
  TabCollectionStateDeleteHistoryEntryEvent,
  TabCollectionStateInitializeEvent,
  TabCollectionStateLoadGroupEvent,
  TabCollectionStatePruneHistoryEvent,
  TabCollectionStateRenameAddonEvent,
  TabCollectionStateRenameGroupEvent,
  TabCollectionStateSetQuickSlotEvent,
  TabCollectionStateStoreContext,
  TabCollectionStateStoreEvents,
  TabCollectionStateUpdateGroupEvent
} from '../types/store';
import { StateContainer } from '../types/tab-manager';

export type TabCollectionStateStore = Store<
  TabCollectionStateStoreContext,
  TabCollectionStateStoreEvents,
  any
>;

export const createInitialTabCollectionStateContext =
  (): TabCollectionStateStoreContext => ({
    groups: {},
    history: {},
    addons: {},
    quickSlots: {}
  });

export const createTabCollectionStateStore = (): TabCollectionStateStore => {
  const log = getLogger().child('TabCollectionState');
  const store = createStore({
    context: createInitialTabCollectionStateContext(),
    on: {
      INITIALIZE: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStateInitializeEvent
      ) => {
        return {
          ...context,
          ...event.data
        };
      },
      CREATE_GROUP: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStateCreateGroupEvent
      ) => {
        return {
          ...context,
          groups: {
            ...context.groups,
            [event.stateContainer.id]: event.stateContainer
          }
        };
      },
      UPDATE_GROUP: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStateUpdateGroupEvent
      ) => {
        if (!(event.groupId in context.groups)) {
          return context;
        }
        return {
          ...context,
          groups: {
            ...context.groups,
            [event.groupId]: event.stateContainer
          }
        };
      },
      RENAME_GROUP: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStateRenameGroupEvent
      ) => {
        const group = context.groups[event.groupId];
        if (!group) return context;
        return {
          ...context,
          groups: {
            ...context.groups,
            [event.groupId]: {
              ...group,
              name: event.newName
            }
          }
        };
      },
      DELETE_GROUP: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStateDeleteGroupEvent
      ) => {
        return {
          ...context,
          groups: excludeKeys(context.groups, [event.groupId]),
          quickSlots: Object.fromEntries(
            Object.entries(context.quickSlots).filter(
              ([_, value]) => value !== event.groupId
            )
          )
        };
      },
      LOAD_GROUP: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStateLoadGroupEvent
      ) => {
        const group = context.groups[event.groupId];
        if (!group) return context;
        return {
          ...context,
          groups: {
            ...context.groups,
            [event.groupId]: {
              ...group,
              lastSelectedAt: event.timestamp
            }
          }
        };
      },
      ADD_TO_HISTORY: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStateAddToHistoryEvent
      ) => {
        return {
          ...context,
          history: {
            ...context.history,
            [event.stateContainer.id]: event.stateContainer
          }
        };
      },
      PRUNE_HISTORY: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStatePruneHistoryEvent
      ) => {
        const historyEntries = Object.values(context.history);
        if (historyEntries.length <= event.maxEntries) {
          return context;
        }
        const sortedEntries = historyEntries.sort(
          (a, b) => a.createdAt - b.createdAt
        );
        const entriesToRemove = sortedEntries.slice(
          0,
          historyEntries.length - event.maxEntries
        );
        const newHistory = excludeKeys(
          context.history,
          entriesToRemove.map((e) => e.id)
        );
        return {
          ...context,
          history: newHistory
        };
      },
      DELETE_HISTORY_ENTRY: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStateDeleteHistoryEntryEvent
      ) => {
        return {
          ...context,
          history: excludeKeys(context.history, [event.historyId])
        };
      },
      CREATE_ADDON: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStateCreateAddonEvent
      ) => {
        return {
          ...context,
          addons: {
            ...context.addons,
            [event.stateContainer.id]: event.stateContainer
          }
        };
      },
      RENAME_ADDON: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStateRenameAddonEvent
      ) => {
        const addon = context.addons[event.addonId];
        if (!addon) return context;
        return {
          ...context,
          addons: {
            ...context.addons,
            [event.addonId]: {
              ...addon,
              name: event.newName
            }
          }
        };
      },
      DELETE_ADDON: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStateDeleteAddonEvent
      ) => {
        return {
          ...context,
          addons: excludeKeys(context.addons, [event.addonId])
        };
      },
      SET_QUICK_SLOT: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStateSetQuickSlotEvent
      ) => {
        return {
          ...context,
          quickSlots: {
            ...context.quickSlots,
            [event.slot]: event.groupId
          }
        };
      },
      CLEAR_QUICK_SLOT: (
        context: TabCollectionStateStoreContext,
        event: TabCollectionStateClearQuickSlotEvent
      ) => {
        return {
          ...context,
          quickSlots: excludeKeys(context.quickSlots, [event.slot])
        };
      },
      RESET: () => {
        return createInitialTabCollectionStateContext();
      }
    }
  });

  inspectStore(store, log);

  store.subscribe((snapshot) => {
    const { groups, history, addons, quickSlots } = snapshot.context;
    log.debug(
      `<< state updated — ${Object.keys(groups).length} group(s), ` +
      `${Object.keys(history).length} history, ` +
      `${Object.keys(addons).length} addon(s), ` +
      `${Object.keys(quickSlots).length} quick slot(s)`
    );
  });

  return store;
};

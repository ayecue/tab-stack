import { createStore, Store } from '@xstate/store';
import { excludeKeys } from 'filter-obj';

import { getLogger, inspectStore } from '../services/logger';
import {
  TabActiveStateAddTabEvent,
  TabActiveStateRemoveTabEvent,
  TabActiveStateSetTabsEvent,
  TabActiveStateStoreContext,
  TabActiveStateStoreEvents,
  TabActiveStateUpdateTabEvent
} from '../types/store';
import { TabInfo } from '../types/tabs';

export type TabActiveStateStore = Store<
  TabActiveStateStoreContext,
  TabActiveStateStoreEvents,
  any
>;

export const createInitialTabActiveStateContext =
  (): TabActiveStateStoreContext => ({
    tabs: {},
    isLocked: false
  });

export const createTabActiveStateStore = (): TabActiveStateStore => {
  const log = getLogger().child('TabActiveState');
  const store = createStore({
    context: createInitialTabActiveStateContext(),
    on: {
      SET_TABS: (
        context: TabActiveStateStoreContext,
        event: TabActiveStateSetTabsEvent
      ) => {
        return {
          ...context,
          tabs: event.tabs
        };
      },
      ADD_TAB: (
        context: TabActiveStateStoreContext,
        event: TabActiveStateAddTabEvent
      ) => {
        if (context.isLocked) return context;
        return {
          ...context,
          tabs: {
            ...context.tabs,
            [event.payload.id]: event.payload
          }
        };
      },
      UPDATE_TAB: (
        context: TabActiveStateStoreContext,
        event: TabActiveStateUpdateTabEvent
      ) => {
        if (context.isLocked) return context;
        return {
          ...context,
          tabs: {
            ...context.tabs,
            [event.payload.id]: event.payload
          }
        };
      },
      LOCK_STATE: (context: TabActiveStateStoreContext) => {
        return {
          ...context,
          isLocked: true
        };
      },
      UNLOCK_STATE: (context: TabActiveStateStoreContext) => {
        return {
          ...context,
          isLocked: false
        };
      },
      REMOVE_TAB: (
        context: TabActiveStateStoreContext,
        event: TabActiveStateRemoveTabEvent
      ) => {
        if (context.isLocked) return context;
        return {
          ...context,
          tabs: excludeKeys(context.tabs, [event.payload])
        };
      },
      RESET: () => {
        return createInitialTabActiveStateContext();
      }
    }
  });

  inspectStore(store, log);

  store.subscribe((snapshot) => {
    const tabCount = Object.keys(snapshot.context.tabs).length;
    log.debug(`<< state updated — ${tabCount} tab(s), locked=${snapshot.context.isLocked}`);
  });

  return store;
};

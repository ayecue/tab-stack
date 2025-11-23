import { createStore, Store } from '@xstate/store';
import { nanoid } from 'nanoid';

import { getLogger, inspectStore } from '../services/logger';
import {
  TabStateContainerInitializeEvent,
  TabStateContainerSetStateEvent,
  TabStateContainerStoreContext,
  TabStateContainerStoreEvents,
  TabStateContainerSyncStateEvent
} from '../types/store';
import { createEmptyStateContainer } from '../types/tab-manager';

export type TabStateContainerStore = Store<
  TabStateContainerStoreContext,
  TabStateContainerStoreEvents,
  any
>;

export const createInitialTabStateContainerContext =
  (): TabStateContainerStoreContext => ({
    currentStateContainer: null,
    previousStateContainer: null,
    isLocked: false
  });

export const createTabStateContainerStore = (): TabStateContainerStore => {
  const log = getLogger().child('TabStateContainer');
  const store = createStore({
    context: createInitialTabStateContainerContext(),
    on: {
      INITIALIZE: (
        context: TabStateContainerStoreContext,
        event: TabStateContainerInitializeEvent
      ) => {
        return {
          ...context,
          currentStateContainer: event.stateContainer,
          previousStateContainer: event.previousStateContainer || null
        };
      },
      SET_STATE: (
        context: TabStateContainerStoreContext,
        event: TabStateContainerSetStateEvent
      ) => {
        return {
          ...context,
          previousStateContainer: context.currentStateContainer,
          currentStateContainer: event.stateContainer
        };
      },
      SYNC_STATE: (
        context: TabStateContainerStoreContext,
        event: TabStateContainerSyncStateEvent
      ) => {
        if (context.isLocked) return context;
        return {
          ...context,
          currentStateContainer: event.stateContainer
        };
      },
      FORK_STATE: (context: TabStateContainerStoreContext) => {
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
      LOCK_STATE: (context: TabStateContainerStoreContext) => {
        return { ...context, isLocked: true };
      },
      UNLOCK_STATE: (context: TabStateContainerStoreContext) => {
        return { ...context, isLocked: false };
      },
      RESET: () => {
        return createInitialTabStateContainerContext();
      }
    }
  });

  inspectStore(store, log);

  store.subscribe((snapshot) => {
    const { currentStateContainer, previousStateContainer, isLocked } = snapshot.context;
    log.debug(
      `<< state updated — current=${currentStateContainer?.name ?? 'none'} (${currentStateContainer?.id ?? '-'}), ` +
      `previous=${previousStateContainer?.name ?? 'none'}, locked=${isLocked}`
    );
  });

  return store;
};

import { createStore, Store } from '@xstate/store';

import { getLogger, inspectStore } from '../services/logger';
import { PersistenceHandler } from '../types/persistence';
import {
  FileStoreContext,
  FileStoreEvents,
  FileStoreLoadSuccessEvent,
  FileStoreSaveEvent
} from '../types/store';
import {
  createDefaultTabStateFileContent,
  TabStateFileContent
} from '../types/tab-manager';

export type PersistenceStore = ReturnType<typeof createPersistenceStore>;

export function createPersistenceStore(
  handler: PersistenceHandler
): Store<FileStoreContext, FileStoreEvents, any> {
  const log = getLogger().child('Persistence');
  const store = createStore({
    context: {
      data: createDefaultTabStateFileContent(),
      isLoading: false,
      location: null,
      storageType: null
    } as FileStoreContext,
    emits: {
      persist: async (payload: { data: TabStateFileContent }) => {
        await handler.write(payload.data);
      }
    },
    on: {
      LOAD: (context: FileStoreContext) => ({
        ...context,
        isLoading: true
      }),
      DONE: (context: FileStoreContext, event: FileStoreLoadSuccessEvent) => {
        return {
          ...context,
          data: event.data,
          isLoading: false
        };
      },
      SAVE: (context: FileStoreContext, event: FileStoreSaveEvent, enqueue) => {
        enqueue.emit.persist({ data: event.data });
        return {
          ...context,
          data: event.data
        };
      },
      CLEAR: (context: FileStoreContext) => {
        return {
          ...context,
          data: createDefaultTabStateFileContent()
        };
      },
      RESET: () => ({
        data: createDefaultTabStateFileContent(),
        isLoading: false
      })
    }
  });

  inspectStore(store, log);

  store.subscribe((snapshot) => {
    log.debug(
      `<< state updated — loading=${snapshot.context.isLoading}, ` +
        `version=${snapshot.context.data?.version ?? 'unknown'}`
    );
  });

  return store;
}

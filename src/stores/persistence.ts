import { createStore, Store } from '@xstate/store';

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
  return createStore({
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
}

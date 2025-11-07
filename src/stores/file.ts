import { createStore, Store } from '@xstate/store';
import { Uri, workspace } from 'vscode';

import { ConfigService } from '../services/config';
import { transform as migrate } from '../transformers/migration';
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

export type StorageStore = ReturnType<typeof createFileStore>;

export function createFileStore(): Store<
  FileStoreContext,
  FileStoreEvents,
  any
> {
  return createStore({
    context: {
      data: createDefaultTabStateFileContent(),
      isLoading: false,
      isPending: false,
      location: null,
      storageType: null
    } as FileStoreContext,
    emits: {
      persist: (payload: { location: string; data: TabStateFileContent }) => {
        void save(payload.location, payload.data);
      }
    },
    on: {
      LOAD_START: (context: FileStoreContext) => ({
        ...context,
        isLoading: true,
        isPending: true
      }),
      LOAD_SUCCESS: (
        context: FileStoreContext,
        event: FileStoreLoadSuccessEvent
      ) => {
        return {
          ...context,
          data: event.data,
          location: event.location,
          storageType: event.storageType,
          isLoading: false,
          isPending: false
        };
      },
      LOAD_ERROR: (context) => ({
        ...context,
        isLoading: false,
        isPending: false
      }),
      SAVE: (context: FileStoreContext, event: FileStoreSaveEvent, enqueue) => {
        enqueue.emit.persist({ location: context.location!, data: event.data });
        return {
          ...context,
          data: event.data
        };
      },
      CLEAR: (context: FileStoreContext) => {
        return {
          ...context,
          data: createDefaultTabStateFileContent(),
          location: null
        };
      },
      RESET: () => ({
        data: createDefaultTabStateFileContent(),
        location: null,
        isLoading: false,
        isPending: false,
        storageType: null
      })
    }
  });
}

// Helper to load storage file
export async function load(
  store: StorageStore,
  configService: ConfigService
): Promise<void> {
  const snapshot = store.getSnapshot();

  if (snapshot.context.isPending) {
    return new Promise((resolve) => {
      const unsubscribe = store.subscribe((state) => {
        if (!state.context.isPending) {
          unsubscribe.unsubscribe();
          resolve();
        }
      });
    });
  }

  store.send({ type: 'LOAD_START' });

  try {
    const masterFolderPath = configService.getMasterWorkspaceFolder();
    const workspaceUri = Uri.parse(masterFolderPath);

    if (!workspaceUri) {
      console.warn('No workspace folder found, cannot load or save state.');

      store.send({
        type: 'LOAD_SUCCESS',
        data: createDefaultTabStateFileContent(),
        location: null,
        storageType: 'in-memory'
      });

      return;
    }

    const vscodeDir = Uri.joinPath(workspaceUri, '.vscode');
    console.log('Loading state file from workspace:', vscodeDir?.fsPath);
    await workspace.fs.createDirectory(vscodeDir);

    const filePath = Uri.joinPath(vscodeDir, 'tmstate.json');
    const fileContent = await workspace.fs.readFile(filePath);
    const data = migrate(JSON.parse(await workspace.decode(fileContent)));

    store.send({
      type: 'LOAD_SUCCESS',
      data,
      location: filePath.fsPath,
      storageType: 'persistent'
    });
  } catch (error) {
    console.error('Failed to load storage file:', error);
    store.send({ type: 'LOAD_ERROR' });
  }
}

export async function save(
  location: string,
  data: TabStateFileContent
): Promise<void> {
  try {
    const fileContent = await workspace.encode(JSON.stringify(data));
    await workspace.fs.writeFile(Uri.file(location), fileContent);
  } catch (error) {
    console.error('Failed to save storage file:', error);
  }
}

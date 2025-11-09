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
      location: null,
      storageType: null
    } as FileStoreContext,
    emits: {
      persist: async (payload: {
        location: string;
        data: TabStateFileContent;
      }) => {
        try {
          await saveFile(payload.location, payload.data);
        } catch (error) {
          console.error('Failed to save storage file:', error);
        }
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
          location: event.location,
          storageType: event.storageType,
          isLoading: false
        };
      },
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

  if (snapshot.context.isLoading) {
    return new Promise((resolve) => {
      const unsubscribe = store.subscribe((state) => {
        if (!state.context.isLoading) {
          unsubscribe.unsubscribe();
          resolve();
        }
      });
    });
  }

  store.send({ type: 'LOAD' });

  const masterFolderPath = configService.getMasterWorkspaceFolder();
  const workspaceUri = Uri.parse(masterFolderPath);

  if (!workspaceUri) {
    console.warn('No workspace folder found, cannot load or save state.');

    store.send({
      type: 'DONE',
      data: createDefaultTabStateFileContent(),
      location: null,
      storageType: 'in-memory',
      success: true
    });

    return;
  }

  const vscodeDir = Uri.joinPath(workspaceUri, '.vscode');
  const filePath = Uri.joinPath(vscodeDir, 'tmstate.json');

  try {
    await workspace.fs.createDirectory(vscodeDir);
    const data = await loadFile(filePath.fsPath);

    store.send({
      type: 'DONE',
      data,
      location: filePath.fsPath,
      storageType: 'persistent',
      success: true
    });
  } catch (error) {
    console.error('Failed to load storage file:', error);
    store.send({
      type: 'DONE',
      data: createDefaultTabStateFileContent(),
      location: filePath.fsPath,
      storageType: 'persistent',
      success: false
    });
  }
}

async function loadFile(location: string): Promise<TabStateFileContent | null> {
  const fileContent = await workspace.fs.readFile(Uri.file(location));
  const data = migrate(JSON.parse(await workspace.decode(fileContent)));
  return data;
}

async function saveFile(
  location: string,
  data: TabStateFileContent
): Promise<void> {
  const fileContent = await workspace.encode(JSON.stringify(data));
  await workspace.fs.writeFile(Uri.file(location), fileContent);
}

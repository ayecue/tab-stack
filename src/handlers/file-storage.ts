import { Uri, workspace } from 'vscode';

import { ConfigService } from '../services/config';
import { getLogger, ScopedLogger } from '../services/logger';
import { PersistenceStore } from '../stores/persistence';
import { transform as migrate } from '../transformers/migration';
import { PersistenceHandler } from '../types/persistence';
import {
  createDefaultTabStateFileContent,
  TabStateFileContent
} from '../types/tab-manager';

const URI_SCHEME_PATTERN = /^[a-zA-Z]+:/;

function resolveWorkspaceUri(location: string | null): Uri | null {
  if (!location) {
    return null;
  }

  try {
    return URI_SCHEME_PATTERN.test(location)
      ? Uri.parse(location, true)
      : Uri.file(location);
  } catch {
    return null;
  }
}

function isFileNotFoundError(error: any): boolean {
  return error?.code === 'ENOENT';
}

async function loadFile(location: Uri): Promise<TabStateFileContent | null> {
  const fileContent = await workspace.fs.readFile(location);
  const data = migrate(JSON.parse(new TextDecoder().decode(fileContent)));
  return data;
}

async function saveFile(
  location: Uri,
  data: TabStateFileContent
): Promise<void> {
  const fileContent = new TextEncoder().encode(JSON.stringify(data));
  await workspace.fs.writeFile(location, fileContent);
}

export class FileStorageHandler implements PersistenceHandler {
  private _configService: ConfigService;
  private _store: PersistenceStore;
  private _log: ScopedLogger;

  private _location: Uri | null;
  private _storageType: 'in-memory' | 'persistent' | null;

  constructor(configService: ConfigService, store: PersistenceStore) {
    this._location = null;
    this._storageType = null;
    this._configService = configService;
    this._store = store;
    this._log = getLogger().child('FileStorage');
  }

  async load(): Promise<void> {
    const snapshot = this._store.getSnapshot();

    if (snapshot.context.isLoading) {
      return new Promise((resolve) => {
        const unsubscribe = this._store.subscribe((state) => {
          if (!state.context.isLoading) {
            unsubscribe.unsubscribe();
            resolve();
          }
        });
      });
    }

    this._store.send({ type: 'LOAD' });

    const masterFolderPath = this._configService.getMasterWorkspaceFolder();
    const workspaceUri = resolveWorkspaceUri(masterFolderPath);

    if (!workspaceUri) {
      this._log.warn(
        'No valid workspace folder found, falling back to in-memory state'
      );

      this._location = null;
      this._storageType = 'in-memory';
      this._store.send({
        type: 'DONE',
        data: createDefaultTabStateFileContent(),
        success: true
      });

      return;
    }

    const vscodeDir = Uri.joinPath(workspaceUri, '.vscode');
    const filePath = Uri.joinPath(vscodeDir, 'tmstate.json');

    this._location = filePath;
    this._storageType = 'persistent';

    try {
      await workspace.fs.createDirectory(vscodeDir);
      const data = await loadFile(filePath);

      this._store.send({
        type: 'DONE',
        data,
        success: true
      });
    } catch (error) {
      if (isFileNotFoundError(error)) {
        this._store.send({
          type: 'DONE',
          data: createDefaultTabStateFileContent(),
          success: true
        });
        return;
      }

      this._log.error('Failed to load storage file', error);
      this._store.send({
        type: 'DONE',
        data: createDefaultTabStateFileContent(),
        success: false
      });
    }
  }

  save(data: TabStateFileContent): void {
    this._store.send({
      type: 'SAVE',
      data
    });
  }

  async write(data: TabStateFileContent): Promise<void> {
    if (this._storageType !== 'persistent' || this._location == null) {
      return;
    }

    try {
      await saveFile(this._location, data);
    } catch (error) {
      this._log.error('Failed to save storage file', error);
    }
  }

  get(): TabStateFileContent | null {
    return this._store.getSnapshot().context.data;
  }

  reset(): void {
    this._store.send({ type: 'CLEAR' });
  }
}

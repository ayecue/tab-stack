import { Uri, workspace } from 'vscode';

import { ConfigService } from '../services/config';
import { PersistenceStore } from '../stores/persistence';
import { transform as migrate } from '../transformers/migration';
import { PersistenceHandler } from '../types/persistence';
import {
  createDefaultTabStateFileContent,
  TabStateFileContent
} from '../types/tab-manager';

async function loadFile(location: string): Promise<TabStateFileContent | null> {
  const fileContent = await workspace.fs.readFile(Uri.file(location));
  const data = migrate(JSON.parse(new TextDecoder().decode(fileContent)));
  return data;
}

async function saveFile(
  location: string,
  data: TabStateFileContent
): Promise<void> {
  const fileContent = new TextEncoder().encode(JSON.stringify(data));
  await workspace.fs.writeFile(Uri.file(location), fileContent);
}

export class FileStorageHandler implements PersistenceHandler {
  private _configService: ConfigService;
  private _store: PersistenceStore;

  private _location: string | null;
  private _storageType: 'in-memory' | 'persistent' | null;

  constructor(configService: ConfigService, store: PersistenceStore) {
    this._location = null;
    this._storageType = null;
    this._configService = configService;
    this._store = store;
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
    const workspaceUri = Uri.parse(masterFolderPath);

    if (!workspaceUri) {
      console.warn('No workspace folder found, cannot load or save state.');

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

    this._location = filePath.fsPath;
    this._storageType = 'persistent';

    try {
      await workspace.fs.createDirectory(vscodeDir);
      const data = await loadFile(filePath.fsPath);

      this._store.send({
        type: 'DONE',
        data,
        success: true
      });
    } catch (error) {
      console.error('Failed to load storage file:', error);
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
      await saveFile(this._location!, data);
    } catch (error) {
      console.error('Failed to save storage file:', error);
    }
  }

  get(): TabStateFileContent | null {
    return this._store.getSnapshot().context.data;
  }

  reset(): void {
    this._store.send({ type: 'CLEAR' });
  }
}

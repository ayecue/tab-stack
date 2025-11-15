import { ExtensionContext } from 'vscode';

import { FileStorageHandler } from '../handlers/file-storage';
import { WorkspaceStorageHandler } from '../handlers/workspace-storage';
import { ConfigService } from '../services/config';
import {
  createPersistenceStore,
  PersistenceStore
} from '../stores/persistence';
import { StorageType } from '../types/config';
import { PersistenceHandler } from '../types/persistence';
import { TabStateFileContent } from '../types/tab-manager';

export class PersistenceMediator implements PersistenceHandler {
  private _store: PersistenceStore;
  private _fileHandler: FileStorageHandler;
  private _workspaceHandler: WorkspaceStorageHandler;
  private _configService: ConfigService;

  constructor(context: ExtensionContext, configService: ConfigService) {
    this._configService = configService;
    this._store = createPersistenceStore(this);
    this._fileHandler = new FileStorageHandler(configService, this._store);
    this._workspaceHandler = new WorkspaceStorageHandler(context, this._store);
  }

  private _getActiveHandler(): PersistenceHandler {
    const storageType = this._configService.getStorageType();
    return storageType === StorageType.WorkspaceState
      ? this._workspaceHandler
      : this._fileHandler;
  }

  async load(): Promise<void> {
    return this._getActiveHandler().load();
  }

  save(data: TabStateFileContent): void {
    this._getActiveHandler().save(data);
  }

  async write(data: TabStateFileContent): Promise<void> {
    return this._getActiveHandler().write(data);
  }

  get(): TabStateFileContent | null {
    return this._store.getSnapshot().context.data;
  }

  reset(): void {
    this._store.send({ type: 'CLEAR' });
  }
}

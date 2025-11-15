import { ExtensionContext } from 'vscode';

import { PersistenceStore } from '../stores/persistence';
import { transform as migrate } from '../transformers/migration';
import { PersistenceHandler } from '../types/persistence';
import {
  createDefaultTabStateFileContent,
  TabStateFileContent
} from '../types/tab-manager';

const WORKSPACE_STATE_KEY = 'tabManagerState';

export class WorkspaceStorageHandler implements PersistenceHandler {
  private _context: ExtensionContext;
  private _store: PersistenceStore;

  constructor(context: ExtensionContext, store: PersistenceStore) {
    this._context = context;
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

    try {
      const rawData =
        this._context.workspaceState.get<TabStateFileContent>(
          WORKSPACE_STATE_KEY
        );

      this._store.send({
        type: 'DONE',
        data:
          rawData != null
            ? migrate(rawData)
            : createDefaultTabStateFileContent(),
        success: true
      });
    } catch (error) {
      console.error('Failed to load workspace state:', error);
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
    try {
      await this._context.workspaceState.update(WORKSPACE_STATE_KEY, data);
    } catch (error) {
      console.error('Failed to save workspace state:', error);
    }
  }

  get(): TabStateFileContent | null {
    return this._store.getSnapshot().context.data;
  }

  reset(): void {
    this._store.send({ type: 'CLEAR' });
  }
}

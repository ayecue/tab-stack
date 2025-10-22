import { Disposable, EventEmitter, workspace, WorkspaceFolder } from 'vscode';

import { getWorkspaceFolder } from '../utils/get-workspace-folder';

export interface ConfigChangeEvent {
  masterWorkspaceFolder: string | null;
}

export class ConfigService implements Disposable {
  private _onDidChangeConfig: EventEmitter<ConfigChangeEvent>;
  private _configChangeListener?: Disposable;

  constructor() {
    this._onDidChangeConfig = new EventEmitter<ConfigChangeEvent>();
    this.initializeListeners();
  }

  get onDidChangeConfig() {
    return this._onDidChangeConfig.event;
  }

  private initializeListeners() {
    this._configChangeListener = workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('tabStack.masterWorkspaceFolder')) {
        this._onDidChangeConfig.fire({
          masterWorkspaceFolder: this.getMasterWorkspaceFolder()
        });
      }
    });
  }

  getMasterWorkspaceFolder(): string | null {
    const config = workspace.getConfiguration('tabStack');
    const configuredPath = config.get<string>('masterWorkspaceFolder');

    return configuredPath || getWorkspaceFolder();
  }

  async setMasterWorkspaceFolder(folderPath: string | null): Promise<void> {
    const config = workspace.getConfiguration('tabStack');
    await config.update('masterWorkspaceFolder', folderPath, false);
  }

  getAvailableWorkspaceFolders(): readonly WorkspaceFolder[] {
    return workspace.workspaceFolders || [];
  }

  dispose() {
    this._configChangeListener?.dispose();
    this._onDidChangeConfig.dispose();
  }
}

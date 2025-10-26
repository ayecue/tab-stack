import { Disposable, EventEmitter, workspace, WorkspaceFolder } from 'vscode';

import {
  ConfigChangeEvent,
  GitIntegrationConfig,
  GitIntegrationMode
} from '../types/config';
import { getWorkspaceFolder } from '../utils/get-workspace-folder';

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
      const changes: ConfigChangeEvent = {
        masterWorkspaceFolder: this.getMasterWorkspaceFolder()
      };

      if (
        e.affectsConfiguration('tabStack.masterWorkspaceFolder') ||
        e.affectsConfiguration('tabStack.gitIntegration')
      ) {
        if (e.affectsConfiguration('tabStack.gitIntegration')) {
          changes.gitIntegration = this.getGitIntegrationConfig();
        }
        this._onDidChangeConfig.fire(changes);
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

  getGitIntegrationConfig(): GitIntegrationConfig {
    const config = workspace.getConfiguration('tabStack.gitIntegration');

    return {
      enabled: config.get<boolean>('enabled', false),
      mode: config.get<GitIntegrationMode>('mode', GitIntegrationMode.FullAuto),
      groupPrefix: config.get<string>('groupPrefix', 'git:')
    };
  }

  async setGitIntegrationEnabled(enabled: boolean): Promise<void> {
    const config = workspace.getConfiguration('tabStack.gitIntegration');
    await config.update('enabled', enabled, false);
  }

  async setGitIntegrationMode(mode: GitIntegrationMode): Promise<void> {
    const config = workspace.getConfiguration('tabStack.gitIntegration');
    await config.update('mode', mode, false);
  }

  async setGitIntegrationGroupPrefix(prefix: string): Promise<void> {
    const config = workspace.getConfiguration('tabStack.gitIntegration');
    await config.update('groupPrefix', prefix, false);
  }

  getAvailableWorkspaceFolders(): readonly WorkspaceFolder[] {
    return workspace.workspaceFolders || [];
  }

  dispose() {
    this._configChangeListener?.dispose();
    this._onDidChangeConfig.dispose();
  }
}

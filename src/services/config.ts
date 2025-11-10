import { Disposable, EventEmitter, workspace, WorkspaceFolder } from 'vscode';

import {
  ConfigChangeEvent,
  GitIntegrationConfig,
  GitIntegrationMode,
  StorageType
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
        e.affectsConfiguration('tabStack.gitIntegration') ||
        e.affectsConfiguration('tabStack.storage.type')
      ) {
        if (e.affectsConfiguration('tabStack.gitIntegration')) {
          changes.gitIntegration = this.getGitIntegrationConfig();
        }
        if (e.affectsConfiguration('tabStack.storage.type')) {
          changes.storageType = this.getStorageType();
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

  getHistoryMaxEntries(): number {
    const config = workspace.getConfiguration('tabStack.history');
    const value = config.get<number>('maxEntries', 10);
    // Guard against misconfiguration
    if (typeof value !== 'number' || Number.isNaN(value)) return 10;
    return Math.max(1, Math.min(100, Math.floor(value)));
  }

  getStorageType(): StorageType {
    const config = workspace.getConfiguration('tabStack.storage');
    return config.get<StorageType>('type', StorageType.File);
  }

  async setStorageType(storageType: StorageType): Promise<void> {
    const config = workspace.getConfiguration('tabStack.storage');
    await config.update('type', storageType, false);
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

  async setHistoryMaxEntries(maxEntries: number): Promise<void> {
    const config = workspace.getConfiguration('tabStack.history');
    const clampedValue = Math.max(1, Math.min(100, Math.floor(maxEntries)));
    await config.update('maxEntries', clampedValue, false);
  }

  getAvailableWorkspaceFolders(): readonly WorkspaceFolder[] {
    return workspace.workspaceFolders || [];
  }

  dispose() {
    this._configChangeListener?.dispose();
    this._onDidChangeConfig.dispose();
  }
}

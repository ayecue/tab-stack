import { vi } from 'vitest';
import type { ConfigService } from '../../../src/services/config';

export class MockConfigService {
  private _configChangeListeners: Array<(event: any) => unknown> = [];

  public get = vi.fn();
  public onDidChange = vi.fn(() => ({ dispose: vi.fn() }));
  public getHistoryMaxEntries = vi.fn();
  public getMasterWorkspaceFolder = vi.fn();
  public getStorageType = vi.fn();
  public getGitIntegrationConfig = vi.fn();
  public getAvailableWorkspaceFolders = vi.fn();
  public setMasterWorkspaceFolder = vi.fn();
  public getTabRecoveryMappings = vi.fn();
  public setTabRecoveryMappings = vi.fn();
  public getTabKindColors = vi.fn();
  public onDidChangeConfig = vi.fn((listener: (event: any) => unknown) => {
    this._configChangeListeners.push(listener);

    return {
      dispose: vi.fn(() => {
        this._configChangeListeners = this._configChangeListeners.filter(
          (entry) => entry !== listener
        );
      })
    };
  });
  
  constructor(defaultConfig: Record<string, any> = {}) {
    this.get.mockImplementation((key: string) => defaultConfig[key]);
    this.getHistoryMaxEntries.mockReturnValue(defaultConfig.historyMaxEntries ?? 10);
    this.getMasterWorkspaceFolder.mockReturnValue(defaultConfig.masterWorkspaceFolder ?? null);
    this.getStorageType.mockReturnValue(defaultConfig.storageType ?? 'workspace');
    this.getGitIntegrationConfig.mockReturnValue(defaultConfig.gitIntegrationConfig ?? {
      enabled: false,
      mode: 'off',
      groupPrefix: 'branch/'
    });
    this.getAvailableWorkspaceFolders.mockReturnValue(defaultConfig.availableWorkspaceFolders ?? []);
    this.getTabRecoveryMappings.mockReturnValue(defaultConfig.tabRecoveryMappings ?? {});
    this.getTabKindColors.mockReturnValue(defaultConfig.tabKindColors ?? []);
    this.setMasterWorkspaceFolder.mockResolvedValue(undefined);
    this.setTabRecoveryMappings.mockResolvedValue(undefined);
  }
  
  public setConfig(config: Record<string, any>): void {
    this.get.mockImplementation((key: string) => config[key]);
  }
  
  public setConfigValue(key: string, value: any): void {
    const current = this.get.mock.results[0]?.value || {};
    this.get.mockImplementation((k: string) => k === key ? value : current[k]);
  }

  public async emitConfigChange(event: Record<string, any>): Promise<void> {
    await Promise.all(
      this._configChangeListeners.map((listener) => Promise.resolve(listener(event)))
    );
  }
}

import { vi } from 'vitest';
import type { ConfigService } from '../../../src/services/config';

export class MockConfigService {
  public get = vi.fn();
  public onDidChange = vi.fn(() => ({ dispose: vi.fn() }));
  public getHistoryMaxEntries = vi.fn();
  public getMasterWorkspaceFolder = vi.fn();
  public getStorageType = vi.fn();
  public getGitIntegrationConfig = vi.fn();
  public getAvailableWorkspaceFolders = vi.fn();
  public setMasterWorkspaceFolder = vi.fn();
  public onDidChangeConfig = vi.fn(() => ({ dispose: vi.fn() }));
  
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
    this.setMasterWorkspaceFolder.mockResolvedValue(undefined);
  }
  
  public setConfig(config: Record<string, any>): void {
    this.get.mockImplementation((key: string) => config[key]);
  }
  
  public setConfigValue(key: string, value: any): void {
    const current = this.get.mock.results[0]?.value || {};
    this.get.mockImplementation((k: string) => k === key ? value : current[k]);
  }
}

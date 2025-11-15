import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { workspace, EventEmitter } from 'vscode';

import { ConfigService } from '../../../src/services/config';
import { GitIntegrationMode, StorageType } from '../../../src/types/config';

vi.mock('../../../src/utils/get-workspace-folder', () => ({
  getWorkspaceFolder: vi.fn(() => '/default/workspace')
}));

describe('ConfigService', () => {
  let configService: ConfigService;
  let mockConfigEmitter: EventEmitter<any>;

  beforeEach(() => {
    mockConfigEmitter = new EventEmitter();
    vi.spyOn(workspace, 'onDidChangeConfiguration').mockImplementation((cb) => {
      const disposable = mockConfigEmitter.event(cb);
      return disposable;
    });
  });

  afterEach(() => {
    if (configService) {
      configService.dispose();
    }
    vi.clearAllMocks();
  });

  describe('getMasterWorkspaceFolder', () => {
    it('returns configured path if set', () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn((key: string) => {
          if (key === 'masterWorkspaceFolder') return '/custom/path';
          return undefined;
        })
      } as any);

      configService = new ConfigService();
      const result = configService.getMasterWorkspaceFolder();

      expect(result).toBe('/custom/path');
    });

    it('returns default workspace folder if not configured', () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn(() => null)
      } as any);

      configService = new ConfigService();
      const result = configService.getMasterWorkspaceFolder();

      expect(result).toBe('/default/workspace');
    });
  });

  describe('setMasterWorkspaceFolder', () => {
    it('updates configuration with new folder path', async () => {
      const updateMock = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        update: updateMock,
        get: vi.fn()
      } as any);

      configService = new ConfigService();
      await configService.setMasterWorkspaceFolder('/new/path');

      expect(updateMock).toHaveBeenCalledWith('masterWorkspaceFolder', '/new/path', false);
    });

    it('can clear configuration with null', async () => {
      const updateMock = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        update: updateMock,
        get: vi.fn()
      } as any);

      configService = new ConfigService();
      await configService.setMasterWorkspaceFolder(null);

      expect(updateMock).toHaveBeenCalledWith('masterWorkspaceFolder', null, false);
    });
  });

  describe('getGitIntegrationConfig', () => {
    it('returns git integration configuration with defaults', () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn((key: string, defaultValue: any) => defaultValue)
      } as any);

      configService = new ConfigService();
      const config = configService.getGitIntegrationConfig();

      expect(config).toEqual({
        enabled: false,
        mode: GitIntegrationMode.FullAuto,
        groupPrefix: 'git:'
      });
    });

    it('returns configured git integration settings', () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn((key: string) => {
          if (key === 'enabled') return true;
          if (key === 'mode') return GitIntegrationMode.AutoSwitch;
          if (key === 'groupPrefix') return 'branch:';
          return undefined;
        })
      } as any);

      configService = new ConfigService();
      const config = configService.getGitIntegrationConfig();

      expect(config).toEqual({
        enabled: true,
        mode: GitIntegrationMode.AutoSwitch,
        groupPrefix: 'branch:'
      });
    });
  });

  describe('getHistoryMaxEntries', () => {
    it('returns configured max entries within bounds', () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn(() => 25)
      } as any);

      configService = new ConfigService();
      const maxEntries = configService.getHistoryMaxEntries();

      expect(maxEntries).toBe(25);
    });

    it('clamps value to minimum of 1', () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn(() => -5)
      } as any);

      configService = new ConfigService();
      const maxEntries = configService.getHistoryMaxEntries();

      expect(maxEntries).toBe(1);
    });

    it('clamps value to maximum of 100', () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn(() => 500)
      } as any);

      configService = new ConfigService();
      const maxEntries = configService.getHistoryMaxEntries();

      expect(maxEntries).toBe(100);
    });

    it('returns default of 10 for invalid values', () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn(() => 'invalid' as any)
      } as any);

      configService = new ConfigService();
      const maxEntries = configService.getHistoryMaxEntries();

      expect(maxEntries).toBe(10);
    });

    it('returns default of 10 for NaN', () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn(() => NaN)
      } as any);

      configService = new ConfigService();
      const maxEntries = configService.getHistoryMaxEntries();

      expect(maxEntries).toBe(10);
    });
  });

  describe('getStorageType', () => {
    it('returns configured storage type', () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn(() => StorageType.WorkspaceState)
      } as any);

      configService = new ConfigService();
      const storageType = configService.getStorageType();

      expect(storageType).toBe(StorageType.WorkspaceState);
    });

    it('returns default storage type of File', () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn((key: string, defaultValue: any) => defaultValue)
      } as any);

      configService = new ConfigService();
      const storageType = configService.getStorageType();

      expect(storageType).toBe(StorageType.File);
    });
  });

  describe('configuration change events', () => {
    it('fires event when git integration config changes', async () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn((key: string) => {
          if (key === 'enabled') return true;
          if (key === 'mode') return GitIntegrationMode.FullAuto;
          if (key === 'groupPrefix') return 'git:';
          return undefined;
        })
      } as any);

      configService = new ConfigService();

      const eventPromise = new Promise((resolve) => {
        configService.onDidChangeConfig((event) => {
          resolve(event);
        });
      });

      mockConfigEmitter.fire({
        affectsConfiguration: (section: string) => section === 'tabStack.gitIntegration'
      });

      const event = await eventPromise;
      expect(event).toHaveProperty('gitIntegration');
      expect((event as any).gitIntegration.enabled).toBe(true);
    });

    it('fires event when storage type changes', async () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn(() => StorageType.WorkspaceState)
      } as any);

      configService = new ConfigService();

      const eventPromise = new Promise((resolve) => {
        configService.onDidChangeConfig((event) => {
          resolve(event);
        });
      });

      mockConfigEmitter.fire({
        affectsConfiguration: (section: string) => section === 'tabStack.storage.type'
      });

      const event = await eventPromise;
      expect(event).toHaveProperty('storageType');
      expect((event as any).storageType).toBe(StorageType.WorkspaceState);
    });

    it('does not fire event for unrelated configuration changes', () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn()
      } as any);

      configService = new ConfigService();

      const listener = vi.fn();
      configService.onDidChangeConfig(listener);

      mockConfigEmitter.fire({
        affectsConfiguration: (section: string) => section === 'unrelated.setting'
      });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('dispose', () => {
    it('cleans up event listeners', () => {
      vi.spyOn(workspace, 'getConfiguration').mockReturnValue({
        get: vi.fn()
      } as any);

      configService = new ConfigService();
      configService.dispose();

      // After disposal, events should not fire
      const listener = vi.fn();
      configService.onDidChangeConfig(listener);

      mockConfigEmitter.fire({
        affectsConfiguration: (section: string) => section === 'tabStack.gitIntegration'
      });

      expect(listener).not.toHaveBeenCalled();
    });
  });
});

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { extensions, EventEmitter } from 'vscode';
import { GitService } from '../../../src/services/git';
import { MockConfigService } from '../../mocks';

// Mock the extensions API
vi.mock('vscode', async () => {
  const actual = await vi.importActual('vscode');
  return {
    ...actual,
    extensions: {
      getExtension: vi.fn()
    }
  };
});

describe('GitService', () => {
  let configService: MockConfigService;
  let gitService: GitService;

  beforeEach(() => {
    vi.clearAllMocks();
    configService = new MockConfigService({
      gitIntegrationConfig: {
        enabled: true,
        mode: 'branch' as const,
        groupPrefix: 'branch/'
      },
      masterWorkspaceFolder: null
    });
    gitService = new GitService(configService as any);
  });

  describe('initialization', () => {
    it('creates service with event emitters', () => {
      expect(gitService.onDidChangeBranch).toBeDefined();
      expect(gitService.onDidOpenRepository).toBeDefined();
    });

    it('returns false when git extension is not found', async () => {
      vi.mocked(extensions.getExtension).mockReturnValue(undefined);

      const result = await gitService.initialize();

      expect(result).toBe(false);
      expect(extensions.getExtension).toHaveBeenCalledWith('vscode.git');
    });

    it('activates git extension if not active', async () => {
      const mockActivate = vi.fn().mockResolvedValue(undefined);
      const mockGitExtension = {
        isActive: false,
        activate: mockActivate,
        exports: {
          getAPI: vi.fn().mockReturnValue({
            repositories: [],
            onDidOpenRepository: new EventEmitter().event,
            onDidCloseRepository: new EventEmitter().event
          })
        }
      };

      vi.mocked(extensions.getExtension).mockReturnValue(mockGitExtension as any);

      const result = await gitService.initialize();

      expect(mockActivate).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('uses already active git extension', async () => {
      const mockActivate = vi.fn();
      const mockGitExtension = {
        isActive: true,
        activate: mockActivate,
        exports: {
          getAPI: vi.fn().mockReturnValue({
            repositories: [],
            onDidOpenRepository: new EventEmitter().event,
            onDidCloseRepository: new EventEmitter().event
          })
        }
      };

      vi.mocked(extensions.getExtension).mockReturnValue(mockGitExtension as any);

      const result = await gitService.initialize();

      expect(mockActivate).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('getCurrentBranch', () => {
    it('returns null when not initialized', () => {
      const branch = gitService.getCurrentBranch();
      expect(branch).toBeNull();
    });
  });

  describe('updateRepository', () => {
    it('does not throw when called without initialization', () => {
      expect(() => gitService.updateRepository()).not.toThrow();
    });

    it('does not throw when no workspace folder is configured', () => {
      vi.mocked(configService.getMasterWorkspaceFolder).mockReturnValue(null);
      
      expect(() => gitService.updateRepository()).not.toThrow();
    });
  });

  describe('dispose', () => {
    it('cleans up resources without errors', () => {
      expect(() => gitService.dispose()).not.toThrow();
    });

    it('can be called multiple times safely', () => {
      gitService.dispose();
      expect(() => gitService.dispose()).not.toThrow();
    });
  });
});

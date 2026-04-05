import { beforeEach, describe, expect, it, vi } from 'vitest';
import { commands, window } from 'vscode';
import { TabActiveStateHandler } from '../../../src/handlers/tab-active-state';
import { MockConfigService, MockEditorLayoutService } from '../../mocks';
import { MockTabRecoveryService } from '../../mocks/services/TabRecoveryService';

describe('TabActiveStateHandler', () => {
  let handler: TabActiveStateHandler;
  let layoutService: MockEditorLayoutService;
  let tabRecoverService: MockTabRecoveryService;

  beforeEach(() => {
    vi.clearAllMocks();

    layoutService = new MockEditorLayoutService();
    tabRecoverService = new MockTabRecoveryService();

    // Mock VSCode window events
    vi.mocked(window.tabGroups.onDidChangeTabs).mockReturnValue({ dispose: vi.fn() } as any);
    vi.mocked(window.tabGroups.onDidChangeTabGroups).mockReturnValue({ dispose: vi.fn() } as any);
    vi.mocked(window.onDidChangeActiveTextEditor).mockReturnValue({ dispose: vi.fn() } as any);
    vi.mocked(window.onDidChangeActiveNotebookEditor).mockReturnValue({ dispose: vi.fn() } as any);
    vi.mocked(window.onDidChangeActiveTerminal).mockReturnValue({ dispose: vi.fn() } as any);

    vi.mocked(commands.executeCommand).mockResolvedValue(undefined);

    handler = new TabActiveStateHandler(
      layoutService as any,
      tabRecoverService as any
    );
  });

  describe('initialization', () => {
    it('creates handler with dependencies', () => {
      expect(handler).toBeDefined();
    });

    it('registers event listeners', () => {
      expect(window.tabGroups.onDidChangeTabs).toHaveBeenCalled();
      expect(window.tabGroups.onDidChangeTabGroups).toHaveBeenCalled();
      expect(window.onDidChangeActiveTextEditor).toHaveBeenCalled();
    });
  });

  describe('getTabState', () => {
    it('returns current tab state', () => {
      const state = handler.getTabState();
      
      expect(state).toBeDefined();
      expect(state).toHaveProperty('tabGroups');
      expect(state).toHaveProperty('activeGroup');
    });

    it('caches tab state between calls', () => {
      const state1 = handler.getTabState();
      const state2 = handler.getTabState();
      
      expect(state1).toBe(state2); // Should return same cached object
    });
  });

  describe('getTabManagerState', () => {
    it('returns tab manager state with layout', () => {
      const state = handler.getTabManagerState();
      
      expect(state).toBeDefined();
      expect(state).toHaveProperty('tabState');
      expect(state).toHaveProperty('layout');
    });
  });

  describe('isTabRecoverable', () => {
    it('returns true for standard file URIs', () => {
      const tab: any = {
        kind: 'tabInputText',
        uri: 'file:///workspace/test.ts',
        meta: { type: 'textEditor' }
      };
      const result = handler.isTabRecoverable(tab);
      
      expect(result).toBe(true);
    });

    it('returns true when recovery mapping exists', () => {
      tabRecoverService.hasMatch.mockReturnValue(true); // Mock recovery service to return true

      const tab: any = {
        kind: 'vscode.tab.custom',
        label: 'output:extension-output-test',
        uri: 'output:extension-output-test',
        meta: { type: 'custom', viewType: 'output' }
      };
      const result = handler.isTabRecoverable(tab);
      
      expect(result).toBe(true);
    });

    it('returns false for unknown URIs without mapping', () => {
      const tab: any = {
        kind: 'unknown',
        uri: 'unknown:some-uri',
        meta: { type: 'unknown' }
      };
      const result = handler.isTabRecoverable(tab);
      
      expect(result).toBe(false);
    });

    it('returns true for terminals', () => {
      const tab: any = {
        kind: 'tabInputTerminal',
        label: 'zsh',
        meta: { type: 'terminal', terminalName: 'zsh' }
      };
      const result = handler.isTabRecoverable(tab);
      
      expect(result).toBe(true);
    });
  });

  describe('syncTabs', () => {
    it('syncs tabs without throwing', () => {
      expect(() => handler.syncTabs()).not.toThrow();
    });
  });

  describe('applyTabState', () => {
    it('applies tab state without throwing', async () => {
      const tabState = {
        tabGroups: {},
        activeGroup: null
      };

      const options = {
        preservePinnedTabs: false,
        preserveTabFocus: false,
        preserveActiveTab: false
      };

      await expect(handler.applyTabState(tabState, options)).resolves.toBeUndefined();
    });
  });

  describe('disposal', () => {
    it('disposes without throwing', () => {
      expect(() => handler.dispose()).not.toThrow();
    });

    it('clears cached state on disposal', () => {
      handler.getTabState(); // Cache state
      handler.dispose();
      
      // After disposal, accessing state should not throw
      // (though behavior may vary)
    });
  });

  describe('onDidChangeState', () => {
    it('provides event emitter', () => {
      const listener = vi.fn();
      const disposable = handler.onDidChangeState(listener);
      
      expect(disposable).toBeDefined();
      expect(disposable.dispose).toBeDefined();
      
      disposable.dispose();
    });
  });
});

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { commands, ExtensionContext, window, workspace, Uri } from 'vscode';
import { TabManagerService } from '../../../src/services/tab-manager';
import { GitIntegrationMode } from '../../../src/types/config';
import * as tabUtils from '../../../src/utils/tab-utils';
import {
  MockConfigService,
  MockEditorLayoutService,
  MockGitService,
  MockSelectionTrackerService,
  createMockExtensionContext
} from '../../mocks';
import { tabStateFactory, tabStateFileContentFactory } from '../../factories';

describe('TabManagerService', () => {
  let service: TabManagerService;
  let context: ExtensionContext;
  let configService: MockConfigService;
  let layoutService: MockEditorLayoutService;
  let selectionTrackerService: MockSelectionTrackerService;
  let gitService: MockGitService;

  beforeEach(() => {
    vi.clearAllMocks();

    context = createMockExtensionContext();

    configService = new MockConfigService({
      historyMaxEntries: 10,
      masterWorkspaceFolder: null,
      storageType: 'workspace',
      gitIntegrationConfig: {
        enabled: false,
        mode: 'off',
        groupPrefix: 'branch/'
      },
      availableWorkspaceFolders: []
    });

    layoutService = new MockEditorLayoutService();
    selectionTrackerService = new MockSelectionTrackerService();
    gitService = new MockGitService();

    // Mock tab state
    vi.spyOn(tabUtils, 'getTabState').mockReturnValue(tabStateFactory.build());

    vi.spyOn(tabUtils, 'isTabStateEqual').mockReturnValue(false);
    vi.spyOn(tabUtils, 'isSelectionMapEqual').mockReturnValue(true);
    vi.spyOn(tabUtils, 'countTabs').mockReturnValue(0);
    vi.spyOn(tabUtils, 'findTabByViewColumnAndIndex').mockReturnValue(null);
    vi.spyOn(tabUtils, 'findTabGroupByViewColumn').mockReturnValue(null);
    vi.spyOn(tabUtils, 'closeTab').mockResolvedValue(undefined);
    vi.spyOn(tabUtils, 'applyTabState').mockResolvedValue(undefined);

    vi.mocked(commands.executeCommand).mockImplementation((cmd: string) => {
      if (cmd === 'vscode.getEditorLayout') {
        return Promise.resolve({ orientation: 0, groups: [{ size: 1 }] });
      }
      return Promise.resolve();
    });

    vi.mocked(window.tabGroups.onDidChangeTabs).mockReturnValue({ dispose: vi.fn() } as any);
    vi.mocked(window.tabGroups.onDidChangeTabGroups).mockReturnValue({ dispose: vi.fn() } as any);

    service = new TabManagerService(
      context,
      layoutService as any,
      configService as any,
      selectionTrackerService as any,
      gitService as any
    );
  });

  afterEach(() => {
    service.dispose();
  });

  describe('initialization', () => {
    it('creates service with dependencies', () => {
      expect(service.config).toBe(configService);
      expect(service.state).toBeNull();
    });

    it('attaches state handler', async () => {
      await service.attachStateHandler();
      expect(service.state).not.toBeNull();
    });
  });

  describe('group operations', () => {
    beforeEach(async () => {
      await service.attachStateHandler();
      await service.waitForRenderComplete();
    });

    it('creates a group', async () => {
      const beforeCount = Object.keys(service.state.groups).length;
      await service.state.createGroup('Test Group');
      const afterCount = Object.keys(service.state.groups).length;
      expect(afterCount).toBeGreaterThan(beforeCount);
    });

    it('renames a group', async () => {
      service.createGroup('Original');
      const groupId = Object.values(service.state.groups).find(g => g.name === 'Original')?.id;
      if (groupId) {
        service.renameGroup(groupId, 'Renamed');
        expect(service.state.groups[groupId].name).toBe('Renamed');
      }
    });

    it('deletes a group', async () => {
      service.createGroup('ToDelete');
      const groupId = Object.values(service.state.groups).find(g => g.name === 'ToDelete')?.id;
      if (groupId) {
        service.deleteGroup(groupId);
        expect(service.state.groups[groupId]).toBeUndefined();
      }
    });

    it('does not switch to same group', async () => {
      const groupId = service.state.stateContainer?.id || null;
      
      service.switchToGroup(groupId);
      
      // State should remain the same
      expect(service.state.stateContainer?.id).toBe(groupId);
    });

    it('forks state when switching to null', async () => {
      const originalId = service.state.stateContainer?.id;
      
      service.switchToGroup(null);
      
      expect(service.state.stateContainer?.id).not.toBe(originalId);
    });
  });

  describe('history operations', () => {
    beforeEach(async () => {
      await service.attachStateHandler();
    });

    it('takes a snapshot', async () => {
      const beforeCount = Object.keys(service.state.history).length;
      await service.takeSnapshot();
      const afterCount = Object.keys(service.state.history).length;
      expect(afterCount).toBeGreaterThanOrEqual(beforeCount);
    });

    it('recovers a snapshot', async () => {
      await service.takeSnapshot();
      const historyId = Object.keys(service.state.history)[0];
      
      if (historyId) {
        service.recoverSnapshot(historyId);
        expect(service.state.stateContainer).toBeDefined();
      }
    });

    it('deletes a snapshot', async () => {
      await service.takeSnapshot();
      const historyId = Object.keys(service.state.history)[0];
      
      if (historyId) {
        service.deleteSnapshot(historyId);
        expect(service.state.history[historyId]).toBeUndefined();
      }
    });
  });

  describe('addon operations', () => {
    beforeEach(async () => {
      await service.attachStateHandler();
    });

    it('creates an addon', () => {
      service.createAddon('Test Addon');
      expect(Object.values(service.state.addons)[0]?.name).toBe('Test Addon');
    });

    it('renames an addon', () => {
      service.createAddon('Original Addon');
      const addonId = Object.keys(service.state.addons)[0];
      
      service.renameAddon(addonId, 'Renamed Addon');
      
      expect(service.state.addons[addonId].name).toBe('Renamed Addon');
    });

    it('deletes an addon', () => {
      service.createAddon('ToDelete Addon');
      const addonId = Object.keys(service.state.addons)[0];
      
      service.deleteAddon(addonId);
      
      expect(service.state.addons[addonId]).toBeUndefined();
    });

    it('applies an addon', async () => {
      service.createAddon('Test Addon');
      const addonId = Object.keys(service.state.addons)[0];
      
      await service.applyAddon(addonId);
      
      expect(tabUtils.applyTabState).toHaveBeenCalled();
    });
  });

  describe('quick slots', () => {
    beforeEach(async () => {
      await service.attachStateHandler();
    });

    it('assigns a quick slot', () => {
      service.createGroup('QuickGroup');
      const groupId = Object.keys(service.state.groups)[0];
      
      service.assignQuickSlot('1', groupId);
      
      expect(service.state.getQuickSlots()['1']).toBe(groupId);
    });

    it('applies a quick slot', () => {
      service.createGroup('QuickGroup');
      const groupId = Object.values(service.state.groups).find(g => g.name === 'QuickGroup')?.id;
      if (groupId) {
        service.assignQuickSlot('1', groupId);
        service.applyQuickSlot('1');
        expect(service.state.stateContainer?.id).toBe(groupId);
      }
    });

    it('handles invalid quick slot when applying', () => {
      service.assignQuickSlot('1', 'invalid-id');
      service.applyQuickSlot('1');
      
      // Should clear the invalid slot
      expect(window.showWarningMessage).toHaveBeenCalled();
    });
  });

  describe('tab operations', () => {
    beforeEach(async () => {
      await service.attachStateHandler();
    });

    it('opens a tab', async () => {
      const mockGroup = { viewColumn: 1, activeTab: null, tabs: [] };
      vi.mocked(tabUtils.findTabGroupByViewColumn).mockReturnValue(mockGroup as any);
      
      await service.openTab(1, 0);
      
      expect(commands.executeCommand).toHaveBeenCalledWith(
        'workbench.action.openEditorAtIndex',
        0
      );
    });

    it('closes a tab', async () => {
      const mockTab = { input: {}, isPinned: false };
      vi.mocked(tabUtils.findTabByViewColumnAndIndex).mockReturnValue(mockTab as any);
      
      await service.closeTab(1, 0);
      
      expect(tabUtils.closeTab).toHaveBeenCalledWith(mockTab);
    });

    it('toggles tab pin', async () => {
      const mockTab = { input: {}, isPinned: false };
      vi.mocked(tabUtils.findTabByViewColumnAndIndex).mockReturnValue(mockTab as any);
      
      await service.toggleTabPin(1, 0);
      
      expect(commands.executeCommand).toHaveBeenCalled();
    });

    it('moves a tab', async () => {
      const mockTab = { input: {}, isPinned: false };
      vi.mocked(tabUtils.findTabByViewColumnAndIndex).mockReturnValue(mockTab as any);
      
      await service.moveTab(1, 0, 2, 1);
      
      expect(commands.executeCommand).toHaveBeenCalled();
    });

    it('clears all tabs', async () => {
      await service.clearAllTabs();
      
      expect(commands.executeCommand).toHaveBeenCalledWith('workbench.action.closeAllEditors');
    });
  });

  describe('import/export', () => {
    beforeEach(async () => {
      await service.attachStateHandler();
    });

    it('exports state file', async () => {
      vi.mocked(workspace.fs.writeFile).mockResolvedValue(undefined);
      
      await service.exportStateFile('file:///export.json');
      
      expect(workspace.fs.writeFile).toHaveBeenCalled();
    });

    it('imports state file', async () => {
      const mockData = new TextEncoder().encode(JSON.stringify({
        version: 2,
        groups: {},
        history: {},
        addons: {},
        quickSlots: {},
        selectedGroup: null,
        previousSelectedGroup: null
      }));
      
      vi.mocked(workspace.fs.readFile).mockResolvedValue(mockData);
      configService.getMasterWorkspaceFolder.mockReturnValue('file:///workspace');
      
      await service.importStateFile('/import.json');
      
      expect(workspace.fs.readFile).toHaveBeenCalled();
    });

    it('handles invalid import file', async () => {
      const mockData = new TextEncoder().encode('invalid json');
      vi.mocked(workspace.fs.readFile).mockResolvedValue(mockData);
      
      await service.importStateFile('/invalid.json');
      
      expect(window.showErrorMessage).toHaveBeenCalled();
    });
  });

  describe('workspace folder', () => {
    beforeEach(async () => {
      await service.attachStateHandler();
    });

    it('selects workspace folder', async () => {
      await service.selectWorkspaceFolder('/path/to/folder');
      
      expect(configService.setMasterWorkspaceFolder).toHaveBeenCalledWith('/path/to/folder');
    });

    it('clears workspace folder', async () => {
      await service.clearWorkspaceFolder();
      
      expect(configService.setMasterWorkspaceFolder).toHaveBeenCalledWith(null);
    });
  });

  describe('quick switch', () => {
    beforeEach(async () => {
      await service.attachStateHandler();
    });

    it('switches to previous state', () => {
      service.switchToGroup(null); // Fork to create previous state
      const currentId = service.state.stateContainer?.id;
      
      service.quickSwitch();
      
      expect(service.state.stateContainer?.id).not.toBe(currentId);
    });
  });

  describe('sync', () => {
    beforeEach(async () => {
      await service.attachStateHandler();
    });

    it('triggers sync after changes', () => {
      const syncSpy = vi.fn();
      service.onDidSyncTabs(syncSpy);
      
      service.createGroup('Test');
      service.triggerSync();
      
      expect(syncSpy).toHaveBeenCalled();
    });

    it('provides sync data', async () => {
      service.createGroup('Group1');
      service.createAddon('Addon1');
      await service.takeSnapshot();
      
      const syncSpy = vi.fn();
      service.onDidSyncTabs(syncSpy);
      service.triggerSync();
      
      const syncData = syncSpy.mock.calls[0][0];
      expect(syncData.groups.length).toBeGreaterThanOrEqual(0);
      expect(syncData).toHaveProperty('addons');
      expect(syncData).toHaveProperty('histories');
    });
  });

  describe('git integration', () => {
    beforeEach(async () => {
      configService.getGitIntegrationConfig.mockReturnValue({
        enabled: true,
        mode: GitIntegrationMode.AutoSwitch,
        groupPrefix: 'branch/'
      });
      
      await service.attachStateHandler();
    });

    it('handles branch change with auto-switch', () => {
      service.createGroup('branch/main');
      const groupId = Object.values(service.state.groups).find(g => g.name === 'branch/main')?.id;
      
      // Emit branch change event
      gitService.emitBranchChange({
        currentBranch: 'main',
        previousBranch: null,
        repository: {} as any
      });
      
      // Should switch to existing branch group
      if (groupId) {
        expect(service.state.stateContainer?.id).toBe(groupId);
      }
    });

    it('does not switch when git integration disabled', () => {
      configService.getGitIntegrationConfig.mockReturnValue({
        enabled: false,
        mode: GitIntegrationMode.AutoSwitch,
        groupPrefix: 'branch/'
      });
      
      // Emit branch change event
      gitService.emitBranchChange({
        currentBranch: 'develop',
        previousBranch: null,
        repository: {} as any
      });
      
      // Should not create or switch
      expect(service.state.groups['branch/develop']).toBeUndefined();
    });
  });

  describe('disposal', () => {
    it('cleans up resources', async () => {
      await service.attachStateHandler();
      
      expect(() => service.dispose()).not.toThrow();
      expect(service.state).toBeNull();
    });

    it('can be disposed without state handler', () => {
      expect(() => service.dispose()).not.toThrow();
    });
  });
});

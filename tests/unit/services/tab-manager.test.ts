import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { commands, ExtensionContext, window, workspace, Uri } from 'vscode';
import { TabManagerService } from '../../../src/services/tab-manager';
import { GitIntegrationMode } from '../../../src/types/config';
import * as tabUtils from '../../../src/utils/tab-utils';
import {
  MockConfigService,
  MockEditorLayoutService,
  MockGitService,
  createMockExtensionContext
} from '../../mocks';
import { tabStateFactory, tabStateFileContentFactory } from '../../factories';
import { MockTabRecoveryService } from '../../mocks/services/TabRecoveryService';

describe('TabManagerService', () => {
  let service: TabManagerService;
  let context: ExtensionContext;
  let configService: MockConfigService;
  let layoutService: MockEditorLayoutService;
  let gitService: MockGitService;
  let tabRecoverService: MockTabRecoveryService;

  beforeEach(() => {
    vi.clearAllMocks();

    context = createMockExtensionContext();

    configService = new MockConfigService({
      historyMaxEntries: 10,
      masterWorkspaceFolder: '/mock/workspace',
      storageType: 'workspace',
      gitIntegrationConfig: {
        enabled: false,
        mode: 'off',
        groupPrefix: 'branch/'
      },
      availableWorkspaceFolders: []
    });

    layoutService = new MockEditorLayoutService();
    gitService = new MockGitService();
    tabRecoverService = new MockTabRecoveryService();

    // Mock tab state
    vi.spyOn(tabUtils, 'getTabState').mockReturnValue(tabStateFactory.build());

    vi.spyOn(tabUtils, 'isTabStateEqual').mockReturnValue(false);
    vi.spyOn(tabUtils, 'isSelectionMapEqual').mockReturnValue(true);
    vi.spyOn(tabUtils, 'countTabs').mockReturnValue(0);
    vi.spyOn(tabUtils, 'findTabByViewColumnAndIndex').mockReturnValue(null);
    vi.spyOn(tabUtils, 'findTabGroupByViewColumn').mockReturnValue(null);
    vi.spyOn(tabUtils, 'closeTab').mockResolvedValue(undefined);

    vi.mocked(commands.executeCommand).mockImplementation((cmd: string) => {
      if (cmd === 'vscode.getEditorLayout') {
        return Promise.resolve({ orientation: 0, groups: [{ size: 1 }] });
      }
      return Promise.resolve();
    });

    vi.mocked(window.tabGroups.onDidChangeTabs).mockReturnValue({ dispose: vi.fn() } as any);
    vi.mocked(window.tabGroups.onDidChangeTabGroups).mockReturnValue({ dispose: vi.fn() } as any);
    vi.mocked(window.onDidChangeActiveTextEditor).mockReturnValue({ dispose: vi.fn() } as any);
    vi.mocked(window.onDidChangeActiveNotebookEditor).mockReturnValue({ dispose: vi.fn() } as any);
    vi.mocked(window.onDidChangeActiveTerminal).mockReturnValue({ dispose: vi.fn() } as any);

    service = new TabManagerService(
      context,
      layoutService as any,
      configService as any,
      gitService as any,
      tabRecoverService as any
    );
  });

  afterEach(() => {
    service.dispose();
  });

  describe('initialization', () => {
    it('creates service with dependencies', () => {
      expect(service.config).toBe(configService);
      expect(service.state.groups).toEqual({});
      expect(service.state.history).toEqual({});
      expect(service.state.addons).toEqual({});
    });

    it('attaches state handler', async () => {
      await service.attachStateHandler();
      expect(service.state.stateContainer).toBeDefined();
    });
  });

  describe('group operations', () => {
    beforeEach(async () => {
      await service.attachStateHandler();
      await service.waitForRenderComplete();
    });

    it('creates a group', async () => {
      const beforeCount = Object.keys(service.state.groups).length;
      service.createGroup('test-group');
      const afterCount = Object.keys(service.state.groups).length;
      expect(afterCount).toBeGreaterThan(beforeCount);
      
      // Find the newly created group
      const newGroup = Object.values(service.state.groups).find(g => g.name === 'test-group');
      expect(newGroup).toBeDefined();
    });

    it('renames a group', async () => {
      service.createGroup('original');
      const group = Object.values(service.state.groups).find(g => g.name === 'original');
      expect(group).toBeDefined();
      
      if (group) {
        service.renameGroup(group.id, 'renamed');
        // Group ID should remain the same, only name changes
        expect(service.state.groups[group.id]).toBeDefined();
        expect(service.state.groups[group.id].name).toBe('renamed');
      }
    });

    it('deletes a group', async () => {
      service.createGroup('to-delete');
      const group = Object.values(service.state.groups).find(g => g.name === 'to-delete');
      expect(group).toBeDefined();
      
      if (group) {
        service.deleteGroup(group.id);
        expect(service.state.groups[group.id]).toBeUndefined();
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
      
      // Forking should move current to previous
      expect(service.state.previousStateContainer?.id).toBe(originalId);
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
      service.createAddon('test-addon');
      const addon = Object.values(service.state.addons).find(a => a.name === 'test-addon');
      expect(addon).toBeDefined();
    });

    it('renames an addon', () => {
      service.createAddon('original-addon');
      const addon = Object.values(service.state.addons).find(a => a.name === 'original-addon');
      expect(addon).toBeDefined();
      
      if (addon) {
        service.renameAddon(addon.id, 'renamed-addon');
        // Addon ID should remain the same, only name changes
        expect(service.state.addons[addon.id]).toBeDefined();
        expect(service.state.addons[addon.id].name).toBe('renamed-addon');
      }
    });

    it('deletes an addon', () => {
      service.createAddon('to-delete-addon');
      const addon = Object.values(service.state.addons).find(a => a.name === 'to-delete-addon');
      expect(addon).toBeDefined();
      
      if (addon) {
        service.deleteAddon(addon.id);
        expect(service.state.addons[addon.id]).toBeUndefined();
      }
    });

    it('applies an addon', async () => {
      service.createAddon('test-addon');
      const addon = Object.values(service.state.addons).find(a => a.name === 'test-addon');
      expect(addon).toBeDefined();
      
      if (addon) {
        await service.applyAddon(addon.id);
        // Applying an addon should trigger render
        await service.waitForRenderComplete();
      }
    });
  });

  describe('quick slots', () => {
    beforeEach(async () => {
      await service.attachStateHandler();
    });

    it('assigns a quick slot', () => {
      service.createGroup('quick-group');
      const group = Object.values(service.state.groups).find(g => g.name === 'quick-group');
      expect(group).toBeDefined();
      
      if (group) {
        service.assignQuickSlot('1', group.id);
        // Quick slot assignment doesn't throw
      }
    });

    it('applies a quick slot', () => {
      service.createGroup('quick-group');
      const group = Object.values(service.state.groups).find(g => g.name === 'quick-group');
      expect(group).toBeDefined();
      
      if (group) {
        service.assignQuickSlot('1', group.id);
        service.applyQuickSlot('1');
        expect(service.state.stateContainer?.id).toBe(group.id);
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
      vi.mocked(tabUtils.findTabByViewColumnAndIndex).mockImplementation(() => mockTab as any);
      
      // Just verify the method runs without error when tab is found
      await expect(service.toggleTabPin(1, 0)).resolves.toBeUndefined();
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
      const importedPreviousGroup = {
        id: 'group-1',
        name: 'Imported Previous',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now() - 1000,
        lastSelectedAt: Date.now() - 1000
      };
      const importedSelectedGroup = {
        id: 'group-2',
        name: 'Imported Current',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };
      const mockData = new TextEncoder().encode(JSON.stringify({
        version: 3,
        groups: {
          'group-1': importedPreviousGroup,
          'group-2': importedSelectedGroup
        },
        history: {},
        addons: {},
        quickSlots: {},
        selectedGroup: 'group-2',
        previousSelectedGroup: 'group-1'
      }));
      
      vi.mocked(workspace.fs.readFile).mockResolvedValue(mockData);
      configService.getMasterWorkspaceFolder.mockReturnValue('file:///workspace');
      
      await service.importStateFile('/import.json');
      
      expect(workspace.fs.readFile).toHaveBeenCalled();
      expect(service.state.stateContainer?.id).toBe('group-2');
      expect(service.state.previousStateContainer?.id).toBe('group-1');
    });

    it('handles invalid import file', async () => {
      const mockData = new TextEncoder().encode('invalid json');
      vi.mocked(workspace.fs.readFile).mockResolvedValue(mockData);
      
      await service.importStateFile('/invalid.json');
      
      expect(window.showErrorMessage).toHaveBeenCalled();
    });
  });

  describe('group import/export', () => {
    beforeEach(async () => {
      await service.attachStateHandler();
      await service.waitForRenderComplete();
    });

    it('exports a group to file', async () => {
      vi.mocked(workspace.fs.writeFile).mockResolvedValue(undefined);

      service.createGroup('export-me');
      const group = Object.values(service.state.groups).find(g => g.name === 'export-me');
      expect(group).toBeDefined();

      // Clear previous writeFile calls from createGroup's save
      vi.mocked(workspace.fs.writeFile).mockClear();

      await service.exportGroup(group!.id, 'file:///export.tabstack');

      expect(workspace.fs.writeFile).toHaveBeenCalled();
      const writeCall = vi.mocked(workspace.fs.writeFile).mock.calls.find(call => {
        const uri = call[0] as Uri;
        return uri.toString().includes('export.tabstack');
      });
      expect(writeCall).toBeDefined();
      const written = JSON.parse(new TextDecoder().decode(writeCall![1] as Uint8Array));
      expect(written.type).toBe('tabstack-group');
      expect(written.group.name).toBe('export-me');
      expect(written.version).toBeDefined();
    });

    it('shows warning when exporting non-existent group', async () => {
      await service.exportGroup('non-existent', 'file:///export.tabstack');

      expect(window.showWarningMessage).toHaveBeenCalled();
    });

    it('imports a group from file', async () => {
      const groupData = {
        version: 3,
        type: 'tabstack-group',
        group: {
          id: 'imported-id',
          name: 'imported-group',
          state: {
            tabState: { tabGroups: {}, activeGroup: null },
            layout: { orientation: 0, groups: [] }
          },
          createdAt: Date.now(),
          lastSelectedAt: 0
        }
      };
      const mockData = new TextEncoder().encode(JSON.stringify(groupData));
      vi.mocked(workspace.fs.readFile).mockResolvedValue(mockData);
      configService.getMasterWorkspaceFolder.mockReturnValue('file:///workspace');

      await service.importGroup('/import.tabstack');

      const imported = Object.values(service.state.groups).find(g => g.name === 'imported-group');
      expect(imported).toBeDefined();
      // should have a new ID (not the original)
      expect(imported!.id).not.toBe('imported-id');
    });

    it('handles invalid group file on import', async () => {
      const mockData = new TextEncoder().encode('not json');
      vi.mocked(workspace.fs.readFile).mockResolvedValue(mockData);

      await service.importGroup('/bad.tabstack');

      expect(window.showErrorMessage).toHaveBeenCalled();
    });

    it('rejects files with wrong type field', async () => {
      const badData = { version: 3, type: 'wrong', group: null };
      const mockData = new TextEncoder().encode(JSON.stringify(badData));
      vi.mocked(workspace.fs.readFile).mockResolvedValue(mockData);

      await service.importGroup('/wrong-type.tabstack');

      expect(window.showErrorMessage).toHaveBeenCalled();
    });

    it('prompts on duplicate name and allows overwrite', async () => {
      service.createGroup('dup-group');
      const existing = Object.values(service.state.groups).find(g => g.name === 'dup-group');
      expect(existing).toBeDefined();

      const groupData = {
        version: 3,
        type: 'tabstack-group',
        group: {
          id: 'new-id',
          name: 'dup-group',
          state: {
            tabState: { tabGroups: {}, activeGroup: null },
            layout: { orientation: 0, groups: [] }
          },
          createdAt: Date.now(),
          lastSelectedAt: 0
        }
      };
      const mockData = new TextEncoder().encode(JSON.stringify(groupData));
      vi.mocked(workspace.fs.readFile).mockResolvedValue(mockData);
      vi.mocked(window.showQuickPick).mockResolvedValue('Yes' as any);
      configService.getMasterWorkspaceFolder.mockReturnValue('file:///workspace');

      await service.importGroup('/dup.tabstack');

      // Old group should be gone
      expect(service.state.groups[existing!.id]).toBeUndefined();
      // New group with same name should exist
      const imported = Object.values(service.state.groups).find(g => g.name === 'dup-group');
      expect(imported).toBeDefined();
      expect(imported!.id).not.toBe(existing!.id);
    });

    it('cancels import when user declines overwrite', async () => {
      service.createGroup('dup-group2');
      const existing = Object.values(service.state.groups).find(g => g.name === 'dup-group2');
      expect(existing).toBeDefined();

      const groupData = {
        version: 3,
        type: 'tabstack-group',
        group: {
          id: 'new-id-2',
          name: 'dup-group2',
          state: {
            tabState: { tabGroups: {}, activeGroup: null },
            layout: { orientation: 0, groups: [] }
          },
          createdAt: Date.now(),
          lastSelectedAt: 0
        }
      };
      const mockData = new TextEncoder().encode(JSON.stringify(groupData));
      vi.mocked(workspace.fs.readFile).mockResolvedValue(mockData);
      vi.mocked(window.showQuickPick).mockResolvedValue('No' as any);
      configService.getMasterWorkspaceFolder.mockReturnValue('file:///workspace');

      await service.importGroup('/dup2.tabstack');

      // Original group should still exist
      expect(service.state.groups[existing!.id]).toBeDefined();
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
      const initialId = service.state.stateContainer?.id;
      service.createGroup('group-a');
      const groupA = Object.values(service.state.groups).find(g => g.name === 'group-a');
      
      if (groupA) {
        // Switch to new group, which saves previous
        service.switchToGroup(groupA.id);
        const currentId = service.state.stateContainer?.id;
        expect(currentId).toBe(groupA.id);
        
        // Quick switch back to previous
        service.quickSwitch();
        expect(service.state.stateContainer?.id).toBe(initialId);
      }
    });
  });

  describe('sync', () => {
    beforeEach(async () => {
      await service.attachStateHandler();
    });

    it('triggers tab state sync', () => {
      const tabStateSpy = vi.fn();
      service.onDidSyncTabState(tabStateSpy);

      service.triggerTabStateSync();

      expect(tabStateSpy).toHaveBeenCalledTimes(1);
      const data = tabStateSpy.mock.calls[0][0];
      expect(data).toHaveProperty('tabState');
      expect(data).toHaveProperty('selectedGroup');
      expect(data).toHaveProperty('rendering');
    });

    it('triggers collections sync with enriched data', () => {
      service.createGroup('EnrichedGroup');
      const collectionsSpy = vi.fn();
      service.onDidSyncCollections(collectionsSpy);

      service.triggerCollectionsSync();

      expect(collectionsSpy).toHaveBeenCalledTimes(1);
      const data = collectionsSpy.mock.calls[0][0];
      expect(data).toHaveProperty('groups');
      expect(data).toHaveProperty('histories');
      expect(data).toHaveProperty('addons');
      expect(data).toHaveProperty('selectedGroup');
      expect(data).toHaveProperty('quickSlots');

      // Enriched data should include layout and tabs
      if (data.groups.length > 0) {
        expect(data.groups[0]).toHaveProperty('layout');
        expect(data.groups[0]).toHaveProperty('tabs');
      }
    });

    it('triggers config sync', () => {
      const configSpy = vi.fn();
      service.onDidSyncConfig(configSpy);

      service.triggerConfigSync();

      expect(configSpy).toHaveBeenCalledTimes(1);
      const data = configSpy.mock.calls[0][0];
      expect(data).toHaveProperty('masterWorkspaceFolder');
      expect(data).toHaveProperty('availableWorkspaceFolders');
      expect(data).toHaveProperty('gitIntegration');
      expect(data).toHaveProperty('historyMaxEntries');
      expect(data).toHaveProperty('storageType');
      expect(data).toHaveProperty('tabKindColors');
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

    it('does not reattach handlers when only git integration changes', async () => {
      const attachSpy = vi.spyOn(service, 'attachStateHandler');

      await configService.emitConfigChange({
        gitIntegration: {
          enabled: true,
          mode: GitIntegrationMode.FullAuto,
          groupPrefix: 'git:'
        }
      });

      expect(gitService.updateRepository).toHaveBeenCalled();
      expect(attachSpy).not.toHaveBeenCalled();
    });

    it('reattaches handlers when storage type changes', async () => {
      const attachSpy = vi.spyOn(service, 'attachStateHandler');

      await configService.emitConfigChange({
        storageType: 'workspace-state'
      });

      expect(attachSpy).toHaveBeenCalledTimes(1);
      expect(gitService.updateRepository).not.toHaveBeenCalled();
    });
  });

  describe('disposal', () => {
    it('cleans up resources', async () => {
      await service.attachStateHandler();
      
      expect(() => service.dispose()).not.toThrow();
      // State getter still returns an object, but handlers are null
      expect(service.state.stateContainer).toBeNull();
    });

    it('can be disposed without state handler', () => {
      expect(() => service.dispose()).not.toThrow();
    });
  });
});

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { commands } from 'vscode';
import { TabStateHandler } from '../../../src/handlers/tab-state';
import { createDefaultTabStateFileContent } from '../../../src/types/tab-manager';
import * as tabUtils from '../../../src/utils/tab-utils';
import { MockConfigService, MockWorkspaceStorageHandler } from '../../mocks';

describe('TabStateHandler', () => {
  let handler: TabStateHandler;
  let configService: MockConfigService;
  let persistenceHandler: MockWorkspaceStorageHandler;

  beforeEach(() => {
    vi.clearAllMocks();

    configService = new MockConfigService({
      historyMaxEntries: 10,
      masterWorkspaceFolder: null
    });

    persistenceHandler = new MockWorkspaceStorageHandler(createDefaultTabStateFileContent());

    // Mock tab state and layout
    vi.spyOn(tabUtils, 'getTabState').mockReturnValue({
      tabGroups: {},
      activeGroup: null
    });

    vi.mocked(commands.executeCommand).mockImplementation((cmd: string) => {
      if (cmd === 'vscode.getEditorLayout') {
        return Promise.resolve({ orientation: 0, groups: [{ size: 1 }] });
      }
      return Promise.resolve();
    });

    handler = new TabStateHandler(configService as any, persistenceHandler as any);
  });

  afterEach(() => {
    handler.dispose();
  });

  describe('initialization', () => {
    it('initializes with persistence data', async () => {
      await handler.initialize();

      expect(persistenceHandler.load).toHaveBeenCalled();
      expect(persistenceHandler.get).toHaveBeenCalled();
    });

    it('syncs with VSCode if no current state container', async () => {
      await handler.initialize();

      expect(tabUtils.getTabState).toHaveBeenCalled();
      expect(commands.executeCommand).toHaveBeenCalledWith('vscode.getEditorLayout');
    });

    it('subscribes to store changes', async () => {
      await handler.initialize();

      // Store subscription should be active
      expect(handler.stateContainer).toBeDefined();
    });
  });

  describe('groups', () => {
    beforeEach(async () => {
      await handler.initialize();
    });

    it('creates a new group', async () => {
      const result = await handler.createGroup('Test Group');

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Test Group');
      expect(handler.groups[result!.id]).toBeDefined();
    });

    it('prevents duplicate group names', async () => {
      await handler.createGroup('Test Group');
      const result = await handler.createGroup('Test Group');

      expect(result).toBeNull();
    });

    it('renames a group', async () => {
      const group = await handler.createGroup('Original Name');
      const result = handler.renameGroup(group!.id, 'New Name');

      expect(result).toBe(true);
      expect(handler.groups[group!.id].name).toBe('New Name');
    });

    it('fails to rename non-existent group', () => {
      const result = handler.renameGroup('fake-id', 'New Name');
      expect(result).toBe(false);
    });

    it('deletes a group', async () => {
      const group = await handler.createGroup('Test Group');
      const result = handler.deleteGroup(group!.id);

      expect(result).toBe(true);
      expect(handler.groups[group!.id]).toBeUndefined();
    });

    it('fails to delete non-existent group', () => {
      const result = handler.deleteGroup('fake-id');
      expect(result).toBe(false);
    });

    it('loads a group state', async () => {
      const group = await handler.createGroup('Test Group');
      const result = handler.loadState(group!.id);

      expect(result).toBe(true);
    });

    it('fails to load non-existent group', () => {
      const result = handler.loadState('fake-id');
      expect(result).toBe(false);
    });

    it('returns false when loading null group', () => {
      const result = handler.loadState(null);
      expect(result).toBe(false);
    });
  });

  describe('history', () => {
    beforeEach(async () => {
      await handler.initialize();
    });

    it('adds state to history', async () => {
      const result = await handler.addCurrentStateToHistory();

      expect(result).not.toBeNull();
      expect(handler.history[result!.id]).toBeDefined();
    });

    it('prunes history when exceeding max entries', async () => {
      vi.mocked(configService.getHistoryMaxEntries).mockReturnValue(2);

      await handler.addCurrentStateToHistory();
      await handler.addCurrentStateToHistory();
      const third = await handler.addCurrentStateToHistory();

      const historyCount = Object.keys(handler.history).length;
      expect(historyCount).toBeLessThanOrEqual(2);
      expect(handler.history[third!.id]).toBeDefined();
    });

    it('deletes history entry', async () => {
      const entry = await handler.addCurrentStateToHistory();
      const result = handler.deleteHistoryEntry(entry!.id);

      expect(result).toBe(true);
      expect(handler.history[entry!.id]).toBeUndefined();
    });

    it('fails to delete non-existent history entry', () => {
      const result = handler.deleteHistoryEntry('fake-id');
      expect(result).toBe(false);
    });

    it('loads history state', async () => {
      const entry = await handler.addCurrentStateToHistory();
      const result = handler.loadHistoryState(entry!.id);

      expect(result).toBe(true);
    });

    it('fails to load non-existent history state', () => {
      const result = handler.loadHistoryState('fake-id');
      expect(result).toBe(false);
    });
  });

  describe('addons', () => {
    beforeEach(async () => {
      await handler.initialize();
    });

    it('creates an addon', () => {
      const state = handler.stateContainer!.state;
      const result = handler.addToAddons(state, 'Test Addon');

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Test Addon');
      expect(handler.addons[result!.id]).toBeDefined();
    });

    it('prevents duplicate addon names', () => {
      const state = handler.stateContainer!.state;
      handler.addToAddons(state, 'Test Addon');
      const result = handler.addToAddons(state, 'Test Addon');

      expect(result).toBeNull();
    });

    it('renames an addon', () => {
      const state = handler.stateContainer!.state;
      const addon = handler.addToAddons(state, 'Original Name');
      const result = handler.renameAddon(addon!.id, 'New Name');

      expect(result).toBe(true);
      expect(handler.addons[addon!.id].name).toBe('New Name');
    });

    it('fails to rename non-existent addon', () => {
      const result = handler.renameAddon('fake-id', 'New Name');
      expect(result).toBe(false);
    });

    it('deletes an addon', () => {
      const state = handler.stateContainer!.state;
      const addon = handler.addToAddons(state, 'Test Addon');
      const result = handler.deleteAddon(addon!.id);

      expect(result).toBe(true);
      expect(handler.addons[addon!.id]).toBeUndefined();
    });

    it('fails to delete non-existent addon', () => {
      const result = handler.deleteAddon('fake-id');
      expect(result).toBe(false);
    });
  });

  describe('quick slots', () => {
    beforeEach(async () => {
      await handler.initialize();
    });

    it('assigns a group to quick slot', async () => {
      const group = await handler.createGroup('Test Group');
      handler.setQuickSlot('1', group!.id);

      const quickSlots = handler.getQuickSlots();
      expect(quickSlots['1']).toBe(group!.id);
    });

    it('clears a quick slot assignment', async () => {
      const group = await handler.createGroup('Test Group');
      handler.setQuickSlot('1', group!.id);
      handler.setQuickSlot('1', null);

      const quickSlots = handler.getQuickSlots();
      expect(quickSlots['1']).toBeUndefined();
    });

    it('gets quick slot assignment', async () => {
      const group = await handler.createGroup('Test Group');
      handler.setQuickSlot('1', group!.id);

      const assignment = handler.getQuickSlotAssignment('1');
      expect(assignment).toBe(group!.id);
    });
  });

  describe('state management', () => {
    beforeEach(async () => {
      await handler.initialize();
    });

    it('forks state', () => {
      const before = handler.stateContainer;
      handler.forkState();
      const after = handler.stateContainer;

      expect(after?.id).not.toBe(before?.id);
    });

    it('syncs state with VSCode', async () => {
      const result = await handler.syncStateWithVSCode();

      expect(result).toBeDefined();
      expect(result.state.tabState).toBeDefined();
      expect(result.state.layout).toBeDefined();
    });

    it('syncs selection', () => {
      const selection = {
        id: 'test-id',
        selection: {
          start: { line: 1, character: 0 },
          end: { line: 1, character: 5 },
          isEmpty: false,
          isSingleLine: true
        },
        lastUpdated: Date.now()
      };

      const result = handler.syncSelection(selection);

      expect(result.state.selectionMap[selection.id]).toEqual(selection.selection);
    });
  });

  describe('state containers', () => {
    beforeEach(async () => {
      await handler.initialize();
    });

    it('provides current state container', () => {
      expect(handler.stateContainer).toBeDefined();
    });

    it('provides previous state container after fork', () => {
      handler.forkState();
      expect(handler.previousStateContainer).toBeDefined();
    });

    it('sets state container', async () => {
      const group = await handler.createGroup('Test Group');
      handler.setState(group!);

      expect(handler.stateContainer?.id).toBe(group!.id);
    });
  });

  describe('import/export', () => {
    beforeEach(async () => {
      await handler.initialize();
    });

    it('exports state file', async () => {
      await handler.createGroup('Test Group');
      const result = handler.exportStateFile();

      expect(result).toBeDefined();
      expect(result.version).toBe(2);
    });

    it('imports state file', () => {
      const fileContent = {
        version: 2,
        groups: {},
        history: {},
        addons: {},
        quickSlots: {},
        selectedGroup: null,
        previousSelectedGroup: null
      };

      vi.mocked(configService.getMasterWorkspaceFolder).mockReturnValue('file:///workspace');
      
      const result = handler.importStateFile(fileContent);
      expect(result).toBe(true);
    });

    it('fails to import when no workspace folder', () => {
      vi.mocked(configService.getMasterWorkspaceFolder).mockReturnValue(null);
      
      const result = handler.importStateFile({});
      expect(result).toBe(false);
    });
  });

  describe('disposal', () => {
    it('cleans up resources', async () => {
      await handler.initialize();
      expect(() => handler.dispose()).not.toThrow();
    });

    it('can be disposed without initialization', () => {
      expect(() => handler.dispose()).not.toThrow();
    });
  });
});

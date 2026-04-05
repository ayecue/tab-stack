import { beforeEach, describe, expect, it } from 'vitest';
import { TabCollectionStateHandler } from '../../../src/handlers/tab-collection-state';
import { StateContainer } from '../../../src/types/tab-manager';

describe('TabCollectionStateHandler', () => {
  let handler: TabCollectionStateHandler;

  beforeEach(() => {
    handler = new TabCollectionStateHandler();
  });

  describe('initialization', () => {
    it('creates handler with empty collections', () => {
      expect(handler).toBeDefined();
      expect(handler.groups).toEqual({});
      expect(handler.history).toEqual({});
      expect(handler.addons).toEqual({});
      expect(handler.quickSlots).toEqual({});
    });
  });

  describe('initialize', () => {
    it('initializes with collections', () => {
      const group: StateContainer = {
        id: 'group-1',
        name: 'Test Group',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      handler.initialize({
        groups: { 'group-1': group },
        history: {},
        addons: {},
        quickSlots: {}
      });

      expect(handler.groups['group-1']).toBe(group);
    });
  });

  describe('group operations', () => {
    it('adds a group', () => {
      const group: StateContainer = {
        id: 'group-1',
        name: 'New Group',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      handler.addGroup(group);

      expect(handler.groups['group-1']).toBe(group);
    });

    it('updates a group', () => {
      const group: StateContainer = {
        id: 'group-1',
        name: 'Original',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      handler.addGroup(group);

      const updatedGroup = { ...group, name: 'Updated' };
      handler.updateGroup('group-1', updatedGroup);

      expect(handler.groups['group-1'].name).toBe('Updated');
    });

    it('renames a group', () => {
      const group: StateContainer = {
        id: 'group-1',
        name: 'Original',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      handler.addGroup(group);
      const result = handler.renameGroup('group-1', 'Renamed');

      expect(result).toBe(true);
      expect(handler.groups['group-1'].name).toBe('Renamed');
    });

    it('returns false when renaming non-existent group', () => {
      const result = handler.renameGroup('non-existent', 'Name');

      expect(result).toBe(false);
    });

    it('removes a group', () => {
      const group: StateContainer = {
        id: 'group-1',
        name: 'To Remove',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      handler.addGroup(group);
      const result = handler.removeGroup('group-1');

      expect(result).toBe(true);
      expect(handler.groups['group-1']).toBeUndefined();
    });

    it('loads a group (updates last selected time)', () => {
      const group: StateContainer = {
        id: 'group-1',
        name: 'Load Test',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: 0
      };

      handler.addGroup(group);
      handler.loadGroup('group-1');

      expect(handler.groups['group-1'].lastSelectedAt).toBeGreaterThan(0);
    });
  });

  describe('history operations', () => {
    it('adds history', () => {
      const history: StateContainer = {
        id: 'history-1',
        name: 'Snapshot 1',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      handler.addHistory(history);

      expect(handler.history['history-1']).toBe(history);
    });

    it('prunes history when exceeding max entries', () => {
      const baseTime = 1_000_000;

      // Add multiple history entries
      for (let i = 0; i < 15; i++) {
        const history: StateContainer = {
          id: `history-${i}`,
          name: `Snapshot ${i}`,
          state: {
            tabState: { tabGroups: {}, activeGroup: null },
            layout: { groups: [], orientation: 0 }
          },
          createdAt: baseTime + i,
          lastSelectedAt: baseTime + i
        };
        handler.addHistory(history);
      }

      handler.pruneHistory(10);

      expect(Object.keys(handler.history)).toHaveLength(10);
      expect(handler.history['history-0']).toBeUndefined();
      expect(handler.history['history-4']).toBeUndefined();
      expect(handler.history['history-5']).toBeDefined();
      expect(handler.history['history-14']).toBeDefined();
    });

    it('removes history', () => {
      const history: StateContainer = {
        id: 'history-1',
        name: 'To Remove',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      handler.addHistory(history);
      const result = handler.removeHistory('history-1');

      expect(result).toBe(true);
      expect(handler.history['history-1']).toBeUndefined();
    });
  });

  describe('addon operations', () => {
    it('adds an addon', () => {
      const addon: StateContainer = {
        id: 'addon-1',
        name: 'Test Addon',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: 0
      };

      handler.addAddon(addon);

      expect(handler.addons['addon-1']).toBe(addon);
    });

    it('renames an addon', () => {
      const addon: StateContainer = {
        id: 'addon-1',
        name: 'Original Addon',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: 0
      };

      handler.addAddon(addon);
      const result = handler.renameAddon('addon-1', 'Renamed Addon');

      expect(result).toBe(true);
      expect(handler.addons['addon-1'].name).toBe('Renamed Addon');
    });

    it('removes an addon', () => {
      const addon: StateContainer = {
        id: 'addon-1',
        name: 'To Remove',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: 0
      };

      handler.addAddon(addon);
      const result = handler.removeAddon('addon-1');

      expect(result).toBe(true);
      expect(handler.addons['addon-1']).toBeUndefined();
    });
  });

  describe('quick slot operations', () => {
    it('sets a quick slot', () => {
      // Add a group first since setQuickSlot validates group existence
      const group: StateContainer = {
        id: 'group-1',
        name: 'Group 1',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };
      handler.addGroup(group);

      handler.setQuickSlot('1', 'group-1');

      // Quick slots are stored internally, verify via getter
      expect(handler.getQuickSlotAssignment('1')).toBe('group-1');
    });

    it('clears a quick slot by setting to null', () => {
      const group: StateContainer = {
        id: 'group-1',
        name: 'Group 1',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };
      handler.addGroup(group);

      handler.setQuickSlot('1', 'group-1');
      handler.setQuickSlot('1', null);

      // After clearing, should return null
      expect(handler.getQuickSlotAssignment('1')).toBeNull();
    });

    it('gets quick slot assignment', () => {
      const group: StateContainer = {
        id: 'group-2',
        name: 'Group 2',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };
      handler.addGroup(group);

      handler.setQuickSlot('2', 'group-2');

      const result = handler.getQuickSlotAssignment('2');

      expect(result).toBe('group-2');
    });

    it('returns null for unassigned quick slot', () => {
      const result = handler.getQuickSlotAssignment('9');

      expect(result).toBeNull();
    });
  });

  describe('disposal', () => {
    it('disposes without throwing', () => {
      expect(() => handler.dispose()).not.toThrow();
    });
  });

  describe('onDidChangeState', () => {
    it('provides event emitter', () => {
      const listener = () => {};
      const disposable = handler.onDidChangeState(listener);
      
      expect(disposable).toBeDefined();
      expect(disposable.dispose).toBeDefined();
      
      disposable.dispose();
    });
  });
});

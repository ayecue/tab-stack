import { describe, expect, it } from 'vitest';
import { transform } from '../../../src/transformers/migration/v0';

describe('v0 migration transformer', () => {
  it('transforms v0 format to v1 format', () => {
    const v0Payload = {
      groups: {
        'Group 1': {
          tabState: {
            tabGroups: {
              0: {
                viewColumn: 1,
                tabs: []
              }
            },
            activeGroup: 0
          },
          layout: { orientation: 0, groups: [] }
        },
        'Group 2': {
          tabState: {
            tabGroups: {
              0: {
                viewColumn: 1,
                tabs: []
              }
            },
            activeGroup: 0
          },
          layout: { orientation: 0, groups: [] }
        }
      },
      history: {
        'History 1': {
          tabState: {
            tabGroups: {},
            activeGroup: null
          },
          layout: { orientation: 0, groups: [] }
        }
      },
      selectedGroup: 'Group 1',
      previousSelectedGroup: 'Group 2',
      quickSlots: {
        '1': 'Group 1'
      }
    };

    const result = transform(v0Payload);

    expect(result.version).toBe(1);
    expect(Object.keys(result.groups)).toHaveLength(2);
    expect(Object.keys(result.history)).toHaveLength(1);
    
    // Check that groups have new structure
    const groupIds = Object.keys(result.groups);
    groupIds.forEach(id => {
      const group = result.groups[id];
      expect(group).toHaveProperty('id', id);
      expect(group).toHaveProperty('name');
      expect(group).toHaveProperty('state');
      expect(group).toHaveProperty('lastSelectedAt');
      expect(group).toHaveProperty('createdAt');
      expect(group.state).toHaveProperty('tabState');
      expect(group.state).toHaveProperty('layout');
    });

    // Check that history has new structure  
    const historyIds = Object.keys(result.history);
    historyIds.forEach(id => {
      const history = result.history[id];
      expect(history).toHaveProperty('id', id);
      expect(history).toHaveProperty('state');
      expect(history).toHaveProperty('createdAt');
      expect(history).toHaveProperty('lastSelectedAt');
    });

    // selectedGroup and previousSelectedGroup should be migrated to new IDs
    expect(result.selectedGroup).not.toBeNull();
    expect(result.previousSelectedGroup).not.toBeNull();
    expect(typeof result.selectedGroup).toBe('string');
    expect(typeof result.previousSelectedGroup).toBe('string');
    
    // quickSlots should be migrated
    expect(Object.keys(result.quickSlots)).toHaveLength(1);
    expect(result.quickSlots['1']).toBeDefined();
  });

  it('handles empty groups', () => {
    const v0Payload = {
      groups: {},
      history: {},
      selectedGroup: '',
      previousSelectedGroup: '',
      quickSlots: {}
    };

    const result = transform(v0Payload);

    expect(result.version).toBe(1);
    expect(Object.keys(result.groups)).toHaveLength(0);
    expect(Object.keys(result.history)).toHaveLength(0);
    expect(result.selectedGroup).toBeNull();
    expect(result.previousSelectedGroup).toBeNull();
  });

  it('handles missing history field', () => {
    const v0Payload = {
      groups: {
        'Test Group': {
          tabState: {
            tabGroups: {},
            activeGroup: null
          },
          layout: { orientation: 0, groups: [] }
        }
      },
      selectedGroup: '',
      previousSelectedGroup: '',
      quickSlots: {}
    };

    const result = transform(v0Payload);

    expect(result.version).toBe(1);
    expect(Object.keys(result.groups)).toHaveLength(1);
    expect(Object.keys(result.history)).toHaveLength(0);
  });
});

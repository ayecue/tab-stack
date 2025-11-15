import { describe, expect, it } from 'vitest';
import { transform } from '../../../src/transformers/migration/v1';

describe('v1 migration transformer', () => {
  it('transforms v1 format to v2 format', () => {
    const v1Payload = {
      version: 1,
      groups: {
        'group-id-1': {
          id: 'group-id-1',
          name: 'Group 1',
          state: {
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
          createdAt: 1234567890,
          lastSelectedAt: 1234567900
        }
      },
      history: {
        'history-id-1': {
          id: 'history-id-1',
          name: 'History Entry',
          state: {
            tabState: {
              tabGroups: {},
              activeGroup: null
            },
            layout: { orientation: 0, groups: [] }
          },
          createdAt: 1234567890,
          lastSelectedAt: 0
        }
      },
      selectedGroup: 'group-id-1',
      previousSelectedGroup: 'group-id-2',
      quickSlots: {
        '1': 'group-id-1'
      }
    };

    const result = transform(v1Payload);

    expect(result.version).toBe(2);
    // v1 merges history into groups
    expect(Object.keys(result.groups)).toHaveLength(1); // group + history
    expect(Object.keys(result.history)).toHaveLength(1);
    expect(result.addons).toBeDefined();
    
    // selectedGroup and previousSelectedGroup should be null
    expect(result.selectedGroup).toBeDefined();
    expect(result.previousSelectedGroup).toBeDefined();
    
    // quickSlots should be empty
    expect(Object.keys(result.quickSlots)).toHaveLength(1);

    // Check group structure
    const group = result.groups['group-id-1'];
    expect(group).toHaveProperty('id', 'group-id-1');
    expect(group).toHaveProperty('name', 'Group 1');
    expect(group).toHaveProperty('state');
    expect(group).toHaveProperty('createdAt', 1234567890);
    expect(group).toHaveProperty('lastSelectedAt', 1234567900);
  });

  it('handles empty groups and history', () => {
    const v1Payload = {
      version: 1,
      groups: {},
      history: {},
      selectedGroup: '',
      previousSelectedGroup: '',
      quickSlots: {}
    };

    const result = transform(v1Payload);

    expect(result.version).toBe(2);
    expect(Object.keys(result.groups)).toHaveLength(0);
    expect(Object.keys(result.history)).toHaveLength(0);
    expect(Object.keys(result.addons)).toHaveLength(0);
  });

  it('migrates addons field if present', () => {
    const v1Payload = {
      version: 1,
      groups: {},
      history: {},
      addons: {
        'addon-id-1': {
          id: 'addon-id-1',
          name: 'Addon 1',
          state: {
            tabState: {
              tabGroups: {},
              activeGroup: null
            },
            layout: { orientation: 0, groups: [] }
          },
          createdAt: 1234567890,
          lastSelectedAt: 0
        }
      },
      selectedGroup: '',
      previousSelectedGroup: '',
      quickSlots: {}
    };

    const result = transform(v1Payload);

    expect(result.version).toBe(2);
    // v1 merges addons into groups
    expect(Object.keys(result.addons)).toHaveLength(1);
    expect(result.addons['addon-id-1']).toBeDefined();
    expect(result.addons['addon-id-1'].name).toBe('Addon 1');
  });

  it('initializes empty addons if not present in v1', () => {
    const v1Payload = {
      version: 1,
      groups: {},
      history: {},
      selectedGroup: '',
      previousSelectedGroup: '',
      quickSlots: {}
    };

    const result = transform(v1Payload);

    expect(result.addons).toBeDefined();
    expect(Object.keys(result.addons)).toHaveLength(0);
  });
});

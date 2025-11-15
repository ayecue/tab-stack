import { describe, expect, it } from 'vitest';

import { createTabStateStore } from '../../../src/stores/tab-state';
import { stateContainerFactory, tabStateFileContentFactory } from '../../factories';

describe('tab-state store', () => {
  it('initializes with provided state file data', () => {
    const store = createTabStateStore();
    const groupA = stateContainerFactory.build({ id: 'group-a', name: 'Group A' });
    const groupB = stateContainerFactory.build({ id: 'group-b', name: 'Group B' });

    store.send({
      type: 'INITIALIZE',
      data: tabStateFileContentFactory.build({
        groups: {
          [groupA.id]: groupA,
          [groupB.id]: groupB
        },
        history: {},
        addons: {},
        quickSlots: {},
        selectedGroup: groupA.id,
        previousSelectedGroup: groupB.id
      })
    });

    const context = store.getSnapshot().context;

    expect(context.groups[groupA.id]).toEqual(groupA);
    expect(context.currentStateContainer?.id).toBe(groupA.id);
    expect(context.previousStateContainer?.id).toBe(groupB.id);
    expect(context.isInitialized).toBe(true);
  });

  it('creates, renames and deletes groups while keeping quick slots in sync', () => {
    const store = createTabStateStore();
    const baseGroup = stateContainerFactory.build({ id: 'group-a', name: 'Original' });

    store.send({ type: 'CREATE_GROUP', stateContainer: baseGroup });
    store.send({
      type: 'SET_QUICK_SLOT',
      slot: '1',
      groupId: baseGroup.id
    });
    store.send({
      type: 'SET_QUICK_SLOT',
      slot: '2',
      groupId: baseGroup.id
    });

    let context = store.getSnapshot().context;
    expect(context.quickSlots).toEqual({ '2': baseGroup.id });

    store.send({
      type: 'RENAME_GROUP',
      groupId: baseGroup.id,
      newName: 'Renamed'
    });

    context = store.getSnapshot().context;
    expect(context.groups[baseGroup.id].name).toBe('Renamed');
    expect(context.currentStateContainer?.name).toBe('Renamed');

    store.send({ type: 'DELETE_GROUP', groupId: baseGroup.id });

    context = store.getSnapshot().context;
    expect(context.groups[baseGroup.id]).toBeUndefined();
    expect(context.quickSlots).toEqual({});
    expect(context.currentStateContainer).toBeNull();
  });

  it('loads history entries and prunes overflow', () => {
    const store = createTabStateStore();
    const historyEntries = Array.from({ length: 3 }).map((_, index) =>
      stateContainerFactory.build({ id: `hist-${index}` })
    );

    historyEntries.forEach((entry) =>
      store.send({ type: 'ADD_TO_HISTORY', stateContainer: entry })
    );

    store.send({ type: 'PRUNE_HISTORY', maxEntries: 2 });

    let context = store.getSnapshot().context;
    expect(Object.keys(context.history)).toHaveLength(2);

    const target = historyEntries[1];
    store.send({ type: 'LOAD_HISTORY_STATE', historyId: target.id });

    context = store.getSnapshot().context;
    expect(context.currentStateContainer?.id).toBe(target.id);
  });

  it('ignores write operations when locked and allows them when unlocked', () => {
    const store = createTabStateStore();
    const group = stateContainerFactory.build({ id: 'group-locked', name: 'Locked' });

    // Lock the store and try to create a group
    store.send({ type: 'LOCK_STATE' });
    store.send({ type: 'CREATE_GROUP', stateContainer: group });

    let context = store.getSnapshot().context;
    expect(context.groups[group.id]).toBeUndefined();

    // Unlock and create group again
    store.send({ type: 'UNLOCK_STATE' });
    store.send({ type: 'CREATE_GROUP', stateContainer: group });

    context = store.getSnapshot().context;
    expect(context.groups[group.id]).toEqual(group);
  });
});

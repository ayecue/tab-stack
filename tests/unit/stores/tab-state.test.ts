import { describe, expect, it } from 'vitest';

import { createTabStateStore } from '../../../src/stores/tab-state';
import {
  StateContainer,
  TabStateFileContent,
  createEmptyStateContainer
} from '../../../src/types/tab-manager';

const createStateContainer = (
  overrides: Partial<StateContainer> = {}
): StateContainer => ({
  ...createEmptyStateContainer(),
  ...overrides,
  state: {
    ...createEmptyStateContainer().state,
    ...(overrides.state ?? {})
  }
});

const createStateFile = (
  overrides: Partial<TabStateFileContent> = {}
): TabStateFileContent => ({
  version: 2,
  groups: {},
  history: {},
  addons: {},
  selectedGroup: null as unknown as string,
  previousSelectedGroup: null as unknown as string,
  quickSlots: {},
  ...overrides
});

describe('tab-state store', () => {
  it('initializes with provided state file data', () => {
    const store = createTabStateStore();
    const groupA = createStateContainer({ id: 'group-a', name: 'Group A' });
    const groupB = createStateContainer({ id: 'group-b', name: 'Group B' });

    store.send({
      type: 'INITIALIZE',
      data: createStateFile({
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
    const baseGroup = createStateContainer({ id: 'group-a', name: 'Original' });

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
      createStateContainer({ id: `hist-${index}` })
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
});

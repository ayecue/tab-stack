import { describe, expect, it, vi } from 'vitest';

import { createPersistenceStore } from '../../../src/stores/persistence';
import { TabStateFileContent } from '../../../src/types/tab-manager';
import { MockWorkspaceStorageHandler } from '../../mocks';

describe('PersistenceStore', () => {
  const createMockHandler = () => new MockWorkspaceStorageHandler();

  describe('initialization', () => {
    it('initializes with default state', () => {
      const handler = createMockHandler();
      const store = createPersistenceStore(handler);
      const snapshot = store.getSnapshot();

      expect(snapshot.context.isLoading).toBe(false);
      expect(snapshot.context.data).toBeDefined();
      expect(snapshot.context.data?.version).toBe(2);
    });
  });

  describe('load lifecycle', () => {
    it('transitions to loading state', () => {
      const handler = createMockHandler();
      const store = createPersistenceStore(handler);

      store.send({ type: 'LOAD' });
      const snapshot = store.getSnapshot();

      expect(snapshot.context.isLoading).toBe(true);
    });

    it('completes load successfully', () => {
      const handler = createMockHandler();
      const store = createPersistenceStore(handler);

      const mockData: TabStateFileContent = {
        version: 2,
        groups: {},
        history: {},
        addons: {},
        selectedGroup: null as unknown as string,
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      };

      store.send({ type: 'LOAD' });
      store.send({ type: 'DONE', data: mockData, success: true });

      const snapshot = store.getSnapshot();

      expect(snapshot.context.isLoading).toBe(false);
      expect(snapshot.context.data).toEqual(mockData);
    });

    it('can clear data', () => {
      const handler = createMockHandler();
      const store = createPersistenceStore(handler);

      const customData: TabStateFileContent = {
        version: 2,
        groups: { test: {} as any },
        history: {},
        addons: {},
        selectedGroup: 'test',
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      };

      store.send({ type: 'DONE', data: customData, success: true });
      store.send({ type: 'CLEAR' });

      const snapshot = store.getSnapshot();

      expect(snapshot.context.data?.groups).toEqual({});
      expect(snapshot.context.data?.selectedGroup).toBeNull();
    });

    it('can reset to initial state', () => {
      const handler = createMockHandler();
      const store = createPersistenceStore(handler);

      store.send({ type: 'RESET' });

      const snapshot = store.getSnapshot();
      expect(snapshot.context.data?.version).toBe(2);
      expect(snapshot.context.isLoading).toBe(false);
    });
  });

  describe('save lifecycle', () => {
    it('saves data and calls handler write', async () => {
      const handler = createMockHandler();
      const store = createPersistenceStore(handler);

      const mockData: TabStateFileContent = {
        version: 2,
        groups: {},
        history: {},
        addons: {},
        selectedGroup: 'group1',
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      };

      store.send({ type: 'SAVE', data: mockData });
      
      // Wait for async write to be called
      await vi.waitFor(() => {
        expect(handler.write).toHaveBeenCalledWith(mockData);
      });

      const snapshot = store.getSnapshot();
      expect(snapshot.context.data).toEqual(mockData);
    });

    it('updates store data on save', () => {
      const handler = createMockHandler();
      const store = createPersistenceStore(handler);

      const mockData: TabStateFileContent = {
        version: 2,
        groups: { test: {} as any },
        history: {},
        addons: {},
        selectedGroup: 'test',
        previousSelectedGroup: null as unknown as string,
        quickSlots: {}
      };

      store.send({ type: 'SAVE', data: mockData });

      const snapshot = store.getSnapshot();
      expect(snapshot.context.data).toEqual(mockData);
    });
  });

  describe('subscriptions', () => {
    it('notifies subscribers of state changes', () => {
      const handler = createMockHandler();
      const store = createPersistenceStore(handler);
      const states: any[] = [];

      const unsubscribe = store.subscribe((state) => {
        states.push(state.context);
      });

      store.send({ type: 'LOAD' });

      expect(states.length).toBeGreaterThan(0);
      expect(states[states.length - 1].isLoading).toBe(true);

      unsubscribe.unsubscribe();
    });

    it('stops notifying after unsubscribe', () => {
      const handler = createMockHandler();
      const store = createPersistenceStore(handler);
      let callCount = 0;

      const unsubscribe = store.subscribe(() => {
        callCount++;
      });

      store.send({ type: 'LOAD' });
      const callsBeforeUnsubscribe = callCount;

      unsubscribe.unsubscribe();

      store.send({ type: 'LOAD' });
      const callsAfterUnsubscribe = callCount;

      expect(callsAfterUnsubscribe).toBe(callsBeforeUnsubscribe);
    });
  });
});

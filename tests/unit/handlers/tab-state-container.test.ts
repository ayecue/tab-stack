import { beforeEach, describe, expect, it } from 'vitest';
import { TabStateContainerHandler } from '../../../src/handlers/tab-state-container';
import { StateContainer } from '../../../src/types/tab-manager';

describe('TabStateContainerHandler', () => {
  let handler: TabStateContainerHandler;

  beforeEach(() => {
    handler = new TabStateContainerHandler();
  });

  describe('initialization', () => {
    it('creates handler with null state containers', () => {
      expect(handler).toBeDefined();
      expect(handler.currentStateContainer).toBeNull();
      expect(handler.previousStateContainer).toBeNull();
    });
  });

  describe('initialize', () => {
    it('initializes with state containers', () => {
      const container: StateContainer = {
        id: 'test-1',
        name: 'Test Container',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      const previous: StateContainer = {
        id: 'test-0',
        name: 'Previous',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      handler.initialize(container, previous);

      expect(handler.currentStateContainer).toBeDefined();
      expect(handler.currentStateContainer?.id).toBe(container.id);
    });
  });

  describe('setCurrentStateContainer', () => {
    it('sets current state container', () => {
      const container: StateContainer = {
        id: 'test-2',
        name: 'Test Container 2',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      handler.setCurrentStateContainer(container);

      expect(handler.currentStateContainer).toMatchObject({
        id: container.id,
        name: container.name,
        state: container.state
      });
    });

    it('moves current to previous when setting new current', () => {
      const container1: StateContainer = {
        id: 'test-1',
        name: 'First',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      const container2: StateContainer = {
        id: 'test-2',
        name: 'Second',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      handler.setCurrentStateContainer(container1);
      handler.setCurrentStateContainer(container2);

      expect(handler.currentStateContainer).toMatchObject({
        id: container2.id,
        name: container2.name,
        state: container2.state
      });
      expect(handler.previousStateContainer).toMatchObject({
        id: container1.id,
        name: container1.name,
        state: container1.state
      });
    });
  });

  describe('updateTabState', () => {
    it('updates tab state in current container', () => {
      const container: StateContainer = {
        id: 'test-3',
        name: 'Test Container 3',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      handler.setCurrentStateContainer(container);

      const newState = {
        tabState: {
          tabGroups: {
            1: { viewColumn: 1, tabs: [], activeTab: undefined }
          },
          activeGroup: 1
        },
        layout: { groups: [], orientation: 0 }
      };

      handler.updateTabState(newState);

      expect(handler.currentStateContainer?.state).toEqual(newState);
    });
  });

  describe('syncState', () => {
    it('syncs state without throwing', () => {
      const container: StateContainer = {
        id: 'sync-test',
        name: 'Sync Test',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };
      
      expect(() => handler.syncState(container)).not.toThrow();
    });
  });

  describe('forkState', () => {
    it('moves current to previous without creating new current', () => {
      const container: StateContainer = {
        id: 'test-4',
        name: 'Fork Test',
        state: {
          tabState: { tabGroups: {}, activeGroup: null },
          layout: { groups: [], orientation: 0 }
        },
        createdAt: Date.now(),
        lastSelectedAt: Date.now()
      };

      handler.setCurrentStateContainer(container);
      handler.forkState();

      expect(handler.previousStateContainer).toMatchObject({
        id: container.id,
        name: container.name,
        state: container.state
      });
      expect(handler.currentStateContainer).toMatchObject({
        name: 'untitled',
        state: container.state
      });
      expect(handler.currentStateContainer.id).not.toBe(container.id);
    });
  });

  describe('lockState and unlockState', () => {
    it('locks state', () => {
      handler.lockState();
      // Lock state is internal, just ensure it doesn't throw
    });

    it('unlocks state', () => {
      handler.unlockState();
      // Unlock state is internal, just ensure it doesn't throw
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

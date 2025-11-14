import { describe, expect, it, vi, beforeEach } from 'vitest';
import { WorkspaceStorageHandler } from '../../../src/handlers/workspace-storage';
import { createPersistenceStore, PersistenceStore } from '../../../src/stores/persistence';
import { createDefaultTabStateFileContent } from '../../../src/types/tab-manager';
import { createMockExtensionContext } from '../../mocks';

describe('WorkspaceStorageHandler', () => {
  let context: ReturnType<typeof createMockExtensionContext>;
  let store: PersistenceStore;
  let handler: WorkspaceStorageHandler;
  let mockHandler: any;

  beforeEach(() => {
    vi.clearAllMocks();

    context = createMockExtensionContext();

    mockHandler = {
      write: vi.fn().mockResolvedValue(undefined)
    };

    store = createPersistenceStore(mockHandler);
    handler = new WorkspaceStorageHandler(context, store);
  });

  describe('load', () => {
    it('loads data from workspace state', async () => {
      const mockData = {
        version: 2,
        groups: [],
        selectionMap: {}
      };
      vi.mocked(context.workspaceState.get).mockReturnValue(mockData);

      await handler.load();

      expect(context.workspaceState.get).toHaveBeenCalledWith('tabManagerState');
      const snapshot = store.getSnapshot();
      expect(snapshot.context.data).toEqual(mockData);
      expect(snapshot.context.isLoading).toBe(false);
    });

    it('creates default state when no data exists', async () => {
      vi.mocked(context.workspaceState.get).mockReturnValue(undefined);

      await handler.load();

      const snapshot = store.getSnapshot();
      expect(snapshot.context.data).toEqual(createDefaultTabStateFileContent());
    });

    it('creates default state when loading fails', async () => {
      vi.mocked(context.workspaceState.get).mockImplementation(() => {
        throw new Error('Storage error');
      });

      await handler.load();

      const snapshot = store.getSnapshot();
      expect(snapshot.context.data).toEqual(createDefaultTabStateFileContent());
      expect(snapshot.context.isLoading).toBe(false);
    });

    it('waits for existing load to complete', async () => {
      vi.mocked(context.workspaceState.get).mockReturnValue({
        version: 2,
        groups: [],
        selectionMap: {}
      });

      // Start loading
      const loadPromise1 = handler.load();
      
      // Try to load again while first is in progress
      const loadPromise2 = handler.load();

      await Promise.all([loadPromise1, loadPromise2]);

      // Second call should wait, not trigger another load
      const snapshot = store.getSnapshot();
      expect(snapshot.context.isLoading).toBe(false);
    });
  });

  describe('save', () => {
    it('sends save event to store', () => {
      const data = createDefaultTabStateFileContent();
      const sendSpy = vi.spyOn(store, 'send');

      handler.save(data);

      expect(sendSpy).toHaveBeenCalledWith({
        type: 'SAVE',
        data
      });
    });
  });

  describe('write', () => {
    it('writes data to workspace state', async () => {
      const data = createDefaultTabStateFileContent();

      await handler.write(data);

      expect(context.workspaceState.update).toHaveBeenCalledWith('tabManagerState', data);
    });

    it('handles write errors gracefully', async () => {
      const data = createDefaultTabStateFileContent();
      vi.mocked(context.workspaceState.update).mockRejectedValue(new Error('Write failed'));

      await expect(handler.write(data)).resolves.not.toThrow();
    });
  });

  describe('get', () => {
    it('returns current data from store', async () => {
      const mockData = {
        version: 2,
        groups: [],
        selectionMap: {}
      };
      vi.mocked(context.workspaceState.get).mockReturnValue(mockData);

      await handler.load();

      const result = handler.get();
      expect(result).toEqual(mockData);
    });

    it('returns default data when no data is loaded', () => {
      const result = handler.get();
      expect(result).toEqual(createDefaultTabStateFileContent());
    });
  });

  describe('reset', () => {
    it('sends clear event to store', () => {
      const sendSpy = vi.spyOn(store, 'send');

      handler.reset();

      expect(sendSpy).toHaveBeenCalledWith({ type: 'CLEAR' });
    });
  });
});

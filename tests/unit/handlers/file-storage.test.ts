import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Uri, workspace } from 'vscode';

import { FileStorageHandler } from '../../../src/handlers/file-storage';
import { createPersistenceStore, PersistenceStore } from '../../../src/stores/persistence';
import { tabStateFileContentFactory } from '../../factories';
import { MockConfigService } from '../../mocks';

describe('FileStorageHandler', () => {
  let configService: MockConfigService;
  let store: PersistenceStore;
  let handler: FileStorageHandler;
  let mockHandler: { write: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.clearAllMocks();

    configService = new MockConfigService();
    mockHandler = {
      write: vi.fn().mockResolvedValue(undefined)
    };

    store = createPersistenceStore(mockHandler as any);
    handler = new FileStorageHandler(configService as any, store);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('falls back to in-memory state when no workspace folder is configured', async () => {
    configService.getMasterWorkspaceFolder.mockReturnValue(null);
    const createDirectorySpy = vi.spyOn(workspace.fs, 'createDirectory');

    await handler.load();

    expect(createDirectorySpy).not.toHaveBeenCalled();
    expect(store.getSnapshot().context.data).toEqual(
      tabStateFileContentFactory.build()
    );
    expect(store.getSnapshot().context.isLoading).toBe(false);
  });

  it('loads state from a configured filesystem path', async () => {
    const storedData = tabStateFileContentFactory.build({
      groups: {},
      history: {},
      addons: {},
      selectedGroup: null as unknown as string,
      previousSelectedGroup: null as unknown as string,
      quickSlots: {}
    });

    configService.getMasterWorkspaceFolder.mockReturnValue('/tmp/tab-stack');
    const createDirectorySpy = vi
      .spyOn(workspace.fs, 'createDirectory')
      .mockResolvedValue(undefined);
    const readFileSpy = vi
      .spyOn(workspace.fs, 'readFile')
      .mockResolvedValue(
        new TextEncoder().encode(JSON.stringify(storedData))
      );

    await handler.load();

    expect(createDirectorySpy).toHaveBeenCalledWith(
      Uri.file('/tmp/tab-stack/.vscode')
    );
    expect(readFileSpy).toHaveBeenCalledWith(
      Uri.file('/tmp/tab-stack/.vscode/tmstate.json')
    );
    expect(handler.get()).toEqual(storedData);
  });

  it('writes state back to the resolved workspace file', async () => {
    const storedData = tabStateFileContentFactory.build();
    const nextData = tabStateFileContentFactory.build({
      groups: {},
      history: {},
      addons: {},
      selectedGroup: null as unknown as string,
      previousSelectedGroup: null as unknown as string,
      quickSlots: {}
    });

    configService.getMasterWorkspaceFolder.mockReturnValue('file:///tmp/tab-stack');
    vi.spyOn(workspace.fs, 'createDirectory').mockResolvedValue(undefined);
    vi.spyOn(workspace.fs, 'readFile').mockResolvedValue(
      new TextEncoder().encode(JSON.stringify(storedData))
    );
    const writeFileSpy = vi
      .spyOn(workspace.fs, 'writeFile')
      .mockResolvedValue(undefined);

    await handler.load();
    await handler.write(nextData);

    expect(writeFileSpy).toHaveBeenCalledWith(
      Uri.parse('file:///tmp/tab-stack/.vscode/tmstate.json', true),
      expect.any(Uint8Array)
    );
  });
});
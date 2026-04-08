import { beforeEach, describe, expect, it, vi } from 'vitest';
import { commands, FileType, Uri, window, workspace } from 'vscode';

import { createCommands } from '../../src/create-commands';
import { EXTENSION_NAME } from '../../src/types/extension';

type RegisteredCommand = (...args: unknown[]) => unknown;

describe('createCommands', () => {
  const registeredCommands = new Map<string, RegisteredCommand>();

  const createMockTabManagerService = () => ({
    state: {
      groups: {
        'group-1': {
          id: 'group-1',
          name: 'Group One',
          lastSelectedAt: 10,
          state: {
            tabState: {
              tabGroups: {
                1: {
                  viewColumn: 1,
                  activeTab: undefined,
                  tabs: [
                    {
                      id: 'tab-1',
                      label: 'alpha.ts',
                      kind: 'tabInputText',
                      uri: 'file:///workspace/src/alpha.ts',
                      isActive: true,
                      isPinned: false,
                      index: 0,
                      viewColumn: 1,
                      isRecoverable: true,
                      meta: {
                        type: 'textEditor'
                      }
                    }
                  ]
                }
              },
              activeGroup: 1
            }
          }
        }
      },
      history: {
        'history-1': {
          id: 'history-1',
          name: 'Snapshot One',
          createdAt: 50,
          state: {
            tabState: {
              tabGroups: {
                1: {
                  viewColumn: 1,
                  activeTab: undefined,
                  tabs: [
                    {
                      id: 'history-tab-1',
                      label: 'snapshot.ts'
                    }
                  ]
                }
              },
              activeGroup: 1
            }
          }
        }
      },
      addons: {},
      quickSlots: {},
      stateContainer: null,
      previousStateContainer: null
    },
    triggerTabStateSync: vi.fn(),
    triggerCollectionsSync: vi.fn(),
    triggerConfigSync: vi.fn(),
    quickSwitch: vi.fn(),
    switchToGroup: vi.fn(),
    createGroup: vi.fn(),
    deleteGroup: vi.fn(),
    openTab: vi.fn(),
    takeSnapshot: vi.fn(),
    recoverSnapshot: vi.fn(),
    deleteSnapshot: vi.fn(),
    createAddon: vi.fn(),
    applyAddon: vi.fn(),
    deleteAddon: vi.fn(),
    assignQuickSlot: vi.fn(),
    clearAllTabs: vi.fn(),
    closeOtherTabs: vi.fn(),
    closeOtherTabsInGroup: vi.fn(),
    closeColumn: vi.fn(),
    closeColumnTabs: vi.fn(),
    moveColumn: vi.fn(),
    mergeColumns: vi.fn(),
    moveTabsToNewColumn: vi.fn(),
    exportGroup: vi.fn(),
    importGroup: vi.fn(),
    applyQuickSlot: vi.fn(),
    exportStateFile: vi.fn(),
    importStateFile: vi.fn(),
    resetState: vi.fn(),
    waitForRenderComplete: vi.fn().mockResolvedValue(undefined)
  });

  beforeEach(() => {
    vi.clearAllMocks();
    registeredCommands.clear();

    vi.mocked(commands.registerCommand).mockImplementation(
      (command: string, callback: RegisteredCommand) => {
        registeredCommands.set(command, callback);
        return { dispose: vi.fn() };
      }
    );

    vi.mocked(workspace.fs.stat).mockResolvedValue({
      type: FileType.File,
      ctime: 0,
      mtime: 0,
      size: 1
    } as never);
  });

  it('does not switch groups when the picker is cancelled', async () => {
    const tabManagerService = createMockTabManagerService();
    createCommands(tabManagerService as never);

    vi.mocked(window.showQuickPick).mockResolvedValue(undefined as never);

    await registeredCommands.get(`${EXTENSION_NAME}.switchGroup`)?.();

    expect(tabManagerService.switchToGroup).not.toHaveBeenCalled();
  });

  it('switches to a recent group from the recentGroups command', async () => {
    const tabManagerService = createMockTabManagerService();
    createCommands(tabManagerService as never);

    vi.mocked(window.showQuickPick).mockResolvedValue(
      {
        label: 'Group One',
        groupId: 'group-1'
      } as never
    );

    await registeredCommands.get(`${EXTENSION_NAME}.recentGroups`)?.();

    expect(tabManagerService.switchToGroup).toHaveBeenCalledWith('group-1');
  });

  it('restores a recent snapshot from the recentSnapshots command', async () => {
    const tabManagerService = createMockTabManagerService();
    createCommands(tabManagerService as never);

    vi.mocked(window.showQuickPick).mockResolvedValue(
      {
        label: 'Snapshot One',
        historyId: 'history-1'
      } as never
    );

    await registeredCommands.get(`${EXTENSION_NAME}.recentSnapshots`)?.();

    expect(tabManagerService.recoverSnapshot).toHaveBeenCalledWith('history-1');
  });

  it('assigns the selected quick slot from the picker label', async () => {
    const tabManagerService = createMockTabManagerService();
    createCommands(tabManagerService as never);

    vi.mocked(window.showQuickPick)
      .mockResolvedValueOnce(
        {
          label: 'Group One',
          groupId: 'group-1'
        } as never
      )
      .mockResolvedValueOnce(
        {
          label: '3',
          description: 'Slot 3'
        } as never
      );

    await registeredCommands.get(`${EXTENSION_NAME}.assignQuickSlot`)?.();

    expect(tabManagerService.assignQuickSlot).toHaveBeenCalledWith(
      '3',
      'group-1'
    );
  });

  it('does not assign a quick slot when the slot picker is cancelled', async () => {
    const tabManagerService = createMockTabManagerService();
    createCommands(tabManagerService as never);

    vi.mocked(window.showQuickPick)
      .mockResolvedValueOnce(
        {
          label: 'Group One',
          groupId: 'group-1'
        } as never
      )
      .mockResolvedValueOnce(undefined as never);

    await registeredCommands.get(`${EXTENSION_NAME}.assignQuickSlot`)?.();

    expect(tabManagerService.assignQuickSlot).not.toHaveBeenCalled();
  });

  it('switches to the selected group and focuses a saved tab from findTab', async () => {
    const tabManagerService = createMockTabManagerService();
    createCommands(tabManagerService as never);

    vi.mocked(window.showQuickPick).mockResolvedValue(
      {
        label: 'alpha.ts',
        groupId: 'group-1',
        viewColumn: 1,
        index: 0
      } as never
    );

    await registeredCommands.get(`${EXTENSION_NAME}.findTab`)?.();

    expect(tabManagerService.switchToGroup).toHaveBeenCalledWith('group-1');
    expect(tabManagerService.waitForRenderComplete).toHaveBeenCalled();
    expect(tabManagerService.openTab).toHaveBeenCalledWith(1, 0);
  });

  it('shows a warning when findTab has no saved tabs to search', async () => {
    const tabManagerService = createMockTabManagerService();
    tabManagerService.state.groups = {};
    createCommands(tabManagerService as never);

    await registeredCommands.get(`${EXTENSION_NAME}.findTab`)?.();

    expect(window.showWarningMessage).toHaveBeenCalledWith(
      'No saved tabs available.'
    );
    expect(tabManagerService.openTab).not.toHaveBeenCalled();
  });
});
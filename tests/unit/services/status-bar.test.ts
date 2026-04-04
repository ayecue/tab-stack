import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EventEmitter, window } from 'vscode';

import { StatusBarService } from '../../../src/services/status-bar';

describe('StatusBarService', () => {
  const createMockTabManager = () => {
    const configEmitter = new EventEmitter<any>();
    const syncEmitter = new EventEmitter<any>();

    return {
      configEmitter,
      syncEmitter,
      service: {
        state: {
          groups: {
            'group-1': {
              id: 'group-1',
              name: 'Group One',
              state: {
                tabState: {
                  tabGroups: {
                    1: {
                      viewColumn: 1,
                      activeTab: undefined,
                      tabs: [
                        {
                          id: 'tab-1',
                          label: 'alpha.ts'
                        },
                        {
                          id: 'tab-2',
                          label: 'beta.ts'
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          quickSlots: {
            '3': 'group-1'
          },
          stateContainer: {
            id: 'group-1'
          }
        },
        config: {
          getStatusBarVisible: vi.fn(() => true),
          onDidChangeConfig: configEmitter.event
        },
        onDidSyncTabs: syncEmitter.event
      }
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the selected group name and quick slot', () => {
    const statusBarItem = {
      text: '',
      tooltip: '',
      command: undefined,
      name: '',
      show: vi.fn(),
      hide: vi.fn(),
      dispose: vi.fn()
    };
    const { service } = createMockTabManager();

    vi.mocked(window.createStatusBarItem).mockReturnValue(statusBarItem as never);

    const statusBarService = new StatusBarService(service as never);

    expect(statusBarItem.text).toBe('Tab Stack: Group One [3]');
    expect(statusBarItem.command).toBe('tabStack.recentGroups');
    expect(statusBarItem.show).toHaveBeenCalled();

    statusBarService.dispose();
  });

  it('switches to unsaved layout text when sync reports no selected group', () => {
    const statusBarItem = {
      text: '',
      tooltip: '',
      command: undefined,
      name: '',
      show: vi.fn(),
      hide: vi.fn(),
      dispose: vi.fn()
    };
    const { service, syncEmitter } = createMockTabManager();

    vi.mocked(window.createStatusBarItem).mockReturnValue(statusBarItem as never);

    const statusBarService = new StatusBarService(service as never);

    syncEmitter.fire({
      selectedGroup: null,
      groups: [
        {
          groupId: 'group-1',
          name: 'Group One',
          tabCount: 2,
          columnCount: 1
        }
      ],
      quickSlots: {
        '3': 'group-1'
      }
    });

    expect(statusBarItem.text).toBe('Tab Stack: Unsaved Layout');
    expect(statusBarItem.command).toBe('tabStack.recentGroups');

    statusBarService.dispose();
  });

  it('offers create group when there are no saved groups', () => {
    const statusBarItem = {
      text: '',
      tooltip: '',
      command: undefined,
      name: '',
      show: vi.fn(),
      hide: vi.fn(),
      dispose: vi.fn()
    };

    vi.mocked(window.createStatusBarItem).mockReturnValue(statusBarItem as never);

    const statusBarService = new StatusBarService({
      state: {
        groups: {},
        quickSlots: {},
        stateContainer: null
      },
      config: {
        getStatusBarVisible: vi.fn(() => true),
        onDidChangeConfig: vi.fn(() => ({ dispose: vi.fn() }))
      },
      onDidSyncTabs: vi.fn(() => ({ dispose: vi.fn() }))
    } as never);

    expect(statusBarItem.text).toBe('Tab Stack: Save Group');
    expect(statusBarItem.command).toBe('tabStack.createGroup');

    statusBarService.dispose();
  });

  it('hides the status bar item when the setting is disabled', () => {
    const statusBarItem = {
      text: '',
      tooltip: '',
      command: undefined,
      name: '',
      show: vi.fn(),
      hide: vi.fn(),
      dispose: vi.fn()
    };
    const { service, configEmitter } = createMockTabManager();

    vi.mocked(window.createStatusBarItem).mockReturnValue(statusBarItem as never);

    const statusBarService = new StatusBarService(service as never);

    service.config.getStatusBarVisible.mockReturnValue(false);
    configEmitter.fire({ statusBarVisible: false });

    expect(statusBarItem.hide).toHaveBeenCalled();

    statusBarService.dispose();
  });
});
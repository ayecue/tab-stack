import { vi } from 'vitest';
import type { TabManagerState } from '../../../src/types/tab-manager';
import type { TabState } from '../../../src/types/tabs';
import { Layout } from '../../../src/types/commands';

export class MockTabActiveStateHandler {
  public syncTabs = vi.fn();
  public getTabState = vi.fn();
  public getTabManagerState = vi.fn();
  public applyTabState = vi.fn();
  public isTabRecoverable = vi.fn();
  public onDidChangeState = vi.fn();
  public dispose = vi.fn();

  constructor() {
    this.getTabState.mockReturnValue({
      tabGroups: {},
      activeGroup: null
    } as TabState);

    this.getTabManagerState.mockReturnValue({
      tabState: {
        tabGroups: {},
        activeGroup: null
      },
      layout: {
        orientation: 0,
        groups: []
      }
    } as TabManagerState);

    this.applyTabState.mockResolvedValue(undefined);
    this.isTabRecoverable.mockReturnValue(true);
    this.syncTabs.mockReturnValue(undefined);
    this.onDidChangeState.mockReturnValue({ dispose: vi.fn() });
  }
}

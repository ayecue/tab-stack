import { vi } from 'vitest';
import type { TabStateFileContent } from '../../../src/types/tab-manager';

export class MockWorkspaceStorageHandler {
  public load = vi.fn();
  public save = vi.fn();
  public write = vi.fn();
  public get = vi.fn();
  public reset = vi.fn();
  
  constructor(initialState?: TabStateFileContent) {
    this.load.mockResolvedValue(initialState || {
      version: 1,
      groups: {},
      addons: {},
      history: [],
      activeGroup: null,
      quickSlots: {}
    });
    this.save.mockResolvedValue(undefined);
    this.write.mockResolvedValue(undefined);
    this.get.mockReturnValue(initialState || {
      version: 1,
      groups: {},
      addons: {},
      history: [],
      activeGroup: null,
      quickSlots: {}
    });
    this.reset.mockResolvedValue(undefined);
  }
  
  public updateState(state: TabStateFileContent): void {
    this.get.mockReturnValue(state);
  }
}

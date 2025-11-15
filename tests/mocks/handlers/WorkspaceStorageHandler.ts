import { vi } from 'vitest';
import type { TabStateFileContent } from '../../../src/types/tab-manager';
import { tabStateFileContentFactory } from '../../factories';

export class MockWorkspaceStorageHandler {
  public load = vi.fn();
  public save = vi.fn();
  public write = vi.fn();
  public get = vi.fn();
  public reset = vi.fn();
  
  constructor(initialState?: TabStateFileContent) {
    this.load.mockResolvedValue(initialState || tabStateFileContentFactory.build());
    this.save.mockResolvedValue(undefined);
    this.write.mockResolvedValue(undefined);
    this.get.mockReturnValue(initialState || tabStateFileContentFactory.build());
    this.reset.mockResolvedValue(undefined);
  }
  
  public updateState(state: TabStateFileContent): void {
    this.get.mockReturnValue(state);
  }
}

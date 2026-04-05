import { vi } from 'vitest';
import type { StateContainer } from '../../../src/types/tab-manager';

export class MockTabStateContainerHandler {
  public currentStateContainer: StateContainer | null = null;
  public previousStateContainer: StateContainer | null = null;

  public initialize = vi.fn();
  public setCurrentStateContainer = vi.fn();
  public updateTabState = vi.fn();
  public syncState = vi.fn();
  public forkState = vi.fn();
  public lockState = vi.fn();
  public unlockState = vi.fn();
  public onDidChangeState = vi.fn();
  public dispose = vi.fn();

  constructor() {
    this.initialize.mockReturnValue(undefined);
    this.setCurrentStateContainer.mockReturnValue(undefined);
    this.updateTabState.mockReturnValue(undefined);
    this.syncState.mockReturnValue(undefined);
    this.forkState.mockReturnValue(undefined);
    this.lockState.mockReturnValue(undefined);
    this.unlockState.mockReturnValue(undefined);
    this.onDidChangeState.mockReturnValue({ dispose: vi.fn() });
  }
}

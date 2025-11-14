import { vi } from 'vitest';

export class MockSelectionTrackerService {
  public syncSelection = vi.fn();
  public dispose = vi.fn();
  public onDidChangeSelection = vi.fn(() => ({ dispose: vi.fn() }));
  
  constructor() {
    this.syncSelection.mockResolvedValue(undefined);
  }
}

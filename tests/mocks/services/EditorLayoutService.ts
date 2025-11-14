import { vi } from 'vitest';

export class MockEditorLayoutService {
  public applyLayout = vi.fn();
  public dispose = vi.fn();
  public onDidChangeLayout = vi.fn(() => ({ dispose: vi.fn() }));
  public setLayout = vi.fn();
  
  constructor() {
    this.applyLayout.mockResolvedValue(undefined);
    this.setLayout.mockResolvedValue(undefined);
  }
}

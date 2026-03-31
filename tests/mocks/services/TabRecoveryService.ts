import { vi } from 'vitest';

export class MockTabRecoveryService {
  public resolveTabRecoveryCommand = vi.fn();
  public dispose = vi.fn();
  public hasMatch = vi.fn(() => {
    return false;
  });
}
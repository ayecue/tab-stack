import { vi } from 'vitest';

export class MockTabRecoveryService {
  public resolveTabRecoveryCommand = vi.fn();
  public dispose = vi.fn();
  public hasMatch = vi.fn(() => {
    return false;
  });
  public isRecoverable = vi.fn((tab: { kind: string }) => {
    switch (tab.kind) {
      case 'tabInputText':
      case 'tabInputTextDiff':
      case 'tabInputNotebook':
      case 'tabInputNotebookDiff':
      case 'tabInputCustom':
      case 'tabInputTerminal':
        return true;
      default:
        return this.hasMatch(tab);
    }
  });
}
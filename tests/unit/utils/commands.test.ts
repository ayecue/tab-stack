import { describe, expect, it, vi, beforeEach } from 'vitest';
import { commands, window } from 'vscode';
import {
  closeAllEditors,
  getEditorLayout,
  setEditorLayout,
  pinCurrentEditor,
  unpinCurrentEditor
} from '../../../src/utils/commands';

vi.mock('vscode', async () => {
  const actual = await vi.importActual('vscode');
  return {
    ...actual,
    commands: {
      executeCommand: vi.fn()
    }
  };
});

describe('commands utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('closeAllEditors', () => {
    it('executes workbench.action.closeAllEditors command', async () => {
      await closeAllEditors();

      expect(commands.executeCommand).toHaveBeenCalledWith('workbench.action.closeAllEditors');
    });
  });

  describe('getEditorLayout', () => {
    it('executes vscode.getEditorLayout command and returns layout', async () => {
      const mockLayout = {
        orientation: 0,
        groups: [{ size: 1 }]
      };

      vi.mocked(commands.executeCommand).mockResolvedValue(mockLayout);

      const result = await getEditorLayout();

      expect(commands.executeCommand).toHaveBeenCalledWith('vscode.getEditorLayout');
      expect(result).toEqual(mockLayout);
    });
  });

  describe('setEditorLayout', () => {
    it('executes vscode.setEditorLayout command with layout', async () => {
      const layout = {
        orientation: 0,
        groups: [{ size: 1 }]
      };

      await setEditorLayout(layout);

      expect(commands.executeCommand).toHaveBeenCalledWith('vscode.setEditorLayout', layout);
    });
  });

  describe('pinCurrentEditor', () => {
    it('executes workbench.action.pinEditor command', async () => {
      await pinCurrentEditor();

      expect(commands.executeCommand).toHaveBeenCalledWith('workbench.action.pinEditor');
    });
  });

  describe('unpinCurrentEditor', () => {
    it('executes workbench.action.unpinEditor command', async () => {
      await unpinCurrentEditor();

      expect(commands.executeCommand).toHaveBeenCalledWith('workbench.action.unpinEditor');
    });
  });
});

import { describe, expect, it, vi } from 'vitest';
import {
  window,
  TextEditor,
  NotebookEditor,
  TabInputText,
  TabInputTextDiff,
  TabInputNotebook,
  Uri
} from 'vscode';

import {
  getTabTrackerKeyFromRawTextEditor,
  getTabTrackerKeyFromRawNotebookEditor
} from '../../../src/transformers/tracker-key';

describe('tracker-key transformer', () => {
  describe('getTabTrackerKeyFromRawTextEditor', () => {
    it('generates key for regular text editor', () => {
      const mockEditor = {
        document: {
          uri: Uri.parse('file:///workspace/test.ts')
        },
        viewColumn: 1,
        diffInformation: undefined
      } as unknown as TextEditor;

      const key = getTabTrackerKeyFromRawTextEditor(mockEditor);

      expect(key).toBe('file:///workspace/test.ts::1::text');
    });
  });

  describe('getTabTrackerKeyFromRawNotebookEditor', () => {
    it('generates key for regular notebook editor', () => {
      const mockEditor = {
        notebook: {
          uri: Uri.parse('file:///workspace/notebook.ipynb')
        },
        viewColumn: 1,
        diffInformation: undefined
      } as unknown as NotebookEditor;

      const key = getTabTrackerKeyFromRawNotebookEditor(mockEditor);

      expect(key).toBe('file:///workspace/notebook.ipynb::1::notebook');
    });
  });
});

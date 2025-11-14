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
  getTabTrackerKeyFromRawNotebookEditor,
  findAssociatedTab
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

    it('generates key for text diff editor', () => {
      const mockEditor = {
        document: {
          uri: Uri.parse('file:///workspace/modified.ts')
        },
        viewColumn: 2,
        diffInformation: [
          {
            modified: Uri.parse('file:///workspace/modified.ts'),
            original: Uri.parse('file:///workspace/original.ts')
          }
        ]
      } as unknown as TextEditor;

      const key = getTabTrackerKeyFromRawTextEditor(mockEditor);

      expect(key).toBe('file:///workspace/modified.ts::file:///workspace/original.ts::2::text');
    });

    it('handles text diff editor without view column', () => {
      const modifiedUri = Uri.parse('file:///workspace/modified.ts');
      const originalUri = Uri.parse('file:///workspace/original.ts');

      const mockEditor = {
        document: {
          uri: modifiedUri
        },
        viewColumn: undefined,
        diffInformation: [
          {
            modified: modifiedUri,
            original: originalUri
          }
        ]
      } as unknown as TextEditor;

      // Mock the tab groups to find the associated tab
      vi.spyOn(window.tabGroups, 'all', 'get').mockReturnValue([
        {
          tabs: [
            {
              input: new TabInputTextDiff(originalUri, modifiedUri),
              group: { viewColumn: 3 }
            }
          ]
        }
      ] as any);

      const key = getTabTrackerKeyFromRawTextEditor(mockEditor);

      expect(key).toContain('::3::text');
    });

    it('defaults to view column 1 when no tab found for diff editor', () => {
      const modifiedUri = Uri.parse('file:///workspace/modified.ts');
      const originalUri = Uri.parse('file:///workspace/original.ts');

      const mockEditor = {
        document: {
          uri: modifiedUri
        },
        viewColumn: undefined,
        diffInformation: [
          {
            modified: modifiedUri,
            original: originalUri
          }
        ]
      } as unknown as TextEditor;

      vi.spyOn(window.tabGroups, 'all', 'get').mockReturnValue([]);

      const key = getTabTrackerKeyFromRawTextEditor(mockEditor);

      expect(key).toContain('::1::text');
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

    it('generates key for notebook diff editor', () => {
      const mockEditor = {
        notebook: {
          uri: Uri.parse('file:///workspace/modified.ipynb')
        },
        viewColumn: 2,
        diffInformation: [
          {
            modified: Uri.parse('file:///workspace/modified.ipynb'),
            original: Uri.parse('file:///workspace/original.ipynb')
          }
        ]
      } as unknown as NotebookEditor;

      const key = getTabTrackerKeyFromRawNotebookEditor(mockEditor);

      expect(key).toBe('file:///workspace/modified.ipynb::file:///workspace/original.ipynb::2::notebook');
    });

    it('handles notebook diff editor without view column', () => {
      const modifiedUri = Uri.parse('file:///workspace/modified.ipynb');
      const originalUri = Uri.parse('file:///workspace/original.ipynb');

      const mockEditor = {
        notebook: {
          uri: modifiedUri
        },
        viewColumn: undefined,
        diffInformation: [
          {
            modified: modifiedUri,
            original: originalUri
          }
        ]
      } as unknown as NotebookEditor;

      vi.spyOn(window.tabGroups, 'all', 'get').mockReturnValue([
        {
          tabs: [
            {
              input: new TabInputTextDiff(originalUri, modifiedUri),
              group: { viewColumn: 4 }
            }
          ]
        }
      ] as any);

      const key = getTabTrackerKeyFromRawNotebookEditor(mockEditor);

      expect(key).toContain('::4::notebook');
    });
  });

  describe('findAssociatedTab', () => {
    it('finds tab matching the condition', () => {
      const targetUri = Uri.parse('file:///workspace/target.ts');
      
      const mockTab = {
        input: new TabInputText(targetUri)
      };

      vi.spyOn(window.tabGroups, 'all', 'get').mockReturnValue([
        {
          tabs: [
            { input: new TabInputText(Uri.parse('file:///workspace/other.ts')) },
            mockTab,
            { input: new TabInputText(Uri.parse('file:///workspace/another.ts')) }
          ]
        }
      ] as any);

      const result = findAssociatedTab((tab) => {
        return (
          tab.input instanceof TabInputText &&
          tab.input.uri.toString() === targetUri.toString()
        );
      });

      expect(result).toBe(mockTab);
    });

    it('returns null when no tab matches', () => {
      vi.spyOn(window.tabGroups, 'all', 'get').mockReturnValue([
        {
          tabs: [
            { input: new TabInputText(Uri.parse('file:///workspace/file1.ts')) },
            { input: new TabInputText(Uri.parse('file:///workspace/file2.ts')) }
          ]
        }
      ] as any);

      const result = findAssociatedTab((tab) => {
        return (
          tab.input instanceof TabInputText &&
          tab.input.uri.toString() === 'file:///workspace/nonexistent.ts'
        );
      });

      expect(result).toBeNull();
    });

    it('searches across multiple tab groups', () => {
      const targetUri = Uri.parse('file:///workspace/target.ts');
      
      const mockTab = {
        input: new TabInputText(targetUri)
      };

      vi.spyOn(window.tabGroups, 'all', 'get').mockReturnValue([
        {
          tabs: [
            { input: new TabInputText(Uri.parse('file:///workspace/file1.ts')) }
          ]
        },
        {
          tabs: [
            { input: new TabInputText(Uri.parse('file:///workspace/file2.ts')) },
            mockTab
          ]
        },
        {
          tabs: [
            { input: new TabInputText(Uri.parse('file:///workspace/file3.ts')) }
          ]
        }
      ] as any);

      const result = findAssociatedTab((tab) => {
        return (
          tab.input instanceof TabInputText &&
          tab.input.uri.toString() === targetUri.toString()
        );
      });

      expect(result).toBe(mockTab);
    });

    it('returns null when tab groups are empty', () => {
      vi.spyOn(window.tabGroups, 'all', 'get').mockReturnValue([]);

      const result = findAssociatedTab(() => true);

      expect(result).toBeNull();
    });
  });
});

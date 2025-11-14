import { describe, expect, it, vi, beforeEach } from 'vitest';
import { window, TextEditor, NotebookEditor, Uri } from 'vscode';

import { SelectionTrackerService } from '../../../src/services/selection-tracker';
import { EditorSelection } from '../../../src/types/selection-tracker';

describe('SelectionTrackerService', () => {
  let service: SelectionTrackerService;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (service) {
      service.dispose();
    }
  });

  describe('initialization', () => {
    it('creates service and sets up listeners', () => {
      service = new SelectionTrackerService();
      expect(service).toBeDefined();
      expect(service.onDidChangeSelection).toBeDefined();
    });
  });

  describe('text editor selection tracking', () => {
    it('captures text editor selection changes', async () => {
      let capturedCallback: any;
      vi.spyOn(window, 'onDidChangeTextEditorSelection').mockImplementation((callback) => {
        capturedCallback = callback;
        return { dispose: () => {} };
      });

      service = new SelectionTrackerService();

      const selections: EditorSelection[] = [];
      service.onDidChangeSelection((selection) => {
        selections.push(selection);
      });

      const mockEditor = {
        document: {
          uri: Uri.parse('file:///workspace/test.ts')
        },
        viewColumn: 1,
        visibleRanges: [{ start: { line: 0, character: 0 }, end: { line: 10, character: 0 } }],
        selection: {
          start: { line: 5, character: 10 },
          end: { line: 5, character: 20 },
          isEmpty: false
        }
      } as unknown as TextEditor;

      // Simulate the onDidChangeTextEditorSelection event
      capturedCallback({ textEditor: mockEditor });

      expect(selections).toHaveLength(1);
      expect(selections[0]).toMatchObject({
        id: 'file:///workspace/test.ts::1::text',
        selection: {
          start: { line: 5, character: 10 },
          end: { line: 5, character: 20 },
          isEmpty: false,
          isSingleLine: true
        }
      });
      expect(selections[0].lastUpdated).toBeGreaterThan(0);
    });

    it('ignores text editors without visible ranges', () => {
      let capturedCallback: any;
      vi.spyOn(window, 'onDidChangeTextEditorSelection').mockImplementation((callback) => {
        capturedCallback = callback;
        return { dispose: () => {} };
      });

      service = new SelectionTrackerService();

      const listener = vi.fn();
      service.onDidChangeSelection(listener);

      const mockEditor = {
        document: {
          uri: Uri.parse('file:///workspace/test.ts')
        },
        viewColumn: 1,
        visibleRanges: [],
        selection: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 0 },
          isEmpty: true
        }
      } as unknown as TextEditor;

      capturedCallback({ textEditor: mockEditor });

      expect(listener).not.toHaveBeenCalled();
    });

    it('ignores text editors without view column', () => {
      let capturedCallback: any;
      vi.spyOn(window, 'onDidChangeTextEditorSelection').mockImplementation((callback) => {
        capturedCallback = callback;
        return { dispose: () => {} };
      });

      service = new SelectionTrackerService();

      const listener = vi.fn();
      service.onDidChangeSelection(listener);

      const mockEditor = {
        document: {
          uri: Uri.parse('file:///workspace/test.ts')
        },
        viewColumn: undefined,
        visibleRanges: [{ start: { line: 0, character: 0 }, end: { line: 10, character: 0 } }],
        selection: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 0 },
          isEmpty: true
        }
      } as unknown as TextEditor;

      capturedCallback({ textEditor: mockEditor });

      expect(listener).not.toHaveBeenCalled();
    });

    it('tracks multi-line selections correctly', () => {
      let capturedCallback: any;
      vi.spyOn(window, 'onDidChangeTextEditorSelection').mockImplementation((callback) => {
        capturedCallback = callback;
        return { dispose: () => {} };
      });

      service = new SelectionTrackerService();

      const selections: EditorSelection[] = [];
      service.onDidChangeSelection((selection) => {
        selections.push(selection);
      });

      const mockEditor = {
        document: {
          uri: Uri.parse('file:///workspace/test.ts')
        },
        viewColumn: 2,
        visibleRanges: [{ start: { line: 0, character: 0 }, end: { line: 100, character: 0 } }],
        selection: {
          start: { line: 10, character: 0 },
          end: { line: 20, character: 10 },
          isEmpty: false
        }
      } as unknown as TextEditor;

      capturedCallback({ textEditor: mockEditor });

      expect(selections[0].selection.isSingleLine).toBe(false);
      expect(selections[0].selection.start.line).toBe(10);
      expect(selections[0].selection.end.line).toBe(20);
    });
  });

  describe('notebook editor selection tracking', () => {
    it('captures notebook editor selection changes', () => {
      let capturedCallback: any;
      vi.spyOn(window, 'onDidChangeNotebookEditorSelection').mockImplementation((callback) => {
        capturedCallback = callback;
        return { dispose: () => {} };
      });

      service = new SelectionTrackerService();

      const selections: EditorSelection[] = [];
      service.onDidChangeSelection((selection) => {
        selections.push(selection);
      });

      const mockEditor = {
        notebook: {
          uri: Uri.parse('file:///workspace/notebook.ipynb')
        },
        viewColumn: 1,
        visibleRanges: [{ start: 0, end: 10 }],
        selection: {
          start: 3,
          end: 5,
          isEmpty: false
        }
      } as unknown as NotebookEditor;

      capturedCallback({ notebookEditor: mockEditor });

      expect(selections).toHaveLength(1);
      expect(selections[0]).toMatchObject({
        id: 'file:///workspace/notebook.ipynb::1::notebook',
        selection: {
          start: { line: 3, character: 0 },
          end: { line: 5, character: 0 },
          isEmpty: false,
          isSingleLine: false
        }
      });
    });

    it('ignores notebook editors without visible ranges', () => {
      let capturedCallback: any;
      vi.spyOn(window, 'onDidChangeNotebookEditorSelection').mockImplementation((callback) => {
        capturedCallback = callback;
        return { dispose: () => {} };
      });

      service = new SelectionTrackerService();

      const listener = vi.fn();
      service.onDidChangeSelection(listener);

      const mockEditor = {
        notebook: {
          uri: Uri.parse('file:///workspace/notebook.ipynb')
        },
        viewColumn: 1,
        visibleRanges: [],
        selection: {
          start: 0,
          end: 0,
          isEmpty: true
        }
      } as unknown as NotebookEditor;

      capturedCallback({ notebookEditor: mockEditor });

      expect(listener).not.toHaveBeenCalled();
    });

    it('ignores notebook editors without view column', () => {
      let capturedCallback: any;
      vi.spyOn(window, 'onDidChangeNotebookEditorSelection').mockImplementation((callback) => {
        capturedCallback = callback;
        return { dispose: () => {} };
      });

      service = new SelectionTrackerService();

      const listener = vi.fn();
      service.onDidChangeSelection(listener);

      const mockEditor = {
        notebook: {
          uri: Uri.parse('file:///workspace/notebook.ipynb')
        },
        viewColumn: undefined,
        visibleRanges: [{ start: 0, end: 10 }],
        selection: {
          start: 0,
          end: 0,
          isEmpty: true
        }
      } as unknown as NotebookEditor;

      capturedCallback({ notebookEditor: mockEditor });

      expect(listener).not.toHaveBeenCalled();
    });

    it('handles single cell notebook selections', () => {
      let capturedCallback: any;
      vi.spyOn(window, 'onDidChangeNotebookEditorSelection').mockImplementation((callback) => {
        capturedCallback = callback;
        return { dispose: () => {} };
      });

      service = new SelectionTrackerService();

      const selections: EditorSelection[] = [];
      service.onDidChangeSelection((selection) => {
        selections.push(selection);
      });

      const mockEditor = {
        notebook: {
          uri: Uri.parse('file:///workspace/notebook.ipynb')
        },
        viewColumn: 2,
        visibleRanges: [{ start: 0, end: 10 }],
        selection: {
          start: 5,
          end: 5,
          isEmpty: false
        }
      } as unknown as NotebookEditor;

      capturedCallback({ notebookEditor: mockEditor });

      expect(selections[0].selection.isSingleLine).toBe(true);
      expect(selections[0].selection.start.line).toBe(5);
      expect(selections[0].selection.end.line).toBe(5);
    });
  });

  describe('dispose', () => {
    it('cleans up event listeners', () => {
      service = new SelectionTrackerService();
      
      expect(() => {
        service.dispose();
      }).not.toThrow();
    });

    it('can be called multiple times safely', () => {
      service = new SelectionTrackerService();
      
      expect(() => {
        service.dispose();
        service.dispose();
        service.dispose();
      }).not.toThrow();
    });
  });
});

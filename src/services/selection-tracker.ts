import {
  Disposable,
  EventEmitter,
  NotebookEditor,
  TextEditor,
  window
} from 'vscode';

import {
  getTabTrackerKeyFromRawNotebookEditor,
  getTabTrackerKeyFromRawTextEditor
} from '../transformers/tracker-key';
import { EditorSelection } from '../types/selection-tracker';

export class SelectionTrackerService implements Disposable {
  private _disposables: Disposable[] = [];

  private _emitter: EventEmitter<EditorSelection>;

  constructor() {
    this._emitter = new EventEmitter<EditorSelection>();
    this.initializeTracking();
  }

  get onDidChangeSelection() {
    return this._emitter.event;
  }

  private initializeTracking(): void {
    this._disposables.push(
      window.onDidChangeTextEditorSelection((event) =>
        this.captureTextEditorSelection(event.textEditor)
      )
    );

    this._disposables.push(
      window.onDidChangeNotebookEditorSelection((event) =>
        this.captureNotebookEditorSelection(event.notebookEditor)
      )
    );
  }

  private captureTextEditorSelection(editor: TextEditor): void {
    if (editor.visibleRanges.length === 0) {
      return;
    }

    if (editor.viewColumn == null) {
      return;
    }

    const position: EditorSelection = {
      id: getTabTrackerKeyFromRawTextEditor(editor),
      selection: {
        start: {
          line: editor.selection.start.line,
          character: editor.selection.start.character
        },
        end: {
          line: editor.selection.end.line,
          character: editor.selection.end.character
        },
        isEmpty: editor.selection.isEmpty,
        isSingleLine: editor.selection.start.line === editor.selection.end.line
      },
      lastUpdated: Date.now()
    };

    this._emitter.fire(position);
  }

  private captureNotebookEditorSelection(editor: NotebookEditor): void {
    if (editor.visibleRanges.length === 0) {
      return;
    }

    if (editor.viewColumn == null) {
      return;
    }

    const position: EditorSelection = {
      id: getTabTrackerKeyFromRawNotebookEditor(editor),
      selection: {
        start: {
          line: editor.selection.start,
          character: 0
        },
        end: {
          line: editor.selection.end,
          character: 0
        },
        isEmpty: editor.selection.isEmpty,
        isSingleLine: editor.selection.start === editor.selection.end
      },
      lastUpdated: Date.now()
    };

    this._emitter.fire(position);
  }

  dispose(): void {
    this._disposables.forEach((d) => d.dispose());
  }
}

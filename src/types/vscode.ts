import { NotebookEditor, TextEditor, Uri } from 'vscode';

export interface DiffPosition {
  endLineNumberExclusive: number;
  startLineNumber: number;
}

export interface DiffChange {
  kind: number;
  moditifed: DiffPosition;
  original: DiffPosition;
}

// Hidden diffInformation on TextEditor for diff editors
export interface DiffInformation {
  changes: DiffChange[];
  documentVersion: number;
  isStale: boolean;
  modified: Uri;
  original: Uri;
}

export interface NotebookEditorWithDiffInformation extends NotebookEditor {
  diffInformation: DiffInformation[];
}

export function isNotebookEditorWithDiffInformation(
  editor: NotebookEditor
): editor is NotebookEditorWithDiffInformation {
  return (
    (editor as NotebookEditorWithDiffInformation).diffInformation != null &&
    (editor as NotebookEditorWithDiffInformation).diffInformation!.length > 0
  );
}

export interface TextEditorWithDiffInformation extends TextEditor {
  diffInformation: DiffInformation[];
}

export function isTextEditorWithDiffInformation(
  editor: TextEditor
): editor is TextEditorWithDiffInformation {
  return (
    (editor as TextEditorWithDiffInformation).diffInformation != null &&
    (editor as TextEditorWithDiffInformation).diffInformation!.length > 0
  );
}

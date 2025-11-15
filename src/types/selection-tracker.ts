export interface SelectionPosition {
  character: number;
  line: number;
}

export interface SelectionRange {
  start: SelectionPosition;
  end: SelectionPosition;
  isEmpty: boolean;
  isSingleLine: boolean;
}

export interface EditorSelection {
  id: string;
  selection: SelectionRange;
  lastUpdated: number;
}

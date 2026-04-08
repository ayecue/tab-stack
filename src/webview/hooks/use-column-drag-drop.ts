import React, { useCallback, useReducer, useRef } from 'react';

interface ColumnDragState {
  draggedColumn: number | null;
  dropTarget: number | null;
  dropMode: 'reorder' | 'merge' | null;
}

type ColumnDragAction =
  | { type: 'start'; viewColumn: number }
  | { type: 'updateDrop'; viewColumn: number; mode: 'reorder' | 'merge' }
  | { type: 'reset' };

const initialState: ColumnDragState = {
  draggedColumn: null,
  dropTarget: null,
  dropMode: null
};

function columnDragReducer(
  state: ColumnDragState,
  action: ColumnDragAction
): ColumnDragState {
  switch (action.type) {
    case 'start':
      return { draggedColumn: action.viewColumn, dropTarget: null, dropMode: null };
    case 'updateDrop':
      if (!state.draggedColumn) return state;
      if (state.draggedColumn === action.viewColumn) return state;
      return { ...state, dropTarget: action.viewColumn, dropMode: action.mode };
    case 'reset':
      return initialState;
  }
}

const COLUMN_DRAG_TYPE = 'application/x-tab-column';

export interface UseColumnDragDropResult {
  draggedColumn: number | null;
  dropTarget: number | null;
  dropMode: 'reorder' | 'merge' | null;
  handleColumnDragStart: (viewColumn: number) => (e: React.DragEvent) => void;
  handleColumnDragEnd: () => void;
  handleColumnHeaderDragOver: (viewColumn: number) => (e: React.DragEvent) => void;
  handleColumnHeaderDrop: (viewColumn: number) => (e: React.DragEvent) => void;
  handleColumnBodyDragOver: (viewColumn: number) => (e: React.DragEvent) => void;
  handleColumnBodyDrop: (viewColumn: number) => (e: React.DragEvent) => void;
  isColumnDragging: (viewColumn: number) => boolean;
  isColumnDropTarget: (viewColumn: number) => boolean;
  getColumnDropMode: (viewColumn: number) => 'reorder' | 'merge' | null;
}

export function useColumnDragDrop(
  moveColumn: (fromViewColumn: number, toViewColumn: number) => void,
  mergeColumns: (fromViewColumn: number, toViewColumn: number) => void
): UseColumnDragDropResult {
  const [state, dispatch] = useReducer(columnDragReducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const handleColumnDragStart = useCallback(
    (viewColumn: number) => (e: React.DragEvent) => {
      dispatch({ type: 'start', viewColumn });
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData(COLUMN_DRAG_TYPE, String(viewColumn));
    },
    []
  );

  const handleColumnDragEnd = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const handleColumnHeaderDragOver = useCallback(
    (viewColumn: number) => (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes(COLUMN_DRAG_TYPE)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      dispatch({ type: 'updateDrop', viewColumn, mode: 'reorder' });
    },
    []
  );

  const handleColumnHeaderDrop = useCallback(
    (viewColumn: number) => (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes(COLUMN_DRAG_TYPE)) return;
      e.preventDefault();
      const { draggedColumn } = stateRef.current;
      if (draggedColumn != null && draggedColumn !== viewColumn) {
        moveColumn(draggedColumn, viewColumn);
      }
      dispatch({ type: 'reset' });
    },
    [moveColumn]
  );

  const handleColumnBodyDragOver = useCallback(
    (viewColumn: number) => (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes(COLUMN_DRAG_TYPE)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      dispatch({ type: 'updateDrop', viewColumn, mode: 'merge' });
    },
    []
  );

  const handleColumnBodyDrop = useCallback(
    (viewColumn: number) => (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes(COLUMN_DRAG_TYPE)) return;
      e.preventDefault();
      const { draggedColumn } = stateRef.current;
      if (draggedColumn != null && draggedColumn !== viewColumn) {
        mergeColumns(draggedColumn, viewColumn);
      }
      dispatch({ type: 'reset' });
    },
    [mergeColumns]
  );

  const isColumnDragging = useCallback(
    (viewColumn: number) => state.draggedColumn === viewColumn,
    [state.draggedColumn]
  );

  const isColumnDropTarget = useCallback(
    (viewColumn: number) => state.dropTarget === viewColumn,
    [state.dropTarget]
  );

  const getColumnDropMode = useCallback(
    (viewColumn: number): 'reorder' | 'merge' | null =>
      state.dropTarget === viewColumn ? state.dropMode : null,
    [state.dropTarget, state.dropMode]
  );

  return {
    draggedColumn: state.draggedColumn,
    dropTarget: state.dropTarget,
    dropMode: state.dropMode,
    handleColumnDragStart,
    handleColumnDragEnd,
    handleColumnHeaderDragOver,
    handleColumnHeaderDrop,
    handleColumnBodyDragOver,
    handleColumnBodyDrop,
    isColumnDragging,
    isColumnDropTarget,
    getColumnDropMode
  };
}

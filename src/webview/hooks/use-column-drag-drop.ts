import React, { useCallback, useReducer, useRef } from 'react';

const COLUMN_REORDER_TOP_ZONE_PX = 56;
const COLUMN_REORDER_EDGE_ZONE_PX = 28;

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
      return {
        draggedColumn: action.viewColumn,
        dropTarget: null,
        dropMode: null
      };
    case 'updateDrop':
      if (!state.draggedColumn) return state;
      if (state.draggedColumn === action.viewColumn) return state;
      if (
        state.dropTarget === action.viewColumn &&
        state.dropMode === action.mode
      ) {
        return state;
      }
      return { ...state, dropTarget: action.viewColumn, dropMode: action.mode };
    case 'reset':
      return initialState;
  }
}

const COLUMN_DRAG_TYPE = 'application/x-tab-column';

function resolveColumnDropMode(
  event: React.DragEvent<Element>
): 'reorder' | 'merge' {
  const rect = event.currentTarget.getBoundingClientRect();
  const relativeX = event.clientX - rect.left;
  const relativeY = event.clientY - rect.top;

  const reorderTopZone = Math.min(
    COLUMN_REORDER_TOP_ZONE_PX,
    rect.height * 0.45
  );
  const isNearTop = relativeY <= reorderTopZone;
  const isNearEdge =
    relativeX <= COLUMN_REORDER_EDGE_ZONE_PX ||
    relativeX >= rect.width - COLUMN_REORDER_EDGE_ZONE_PX;

  return isNearTop || isNearEdge ? 'reorder' : 'merge';
}

export interface UseColumnDragDropResult {
  draggedColumn: number | null;
  dropTarget: number | null;
  dropMode: 'reorder' | 'merge' | null;
  handleColumnDragStart: (viewColumn: number) => (e: React.DragEvent) => void;
  handleColumnDragEnd: () => void;
  handleColumnDragOver: (viewColumn: number) => (e: React.DragEvent) => void;
  handleColumnDrop: (viewColumn: number) => (e: React.DragEvent) => void;
  handleProjectedColumnReorderDragOver: () => (e: React.DragEvent) => void;
  handleProjectedColumnReorderDrop: () => (e: React.DragEvent) => void;
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

  const executeColumnReorder = useCallback(() => {
    const { draggedColumn, dropTarget, dropMode } = stateRef.current;

    if (
      draggedColumn == null ||
      dropTarget == null ||
      dropMode !== 'reorder' ||
      draggedColumn === dropTarget
    ) {
      return;
    }

    moveColumn(draggedColumn, dropTarget);
    dispatch({ type: 'reset' });
  }, [moveColumn]);

  const handleColumnDragOver = useCallback(
    (viewColumn: number) => (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes(COLUMN_DRAG_TYPE)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      dispatch({
        type: 'updateDrop',
        viewColumn,
        mode: resolveColumnDropMode(e)
      });
    },
    []
  );

  const handleColumnDrop = useCallback(
    (viewColumn: number) => (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes(COLUMN_DRAG_TYPE)) return;
      e.preventDefault();
      const { draggedColumn } = stateRef.current;
      if (draggedColumn == null || draggedColumn === viewColumn) {
        dispatch({ type: 'reset' });
        return;
      }

      if (resolveColumnDropMode(e) === 'reorder') {
        moveColumn(draggedColumn, viewColumn);
      } else {
        mergeColumns(draggedColumn, viewColumn);
      }

      dispatch({ type: 'reset' });
    },
    [mergeColumns, moveColumn]
  );

  const handleProjectedColumnReorderDragOver = useCallback(
    () => (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes(COLUMN_DRAG_TYPE)) return;
      if (stateRef.current.dropMode !== 'reorder') return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },
    []
  );

  const handleProjectedColumnReorderDrop = useCallback(
    () => (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes(COLUMN_DRAG_TYPE)) return;
      e.preventDefault();
      executeColumnReorder();
    },
    [executeColumnReorder]
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
    handleColumnDragOver,
    handleColumnDrop,
    handleProjectedColumnReorderDragOver,
    handleProjectedColumnReorderDrop,
    isColumnDragging,
    isColumnDropTarget,
    getColumnDropMode
  };
}

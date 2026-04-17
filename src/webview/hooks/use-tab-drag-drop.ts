import React, { useCallback, useReducer } from 'react';

import { calculateDropIndex } from '../lib/calculate-drop-index';

interface DragTarget {
  index: number;
  viewColumn: number;
}

interface MoveTabFn {
  (
    fromIndex: number,
    fromViewColumn: number,
    toIndex: number,
    toViewColumn: number
  ): void;
}

// --- Reducer ---

interface DragDropState {
  draggedTab: DragTarget | null;
  dropTarget: DragTarget | null;
}

type DragDropAction =
  | { type: 'start'; target: DragTarget }
  | { type: 'updateDrop'; target: DragTarget }
  | { type: 'reset' };

const initialState: DragDropState = { draggedTab: null, dropTarget: null };

function dragDropReducer(
  state: DragDropState,
  action: DragDropAction
): DragDropState {
  switch (action.type) {
    case 'start':
      return { draggedTab: action.target, dropTarget: null };
    case 'updateDrop':
      if (!state.draggedTab) return state;
      return { ...state, dropTarget: action.target };
    case 'reset':
      return initialState;
  }
}

// --- Hook ---

export interface UseTabDragDropResult {
  draggedTab: DragTarget | null;
  dropTarget: DragTarget | null;
  handleDragStart: (
    index: number,
    viewColumn: number
  ) => (e: React.DragEvent<HTMLLIElement>) => void;
  handleDragEnd: () => void;
  handleDragOver: (
    index: number,
    viewColumn: number
  ) => (e: React.DragEvent<HTMLLIElement>) => void;
  handleDrop: (
    toIndex: number,
    toViewColumn: number
  ) => (e: React.DragEvent<HTMLLIElement>) => void;
  handleDropZoneOver: (
    index: number,
    viewColumn: number
  ) => (e: React.DragEvent) => void;
  handleDropZoneDrop: (
    index: number,
    viewColumn: number
  ) => (e: React.DragEvent) => void;
  isDragging: (index: number, viewColumn: number) => boolean;
  isDraggedOver: (index: number, viewColumn: number) => boolean;
  getDropPosition: (index: number, viewColumn: number) => 'before' | undefined;
}

export function useTabDragDrop(moveTab: MoveTabFn): UseTabDragDropResult {
  const [state, dispatch] = useReducer(dragDropReducer, initialState);
  const { draggedTab, dropTarget } = state;

  const handleDragStart = useCallback(
    (index: number, viewColumn: number) =>
      (e: React.DragEvent<HTMLLIElement>) => {
        dispatch({ type: 'start', target: { index, viewColumn } });
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `${index}:${viewColumn}`);
      },
    []
  );

  const handleDragEnd = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const handleDragOver = useCallback(
    (index: number, viewColumn: number) =>
      (e: React.DragEvent<HTMLLIElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const rect = e.currentTarget.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const dropIndex = relativeY < rect.height / 2 ? index : index + 1;

        dispatch({
          type: 'updateDrop',
          target: { index: dropIndex, viewColumn }
        });
      },
    []
  );

  // Use a ref so drop handlers always see the latest reducer state
  const stateRef = React.useRef(state);
  stateRef.current = state;

  const executeDrop = useCallback(
    (toIndex: number, toViewColumn: number) => {
      const { draggedTab: dragged, dropTarget: drop } = stateRef.current;
      if (!dragged || !drop) return;

      const finalToIndex = calculateDropIndex(
        dragged.index,
        dragged.viewColumn,
        toIndex,
        toViewColumn
      );

      if (finalToIndex !== null) {
        moveTab(dragged.index, dragged.viewColumn, finalToIndex, toViewColumn);
      }

      dispatch({ type: 'reset' });
    },
    [moveTab]
  );

  const handleDrop = useCallback(
    (toIndex: number, toViewColumn: number) =>
      (e: React.DragEvent<HTMLLIElement>) => {
        e.preventDefault();
        executeDrop(toIndex, toViewColumn);
      },
    [executeDrop]
  );

  const handleDropZoneOver = useCallback(
    (index: number, viewColumn: number) => (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      dispatch({ type: 'updateDrop', target: { index, viewColumn } });
    },
    []
  );

  const handleDropZoneDrop = useCallback(
    (index: number, viewColumn: number) => (e: React.DragEvent) => {
      e.preventDefault();
      executeDrop(index, viewColumn);
    },
    [executeDrop]
  );

  const isDragging = useCallback(
    (index: number, viewColumn: number) =>
      draggedTab?.index === index && draggedTab?.viewColumn === viewColumn,
    [draggedTab]
  );

  const isDraggedOver = useCallback(
    (index: number, viewColumn: number) =>
      dropTarget?.viewColumn === viewColumn && dropTarget?.index === index,
    [dropTarget]
  );

  const getDropPosition = useCallback(
    (index: number, viewColumn: number): 'before' | undefined =>
      dropTarget?.viewColumn === viewColumn && dropTarget?.index === index
        ? 'before'
        : undefined,
    [dropTarget]
  );

  return {
    draggedTab,
    dropTarget,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleDropZoneOver,
    handleDropZoneDrop,
    isDragging,
    isDraggedOver,
    getDropPosition
  };
}

import type React from 'react';

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useColumnDragDrop } from '../../../src/webview/hooks/use-column-drag-drop';

function createDragEvent(
  options?: Partial<{
    clientX: number;
    clientY: number;
    width: number;
    height: number;
  }>
): React.DragEvent {
  const {
    clientX = 20,
    clientY = 20,
    width = 240,
    height = 160
  } = options ?? {};

  return {
    clientX,
    clientY,
    currentTarget: {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width,
        height,
        right: width,
        bottom: height,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })
    },
    dataTransfer: {
      types: ['application/x-tab-column'],
      effectAllowed: 'move',
      dropEffect: 'move',
      setData: vi.fn()
    },
    preventDefault: vi.fn()
  } as unknown as React.DragEvent;
}

describe('useColumnDragDrop', () => {
  it('reorders when dropping onto the projected slot', () => {
    const moveColumn = vi.fn();
    const mergeColumns = vi.fn();

    const { result } = renderHook(() =>
      useColumnDragDrop(moveColumn, mergeColumns)
    );

    act(() => {
      result.current.handleColumnDragStart(1)(createDragEvent());
    });

    act(() => {
      result.current.handleColumnDragOver(3)(createDragEvent({ clientY: 18 }));
    });

    act(() => {
      result.current.handleProjectedColumnReorderDrop()(createDragEvent());
    });

    expect(moveColumn).toHaveBeenCalledWith(1, 3);
    expect(mergeColumns).not.toHaveBeenCalled();
    expect(result.current.dropTarget).toBeNull();
    expect(result.current.dropMode).toBeNull();
  });

  it('reorders when hovering near the top of a target column', () => {
    const moveColumn = vi.fn();
    const mergeColumns = vi.fn();

    const { result } = renderHook(() =>
      useColumnDragDrop(moveColumn, mergeColumns)
    );

    act(() => {
      result.current.handleColumnDragStart(1)(createDragEvent());
    });

    act(() => {
      result.current.handleColumnDragOver(3)(createDragEvent({ clientY: 18 }));
    });

    expect(result.current.getColumnDropMode(3)).toBe('reorder');

    act(() => {
      result.current.handleColumnDrop(3)(createDragEvent({ clientY: 18 }));
    });

    expect(moveColumn).toHaveBeenCalledWith(1, 3);
    expect(mergeColumns).not.toHaveBeenCalled();
  });

  it('merges when hovering in the body center of a target column', () => {
    const moveColumn = vi.fn();
    const mergeColumns = vi.fn();

    const { result } = renderHook(() =>
      useColumnDragDrop(moveColumn, mergeColumns)
    );

    act(() => {
      result.current.handleColumnDragStart(1)(createDragEvent());
    });

    act(() => {
      result.current.handleColumnDragOver(3)(
        createDragEvent({ clientX: 120, clientY: 110 })
      );
    });

    expect(result.current.getColumnDropMode(3)).toBe('merge');

    act(() => {
      result.current.handleColumnDrop(3)(
        createDragEvent({ clientX: 120, clientY: 110 })
      );
    });

    expect(mergeColumns).toHaveBeenCalledWith(1, 3);
    expect(moveColumn).not.toHaveBeenCalled();
  });
});
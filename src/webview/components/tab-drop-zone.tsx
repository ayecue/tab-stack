import React from 'react';

interface TabDropZoneProps {
  index: number;
  viewColumn: number;
  isActive: boolean;
  onDragOver: (
    index: number,
    viewColumn: number
  ) => (e: React.DragEvent) => void;
  onDrop: (index: number, viewColumn: number) => (e: React.DragEvent) => void;
}

export const TabDropZone: React.FC<TabDropZoneProps> = ({
  index,
  viewColumn,
  isActive,
  onDragOver,
  onDrop
}) => (
  <li
    className={`drop-zone-end ${isActive ? 'active' : ''}`}
    onDragOver={onDragOver(index, viewColumn)}
    onDrop={onDrop(index, viewColumn)}
  />
);

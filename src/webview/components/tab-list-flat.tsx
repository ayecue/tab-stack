import React from 'react';

import { TabKindColors } from '../../types/config';
import { resolveTabKindColor } from '../lib/resolve-tab-kind-color';
import { TabDropZone } from './tab-drop-zone';
import { TabItem } from './tab-item';

import type { UseTabDragDropResult } from '../hooks/use-tab-drag-drop';
import type { UseTabFilterResult } from '../hooks/use-tab-filter';

interface TabListFlatProps {
  flatList: UseTabFilterResult['flatList'];
  tabKindColors: TabKindColors;
  dragDrop: UseTabDragDropResult;
  messagingService: {
    openTab: (index: number, viewColumn: number) => void;
    closeTab: (index: number, viewColumn: number) => void;
    toggleTabPin: (index: number, viewColumn: number) => void;
  };
}

export const TabListFlat: React.FC<TabListFlatProps> = ({
  flatList,
  tabKindColors,
  dragDrop,
  messagingService
}) => {
  const {
    draggedTab,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleDropZoneOver,
    handleDropZoneDrop,
    isDragging,
    isDraggedOver,
    getDropPosition
  } = dragDrop;

  const maxIndex =
    flatList.length > 0
      ? Math.max(...flatList.map((item) => item.tabGroupIndex)) + 1
      : 0;
  const lastViewColumn =
    flatList.length > 0 ? flatList[flatList.length - 1].viewColumn : 1;

  return (
    <ul className="tab-list-flat" role="list">
      {flatList.map(({ tab, label, isActive, tabGroupIndex, viewColumn }) => (
        <TabItem
          key={`${tab.viewColumn}:${tab.label}`}
          tab={tab}
          onOpen={() =>
            messagingService.openTab(tabGroupIndex, tab.viewColumn)
          }
          onClose={() =>
            messagingService.closeTab(tabGroupIndex, tab.viewColumn)
          }
          onTogglePin={() =>
            messagingService.toggleTabPin(tabGroupIndex, tab.viewColumn)
          }
          onDragStart={handleDragStart(tabGroupIndex, viewColumn)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver(tabGroupIndex, viewColumn)}
          onDrop={handleDrop(tabGroupIndex, viewColumn)}
          viewColumnLabel={label}
          isColumnActive={isActive}
          resolvedColor={resolveTabKindColor(tabKindColors, tab.kind, tab.label)}
          isDragging={isDragging(tabGroupIndex, viewColumn)}
          isDraggedOver={isDraggedOver(tabGroupIndex, viewColumn)}
          dropPosition={getDropPosition(tabGroupIndex, viewColumn)}
        />
      ))}
      {draggedTab && (
        <TabDropZone
          index={maxIndex}
          viewColumn={lastViewColumn}
          isActive={isDraggedOver(maxIndex, lastViewColumn)}
          onDragOver={handleDropZoneOver}
          onDrop={handleDropZoneDrop}
        />
      )}
    </ul>
  );
};

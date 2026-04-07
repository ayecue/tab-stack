import React from 'react';

import { TabKindColors } from '../../types/config';
import { resolveTabKindColor } from '../lib/resolve-tab-kind-color';
import { TabDropZone } from './tab-drop-zone';
import { TabItem } from './tab-item';

import type { UseTabDragDropResult } from '../hooks/use-tab-drag-drop';
import type { UseTabFilterResult } from '../hooks/use-tab-filter';

interface TabListColumnsProps {
  columns: UseTabFilterResult['columns'];
  tabKindColors: TabKindColors;
  searchTerm: string;
  dragDrop: UseTabDragDropResult;
  messagingService: {
    openTab: (index: number, viewColumn: number) => void;
    closeTab: (index: number, viewColumn: number) => void;
    toggleTabPin: (index: number, viewColumn: number) => void;
    closeOtherEditors: (index: number, viewColumn: number) => void;
    closeOtherEditorsInGroup: (index: number, viewColumn: number) => void;
  };
}

export const TabListColumns: React.FC<TabListColumnsProps> = ({
  columns,
  tabKindColors,
  searchTerm,
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

  return (
    <div className="tab-columns" role="list">
      {columns.map(({ viewColumn, tabs, isActive }) => {
        const columnLabel = `Column ${viewColumn}`;

        return (
          <div
            key={`${viewColumn}`}
            className={`tab-column${isActive ? ' active' : ''}`}
            role="listitem"
          >
            <div className="tab-column-header">
              <span className="tab-column-title">{columnLabel}</span>
            </div>
            <ul className="tab-list" role="list">
              {tabs.map(({ tab, originalIndex }) => (
                <TabItem
                  key={`${tab.viewColumn}:${originalIndex}:${tab.label}`}
                  tab={tab}
                  onOpen={() =>
                    messagingService.openTab(originalIndex, tab.viewColumn)
                  }
                  onClose={() =>
                    messagingService.closeTab(originalIndex, tab.viewColumn)
                  }
                  onTogglePin={() =>
                    messagingService.toggleTabPin(originalIndex, tab.viewColumn)
                  }
                  onCloseOthers={() =>
                    messagingService.closeOtherEditors(originalIndex, tab.viewColumn)
                  }
                  onCloseOthersInGroup={() =>
                    messagingService.closeOtherEditorsInGroup(originalIndex, tab.viewColumn)
                  }
                  onDragStart={handleDragStart(originalIndex, viewColumn)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver(originalIndex, viewColumn)}
                  onDrop={handleDrop(originalIndex, viewColumn)}
                  viewColumnLabel={columnLabel}
                  isColumnActive={isActive}
                  resolvedColor={resolveTabKindColor(tabKindColors, tab.kind, tab.label)}
                  isDragging={isDragging(originalIndex, viewColumn)}
                  isDraggedOver={isDraggedOver(originalIndex, viewColumn)}
                  dropPosition={getDropPosition(originalIndex, viewColumn)}
                />
              ))}
              {draggedTab && tabs.length > 0 && (
                <TabDropZone
                  index={tabs.length}
                  viewColumn={viewColumn}
                  isActive={isDraggedOver(tabs.length, viewColumn)}
                  onDragOver={handleDropZoneOver}
                  onDrop={handleDropZoneDrop}
                />
              )}
              {tabs.length === 0 && (
                <li className="no-tabs">
                  {searchTerm.trim()
                    ? 'No tabs match that search.'
                    : 'No tabs in this column.'}
                </li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

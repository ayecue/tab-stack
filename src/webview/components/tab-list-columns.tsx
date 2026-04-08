import React from 'react';

import { TabKindColors } from '../../types/config';
import { Tooltip } from './common/tooltip';
import { resolveTabKindColor } from '../lib/resolve-tab-kind-color';
import { TabDropZone } from './tab-drop-zone';
import { TabItem } from './tab-item';

import type { UseColumnDragDropResult } from '../hooks/use-column-drag-drop';
import type { UseTabDragDropResult } from '../hooks/use-tab-drag-drop';
import type { UseTabFilterResult } from '../hooks/use-tab-filter';

interface TabListColumnsProps {
  columns: UseTabFilterResult['columns'];
  tabKindColors: TabKindColors;
  searchTerm: string;
  dragDrop: UseTabDragDropResult;
  columnDragDrop: UseColumnDragDropResult;
  messagingService: {
    openTab: (index: number, viewColumn: number) => void;
    closeTab: (index: number, viewColumn: number) => void;
    toggleTabPin: (index: number, viewColumn: number) => void;
    closeOtherEditors: (index: number, viewColumn: number) => void;
    closeOtherEditorsInGroup: (index: number, viewColumn: number) => void;
    closeColumn: (viewColumn: number) => void;
    closeColumnFilteredTabs: (viewColumn: number, indices: number[]) => void;
    closeColumnNonFilteredTabs: (viewColumn: number, indices: number[]) => void;
    moveTabsToNewColumn: (viewColumn: number, indices: number[]) => void;
  };
}

export const TabListColumns: React.FC<TabListColumnsProps> = ({
  columns,
  tabKindColors,
  searchTerm,
  dragDrop,
  columnDragDrop,
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

  const {
    handleColumnDragStart,
    handleColumnDragEnd,
    handleColumnHeaderDragOver,
    handleColumnHeaderDrop,
    handleColumnBodyDragOver,
    handleColumnBodyDrop,
    isColumnDragging,
    isColumnDropTarget,
    getColumnDropMode
  } = columnDragDrop;

  return (
    <div className="tab-columns" role="list">
      {columns.map(({ viewColumn, tabs, isActive, totalTabCount, nonFilteredIndices }) => {
        const columnLabel = `Column ${viewColumn}`;
        const isFiltering = tabs.length !== totalTabCount;
        const filteredIndices = tabs.map(({ originalIndex }) => originalIndex);
        const columnDropMode = getColumnDropMode(viewColumn);
        const dragging = isColumnDragging(viewColumn);
        const dropTarget = isColumnDropTarget(viewColumn);

        const columnClasses = [
          'tab-column',
          isActive ? 'active' : '',
          dragging ? 'column-dragging' : '',
          dropTarget && columnDropMode === 'reorder' ? 'column-drop-reorder' : '',
          dropTarget && columnDropMode === 'merge' ? 'column-drop-merge' : ''
        ].filter(Boolean).join(' ');

        return (
          <div
            key={`${viewColumn}`}
            className={columnClasses}
            role="listitem"
          >
            <div
              className="tab-column-header"
              draggable
              onDragStart={handleColumnDragStart(viewColumn)}
              onDragEnd={handleColumnDragEnd}
              onDragOver={handleColumnHeaderDragOver(viewColumn)}
              onDrop={handleColumnHeaderDrop(viewColumn)}
            >
              <span className="tab-column-title">
                <i className="codicon codicon-gripper" aria-hidden="true" />
                {columnLabel}
              </span>
              <div className="tab-column-actions">
                {isFiltering && nonFilteredIndices.length > 0 && (
                  <Tooltip content="Move non-matching to new column">
                    <button
                      type="button"
                      className="column-action"
                      onClick={() =>
                        messagingService.moveTabsToNewColumn(viewColumn, nonFilteredIndices)
                      }
                      aria-label={`Move non-matching tabs to new column in ${columnLabel}`}
                    >
                      <i className="codicon codicon-split-horizontal" aria-hidden="true" />
                    </button>
                  </Tooltip>
                )}
                {isFiltering && nonFilteredIndices.length > 0 && (
                  <Tooltip content="Close non-matching tabs">
                    <button
                      type="button"
                      className="column-action"
                      onClick={() =>
                        messagingService.closeColumnNonFilteredTabs(viewColumn, nonFilteredIndices)
                      }
                      aria-label={`Close non-matching tabs in ${columnLabel}`}
                    >
                      <i className="codicon codicon-filter-filled" aria-hidden="true" />
                    </button>
                  </Tooltip>
                )}
                {isFiltering && filteredIndices.length > 0 && (
                  <Tooltip content="Move matching to new column">
                    <button
                      type="button"
                      className="column-action"
                      onClick={() =>
                        messagingService.moveTabsToNewColumn(viewColumn, filteredIndices)
                      }
                      aria-label={`Move matching tabs to new column in ${columnLabel}`}
                    >
                      <i className="codicon codicon-split-horizontal" aria-hidden="true" />
                    </button>
                  </Tooltip>
                )}
                {isFiltering && filteredIndices.length > 0 && (
                  <Tooltip content="Close matching tabs">
                    <button
                      type="button"
                      className="column-action"
                      onClick={() =>
                        messagingService.closeColumnFilteredTabs(viewColumn, filteredIndices)
                      }
                      aria-label={`Close matching tabs in ${columnLabel}`}
                    >
                      <i className="codicon codicon-filter" aria-hidden="true" />
                    </button>
                  </Tooltip>
                )}
                <Tooltip content="Close column">
                  <button
                    type="button"
                    className="column-action danger"
                    onClick={() => messagingService.closeColumn(viewColumn)}
                    aria-label={`Close all tabs in ${columnLabel}`}
                  >
                    <i className="codicon codicon-close-all" aria-hidden="true" />
                  </button>
                </Tooltip>
              </div>
            </div>
            <ul
              className="tab-list"
              role="list"
              onDragOver={handleColumnBodyDragOver(viewColumn)}
              onDrop={handleColumnBodyDrop(viewColumn)}
            >
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

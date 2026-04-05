import React, { useCallback } from 'react';

import { useTabContext } from '../hooks/use-tab-context';
import { useTabDragDrop } from '../hooks/use-tab-drag-drop';
import { useTabFilter } from '../hooks/use-tab-filter';
import { TabListColumns } from './tab-list-columns';
import { TabListFlat } from './tab-list-flat';

interface TabListProps {
  viewMode: 'columns' | 'flat';
  searchTerm: string;
  filters?: {
    pinnedOnly: boolean;
    dirtyOnly: boolean;
    type:
      | 'all'
      | 'text'
      | 'diff'
      | 'notebook'
      | 'webview'
      | 'custom'
      | 'terminal';
  };
}

export const TabList: React.FC<TabListProps> = ({
  viewMode,
  searchTerm,
  filters
}) => {
  const { state, messagingService } = useTabContext();
  const tabGroups = state.payload?.tabGroups ?? {};
  const tabKindColors = state.tabKindColors;

  const moveTab = useCallback(
    (fromIndex: number, fromViewColumn: number, toIndex: number, toViewColumn: number) => {
      messagingService.moveTab(fromIndex, fromViewColumn, toIndex, toViewColumn);
    },
    [messagingService]
  );

  const dragDrop = useTabDragDrop(moveTab);

  const { columns, flatList, totalVisibleTabs } = useTabFilter({
    tabGroups,
    searchTerm,
    activeGroup: state.payload?.activeGroup,
    filters
  });

  if (state.loading || state.rendering) {
    return (
      <div className="tab-empty-state">
        <i className="codicon codicon-sync" aria-hidden="true" />
        <p>{state.rendering ? 'Applying tabs…' : 'Loading tabs…'}</p>
      </div>
    );
  }

  if (totalVisibleTabs === 0) {
    return (
      <div className="tab-empty-state">
        <i className="codicon codicon-search-fuzzy" aria-hidden="true" />
        <p>
          {searchTerm.trim()
            ? `No tabs match "${searchTerm}"`
            : 'No tabs are currently open.'}
        </p>
      </div>
    );
  }

  if (viewMode === 'flat') {
    return (
      <TabListFlat
        flatList={flatList}
        tabKindColors={tabKindColors}
        dragDrop={dragDrop}
        messagingService={messagingService}
      />
    );
  }

  return (
    <TabListColumns
      columns={columns}
      tabKindColors={tabKindColors}
      searchTerm={searchTerm}
      dragDrop={dragDrop}
      messagingService={messagingService}
    />
  );
};

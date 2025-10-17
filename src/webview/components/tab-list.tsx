import React, { useMemo } from 'react';

import { TabInfo } from '../../types/tabs';
import { useTabContext } from '../hooks/use-tab-context';
import { TabItem } from './tab-item';

interface TabListProps {
  viewMode: 'columns' | 'flat';
}

interface ColumnInfo {
  key: string;
  viewColumn: number | undefined;
  activeLabel: string | null;
  tabs: TabInfo[];
  isActive: boolean;
}

export const TabList: React.FC<TabListProps> = ({ viewMode }) => {
  const { state, actions } = useTabContext();
  const tabGroups = state.payload?.tabGroups ?? {};
  const getColumnLabel = (viewColumn: number | undefined) => {
    if (typeof viewColumn === 'number' && !Number.isNaN(viewColumn)) {
      return `Column ${viewColumn}`;
    }
    return 'Column •';
  };

  const columns = useMemo<ColumnInfo[]>(() => {
    return Object.entries(tabGroups)
      .map(([key, group]) => {
        const sortValue = group.viewColumn ?? Number.MAX_SAFE_INTEGER;
        const numericKey = Number(key);
        const displayName = group.activeTab ? group.activeTab.label : null;

        return {
          key,
          viewColumn: group.viewColumn,
          activeLabel: displayName,
          tabs: group.tabs,
          isActive: state.payload?.activeGroup === group.viewColumn,
          sortValue,
          numericKey: Number.isNaN(numericKey)
            ? Number.MAX_SAFE_INTEGER
            : numericKey
        };
      })
      .sort((a, b) => {
        if (a.sortValue !== b.sortValue) {
          return a.sortValue - b.sortValue;
        }
        return a.numericKey - b.numericKey;
      });
  }, [tabGroups, state.payload?.activeGroup]);

  const flatList = useMemo(() => {
    return columns
      .flatMap((column) =>
        column.tabs.map((tab) => ({
          columnKey: column.key,
          columnLabel: getColumnLabel(column.viewColumn),
          isActiveColumn: column.isActive,
          tab
        }))
      )
      .sort((a, b) => {
        if (a.tab.isPinned !== b.tab.isPinned) {
          return a.tab.isPinned ? -1 : 1;
        }
        const nameA = a.tab.label;
        const nameB = b.tab.label;
        return nameA.localeCompare(nameB);
      });
  }, [columns]);

  const totalVisibleTabs = useMemo(() => {
    return columns.reduce((count, column) => count + column.tabs.length, 0);
  }, [columns]);

  if (state.loading) {
    return (
      <div className="tab-empty-state">
        <i className="codicon codicon-sync" aria-hidden="true" />
        <p>Loading tabs…</p>
      </div>
    );
  }

  if (totalVisibleTabs === 0) {
    return (
      <div className="tab-empty-state">
        <i className="codicon codicon-search-fuzzy" aria-hidden="true" />
        <p>No tabs are currently open.</p>
      </div>
    );
  }

  if (viewMode === 'flat') {
    return (
      <ul className="tab-list-flat" role="list">
        {flatList.map(({ tab, columnLabel, isActiveColumn }, index) => (
          <TabItem
            key={`${tab.viewColumn}:${tab.label}`}
            tab={tab}
            onOpen={() => void actions.openTab(index, tab)}
            onClose={() => void actions.closeTab(index, tab)}
            onTogglePin={() => void actions.togglePin(index, tab)}
            viewColumnLabel={columnLabel}
            isColumnActive={isActiveColumn}
          />
        ))}
      </ul>
    );
  }

  return (
    <div className="tab-columns" role="list">
      {columns.map(({ key, viewColumn, tabs, isActive }) => (
        <div
          key={key}
          className={`tab-column${isActive ? ' active' : ''}`}
          role="listitem"
        >
          <div className="tab-column-header">
            <span className="tab-column-title">
              {getColumnLabel(viewColumn)}
            </span>
          </div>
          <ul className="tab-list" role="list">
            {tabs.map((tab, index) => (
              <TabItem
                key={`${tab.viewColumn}:${tab.label}`}
                tab={tab}
                onOpen={() => void actions.openTab(index, tab)}
                onClose={() => void actions.closeTab(index, tab)}
                onTogglePin={() => void actions.togglePin(index, tab)}
                viewColumnLabel={getColumnLabel(viewColumn)}
                isColumnActive={isActive}
              />
            ))}
            {tabs.length === 0 && (
              <li className="no-tabs">No tabs in this column.</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

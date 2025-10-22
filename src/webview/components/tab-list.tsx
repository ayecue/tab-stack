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
  const getColumnLabel = (viewColumn: number) => {
    return `Column ${viewColumn}`;
  };

  const columns = Object.values(tabGroups).map((group) => {
    const displayName = group.activeTab ? group.activeTab.label : null;

    return {
      viewColumn: group.viewColumn,
      label: displayName,
      tabs: group.tabs,
      isActive: state.payload?.activeGroup === group.viewColumn
    };
  });

  const flatList = columns.flatMap((group) =>
    group.tabs.map((tab, index) => ({
      label: getColumnLabel(group.viewColumn),
      isActive: group.isActive,
      tabGroupIndex: index,
      viewColumn: group.viewColumn,
      tab
    }))
  );

  const totalVisibleTabs = flatList.length;

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
        {flatList.map(({ tab, label, isActive, tabGroupIndex }) => (
          <TabItem
            key={`${tab.viewColumn}:${tab.label}`}
            tab={tab}
            onOpen={() => void actions.openTab(tabGroupIndex, tab)}
            onClose={() => void actions.closeTab(tabGroupIndex, tab)}
            onTogglePin={() => void actions.togglePin(tabGroupIndex, tab)}
            viewColumnLabel={label}
            isColumnActive={isActive}
          />
        ))}
      </ul>
    );
  }

  return (
    <div className="tab-columns" role="list">
      {columns.map(({ viewColumn, tabs, isActive }) => {
        const columnLabel = getColumnLabel(viewColumn);

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
              {tabs.map((tab, index) => (
                <TabItem
                  key={`${tab.viewColumn}:${index}:${tab.label}`}
                  tab={tab}
                  onOpen={() => void actions.openTab(index, tab)}
                  onClose={() => void actions.closeTab(index, tab)}
                  onTogglePin={() => void actions.togglePin(index, tab)}
                  viewColumnLabel={columnLabel}
                  isColumnActive={isActive}
                />
              ))}
              {tabs.length === 0 && (
                <li className="no-tabs">No tabs in this column.</li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

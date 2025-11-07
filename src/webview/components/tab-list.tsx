import React, { useMemo } from 'react';

import { TabInfo, TabKind } from '../../types/tabs';
import { useTabContext } from '../hooks/use-tab-context';
import { TabItem } from './tab-item';

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

interface TabWithIndex {
  tab: TabInfo;
  originalIndex: number;
}

export const TabList: React.FC<TabListProps> = ({
  viewMode,
  searchTerm,
  filters
}) => {
  const { state, messagingService } = useTabContext();
  const tabGroups = state.payload?.tabGroups ?? {};
  const getColumnLabel = (viewColumn: number) => {
    return `Column ${viewColumn}`;
  };

  const matchesSearch = (tab: TabInfo, term: string): boolean => {
    if (!term.trim()) return true;
    const lowerTerm = term.toLowerCase();

    // Check label
    if (tab.label.toLowerCase().includes(lowerTerm)) {
      return true;
    }

    // Check URI for tab types that have it
    if ('uri' in tab && tab.uri && tab.uri.toLowerCase().includes(lowerTerm)) {
      return true;
    }

    // Check URIs for diff types
    if ('originalUri' in tab) {
      if (
        tab.originalUri &&
        tab.originalUri.toLowerCase().includes(lowerTerm)
      ) {
        return true;
      }
      if (
        'modifiedUri' in tab &&
        tab.modifiedUri &&
        tab.modifiedUri.toLowerCase().includes(lowerTerm)
      ) {
        return true;
      }
    }

    return false;
  };

  const matchesType = (tab: TabInfo): boolean => {
    const type = filters?.type ?? 'all';
    if (type === 'all') return true;
    switch (type) {
      case 'text':
        return tab.kind === TabKind.TabInputText;
      case 'diff':
        return (
          tab.kind === TabKind.TabInputTextDiff ||
          tab.kind === TabKind.TabInputNotebookDiff
        );
      case 'notebook':
        return tab.kind === TabKind.TabInputNotebook;
      case 'webview':
        return tab.kind === TabKind.TabInputWebview;
      case 'custom':
        return tab.kind === TabKind.TabInputCustom;
      case 'terminal':
        return tab.kind === TabKind.TabInputTerminal;
      default:
        return true;
    }
  };

  const passesFilters = (tab: TabInfo): boolean => {
    if (filters?.pinnedOnly && !tab.isPinned) return false;
    if (filters?.dirtyOnly && !(tab as any).isDirty) return false;
    if (!matchesType(tab)) return false;
    return true;
  };

  const columns = useMemo(() => {
    return Object.values(tabGroups).map((group) => {
      const displayName = group.activeTab ? group.activeTab.label : null;

      // Map tabs with their original indices before filtering
      const tabsWithIndices: TabWithIndex[] = group.tabs.map((tab, index) => ({
        tab,
        originalIndex: index
      }));

      // Filter tabs based on search term while preserving original indices
      const filteredTabs = (
        searchTerm.trim()
          ? tabsWithIndices.filter(({ tab }) => matchesSearch(tab, searchTerm))
          : tabsWithIndices
      ).filter(({ tab }) => passesFilters(tab));

      return {
        viewColumn: group.viewColumn,
        label: displayName,
        tabs: filteredTabs,
        isActive: state.payload?.activeGroup === group.viewColumn
      };
    });
  }, [tabGroups, searchTerm, state.payload?.activeGroup, filters]);

  const flatList = useMemo(() => {
    return columns.flatMap((group) =>
      group.tabs.map(({ tab, originalIndex }) => ({
        label: getColumnLabel(group.viewColumn),
        isActive: group.isActive,
        tabGroupIndex: originalIndex,
        viewColumn: group.viewColumn,
        tab
      }))
    );
  }, [columns]);

  const totalVisibleTabs = flatList.length;

  if (state.loading || state.rendering) {
    return (
      <div className="tab-empty-state">
        <i className="codicon codicon-sync" aria-hidden="true" />
        <p>{state.rendering ? 'Applying tabs…' : 'Loading tabs…'}</p>
      </div>
    );
  }

  if (totalVisibleTabs === 0) {
    if (searchTerm.trim()) {
      return (
        <div className="tab-empty-state">
          <i className="codicon codicon-search-fuzzy" aria-hidden="true" />
          <p>No tabs match "{searchTerm}"</p>
        </div>
      );
    }
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
            onOpen={() =>
              messagingService.openTab(tabGroupIndex, tab.viewColumn)
            }
            onClose={() =>
              messagingService.closeTab(tabGroupIndex, tab.viewColumn)
            }
            onTogglePin={() =>
              messagingService.toggleTabPin(tabGroupIndex, tab.viewColumn)
            }
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
                  viewColumnLabel={columnLabel}
                  isColumnActive={isActive}
                />
              ))}
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

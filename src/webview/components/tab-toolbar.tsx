import React from 'react';

import { Tooltip } from './common/tooltip';

export type FilterType =
  | 'all'
  | 'text'
  | 'diff'
  | 'notebook'
  | 'webview'
  | 'custom'
  | 'terminal';

interface TabToolbarProps {
  viewMode: 'columns' | 'flat';
  onViewModeChange: (mode: 'columns' | 'flat') => void;
  totals: {
    openTabs: number;
    pinnedTabs: number;
    groups: number;
    histories: number;
  };
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters?: {
    pinnedOnly: boolean;
    dirtyOnly: boolean;
    type: FilterType;
  };
  onFiltersChange?: (next: {
    pinnedOnly?: boolean;
    dirtyOnly?: boolean;
    type?: FilterType;
  }) => void;
  actions: {
    onRefresh: () => void;
    onSaveGroup: () => void;
    onCreateAddon: () => void;
    onSnapshot: () => void;
    onRestoreSnapshot: () => void;
    onCloseAll: () => void;
  };
  disabled?: {
    saveGroup?: boolean;
    createAddon?: boolean;
    snapshot?: boolean;
    restoreSnapshot?: boolean;
    closeAll?: boolean;
  };
}

export const TabToolbar: React.FC<TabToolbarProps> = ({
  viewMode,
  onViewModeChange,
  totals,
  isLoading,
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  actions,
  disabled
}) => {
  return (
    <div className="tab-toolbar">
      <div className="tab-toolbar-row">
        <div className="action-group" role="group" aria-label="Tab actions">
          <Tooltip content="Refresh open tabs">
            <button
              type="button"
              className="icon-button"
              onClick={actions.onRefresh}
              disabled={isLoading}
            >
              <i className="codicon codicon-refresh" aria-hidden="true" />
            </button>
          </Tooltip>
          <Tooltip content="Save current tabs as group">
            <button
              type="button"
              className="icon-button"
              onClick={actions.onSaveGroup}
              disabled={isLoading || disabled?.saveGroup}
            >
              <i className="codicon codicon-archive" aria-hidden="true" />
            </button>
          </Tooltip>
          <Tooltip content="Snapshot current tabs">
            <button
              type="button"
              className="icon-button"
              onClick={actions.onSnapshot}
              disabled={isLoading || disabled?.snapshot}
            >
              <i className="codicon codicon-device-camera" aria-hidden="true" />
            </button>
          </Tooltip>
          <Tooltip content="Save current tabs as add-on">
            <button
              type="button"
              className="icon-button"
              onClick={actions.onCreateAddon}
              disabled={isLoading || disabled?.createAddon}
            >
              <i className="codicon codicon-extensions" aria-hidden="true" />
            </button>
          </Tooltip>
          <Tooltip content="Restore last snapshot">
            <button
              type="button"
              className="icon-button"
              onClick={actions.onRestoreSnapshot}
              disabled={isLoading || disabled?.restoreSnapshot}
            >
              <i className="codicon codicon-history" aria-hidden="true" />
            </button>
          </Tooltip>
          <Tooltip content="Close all tabs">
            <button
              type="button"
              className="icon-button danger"
              onClick={actions.onCloseAll}
              disabled={isLoading || disabled?.closeAll}
            >
              <i className="codicon codicon-close-all" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>

        <div className="toolbar-stats" aria-label="Tab counts">
          <Tooltip content={`${totals.openTabs} open tabs`}>
            <span className="toolbar-stat">
              <i className="codicon codicon-files" aria-hidden="true" />
              <strong>{totals.openTabs}</strong>
            </span>
          </Tooltip>
          <Tooltip content={`${totals.pinnedTabs} pinned tabs`}>
            <span className="toolbar-stat">
              <i className="codicon codicon-pin" aria-hidden="true" />
              <strong>{totals.pinnedTabs}</strong>
            </span>
          </Tooltip>
        </div>

        <div className="toggle-group" role="group" aria-label="View mode">
          <Tooltip content="Show tabs by VS Code columns">
            <button
              type="button"
              className={viewMode === 'columns' ? 'active' : ''}
              onClick={() => onViewModeChange('columns')}
              aria-label="Column view"
            >
              <i
                className="codicon codicon-layout-activitybar-left"
                aria-hidden="true"
              />
            </button>
          </Tooltip>
          <Tooltip content="Show tabs in a single list">
            <button
              type="button"
              className={viewMode === 'flat' ? 'active' : ''}
              onClick={() => onViewModeChange('flat')}
              aria-label="List view"
            >
              <i className="codicon codicon-list-unordered" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="tab-toolbar-row">
        <div className="tab-toolbar-search">
          <div className="search-input">
            <i className="codicon codicon-search" aria-hidden="true" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search tabs..."
              aria-label="Search open tabs"
            />
            {searchTerm && (
              <Tooltip content="Clear tab search">
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear tab search"
                >
                  <i className="codicon codicon-close" aria-hidden="true" />
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="filter-group" role="group" aria-label="Tab filters">
          <Tooltip content="Show pinned only">
            <button
              type="button"
              className={`icon-button${filters?.pinnedOnly ? ' active' : ''}`}
              onClick={() =>
                onFiltersChange?.({ pinnedOnly: !filters?.pinnedOnly })
              }
              aria-pressed={!!filters?.pinnedOnly}
            >
              <i className="codicon codicon-pin" aria-hidden="true" />
            </button>
          </Tooltip>
          <Tooltip content="Show modified (dirty) only">
            <button
              type="button"
              className={`icon-button${filters?.dirtyOnly ? ' active' : ''}`}
              onClick={() =>
                onFiltersChange?.({ dirtyOnly: !filters?.dirtyOnly })
              }
              aria-pressed={!!filters?.dirtyOnly}
            >
              <i className="codicon codicon-pencil" aria-hidden="true" />
            </button>
          </Tooltip>
          <select
            className="type-select"
            aria-label="Filter by tab type"
            value={filters?.type ?? 'all'}
            onChange={(e) =>
              onFiltersChange?.({ type: e.target.value as any })
            }
          >
            <option value="all">All types</option>
            <option value="text">Text</option>
            <option value="diff">Diff</option>
            <option value="notebook">Notebook</option>
            <option value="webview">Webview</option>
            <option value="custom">Custom</option>
            <option value="terminal">Terminal</option>
          </select>
        </div>
      </div>
    </div>
  );
};

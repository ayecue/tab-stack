import React from 'react';

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
            <button
              type="button"
              className="clear-search"
              onClick={() => onSearchChange('')}
              aria-label="Clear tab search"
            >
              <i className="codicon codicon-close" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <div className="tab-toolbar-controls">
        <div className="action-group" role="group" aria-label="Tab actions">
          <button
            type="button"
            className="icon-button"
            onClick={actions.onRefresh}
            title="Refresh open tabs"
            disabled={isLoading}
          >
            <i className="codicon codicon-refresh" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={actions.onSaveGroup}
            title="Save current tabs as group"
            disabled={isLoading || disabled?.saveGroup}
          >
            <i className="codicon codicon-archive" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={actions.onCreateAddon}
            title="Save current tabs as add-on"
            disabled={isLoading || disabled?.createAddon}
          >
            <i className="codicon codicon-extensions" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={actions.onSnapshot}
            title="Snapshot current tabs"
            disabled={isLoading || disabled?.snapshot}
          >
            <i className="codicon codicon-device-camera" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={actions.onRestoreSnapshot}
            title="Restore last snapshot"
            disabled={isLoading || disabled?.restoreSnapshot}
          >
            <i className="codicon codicon-history" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button danger"
            onClick={actions.onCloseAll}
            title="Close every open tab"
            disabled={isLoading || disabled?.closeAll}
          >
            <i className="codicon codicon-close-all" aria-hidden="true" />
          </button>
        </div>
        <div className="filter-group" role="group" aria-label="Tab filters">
          <button
            type="button"
            className={`icon-button${filters?.pinnedOnly ? ' active' : ''}`}
            onClick={() =>
              onFiltersChange?.({ pinnedOnly: !filters?.pinnedOnly })
            }
            title="Show pinned only"
            aria-pressed={!!filters?.pinnedOnly}
          >
            <i className="codicon codicon-pin" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`icon-button${filters?.dirtyOnly ? ' active' : ''}`}
            onClick={() =>
              onFiltersChange?.({ dirtyOnly: !filters?.dirtyOnly })
            }
            title="Show modified (dirty) only"
            aria-pressed={!!filters?.dirtyOnly}
          >
            <i className="codicon codicon-pencil" aria-hidden="true" />
          </button>
          <select
            className="type-select"
            aria-label="Filter by tab type"
            value={filters?.type ?? 'all'}
            onChange={(e) => onFiltersChange?.({ type: e.target.value as any })}
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

      <div className="toolbar-stats" aria-label="Tab counts">
        <span className="toolbar-stat">
          <strong>{totals.openTabs}</strong> open
        </span>
        <span className="toolbar-stat">
          <strong>{totals.pinnedTabs}</strong> pinned
        </span>
      </div>

      <div className="toggle-group" role="group" aria-label="View mode">
        <button
          type="button"
          className={viewMode === 'columns' ? 'active' : ''}
          onClick={() => onViewModeChange('columns')}
          title="Show tabs by VS Code columns"
        >
          <i
            className="codicon codicon-layout-activitybar-left"
            aria-hidden="true"
          />
          <span>Columns</span>
        </button>
        <button
          type="button"
          className={viewMode === 'flat' ? 'active' : ''}
          onClick={() => onViewModeChange('flat')}
          title="Show tabs in a single list"
        >
          <i className="codicon codicon-list-unordered" aria-hidden="true" />
          <span>List</span>
        </button>
      </div>
    </div>
  );
};

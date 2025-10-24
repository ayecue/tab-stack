import React from 'react';

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
  actions: {
    onRefresh: () => void;
    onSaveGroup: () => void;
    onSnapshot: () => void;
    onRestoreSnapshot: () => void;
    onCloseAll: () => void;
  };
  disabled?: {
    saveGroup?: boolean;
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
            disabled={disabled?.saveGroup}
          >
            <i className="codicon codicon-archive" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={actions.onSnapshot}
            title="Snapshot current tabs"
            disabled={disabled?.snapshot}
          >
            <i className="codicon codicon-device-camera" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={actions.onRestoreSnapshot}
            title="Restore last snapshot"
            disabled={disabled?.restoreSnapshot}
          >
            <i className="codicon codicon-history" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button danger"
            onClick={actions.onCloseAll}
            title="Close every open tab"
            disabled={disabled?.closeAll}
          >
            <i className="codicon codicon-close-all" aria-hidden="true" />
          </button>
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

import React, { useState } from 'react';

import { TabProvider, useTabContext } from '../hooks/use-tab-context';
import { useTabActions } from '../hooks/use-tab-actions';
import { CollectionsPanel } from './collections-panel';
import { ErrorBoundary } from './error-boundary';
import { Header } from './header';
import { SettingsPanel } from './settings-panel';
import { TabList } from './tab-list';
import { FilterType, TabToolbar } from './tab-toolbar';

const TabManagerContent: React.FC = () => {
  const { state, messagingService } = useTabContext();
  const [viewMode, setViewMode] = useState<'columns' | 'flat'>('columns');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState({
    pinnedOnly: false,
    dirtyOnly: false,
    type: 'all' as FilterType
  });

  const {
    totals,
    lastSnapshotId,
    hasTabs,
    handleCloseAllTabs,
    handleSaveGroup,
    handleSnapshot,
    handleRestoreSnapshot,
    handleCreateAddon
  } = useTabActions({
    messagingService,
    tabGroups: state.payload?.tabGroups,
    groupsLength: state.groups.length,
    histories: state.histories,
    rendering: state.rendering
  });

  return (
    <div className="tab-manager">
      {state.error && (
        <div className="notification error">
          <i className="codicon codicon-warning" aria-hidden="true" />
          <span>{state.error}</span>
        </div>
      )}

      <Header
        connectionStatus={state.connectionStatus}
        isLoading={state.loading || state.rendering}
      />

      <div className="tab-manager-shell">
        <aside className="tab-manager-sidebar">
          <SettingsPanel />
          <CollectionsPanel />
        </aside>

        <section className="tab-manager-main" aria-label="Open tabs">
          <TabToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totals={totals}
            isLoading={state.loading || state.rendering}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFiltersChange={(next) =>
              setFilters((prev) => ({ ...prev, ...next }))
            }
            actions={{
              onRefresh: () => {
                messagingService.refreshTabs();
              },
              onSaveGroup: handleSaveGroup,
              onCreateAddon: handleCreateAddon,
              onSnapshot: handleSnapshot,
              onRestoreSnapshot: handleRestoreSnapshot,
              onCloseAll: handleCloseAllTabs
            }}
            disabled={{
              saveGroup: !hasTabs || state.rendering,
              createAddon: !hasTabs || state.rendering,
              snapshot: !hasTabs || state.rendering,
              restoreSnapshot: !lastSnapshotId || state.rendering,
              closeAll: !hasTabs || state.rendering
            }}
          />

          <TabList
            viewMode={viewMode}
            searchTerm={searchTerm}
            filters={filters}
          />
        </section>
      </div>
    </div>
  );
};

export const TabManager: React.FC = () => {
  return (
    <ErrorBoundary>
      <TabProvider>
        <TabManagerContent />
      </TabProvider>
    </ErrorBoundary>
  );
};

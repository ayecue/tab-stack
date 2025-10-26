import React, { useCallback, useMemo, useState } from 'react';

import { TabProvider, useTabContext } from '../hooks/use-tab-context';
import { CollectionsPanel } from './collections-panel';
import { Header } from './header';
import { SettingsPanel } from './settings-panel';
import { TabList } from './tab-list';
import { TabToolbar } from './tab-toolbar';

const TabManagerContent: React.FC = () => {
  const { state, actions } = useTabContext();
  const [viewMode, setViewMode] = useState<'columns' | 'flat'>('columns');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const totals = useMemo(() => {
    const tabGroups = state.payload?.tabGroups ?? {};
    const groupValues = Object.values(tabGroups);
    const openTabs = groupValues.reduce(
      (count, group) => count + group.tabs.length,
      0
    );
    const pinnedTabs = groupValues.reduce(
      (count, group) => count + group.tabs.filter((tab) => tab.isPinned).length,
      0
    );

    return {
      openTabs,
      pinnedTabs,
      groups: state.groups.length,
      histories: state.histories.length
    };
  }, [state]);

  const lastSnapshotId = useMemo(() => {
    if (state.histories.length === 0) {
      return null;
    }
    return state.histories[0].historyId;
  }, [state.histories]);

  const handleCloseAllTabs = useCallback(() => {
    const tabGroups = state.payload?.tabGroups;
    if (!tabGroups) {
      return;
    }
    actions.clearAllTabs().catch((error) => {
      console.error('Failed to close all tabs', error);
    });
  }, [actions, state.payload?.tabGroups]);

  const handleSaveGroup = useCallback(() => {
    const name = `Group ${new Date().toLocaleTimeString()}`;
    if (name) {
      void actions
        .saveGroup(name.trim())
        .catch((error) => console.error('Failed to save group', error));
    }
  }, [actions]);

  const handleSnapshot = useCallback(() => {
    void actions
      .captureHistory()
      .catch((error) => console.error('Failed to snapshot tabs', error));
  }, [actions]);

  const handleRestoreSnapshot = useCallback(() => {
    if (!lastSnapshotId) {
      return;
    }
    void actions
      .recoverHistory(lastSnapshotId)
      .catch((error) => console.error('Failed to restore snapshot', error));
  }, [actions, lastSnapshotId]);

  const hasTabs = totals.openTabs > 0;

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
            actions={{
              onRefresh: () =>
                void actions
                  .requestRefresh()
                  .catch((error) =>
                    console.error('Failed to refresh tabs', error)
                  ),
              onSaveGroup: handleSaveGroup,
              onSnapshot: handleSnapshot,
              onRestoreSnapshot: handleRestoreSnapshot,
              onCloseAll: handleCloseAllTabs
            }}
            disabled={{
              saveGroup: !hasTabs || state.rendering,
              snapshot: !hasTabs || state.rendering,
              restoreSnapshot: !lastSnapshotId || state.rendering,
              closeAll: !hasTabs || state.rendering
            }}
          />

          <TabList viewMode={viewMode} searchTerm={searchTerm} />
        </section>
      </div>
    </div>
  );
};

export const TabManager: React.FC = () => {
  return (
    <TabProvider>
      <TabManagerContent />
    </TabProvider>
  );
};

import React, { useMemo } from 'react';

import { useTabContext } from '../hooks/use-tab-context';

interface QuickActionsProps {
  totals: {
    openTabs: number;
    pinnedTabs: number;
    groups: number;
    history: number;
  };
}

export const QuickActions: React.FC<QuickActionsProps> = ({ totals }) => {
  const { actions, state } = useTabContext();

  const hasTabs = totals.openTabs > 0;
  const canRecover = state.historyIds.length > 0;

  const lastSnapshotId = useMemo(() => {
    if (state.historyIds.length === 0) {
      return null;
    }
    return [...state.historyIds].sort().reverse()[0];
  }, [state.historyIds]);

  const handleCloseAllTabs = () => {
    if (!state.payload?.tabGroups) {
      return;
    }
    Object.values(state.payload.tabGroups).forEach((group, index) => {
      group.tabs.forEach((tab) => {
        actions
          .closeTab(index, tab)
          .catch((error) => console.error('Failed to close tab', error));
      });
    });
  };

  const handleSaveGroup = () => {
    const defaultName = `Group ${new Date().toLocaleTimeString()}`;
    const name = window.prompt('Save current tabs as group', defaultName);
    if (name) {
      actions
        .saveGroup(name.trim())
        .catch((error) => console.error('Failed to save group', error));
    }
  };

  const handleRecoverSnapshot = () => {
    if (!lastSnapshotId) {
      return;
    }
    actions
      .recoverHistory(lastSnapshotId)
      .catch((error) => console.error('Failed to recover snapshot', error));
  };

  return (
    <section className="card quick-actions" aria-label="Quick actions">
      <header>
        <h2>Quick actions</h2>
      </header>
      <div className="quick-actions-grid">
        <button
          className="action-button action-primary"
          onClick={() =>
            actions
              .requestRefresh()
              .catch((error) => console.error('Failed to refresh tabs', error))
          }
          title="Refresh tabs from VS Code"
        >
          <i className="codicon codicon-refresh" aria-hidden="true" />
          <span>Refresh</span>
        </button>

        <button
          className="action-button action-secondary"
          onClick={handleSaveGroup}
          disabled={!hasTabs}
          title="Save current layout as a reusable group"
        >
          <i className="codicon codicon-archive" aria-hidden="true" />
          <span>Save as group</span>
        </button>

        <button
          className="action-button action-secondary"
          onClick={() =>
            actions
              .captureHistory()
              .catch((error) =>
                console.error('Failed to capture snapshot', error)
              )
          }
          disabled={!hasTabs}
          title="Take a snapshot of all open tabs"
        >
          <i className="codicon codicon-device-camera" aria-hidden="true" />
          <span>Snapshot tabs</span>
        </button>

        <button
          className="action-button action-danger"
          onClick={handleCloseAllTabs}
          disabled={!hasTabs}
          title="Close every open tab"
        >
          <i className="codicon codicon-close-all" aria-hidden="true" />
          <span>Close all</span>
        </button>

        <button
          className="action-button action-neutral"
          onClick={handleRecoverSnapshot}
          disabled={!canRecover || !lastSnapshotId}
          title="Restore the most recent snapshot"
        >
          <i className="codicon codicon-history" aria-hidden="true" />
          <span>Restore last snapshot</span>
        </button>
      </div>
    </section>
  );
};

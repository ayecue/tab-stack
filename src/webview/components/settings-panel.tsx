import React, { useCallback, useState } from 'react';

import { GitIntegrationMode } from '../../types/config';
import { useTabContext } from '../hooks/use-tab-context';

export const SettingsPanel: React.FC = () => {
  const { state, messagingService } = useTabContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleWorkspaceFolderChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      messagingService.selectWorkspaceFolder(value || null);
    },
    [messagingService]
  );

  const handleClearWorkspaceFolder = useCallback(() => {
    messagingService.clearWorkspaceFolder();
  }, [messagingService]);

  const handleGitEnabledChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const enabled = event.target.checked;
      messagingService.updateGitIntegration({ enabled });
    },
    [messagingService]
  );

  const handleGitModeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const mode = event.target.value as GitIntegrationMode;
      messagingService.updateGitIntegration({ mode });
    },
    [messagingService]
  );

  const handleGitGroupPrefixChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const groupPrefix = event.target.value;
      messagingService.updateGitIntegration({ groupPrefix });
    },
    [messagingService]
  );

  const handleHistoryMaxEntriesChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value, 10);
      if (!isNaN(value) && value >= 1 && value <= 100) {
        messagingService.updateHistoryMaxEntries(value);
      }
    },
    [messagingService]
  );

  return (
    <div className="settings-panel">
      <button
        className="settings-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        type="button"
      >
        <i
          className={`codicon codicon-chevron-${isExpanded ? 'down' : 'right'}`}
          aria-hidden="true"
        />
        <i className="codicon codicon-settings-gear" aria-hidden="true" />
        <span>Settings</span>
      </button>

      {isExpanded && (
        <div className="settings-content">
          <div className="settings-section">
            <label className="settings-label" htmlFor="workspace-folder-select">
              <i className="codicon codicon-folder" aria-hidden="true" />
              Master Workspace Folder
            </label>
            <p className="settings-description">
              Select the workspace folder for storing tab state and tracking git
              changes.
            </p>

            {state.availableWorkspaceFolders.length > 0 ? (
              <>
                <div className="workspace-folder-select-container">
                  <select
                    id="workspace-folder-select"
                    className="workspace-folder-select"
                    value={state.masterWorkspaceFolder || ''}
                    onChange={handleWorkspaceFolderChange}
                  >
                    <option value="">Use default folder</option>
                    {state.availableWorkspaceFolders.map((folder) => (
                      <option key={folder.path} value={folder.path}>
                        {folder.name}
                      </option>
                    ))}
                  </select>

                  {state.masterWorkspaceFolder && (
                    <button
                      className="button secondary small"
                      onClick={handleClearWorkspaceFolder}
                      title="Clear and use default folder"
                      type="button"
                    >
                      <i className="codicon codicon-close" aria-hidden="true" />
                      Clear Selection
                    </button>
                  )}
                </div>

                {state.masterWorkspaceFolder && (
                  <p className="settings-description muted-text">
                    {state.masterWorkspaceFolder}/.vscode/tmstate.json
                  </p>
                )}
              </>
            ) : (
              <p className="settings-description muted-text">
                No workspace folders available
              </p>
            )}
          </div>

          <div className="settings-section">
            <label className="settings-label" htmlFor="git-enabled">
              <i className="codicon codicon-git-branch" aria-hidden="true" />
              Git Integration
            </label>
            <p className="settings-description">
              Control how tab groups follow your Git branches: auto switch on
              branch change, auto create groups, or full auto. Prefix controls
              the generated group name.
            </p>

            {state.gitIntegration ? (
              <div className="git-settings-grid">
                <div className="form-row">
                  <label htmlFor="git-enabled" className="inline">
                    <input
                      id="git-enabled"
                      type="checkbox"
                      checked={state.gitIntegration.enabled}
                      onChange={handleGitEnabledChange}
                    />
                    Enable Git integration
                  </label>
                </div>

                <div className="form-row">
                  <label htmlFor="git-mode-select">Mode</label>
                  <select
                    id="git-mode-select"
                    className="git-mode-select"
                    value={state.gitIntegration.mode}
                    onChange={handleGitModeChange}
                    disabled={!state.gitIntegration.enabled}
                  >
                    <option value={GitIntegrationMode.AutoSwitch}>
                      Auto switch on branch change
                    </option>
                    <option value={GitIntegrationMode.AutoCreate}>
                      Auto create group on branch change
                    </option>
                    <option value={GitIntegrationMode.FullAuto}>
                      Full auto (create + switch)
                    </option>
                  </select>
                </div>

                <div className="form-row">
                  <label htmlFor="git-group-prefix">Group prefix</label>
                  <input
                    id="git-group-prefix"
                    className="git-group-prefix"
                    type="text"
                    value={state.gitIntegration.groupPrefix}
                    onChange={handleGitGroupPrefixChange}
                    placeholder="e.g. git/"
                    disabled={!state.gitIntegration.enabled}
                  />
                </div>
              </div>
            ) : (
              <p className="settings-description muted-text">Loading…</p>
            )}
          </div>

          <div className="settings-section">
            <label className="settings-label" htmlFor="history-max-entries">
              <i className="codicon codicon-history" aria-hidden="true" />
              History
            </label>
            <p className="settings-description">
              Maximum number of history entries to keep. Range: 1-100.
            </p>

            {state.historyMaxEntries != null ? (
              <div className="form-row">
                <label htmlFor="history-max-entries">Max entries</label>
                <input
                  id="history-max-entries"
                  type="number"
                  min="1"
                  max="100"
                  value={state.historyMaxEntries}
                  onChange={handleHistoryMaxEntriesChange}
                />
              </div>
            ) : (
              <p className="settings-description muted-text">Loading…</p>
            )}
          </div>

          <div className="settings-section">
            <label className="settings-label">
              <i className="codicon codicon-save" aria-hidden="true" />
              State file
            </label>
            <p className="settings-description">
              Import or export the full tab manager state as a JSON file.
            </p>
            <div className="form-row button-row">
              <button
                className="button secondary"
                type="button"
                onClick={() => messagingService.exportStateFile()}
                title="Export current state to a JSON file"
              >
                <i className="codicon codicon-export" aria-hidden="true" />
                Export state file
              </button>

              <button
                className="button secondary"
                type="button"
                onClick={() => messagingService.importStateFile()}
                title="Import state from a JSON file"
              >
                <i className="codicon codicon-import" aria-hidden="true" />
                Import state file
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

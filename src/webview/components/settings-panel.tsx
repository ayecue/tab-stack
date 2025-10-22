import React, { useCallback, useState } from 'react';

import { useTabContext } from '../hooks/use-tab-context';

export const SettingsPanel: React.FC = () => {
  const { state, actions } = useTabContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleWorkspaceFolderChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      void actions.selectWorkspaceFolder(value || null).catch((error) => {
        console.error('Failed to select workspace folder', error);
      });
    },
    [actions]
  );

  const handleClearWorkspaceFolder = useCallback(() => {
    void actions.clearWorkspaceFolder().catch((error) => {
      console.error('Failed to clear workspace folder', error);
    });
  }, [actions]);

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
        </div>
      )}
    </div>
  );
};

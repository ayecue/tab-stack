import React, { useCallback } from 'react';

import { useTabContext } from '../../hooks/use-tab-context';
import { Tooltip } from '../common/tooltip';

export const WorkspaceFolderSection: React.FC = () => {
  const { state, messagingService } = useTabContext();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      messagingService.selectWorkspaceFolder(value || null);
    },
    [messagingService]
  );

  const handleClear = useCallback(() => {
    messagingService.clearWorkspaceFolder();
  }, [messagingService]);

  return (
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
              onChange={handleChange}
            >
              <option value="">Use default folder</option>
              {state.availableWorkspaceFolders.map((folder) => (
                <option key={folder.path} value={folder.path}>
                  {folder.name}
                </option>
              ))}
            </select>

            {state.masterWorkspaceFolder && (
              <Tooltip content="Clear and use default folder">
                <button
                  className="button secondary small"
                  onClick={handleClear}
                  type="button"
                >
                  <i className="codicon codicon-close" aria-hidden="true" />
                  Clear Selection
                </button>
              </Tooltip>
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
  );
};

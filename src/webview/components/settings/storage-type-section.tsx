import React, { useCallback } from 'react';

import { StorageType } from '../../../types/config';
import { useTabContext } from '../../hooks/use-tab-context';

export const StorageTypeSection: React.FC = () => {
  const { state, messagingService } = useTabContext();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const storageType = event.target.value as StorageType;
      messagingService.updateStorageType(storageType);
    },
    [messagingService]
  );

  return (
    <div className="settings-section">
      <label className="settings-label" htmlFor="storage-type-select">
        <i className="codicon codicon-database" aria-hidden="true" />
        Storage Type
      </label>
      <p className="settings-description">
        Choose where to store tab state. File storage saves to
        .vscode/tmstate.json (visible, git-trackable). Workspace state uses VS
        Code's internal storage (hidden, not in git).
      </p>

      {state.storageType != null ? (
        <div className="form-row">
          <label htmlFor="storage-type-select">Storage method</label>
          <select
            id="storage-type-select"
            className="storage-type-select"
            value={state.storageType}
            onChange={handleChange}
          >
            <option value={StorageType.File}>
              File (.vscode/tmstate.json)
            </option>
            <option value={StorageType.WorkspaceState}>
              Workspace State (hidden)
            </option>
          </select>
        </div>
      ) : (
        <p className="settings-description muted-text">Loading…</p>
      )}
    </div>
  );
};

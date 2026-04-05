import React from 'react';

import { useTabContext } from '../../hooks/use-tab-context';
import { Tooltip } from '../common/tooltip';

export const StateFileSection: React.FC = () => {
  const { messagingService } = useTabContext();

  return (
    <div className="settings-section">
      <label className="settings-label">
        <i className="codicon codicon-save" aria-hidden="true" />
        State file
      </label>
      <p className="settings-description">
        Import or export the full tab manager state as a JSON file.
      </p>
      <div className="form-row button-row">
        <Tooltip content="Export current state to a JSON file">
          <button
            className="button secondary"
            type="button"
            onClick={() => messagingService.exportStateFile()}
          >
            <i className="codicon codicon-export" aria-hidden="true" />
            Export state file
          </button>
        </Tooltip>

        <Tooltip content="Import state from a JSON file">
          <button
            className="button secondary"
            type="button"
            onClick={() => messagingService.importStateFile()}
          >
            <i className="codicon codicon-import" aria-hidden="true" />
            Import state file
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

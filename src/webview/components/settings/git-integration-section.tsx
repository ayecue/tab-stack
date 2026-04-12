import React, { useCallback } from 'react';

import { GitIntegrationMode } from '../../../types/config';
import { useTabContext } from '../../hooks/use-tab-context';

export const GitIntegrationSection: React.FC = () => {
  const { state, messagingService } = useTabContext();

  const handleEnabledChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const enabled = event.target.checked;
      messagingService.updateGitIntegration({ enabled });
    },
    [messagingService]
  );

  const handleModeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const mode = event.target.value as GitIntegrationMode;
      messagingService.updateGitIntegration({ mode });
    },
    [messagingService]
  );

  const handleGroupPrefixChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const groupPrefix = event.target.value;
      messagingService.updateGitIntegration({ groupPrefix });
    },
    [messagingService]
  );

  return (
    <div className="settings-section">
      <label className="settings-label" htmlFor="git-enabled">
        <i className="codicon codicon-git-branch" aria-hidden="true" />
        Git Integration
      </label>
      <p className="settings-description">
        Control how tab groups follow your Git branches: auto switch on branch
        change, auto create groups, or full auto. Prefix controls the generated
        group name.
      </p>

      {state.gitIntegration ? (
        <div className="git-settings-grid">
          <div className="form-row">
            <label htmlFor="git-enabled" className="inline">
              <input
                id="git-enabled"
                type="checkbox"
                checked={state.gitIntegration.enabled}
                onChange={handleEnabledChange}
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
              onChange={handleModeChange}
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
              onChange={handleGroupPrefixChange}
              placeholder="e.g. git/"
              disabled={!state.gitIntegration.enabled}
            />
          </div>
        </div>
      ) : (
        <p className="settings-description muted-text">Loading…</p>
      )}
    </div>
  );
};

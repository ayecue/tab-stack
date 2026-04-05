import React, { useState } from 'react';

import { GitIntegrationSection } from './settings/git-integration-section';
import { HistorySection } from './settings/history-section';
import { StateFileSection } from './settings/state-file-section';
import { StorageTypeSection } from './settings/storage-type-section';
import { WorkspaceFolderSection } from './settings/workspace-folder-section';

export const SettingsPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

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
          <WorkspaceFolderSection />
          <GitIntegrationSection />
          <HistorySection />
          <StorageTypeSection />
          <StateFileSection />
        </div>
      )}
    </div>
  );
};

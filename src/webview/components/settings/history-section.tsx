import React, { useCallback } from 'react';

import { useTabContext } from '../../hooks/use-tab-context';

export const HistorySection: React.FC = () => {
  const { state, messagingService } = useTabContext();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value, 10);
      if (!isNaN(value) && value >= 1 && value <= 100) {
        messagingService.updateHistoryMaxEntries(value);
      }
    },
    [messagingService]
  );

  return (
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
            className="history-max-entries"
            type="number"
            min="1"
            max="100"
            value={state.historyMaxEntries}
            onChange={handleChange}
          />
        </div>
      ) : (
        <p className="settings-description muted-text">Loading…</p>
      )}
    </div>
  );
};

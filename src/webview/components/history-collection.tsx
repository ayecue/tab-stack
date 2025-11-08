import React, { useMemo, useState } from 'react';

import { useTabContext } from '../hooks/use-tab-context';
import { HistoryItem } from './history-item';

const formatTimestamp = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

export const HistoryCollection: React.FC = () => {
  const { state, messagingService } = useTabContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = useMemo(() => {
    if (!searchTerm.trim()) {
      return state.histories;
    }

    const term = searchTerm.trim().toLowerCase();
    return state.histories.filter((history) => {
      const timestamp = formatTimestamp(history.historyId).toLowerCase();
      return (
        history.name.toLowerCase().includes(term) ||
        history.historyId.toLowerCase().includes(term) ||
        timestamp.includes(term)
      );
    });
  }, [state.histories, searchTerm]);

  return (
    <div className="collections-section history-collection">
      <div className="section-toolbar">
        <div className="section-toolbar-heading">
          <h3>Snapshots</h3>
          <button
            type="button"
            className="section-action"
            onClick={() => {
              messagingService.addToHistory();
            }}
            aria-label="Capture new snapshot"
          >
            <i className="codicon codicon-device-camera" aria-hidden="true" />
          </button>
        </div>
        <div className="section-toolbar-search">
          <div className="section-search">
            <i className="codicon codicon-search" aria-hidden="true" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search snapshots"
              aria-label="Search snapshots"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchTerm('')}
                aria-label="Clear snapshot search"
              >
                <i className="codicon codicon-close" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      {state.histories.length === 0 ? (
        <p className="section-empty">No snapshots captured yet.</p>
      ) : filteredHistory.length === 0 ? (
        <p className="section-empty">No snapshots match your search.</p>
      ) : (
        <ul className="section-list" role="list">
          {filteredHistory.map((history) => {
            const { historyId, name, tabCount, columnCount } = history;
            return (
              <HistoryItem
                key={historyId}
                historyId={historyId}
                name={name}
                tabCount={tabCount}
                columnCount={columnCount}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

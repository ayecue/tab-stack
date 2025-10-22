import React, { useMemo, useState } from 'react';

import { useTabContext } from '../hooks/use-tab-context';

interface HistoryCollectionProps {
  deletingKeys: ReadonlySet<string>;
  onDelete: (historyId: string) => Promise<void> | void;
}

const formatTimestamp = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

export const HistoryCollection: React.FC<HistoryCollectionProps> = ({
  deletingKeys,
  onDelete
}) => {
  const { state, actions } = useTabContext();

  const sortedHistory = useMemo(
    () => [...state.historyIds].sort().reverse(),
    [state.historyIds]
  );
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = useMemo(() => {
    if (!searchTerm.trim()) {
      return sortedHistory;
    }

    const term = searchTerm.trim().toLowerCase();
    return sortedHistory.filter((historyId) => {
      const timestamp = formatTimestamp(historyId).toLowerCase();
      return historyId.toLowerCase().includes(term) || timestamp.includes(term);
    });
  }, [sortedHistory, searchTerm]);

  return (
    <div className="collections-section history-collection">
      <div className="section-toolbar">
        <div className="section-toolbar-heading">
          <h3>Snapshots</h3>
          <button
            type="button"
            className="section-action"
            onClick={() => {
              void actions.captureHistory().catch((error) => {
                console.error('Failed to capture history', error);
              });
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

      {sortedHistory.length === 0 ? (
        <p className="section-empty">No snapshots captured yet.</p>
      ) : filteredHistory.length === 0 ? (
        <p className="section-empty">No snapshots match your search.</p>
      ) : (
        <ul className="section-list" role="list">
          {filteredHistory.map((historyId) => {
            const isDeleting = deletingKeys.has(`history:${historyId}`);

            const handleRestore = () => {
              if (isDeleting) {
                return;
              }
              void actions.recoverHistory(historyId).catch((error) => {
                console.error('Failed to recover history', error);
              });
            };

            return (
              <li
                key={historyId}
                className="section-item"
                tabIndex={0}
                onClick={handleRestore}
                onKeyDown={(event) => {
                  if (isDeleting) {
                    return;
                  }
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleRestore();
                  }
                }}
                title={isDeleting ? undefined : 'Restore this snapshot'}
              >
                <div className="item-row">
                  <div className="item-primary">
                    <span className="item-name">
                      {formatTimestamp(historyId)}
                    </span>
                  </div>

                  <div
                    className="item-actions"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        void onDelete(historyId);
                      }}
                      disabled={isDeleting}
                      title="Delete snapshot"
                    >
                      <i className="codicon codicon-trash" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

import React, { useCallback } from 'react';

import { useCollectionSearch } from '../hooks/use-collection-search';
import { useTabContext } from '../hooks/use-tab-context';
import { Tooltip } from './common/tooltip';
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

  const filterHistory = useCallback(
    (
      history: (typeof state.histories)[number],
      term: string
    ) => {
      const timestamp = formatTimestamp(history.historyId).toLowerCase();
      return (
        history.name.toLowerCase().includes(term) ||
        history.historyId.toLowerCase().includes(term) ||
        timestamp.includes(term)
      );
    },
    []
  );

  const { searchTerm, setSearchTerm, filteredItems: filteredHistory, clearSearch } =
    useCollectionSearch({ items: state.histories, filterFn: filterHistory });

  return (
    <div className="collections-section history-collection">
      <div className="section-toolbar">
        <div className="section-toolbar-heading">
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
              <Tooltip content="Clear snapshot search">
                <button
                  type="button"
                  className="clear-search"
                  onClick={clearSearch}
                  aria-label="Clear snapshot search"
                >
                  <i className="codicon codicon-close" aria-hidden="true" />
                </button>
              </Tooltip>
            )}
          </div>
          <Tooltip content="Capture new snapshot">
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
          </Tooltip>
        </div>
      </div>

      {state.histories.length === 0 ? (
        <p className="section-empty">No snapshots captured yet.</p>
      ) : filteredHistory.length === 0 ? (
        <p className="section-empty">No snapshots match your search.</p>
      ) : (
        <ul className="section-list" role="list">
          {filteredHistory.map((history) => {
            const { historyId, name, tabCount, columnCount, layout, tabs } = history;
            return (
              <HistoryItem
                key={historyId}
                historyId={historyId}
                name={name}
                tabCount={tabCount}
                columnCount={columnCount}
                layout={layout}
                tabs={tabs}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

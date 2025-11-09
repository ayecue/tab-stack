import React, { useCallback, useState } from 'react';

import { useTabContext } from '../hooks/use-tab-context';
import { CollectionTooltipContent } from './common/collection-tooltip-content';
import { Tooltip } from './common/tooltip';

interface HistoryItemProps {
  historyId: string;
  name: string;
  tabCount: number;
  columnCount: number;
}

const formatTimestamp = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

export const HistoryItem: React.FC<HistoryItemProps> = ({
  historyId,
  name,
  tabCount,
  columnCount
}) => {
  const { messagingService } = useTabContext();

  const handleRestore = useCallback(() => {
    messagingService.recoverState(historyId);
  }, [messagingService, historyId]);

  const handleDelete = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      messagingService.deleteHistory(historyId);
    },
    [messagingService, historyId]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLLIElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleRestore();
      }
    },
    [handleRestore]
  );

  return (
    <Tooltip
      content={
        <CollectionTooltipContent
          tabCount={tabCount}
          columnCount={columnCount}
        />
      }
    >
      <li
        className="section-item"
        tabIndex={0}
        onClick={handleRestore}
        onKeyDown={handleKeyDown}
      >
        <div className="item-row">
          <div className="item-primary">
            <span className="item-name">{name}</span>
          </div>

          <div
            className="item-actions"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="danger"
              onClick={handleDelete}
              title="Delete snapshot"
            >
              <i className="codicon codicon-trash" aria-hidden="true" />
            </button>
          </div>
        </div>
      </li>
    </Tooltip>
  );
};

import React, { useCallback } from 'react';

import { Layout } from '../../types/commands';
import { CollectionTabSummary } from '../../types/messages';
import { useTabContext } from '../hooks/use-tab-context';
import { useTooltip } from '../hooks/use-tooltip';
import { CollectionTooltipContent } from './common/collection-tooltip-content';
import { Tooltip } from './common/tooltip';

interface HistoryItemProps {
  historyId: string;
  name: string;
  tabCount: number;
  columnCount: number;
  layout?: Layout;
  tabs?: CollectionTabSummary[];
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  historyId,
  name,
  tabCount,
  columnCount,
  layout,
  tabs
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

  const { triggerProps, renderTooltip } = useTooltip({
    content: (
      <CollectionTooltipContent
        tabCount={tabCount}
        columnCount={columnCount}
        layout={layout}
        tabs={tabs}
      />
    )
  });

  return (
    <>
      <li
        className="section-item"
        tabIndex={0}
        onClick={handleRestore}
        onKeyDown={handleKeyDown}
        {...triggerProps}
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
            <Tooltip content="Delete snapshot">
              <button
                type="button"
                className="danger"
                onClick={handleDelete}
              >
                <i className="codicon codicon-trash" aria-hidden="true" />
              </button>
            </Tooltip>
          </div>
        </div>
      </li>
      {renderTooltip()}
    </>
  );
};

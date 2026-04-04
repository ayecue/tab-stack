import React from 'react';

import { Layout } from '../../../types/commands';
import { CollectionTabSummary } from '../../../types/messages';
import { TabKind } from '../../../types/tabs';

interface CollectionTooltipContentProps {
  tabCount: number;
  columnCount: number;
  layout?: Layout;
  tabsByColumn?: CollectionTabSummary[][];
}

const MAX_TABS_PER_COLUMN = 5;

function getTabIcon(kind: TabKind): string {
  switch (kind) {
    case TabKind.TabInputTextDiff:
      return 'codicon-diff';
    case TabKind.TabInputTerminal:
      return 'codicon-terminal';
    case TabKind.TabInputNotebook:
    case TabKind.TabInputNotebookDiff:
      return 'codicon-notebook';
    case TabKind.TabInputWebview:
      return 'codicon-preview';
    case TabKind.TabInputCustom:
      return 'codicon-extensions';
    default:
      return 'codicon-file';
  }
}

export const CollectionTooltipContent: React.FC<
  CollectionTooltipContentProps
> = ({ tabCount, columnCount, layout, tabsByColumn }) => {
  const tabLabel = tabCount === 1 ? 'tab' : 'tabs';
  const columnLabel = columnCount === 1 ? 'column' : 'columns';
  const hasColumns = tabsByColumn && tabsByColumn.length > 0;

  return (
    <div className="collection-tooltip">
      <div className="collection-tooltip-header">
        <i className="codicon codicon-layout" aria-hidden="true" />
        <span>
          {tabCount} {tabLabel} &middot; {columnCount} {columnLabel}
        </span>
      </div>

      {hasColumns && (
        <div className="collection-tooltip-columns">
          {tabsByColumn.map((columnTabs, colIndex) => {
            const flexSize =
              layout && layout.groups[colIndex]
                ? layout.groups[colIndex].size
                : 1;
            const overflow = columnTabs.length - MAX_TABS_PER_COLUMN;

            return (
              <div
                key={colIndex}
                className="collection-tooltip-column"
                style={{ flex: flexSize }}
              >
                <div className="collection-tooltip-column-header">
                  <i
                    className="codicon codicon-split-horizontal"
                    aria-hidden="true"
                  />
                  <span>{columnTabs.length}</span>
                </div>
                <ul className="collection-tooltip-column-tabs">
                  {columnTabs.slice(0, MAX_TABS_PER_COLUMN).map((tab, i) => (
                    <li key={i} className="collection-tooltip-tab">
                      <i
                        className={`codicon ${getTabIcon(tab.kind)}`}
                        aria-hidden="true"
                      />
                      <span>{tab.label}</span>
                    </li>
                  ))}
                  {overflow > 0 && (
                    <li className="collection-tooltip-tab collection-tooltip-overflow">
                      +{overflow} more
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

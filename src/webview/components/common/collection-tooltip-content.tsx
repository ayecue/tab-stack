import React from 'react';

import { Layout, LayoutGroup } from '../../../types/commands';
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

function renderTabList(columnTabs: CollectionTabSummary[]) {
  const overflow = columnTabs.length - MAX_TABS_PER_COLUMN;

  return (
    <>
      <div className="collection-tooltip-column-header">
        <i className="codicon codicon-split-horizontal" aria-hidden="true" />
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
    </>
  );
}

function renderLayoutGroup(
  group: LayoutGroup,
  tabsByColumn: CollectionTabSummary[][],
  indexRef: { current: number },
  isHorizontal: boolean,
  key: number
): React.ReactNode {
  if (group.groups && group.groups.length > 0) {
    const childIsHorizontal = !isHorizontal;
    return (
      <div
        key={key}
        className={`collection-tooltip-nested ${isHorizontal ? 'is-horizontal' : 'is-vertical'}`}
        style={{ flex: group.size }}
      >
        {group.groups.map((child, i) =>
          renderLayoutGroup(child, tabsByColumn, indexRef, childIsHorizontal, i)
        )}
      </div>
    );
  }

  const colIndex = indexRef.current++;
  const columnTabs = tabsByColumn[colIndex] || [];

  return (
    <div
      key={key}
      className="collection-tooltip-column"
      style={{ flex: group.size }}
    >
      {renderTabList(columnTabs)}
    </div>
  );
}

export const CollectionTooltipContent: React.FC<
  CollectionTooltipContentProps
> = ({ tabCount, columnCount, layout, tabsByColumn }) => {
  const tabLabel = tabCount === 1 ? 'tab' : 'tabs';
  const columnLabel = columnCount === 1 ? 'column' : 'columns';
  const hasColumns = tabsByColumn && tabsByColumn.length > 0;

  const isHorizontal = layout ? layout.orientation === 0 : true;

  return (
    <div className="collection-tooltip">
      <div className="collection-tooltip-header">
        <i className="codicon codicon-layout" aria-hidden="true" />
        <span>
          {tabCount} {tabLabel} &middot; {columnCount} {columnLabel}
        </span>
      </div>

      {hasColumns && (
        <div className={`collection-tooltip-columns ${isHorizontal ? 'is-horizontal' : 'is-vertical'}`}>
          {layout
            ? (() => {
                const indexRef = { current: 0 };
                return layout.groups.map((group, i) =>
                  renderLayoutGroup(
                    group,
                    tabsByColumn,
                    indexRef,
                    !isHorizontal,
                    i
                  )
                );
              })()
            : tabsByColumn.map((columnTabs, colIndex) => (
                <div
                  key={colIndex}
                  className="collection-tooltip-column"
                  style={{ flex: 1 }}
                >
                  {renderTabList(columnTabs)}
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

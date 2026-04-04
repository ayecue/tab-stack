import React from 'react';

import { Layout } from '../../../types/commands';
import { CollectionTabSummary } from '../../../types/messages';

interface CollectionTooltipContentProps {
  tabCount: number;
  columnCount: number;
  layout?: Layout;
  tabs?: CollectionTabSummary[];
}

const MAX_TOOLTIP_TABS = 8;

export const CollectionTooltipContent: React.FC<
  CollectionTooltipContentProps
> = ({ tabCount, columnCount, layout, tabs }) => {
  const tabLabel = tabCount === 1 ? 'tab' : 'tabs';
  const columnLabel = columnCount === 1 ? 'column' : 'columns';

  return (
    <div className="collection-tooltip">
      <div className="collection-tooltip-summary">
        {tabCount} {tabLabel} in {columnCount} {columnLabel}
      </div>
      {layout && layout.groups.length > 0 && (
        <div className="collection-tooltip-layout">
          {layout.groups.map((group, i) => (
            <div
              key={i}
              className="collection-tooltip-layout-column"
              style={{ flex: group.size }}
            />
          ))}
        </div>
      )}
      {tabs && tabs.length > 0 && (
        <ul className="collection-tooltip-tabs">
          {tabs.slice(0, MAX_TOOLTIP_TABS).map((tab, i) => (
            <li key={i} className="collection-tooltip-tab">
              {tab.label}
            </li>
          ))}
          {tabs.length > MAX_TOOLTIP_TABS && (
            <li className="collection-tooltip-tab collection-tooltip-more">
              +{tabs.length - MAX_TOOLTIP_TABS} more
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

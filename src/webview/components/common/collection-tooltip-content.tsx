import React from 'react';

interface CollectionTooltipContentProps {
  tabCount: number;
  columnCount: number;
}

export const CollectionTooltipContent: React.FC<
  CollectionTooltipContentProps
> = ({ tabCount, columnCount }) => {
  const tabLabel = tabCount === 1 ? 'tab' : 'tabs';
  const columnLabel = columnCount === 1 ? 'column' : 'columns';

  return (
    <>
      {tabCount} {tabLabel} in {columnCount} {columnLabel}
    </>
  );
};

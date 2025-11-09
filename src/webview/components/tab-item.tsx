import React from 'react';

import { type TabInfo, TabKind } from '../../types/tabs';
import { FileIcon } from './file-icon';

interface TabItemProps {
  tab: TabInfo;
  onOpen: () => void;
  onClose: () => void;
  onTogglePin: () => void;
  onDragStart?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLLIElement>) => void;
  viewColumnLabel?: string;
  isColumnActive?: boolean;
  isDragging?: boolean;
  isDraggedOver?: boolean;
  dropPosition?: 'before' | 'after';
}

export const TabItem: React.FC<TabItemProps> = ({
  tab,
  onOpen,
  onClose,
  onTogglePin,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  viewColumnLabel,
  isColumnActive,
  isDragging,
  isDraggedOver,
  dropPosition
}) => {
  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  const handleTogglePin = (event: React.MouseEvent) => {
    event.stopPropagation();
    onTogglePin();
  };

  // Extract file extension
  const getFileExtension = (filename: string): string => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  };

  const fileName = tab.label;
  const extension = getFileExtension(fileName);
  const isUnknownKind = tab.kind === TabKind.Unknown;
  const kindSlug = tab.kind.toLowerCase();
  const activeClass = [
    tab.isActive ? 'active' : '',
    tab.isPinned ? 'pinned' : '',
    isColumnActive ? 'column-active' : '',
    isUnknownKind ? 'unknown-kind' : '',
    isDragging ? 'dragging' : '',
    isDraggedOver ? 'drag-over' : '',
    isDraggedOver && dropPosition === 'before' ? 'drop-before' : '',
    isDraggedOver && dropPosition === 'after' ? 'drop-after' : ''
  ]
    .filter(Boolean)
    .join(' ');
  const tabNameClassName = ['tab-name', `tab-kind-${kindSlug}`]
    .filter(Boolean)
    .join(' ');

  const ariaLabelParts: string[] = [fileName];

  if (isUnknownKind) {
    ariaLabelParts.push('unsupported tab type (cannot restore automatically)');
  }

  if (tab.isPinned) {
    ariaLabelParts.push('pinned');
  }

  if (viewColumnLabel) {
    ariaLabelParts.push(viewColumnLabel);
  }

  const itemLabel = ariaLabelParts.join(', ');
  const unrecoverableMessage = 'This tab type cannot be restored automatically';

  return (
    <li
      className={`tab-item ${activeClass}`.trim()}
      onClick={onOpen}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      role="listitem"
      aria-label={itemLabel}
    >
      <div className="tab-item-main">
        <span className="tab-icon" aria-hidden="true">
          <FileIcon fileName={fileName} extension={extension} />
        </span>
        <div className="tab-item-text">
          <div className="tab-item-title">
            <span className={tabNameClassName} title={fileName}>
              {fileName}
            </span>
            {isUnknownKind && (
              <span
                className="tab-kind-indicator"
                role="img"
                aria-label={unrecoverableMessage}
                title={unrecoverableMessage}
              />
            )}
          </div>
        </div>
      </div>
      <div className="tab-item-actions">
        <button
          className={`pin-btn${tab.isPinned ? ' active' : ''}`}
          onClick={handleTogglePin}
          title={tab.isPinned ? 'Unpin tab' : 'Pin tab'}
          aria-label={tab.isPinned ? 'Unpin tab' : 'Pin tab'}
          aria-pressed={tab.isPinned}
        >
          <i
            className={`codicon codicon-pin${tab.isPinned ? ' pinned' : ''}`}
            aria-hidden="true"
          />
        </button>
        <button
          className="close-btn"
          onClick={handleClose}
          title="Close tab"
          aria-label="Close tab"
        >
          <i className="codicon codicon-close" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
};

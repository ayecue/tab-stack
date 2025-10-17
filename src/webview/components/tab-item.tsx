import React from 'react';

import { TabInfo } from '../../types/tabs';
import { FileIcon } from './file-icon';

interface TabItemProps {
  tab: TabInfo;
  onOpen: () => void;
  onClose: () => void;
  onTogglePin: () => void;
  viewColumnLabel?: string;
  isColumnActive?: boolean;
}

export const TabItem: React.FC<TabItemProps> = ({
  tab,
  onOpen,
  onClose,
  onTogglePin,
  isColumnActive
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
  const activeClass = [
    tab.isActive ? 'active' : '',
    tab.isPinned ? 'pinned' : '',
    isColumnActive ? 'column-active' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li
      className={`tab-item ${activeClass}`.trim()}
      onClick={onOpen}
      role="listitem"
    >
      <div className="tab-item-main">
        <span className="tab-icon" aria-hidden="true">
          <FileIcon fileName={fileName} extension={extension} />
        </span>
        <div className="tab-item-text">
          <div className="tab-item-title">
            <span className="tab-name" title={fileName}>
              {fileName}
            </span>
          </div>
        </div>
      </div>
      <div className="tab-item-actions">
        <button
          className="pin-btn"
          onClick={handleTogglePin}
          title={tab.isPinned ? 'Unpin tab' : 'Pin tab'}
          aria-label={tab.isPinned ? 'Unpin tab' : 'Pin tab'}
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

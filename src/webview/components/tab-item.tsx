import React, { useCallback, useEffect, useRef, useState } from 'react';

import { type TabInfo, TabKind } from '../../types/tabs';
import { Tooltip } from './common/tooltip';
import { TabKindIcon } from './tab-kind-icon';

interface TabItemProps {
  tab: TabInfo;
  onOpen: () => void;
  onClose: () => void;
  onTogglePin: () => void;
  onCloseOthers: () => void;
  onCloseOthersInGroup: () => void;
  onDragStart?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLLIElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLLIElement>) => void;
  viewColumnLabel?: string;
  isColumnActive?: boolean;
  isDragging?: boolean;
  isDraggedOver?: boolean;
  dropPosition?: 'before' | 'after';
  resolvedColor?: string;
}

export const TabItem: React.FC<TabItemProps> = React.memo(
  ({
    tab,
    onOpen,
    onClose,
    onTogglePin,
    onCloseOthers,
    onCloseOthersInGroup,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    viewColumnLabel,
    isColumnActive,
    isDragging,
    isDraggedOver,
    dropPosition,
    resolvedColor
  }) => {
    const [contextMenu, setContextMenu] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);

    const handleClose = (event: React.MouseEvent) => {
      event.stopPropagation();
      onClose();
    };

    const handleTogglePin = (event: React.MouseEvent) => {
      event.stopPropagation();
      onTogglePin();
    };

    const handleContextMenu = useCallback((event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setContextMenu({ x: event.clientX, y: event.clientY });
    }, []);

    const handleCloseOthers = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        setContextMenu(null);
        onCloseOthers();
      },
      [onCloseOthers]
    );

    const handleCloseOthersInGroup = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        setContextMenu(null);
        onCloseOthersInGroup();
      },
      [onCloseOthersInGroup]
    );

    useEffect(() => {
      if (!contextMenu) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(event.target as Node)
        ) {
          setContextMenu(null);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [contextMenu]);

    const fileName = tab.label;
    const isUnrecoverable = !tab.isRecoverable;
    const kindSlug = tab.kind.toLowerCase();

    const activeClass = [
      tab.isActive ? 'active' : '',
      tab.isPinned ? 'pinned' : '',
      isColumnActive ? 'column-active' : '',
      isUnrecoverable ? 'unrecoverable-kind' : '',
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

    if (isUnrecoverable) {
      ariaLabelParts.push(
        'unsupported tab type (cannot restore automatically)'
      );
    }

    if (tab.isPinned) {
      ariaLabelParts.push('pinned');
    }

    if (viewColumnLabel) {
      ariaLabelParts.push(viewColumnLabel);
    }

    const itemLabel = ariaLabelParts.join(', ');
    const unrecoverableMessage =
      'This tab type cannot be restored automatically';

    return (
      <li
        className={`tab-item ${activeClass}`.trim()}
        onClick={onOpen}
        onContextMenu={handleContextMenu}
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
            <TabKindIcon
              kind={tab.kind}
              fileName={fileName}
              color={resolvedColor}
            />
          </span>
          <div className="tab-item-text">
            <div className="tab-item-title">
              <Tooltip content={fileName}>
                <span
                  className={tabNameClassName}
                  style={resolvedColor ? { color: resolvedColor } : undefined}
                >
                  {fileName}
                </span>
              </Tooltip>
              {isUnrecoverable && (
                <Tooltip content={unrecoverableMessage}>
                  <span
                    className="tab-kind-indicator"
                    role="img"
                    aria-label={unrecoverableMessage}
                  />
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        <div className="tab-item-actions">
          <Tooltip content={tab.isPinned ? 'Unpin tab' : 'Pin tab'}>
            <button
              className={`pin-btn${tab.isPinned ? ' active' : ''}`}
              onClick={handleTogglePin}
              aria-label={tab.isPinned ? 'Unpin tab' : 'Pin tab'}
              aria-pressed={tab.isPinned}
            >
              <i
                className={`codicon codicon-pin${tab.isPinned ? ' pinned' : ''}`}
                aria-hidden="true"
              />
            </button>
          </Tooltip>
          <Tooltip content="Close tab">
            <button
              className="close-btn"
              onClick={handleClose}
              aria-label="Close tab"
            >
              <i className="codicon codicon-close" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>
        {contextMenu && (
          <div
            ref={contextMenuRef}
            className="tab-context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            role="menu"
          >
            <button
              className="tab-context-menu-item"
              onClick={handleCloseOthers}
              role="menuitem"
            >
              <i className="codicon codicon-close-all" aria-hidden="true" />
              Close Others
            </button>
            <button
              className="tab-context-menu-item"
              onClick={handleCloseOthersInGroup}
              role="menuitem"
            >
              <i className="codicon codicon-close-all" aria-hidden="true" />
              Close Others in Group
            </button>
          </div>
        )}
      </li>
    );
  }
);

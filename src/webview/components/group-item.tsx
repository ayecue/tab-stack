import React, { useCallback, useRef, useState } from 'react';

import { Layout } from '../../types/commands';
import { CollectionTabSummary } from '../../types/messages';
import { QuickSlotIndex } from '../../types/tab-manager';
import { useTabContext } from '../hooks/use-tab-context';
import { useTooltip } from '../hooks/use-tooltip';
import { CollectionTooltipContent } from './common/collection-tooltip-content';
import { Tooltip } from './common/tooltip';
import { SlotKeypad } from './slot-keypad';

interface GroupItemProps {
  groupId: string;
  name: string;
  index: number;
  isSelected: boolean;
  assignedSlot: string | undefined;
  occupiedSlots: Record<string, string>;
  onStartRename: (groupId: string, currentName: string) => void;
  isEditing: boolean;
  onCancelRename: () => void;
  renameValue: string;
  onRenameValueChange: (value: string) => void;
  renameError: string | null;
  onClearRenameError: () => void;
  isRenaming: boolean;
  renameInputRef: React.RefObject<HTMLInputElement | null>;
  onSubmitRename: (id: string, currentName: string) => void;
  onRenameKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    currentName: string
  ) => void;
  tabCount: number;
  columnCount: number;
  layout?: Layout;
  tabs?: CollectionTabSummary[];
}

export const GroupItem: React.FC<GroupItemProps> = ({
  groupId,
  name,
  index,
  isSelected,
  assignedSlot,
  occupiedSlots,
  onStartRename,
  isEditing,
  onCancelRename,
  renameValue,
  onRenameValueChange,
  renameError,
  onClearRenameError,
  isRenaming,
  renameInputRef,
  onSubmitRename,
  onRenameKeyDown,
  tabCount,
  columnCount,
  layout,
  tabs
}) => {
  const { messagingService } = useTabContext();

  const handleSlotChange = useCallback(
    (rawValue: string | null) => {
      if (rawValue === null) {
        if (assignedSlot) {
          messagingService.assignQuickSlot(assignedSlot as QuickSlotIndex, null);
        }
        return;
      }

      const nextSlotNumber = Number(rawValue.trim());

      if (
        !Number.isInteger(nextSlotNumber) ||
        nextSlotNumber < 1 ||
        nextSlotNumber > 9
      ) {
        return;
      }

      const nextSlot = nextSlotNumber.toString() as QuickSlotIndex;

      if (assignedSlot === nextSlot) {
        return;
      }

      messagingService.assignQuickSlot(nextSlot, groupId);
    },
    [messagingService, groupId, assignedSlot]
  );

  const handleItemClick = useCallback(() => {
    if (isEditing) {
      return;
    }
    const nextId = isSelected ? null : groupId;
    messagingService.switchToGroup(nextId);
  }, [isEditing, isSelected, groupId, messagingService]);

  const handleItemKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLLIElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const nextId = isSelected ? null : groupId;
        messagingService.switchToGroup(nextId);
      }
    },
    [isSelected, groupId, messagingService]
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
        className={`section-item${isSelected ? ' active' : ''}${isEditing ? ' editing' : ''}`}
        tabIndex={0}
        onClick={handleItemClick}
        onKeyDown={handleItemKeyDown}
        {...triggerProps}
      >
        <div className="item-row">
          <div className="item-primary">
            {isEditing ? (
              <>
                <input
                  ref={renameInputRef}
                  type="text"
                  value={renameValue}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => {
                    onRenameValueChange(event.target.value);
                    if (renameError) {
                      onClearRenameError();
                    }
                  }}
                  onKeyDown={(event) => onRenameKeyDown(event, groupId, name)}
                  aria-label="Rename group"
                  disabled={isRenaming}
                />
                <div className="inline-form-actions">
                  <Tooltip content="Save group name">
                    <button
                      type="button"
                      className="action-save"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSubmitRename(groupId, name);
                      }}
                      disabled={isRenaming}
                      aria-label="Save group name"
                    >
                      <i className="codicon codicon-check" aria-hidden="true" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Cancel rename">
                    <button
                      type="button"
                      className="action-cancel"
                      onClick={(event) => {
                        event.stopPropagation();
                        onCancelRename();
                      }}
                      disabled={isRenaming}
                      aria-label="Cancel rename"
                    >
                      <i className="codicon codicon-close" aria-hidden="true" />
                    </button>
                  </Tooltip>
                </div>
              </>
            ) : (
              <span className="item-name">{name}</span>
            )}
          </div>
          {isEditing && renameError && (
            <span className="form-error" role="alert">
              {renameError}
            </span>
          )}

          <div
            className="item-actions"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <SlotKeypad
              assignedSlot={assignedSlot}
              occupiedSlots={occupiedSlots}
              groupId={groupId}
              disabled={isEditing}
              onSlotChange={handleSlotChange}
            />
            {!isEditing && (
              <Tooltip content="Export group">
                <button
                  type="button"
                  className="neutral"
                  onClick={(event) => {
                    event.stopPropagation();
                    messagingService.exportGroup(groupId);
                  }}
                >
                  <i className="codicon codicon-cloud-upload" aria-hidden="true" />
                </button>
              </Tooltip>
            )}
            {!isEditing && (
              <Tooltip content="Rename group">
                <button
                  type="button"
                  className="neutral"
                  onClick={(event) => {
                    event.stopPropagation();
                    onStartRename(groupId, name);
                  }}
                >
                  <i className="codicon codicon-edit" aria-hidden="true" />
                </button>
              </Tooltip>
            )}
            <Tooltip content="Delete group">
              <button
                type="button"
                className="danger"
                onClick={(event) => {
                  event.stopPropagation();
                  messagingService.deleteGroup(groupId);
                }}
                disabled={isEditing}
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

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { QuickSlotIndex } from '../../types/tab-manager';
import { useTabContext } from '../hooks/use-tab-context';

interface GroupItemProps {
  groupId: string;
  name: string;
  index: number;
  isSelected: boolean;
  assignedSlot: string | undefined;
  quickSlotOptions: string[];
  onStartRename: (groupId: string, currentName: string) => void;
  isEditing: boolean;
  onCancelRename: () => void;
}

export const GroupItem: React.FC<GroupItemProps> = ({
  groupId,
  name,
  index,
  isSelected,
  assignedSlot,
  quickSlotOptions,
  onStartRename,
  isEditing,
  onCancelRename
}) => {
  const { state, messagingService } = useTabContext();
  const renameInputRef = useRef<HTMLInputElement | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const slotControlId = `slot-${index}`;

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && renameInputRef.current) {
      setRenameValue(name);
      setRenameError(null);
      setIsRenaming(false);
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isEditing, name]);

  const handleSlotChange = useCallback(
    (rawValue: string) => {
      const value = rawValue.trim();

      if (!value) {
        if (assignedSlot) {
          messagingService.assignQuickSlot(null, groupId);
        }
        return;
      }

      const nextSlotNumber = Number(value);

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

  const submitRename = useCallback(async () => {
    const normalized = renameValue.trim();

    if (!normalized) {
      setRenameError('Group name is required');
      renameInputRef.current?.focus();
      return;
    }

    if (normalized === name) {
      onCancelRename();
      return;
    }

    if (
      state.groups.some((g) => g.name === normalized && g.groupId !== groupId)
    ) {
      setRenameError('A group with this name already exists');
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
      return;
    }

    try {
      setIsRenaming(true);
      messagingService.renameGroup(groupId, normalized);
      onCancelRename();
    } catch (error) {
      console.error('Failed to rename group', error);
      setRenameError('Unable to rename group');
      setIsRenaming(false);
      renameInputRef.current?.focus();
    }
  }, [
    messagingService,
    groupId,
    renameValue,
    onCancelRename,
    state.groups,
    name
  ]);

  const handleRenameKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        void submitRename();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCancelRename();
      }
    },
    [submitRename, onCancelRename]
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

  return (
    <li
      className={`section-item${isSelected ? ' active' : ''}${isEditing ? ' editing' : ''}`}
      tabIndex={0}
      onClick={handleItemClick}
      onKeyDown={handleItemKeyDown}
      title={isSelected ? 'Deselect this group' : 'Apply this group'}
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
                  setRenameValue(event.target.value);
                  if (renameError) {
                    setRenameError(null);
                  }
                }}
                onKeyDown={handleRenameKeyDown}
                aria-label="Rename group"
                disabled={isRenaming}
              />
              <div className="inline-form-actions">
                <button
                  type="button"
                  className="action-save"
                  onClick={(event) => {
                    event.stopPropagation();
                    void submitRename();
                  }}
                  disabled={isRenaming}
                  aria-label="Save group name"
                >
                  <i className="codicon codicon-check" aria-hidden="true" />
                </button>
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
          <div className="slot-selector">
            <select
              id={slotControlId}
              value={assignedSlot ? assignedSlot.toString() : ''}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => {
                event.stopPropagation();
                handleSlotChange(event.target.value);
              }}
              disabled={isEditing}
            >
              <option value="">No slot</option>
              {quickSlotOptions.map((slot) => (
                <option key={slot} value={slot}>
                  Slot {slot}
                </option>
              ))}
            </select>
          </div>
          {!isEditing && (
            <button
              type="button"
              className="neutral"
              onClick={(event) => {
                event.stopPropagation();
                onStartRename(groupId, name);
              }}
              title="Rename group"
            >
              <i className="codicon codicon-edit" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="danger"
            onClick={(event) => {
              event.stopPropagation();
              messagingService.deleteGroup(groupId);
            }}
            disabled={isEditing}
            title="Delete group"
          >
            <i className="codicon codicon-trash" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
};

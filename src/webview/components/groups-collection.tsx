import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { QuickSlotIndex } from '../../types/tab-manager';
import { useTabContext } from '../hooks/use-tab-context';

interface GroupsCollectionProps {
  deletingKeys: ReadonlySet<string>;
  onDelete: (groupId: string) => Promise<void> | void;
}

export const GroupsCollection: React.FC<GroupsCollectionProps> = ({
  deletingKeys,
  onDelete
}) => {
  const { state, actions } = useTabContext();
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const quickSlotOptions = useMemo<QuickSlotIndex[]>(
    () =>
      Array.from({ length: 9 }, (_, index) => (index + 1) as QuickSlotIndex),
    []
  );

  const slotByGroup = useMemo(() => {
    const mapping: Record<string, QuickSlotIndex> = {};
    Object.entries(state.quickSlots ?? {}).forEach(([slot, groupId]) => {
      const slotIndex = Number(slot);
      if (!groupId || !Number.isInteger(slotIndex)) {
        return;
      }
      mapping[groupId] = slotIndex as QuickSlotIndex;
    });
    return mapping;
  }, [state.quickSlots]);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isCreating]);

  const startCreate = useCallback(() => {
    setIsCreating(true);
    setNewGroupName('');
    setLocalError(null);
  }, []);

  const cancelCreate = useCallback(() => {
    setIsCreating(false);
    setNewGroupName('');
    setLocalError(null);
    setIsSaving(false);
  }, []);

  const submitCreate = useCallback(async () => {
    const normalized = newGroupName.trim();
    if (!normalized) {
      setLocalError('Group name is required');
      inputRef.current?.focus();
      return;
    }

    try {
      setIsSaving(true);
      await actions.saveGroup(normalized);
      cancelCreate();
    } catch (error) {
      console.error('Failed to create group', error);
      setLocalError('Unable to save group');
      setIsSaving(false);
    }
  }, [actions, newGroupName, cancelCreate]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        void submitCreate();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        cancelCreate();
      }
    },
    [submitCreate, cancelCreate]
  );

  const filteredGroupIds = useMemo(() => {
    if (!searchTerm.trim()) {
      return state.groupIds;
    }
    const term = searchTerm.trim().toLowerCase();
    return state.groupIds.filter((groupId) =>
      groupId.toLowerCase().includes(term)
    );
  }, [state.groupIds, searchTerm]);

  const handleSlotChange = useCallback(
    (groupId: string, rawValue: string) => {
      const currentSlot = slotByGroup[groupId];
      const value = rawValue.trim();

      if (!value) {
        if (currentSlot) {
          void actions.clearQuickSlot(currentSlot).catch((error) => {
            console.error('Failed to clear quick slot', error);
          });
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

      const nextSlot = nextSlotNumber as QuickSlotIndex;

      if (currentSlot === nextSlot) {
        return;
      }

      void actions.assignQuickSlot(nextSlot, groupId).catch((error) => {
        console.error('Failed to assign quick slot', error);
      });
    },
    [actions, slotByGroup]
  );

  return (
    <div className="collections-section groups-collection">
      <div className="section-toolbar">
        <div className="section-toolbar-heading">
          <h3>Groups</h3>
          <div className="section-toolbar-actions">
            {state.selectedGroup && (
              <button
                type="button"
                className="section-action secondary"
                onClick={() => void actions.clearSelection()}
                aria-label="Clear selection"
              >
                <i className="codicon codicon-close" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              className="section-action"
              onClick={startCreate}
              disabled={isCreating}
              aria-label="Create new group"
            >
              <i className="codicon codicon-add" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="section-toolbar-search">
          <div className="section-search">
            <i className="codicon codicon-search" aria-hidden="true" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search groups"
              aria-label="Search saved groups"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchTerm('')}
                aria-label="Clear group search"
              >
                <i className="codicon codicon-close" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isCreating && (
        <div className="section-inline-form">
          <input
            ref={inputRef}
            type="text"
            placeholder="Group name"
            value={newGroupName}
            onChange={(event) => {
              setNewGroupName(event.target.value);
              if (localError) {
                setLocalError(null);
              }
            }}
            onKeyDown={handleKeyDown}
            aria-label="New group name"
            disabled={isSaving}
          />
          <div className="inline-form-actions">
            <button
              type="button"
              className="action-save"
              onClick={() => void submitCreate()}
              disabled={isSaving}
            >
              <i className="codicon codicon-check" aria-hidden="true" />
              <span>Save</span>
            </button>
            <button
              type="button"
              className="action-cancel"
              onClick={cancelCreate}
              disabled={isSaving}
            >
              <i className="codicon codicon-close" aria-hidden="true" />
              <span>Cancel</span>
            </button>
          </div>
          {localError && <span className="form-error">{localError}</span>}
        </div>
      )}

      {state.groupIds.length === 0 && !isCreating ? (
        <p className="section-empty">No groups saved yet.</p>
      ) : (
        <ul className="section-list" role="list">
          {filteredGroupIds.map((groupId, index) => {
            const assignedSlot = slotByGroup[groupId];
            const slotControlId = `slot-${index}`;
            const isSelected = state.selectedGroup === groupId;
            const isDeleting = deletingKeys.has(`group:${groupId}`);

            return (
              <li
                key={groupId}
                className={`section-item${isSelected ? ' active' : ''}`}
                tabIndex={0}
                onClick={() => {
                  if (isDeleting) {
                    return;
                  }
                  const nextId = isSelected ? null : groupId;
                  void actions.switchGroup(nextId).catch((error) => {
                    console.error('Failed to switch group', error);
                  });
                }}
                onKeyDown={(event) => {
                  if (isDeleting) {
                    return;
                  }
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    const nextId = isSelected ? null : groupId;
                    void actions.switchGroup(nextId).catch((error) => {
                      console.error('Failed to switch group', error);
                    });
                  }
                }}
                title={
                  isDeleting
                    ? undefined
                    : isSelected
                      ? 'Deselect this group'
                      : 'Apply this group'
                }
              >
                <div className="item-row">
                  <div className="item-primary">
                    <span className="item-name">{groupId}</span>
                  </div>

                  <div
                    className="item-actions"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <div className="slot-selector">
                      <label htmlFor={slotControlId} className="sr-only">
                        Quick slot
                      </label>
                      <select
                        id={slotControlId}
                        value={assignedSlot ? assignedSlot.toString() : ''}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          event.stopPropagation();
                          handleSlotChange(groupId, event.target.value);
                        }}
                      >
                        <option value="">No slot</option>
                        {quickSlotOptions.map((slot) => (
                          <option key={slot} value={slot}>
                            Slot {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      className="danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        void onDelete(groupId);
                      }}
                      disabled={isDeleting}
                      title="Delete group"
                    >
                      <i className="codicon codicon-trash" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}

          {filteredGroupIds.length === 0 &&
            state.groupIds.length > 0 &&
            !isCreating && (
              <li className="section-empty" aria-live="polite">
                No groups match that search.
              </li>
            )}
        </ul>
      )}
    </div>
  );
};

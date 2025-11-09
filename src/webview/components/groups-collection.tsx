import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { useTabContext } from '../hooks/use-tab-context';
import { GroupItem } from './group-item';

export const GroupsCollection: React.FC = () => {
  const { state, messagingService } = useTabContext();
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const quickSlotOptions = useMemo(
    () => Array.from({ length: 9 }, (_, index) => (index + 1).toString()),
    []
  );

  const slotByGroup = useMemo(() => {
    const mapping: Record<string, string> = {};
    Object.entries(state.quickSlots ?? {}).forEach(([slot, groupId]) => {
      const slotIndex = Number(slot);
      if (!groupId || !Number.isInteger(slotIndex)) {
        return;
      }
      mapping[groupId] = slotIndex.toString();
    });
    return mapping;
  }, [state.quickSlots]);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isCreating]);

  const cancelRename = useCallback(() => {
    setEditingGroupId(null);
  }, []);

  const startCreate = useCallback(() => {
    cancelRename();
    setIsCreating(true);
    setNewGroupName('');
    setLocalError(null);
  }, [cancelRename]);

  const cancelCreate = useCallback(() => {
    setIsCreating(false);
    setNewGroupName('');
    setLocalError(null);
    setIsSaving(false);
  }, []);

  const startRename = useCallback(
    (groupId: string, _currentName: string) => {
      cancelCreate();
      setEditingGroupId(groupId);
    },
    [cancelCreate]
  );

  useEffect(() => {
    if (!editingGroupId) {
      return;
    }

    if (!state.groups.some((g) => g.groupId === editingGroupId)) {
      cancelRename();
    }
  }, [editingGroupId, state.groups, cancelRename]);

  const submitCreate = useCallback(async () => {
    const normalized = newGroupName.trim();
    if (!normalized) {
      setLocalError('Group name is required');
      inputRef.current?.focus();
      return;
    }

    try {
      setIsSaving(true);
      messagingService.createGroup(normalized);
      cancelCreate();
    } catch (error) {
      console.error('Failed to create group', error);
      setLocalError('Unable to save group');
      setIsSaving(false);
    }
  }, [messagingService, newGroupName, cancelCreate]);

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

  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) {
      return state.groups;
    }
    const term = searchTerm.trim().toLowerCase();
    return state.groups.filter((group) =>
      group.name.toLowerCase().includes(term)
    );
  }, [state.groups, searchTerm]);

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
                onClick={() => messagingService.switchToGroup(null)}
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
              type="text"
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

      {state.groups.length === 0 && !isCreating ? (
        <p className="section-empty">No groups saved yet.</p>
      ) : (
        <ul className="section-list" role="list">
          {filteredGroups.map((group, index) => {
            const { groupId, name, tabCount, columnCount } = group;
            const assignedSlot = slotByGroup[groupId];
            const isSelected = state.selectedGroup === groupId;
            const isEditing = editingGroupId === groupId;

            return (
              <GroupItem
                key={groupId}
                groupId={groupId}
                name={name}
                index={index}
                isSelected={isSelected}
                assignedSlot={assignedSlot}
                quickSlotOptions={quickSlotOptions}
                onStartRename={startRename}
                isEditing={isEditing}
                onCancelRename={cancelRename}
                tabCount={tabCount}
                columnCount={columnCount}
              />
            );
          })}

          {filteredGroups.length === 0 &&
            state.groups.length > 0 &&
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

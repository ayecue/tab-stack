import React, {
  useCallback,
  useEffect,
  useMemo
} from 'react';

import { Tooltip } from './common/tooltip';

import { useCollectionCreate } from '../hooks/use-collection-create';
import { useCollectionRename } from '../hooks/use-collection-rename';
import { useCollectionSearch } from '../hooks/use-collection-search';
import { useTabContext } from '../hooks/use-tab-context';
import { GroupItem } from './group-item';

export const GroupsCollection: React.FC = () => {
  const { state, messagingService } = useTabContext();

  const isDuplicateGroup = useCallback(
    (name: string, id: string) =>
      state.groups.some((g) => g.name === name && g.groupId !== id),
    [state.groups]
  );

  const rename = useCollectionRename({
    onRename: (id, newName) => messagingService.renameGroup(id, newName),
    entityLabel: 'Group',
    isDuplicate: isDuplicateGroup
  });

  const create = useCollectionCreate({
    onCreate: (name) => messagingService.createGroup(name),
    entityLabel: 'Group',
    onStart: rename.cancelRename
  });

  const filterGroup = useCallback(
    (group: (typeof state.groups)[number], term: string) =>
      group.name.toLowerCase().includes(term),
    []
  );

  const { searchTerm, setSearchTerm, filteredItems: filteredGroups, clearSearch } =
    useCollectionSearch({ items: state.groups, filterFn: filterGroup });

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

  const occupiedSlots = useMemo(() => {
    const mapping: Record<string, string> = {};
    Object.entries(state.quickSlots ?? {}).forEach(([slot, groupId]) => {
      if (groupId) {
        mapping[slot] = groupId;
      }
    });
    return mapping;
  }, [state.quickSlots]);

  useEffect(() => {
    if (!rename.editingId) {
      return;
    }

    if (!state.groups.some((g) => g.groupId === rename.editingId)) {
      rename.cancelRename();
    }
  }, [rename.editingId, state.groups, rename.cancelRename]);

  return (
    <div className="collections-section groups-collection">
      <div className="section-toolbar">
        <div className="section-toolbar-heading">
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
              <Tooltip content="Clear group search">
                <button
                  type="button"
                  className="clear-search"
                  onClick={clearSearch}
                  aria-label="Clear group search"
                >
                  <i className="codicon codicon-close" aria-hidden="true" />
                </button>
              </Tooltip>
            )}
          </div>
          <div className="section-toolbar-actions">
            {state.selectedGroup && (
              <Tooltip content="Clear selection">
                <button
                  type="button"
                  className="section-action secondary"
                  onClick={() => messagingService.switchToGroup(null)}
                  aria-label="Clear selection"
                >
                  <i className="codicon codicon-close" aria-hidden="true" />
                </button>
              </Tooltip>
            )}
            <Tooltip content="Import group">
              <button
                type="button"
                className="section-action"
                onClick={() => messagingService.importGroup()}
                aria-label="Import group from file"
              >
                <i className="codicon codicon-cloud-download" aria-hidden="true" />
              </button>
            </Tooltip>
            <Tooltip content="Create new group">
              <button
                type="button"
                className="section-action"
                onClick={create.startCreate}
                disabled={create.isCreating}
                aria-label="Create new group"
              >
                <i className="codicon codicon-add" aria-hidden="true" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {create.isCreating && (
        <div className="section-inline-form">
          <input
            ref={create.inputRef}
            type="text"
            placeholder="Group name"
            value={create.name}
            onChange={(event) => {
              create.setName(event.target.value);
              if (create.error) {
                create.clearError();
              }
            }}
            onKeyDown={create.handleKeyDown}
            aria-label="New group name"
            disabled={create.isSaving}
          />
          <div className="inline-form-actions">
            <button
              type="button"
              className="action-save"
              onClick={() => void create.submitCreate()}
              disabled={create.isSaving}
            >
              <i className="codicon codicon-check" aria-hidden="true" />
              <span>Save</span>
            </button>
            <button
              type="button"
              className="action-cancel"
              onClick={create.cancelCreate}
              disabled={create.isSaving}
            >
              <i className="codicon codicon-close" aria-hidden="true" />
              <span>Cancel</span>
            </button>
          </div>
          {create.error && <span className="form-error">{create.error}</span>}
        </div>
      )}

      {state.groups.length === 0 && !create.isCreating ? (
        <p className="section-empty">No groups saved yet.</p>
      ) : (
        <ul className="section-list" role="list">
          {filteredGroups.map((group, index) => {
            const { groupId, name, tabCount, columnCount, layout, tabs } = group;
            const assignedSlot = slotByGroup[groupId];
            const isSelected = state.selectedGroup === groupId;
            const isEditing = rename.editingId === groupId;

            return (
              <GroupItem
                key={groupId}
                groupId={groupId}
                name={name}
                index={index}
                isSelected={isSelected}
                assignedSlot={assignedSlot}
                occupiedSlots={occupiedSlots}
                onStartRename={(id, currentName) => {
                  create.cancelCreate();
                  rename.startRename(id, currentName);
                }}
                isEditing={isEditing}
                onCancelRename={rename.cancelRename}
                renameValue={rename.renameValue}
                onRenameValueChange={rename.setRenameValue}
                renameError={rename.renameError}
                onClearRenameError={rename.clearRenameError}
                isRenaming={rename.isRenaming}
                renameInputRef={rename.renameInputRef}
                onSubmitRename={rename.submitRename}
                onRenameKeyDown={rename.handleRenameKeyDown}
                tabCount={tabCount}
                columnCount={columnCount}
                layout={layout}
                tabs={tabs}
              />
            );
          })}

          {filteredGroups.length === 0 &&
            state.groups.length > 0 &&
            !create.isCreating && (
              <li className="section-empty" aria-live="polite">
                No groups match that search.
              </li>
            )}
        </ul>
      )}
    </div>
  );
};

import React, {
  useCallback
} from 'react';

import { useCollectionCreate } from '../hooks/use-collection-create';
import { Tooltip } from './common/tooltip';
import { useCollectionRename } from '../hooks/use-collection-rename';
import { useCollectionSearch } from '../hooks/use-collection-search';
import { useTabContext } from '../hooks/use-tab-context';
import { AddonItem } from './addon-item';

export const AddonsCollection: React.FC = () => {
  const { state, messagingService } = useTabContext();

  const isDuplicateAddon = useCallback(
    (name: string, id: string) =>
      state.addons.some((a) => a.name === name && a.addonId !== id),
    [state.addons]
  );

  const rename = useCollectionRename({
    onRename: (id, newName) => messagingService.renameAddon(id, newName),
    entityLabel: 'Add-on',
    isDuplicate: isDuplicateAddon
  });

  const create = useCollectionCreate({
    onCreate: (name) => messagingService.createAddon(name),
    entityLabel: 'Add-on',
    onStart: rename.cancelRename
  });

  const filterAddon = useCallback(
    (addon: (typeof state.addons)[number], term: string) =>
      addon.name.toLowerCase().includes(term),
    []
  );

  const { searchTerm, setSearchTerm, filteredItems: filteredAddons, clearSearch } =
    useCollectionSearch({ items: state.addons, filterFn: filterAddon });

  return (
    <div className="collections-section addons-collection">
      <div className="section-toolbar">
        <div className="section-toolbar-heading">
          <div className="section-search">
            <i className="codicon codicon-search" aria-hidden="true" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search add-ons"
              aria-label="Search saved add-ons"
            />
            {searchTerm && (
              <Tooltip content="Clear add-ons search">
                <button
                  type="button"
                  className="clear-search"
                  onClick={clearSearch}
                  aria-label="Clear add-ons search"
                >
                  <i className="codicon codicon-close" aria-hidden="true" />
                </button>
              </Tooltip>
            )}
          </div>
          <div className="section-toolbar-actions">
            <Tooltip content="Create new add-on from current tabs">
              <button
                type="button"
                className="section-action"
                onClick={create.startCreate}
                disabled={create.isCreating}
                aria-label="Create new add-on from current tabs"
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
            placeholder="Add-on name"
            value={create.name}
            onChange={(event) => {
              create.setName(event.target.value);
              if (create.error) {
                create.clearError();
              }
            }}
            onKeyDown={create.handleKeyDown}
            aria-label="New add-on name"
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

      {state.addons.length === 0 && !create.isCreating ? (
        <p className="section-empty">No add-ons saved yet.</p>
      ) : (
        <ul className="section-list" role="list">
          {filteredAddons.map((addon) => {
            const { addonId, name, tabCount, columnCount, layout, tabs } = addon;
            const isEditing = rename.editingId === addonId;
            return (
              <AddonItem
                key={addonId}
                addonId={addonId}
                name={name}
                isEditing={isEditing}
                onStartRename={(id, currentName) => {
                  create.cancelCreate();
                  rename.startRename(id, currentName);
                }}
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

          {filteredAddons.length === 0 &&
            state.addons.length > 0 &&
            !create.isCreating && (
              <li className="section-empty" aria-live="polite">
                No add-ons match that search.
              </li>
            )}
        </ul>
      )}
    </div>
  );
};

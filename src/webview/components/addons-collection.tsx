import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { useTabContext } from '../hooks/use-tab-context';

interface AddonsCollectionProps {
  deletingKeys: ReadonlySet<string>;
  onDelete: (addonId: string) => Promise<void> | void;
}

export const AddonsCollection: React.FC<AddonsCollectionProps> = ({
  deletingKeys,
  onDelete
}) => {
  const { state, actions } = useTabContext();
  const [isCreating, setIsCreating] = useState(false);
  const [newAddonName, setNewAddonName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const renameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isCreating]);

  useEffect(() => {
    if (editingAddonId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [editingAddonId]);

  const startCreate = useCallback(() => {
    setIsCreating(true);
    setNewAddonName('');
    setLocalError(null);
  }, []);

  const cancelCreate = useCallback(() => {
    setIsCreating(false);
    setNewAddonName('');
    setLocalError(null);
    setIsSaving(false);
  }, []);

  const cancelRename = useCallback(() => {
    setEditingAddonId(null);
    setRenameValue('');
    setRenameError(null);
    setIsRenaming(false);
  }, []);

  const submitCreate = useCallback(async () => {
    const normalized = newAddonName.trim();
    if (!normalized) {
      setLocalError('Name is required');
      inputRef.current?.focus();
      return;
    }

    try {
      setIsSaving(true);
      await actions.createAddon(normalized);
      cancelCreate();
    } catch (error) {
      console.error('Failed to create add-on', error);
      setLocalError('Unable to save add-on');
      setIsSaving(false);
    }
  }, [actions, newAddonName, cancelCreate]);

  const startRename = useCallback(
    (addonId: string, currentName: string) => {
      cancelCreate();
      setEditingAddonId(addonId);
      setRenameValue(currentName);
      setRenameError(null);
      setIsRenaming(false);
    },
    [cancelCreate]
  );

  const submitRename = useCallback(async () => {
    if (!editingAddonId) return;
    const normalized = renameValue.trim();
    if (!normalized) {
      setRenameError('Add-on name is required');
      renameInputRef.current?.focus();
      return;
    }

    const currentAddon = state.addons.find((a) => a.addonId === editingAddonId);
    if (normalized === currentAddon?.name) {
      cancelRename();
      return;
    }

    if (
      state.addons.some(
        (a) => a.name === normalized && a.addonId !== editingAddonId
      )
    ) {
      setRenameError('An add-on with this name already exists');
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
      return;
    }

    try {
      setIsRenaming(true);
      await actions.renameAddon(editingAddonId, normalized);
      cancelRename();
    } catch (error) {
      console.error('Failed to rename add-on', error);
      setRenameError('Unable to rename add-on');
      setIsRenaming(false);
      renameInputRef.current?.focus();
    }
  }, [actions, editingAddonId, renameValue, cancelRename, state.addons]);

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

  const filteredAddons = useMemo(() => {
    if (!searchTerm.trim()) {
      return state.addons;
    }
    const term = searchTerm.trim().toLowerCase();
    return state.addons.filter((addon) =>
      addon.name.toLowerCase().includes(term)
    );
  }, [state.addons, searchTerm]);

  return (
    <div className="collections-section addons-collection">
      <div className="section-toolbar">
        <div className="section-toolbar-heading">
          <h3>Add-ons</h3>
          <div className="section-toolbar-actions">
            <button
              type="button"
              className="section-action"
              onClick={startCreate}
              disabled={isCreating}
              aria-label="Create new add-on from current tabs"
              title="Create new add-on from current tabs"
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
              placeholder="Search add-ons"
              aria-label="Search saved add-ons"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchTerm('')}
                aria-label="Clear add-ons search"
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
            placeholder="Add-on name"
            value={newAddonName}
            onChange={(event) => {
              setNewAddonName(event.target.value);
              if (localError) {
                setLocalError(null);
              }
            }}
            onKeyDown={handleKeyDown}
            aria-label="New add-on name"
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

      {state.addons.length === 0 && !isCreating ? (
        <p className="section-empty">No add-ons saved yet.</p>
      ) : (
        <ul className="section-list" role="list">
          {filteredAddons.map((addon) => {
            const { addonId, name } = addon;
            const isDeleting = deletingKeys.has(`addon:${addonId}`);
            const isEditing = editingAddonId === addonId;
            return (
              <li
                key={addonId}
                className={`section-item${isEditing ? ' editing' : ''}`}
                tabIndex={0}
                onClick={() => {
                  if (isDeleting) return;
                  if (isEditing) return;
                  void actions.applyAddon(addonId).catch((error) => {
                    console.error('Failed to apply add-on', error);
                  });
                }}
                onKeyDown={(event) => {
                  if (isDeleting) return;
                  if (isEditing) return;
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    void actions.applyAddon(addonId).catch((error) => {
                      console.error('Failed to apply add-on', error);
                    });
                  }
                }}
                title="Apply this add-on (adds tabs without replacing)"
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
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              event.stopPropagation();
                              void submitRename();
                            }
                            if (event.key === 'Escape') {
                              event.preventDefault();
                              event.stopPropagation();
                              cancelRename();
                            }
                          }}
                          aria-label="Rename add-on"
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
                            aria-label="Save add-on name"
                          >
                            <i
                              className="codicon codicon-check"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            className="action-cancel"
                            onClick={(event) => {
                              event.stopPropagation();
                              cancelRename();
                            }}
                            disabled={isRenaming}
                            aria-label="Cancel rename"
                          >
                            <i
                              className="codicon codicon-close"
                              aria-hidden="true"
                            />
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
                    {!isEditing && (
                      <button
                        type="button"
                        className="neutral"
                        onClick={(event) => {
                          event.stopPropagation();
                          startRename(addonId, name);
                        }}
                        disabled={isDeleting}
                        title="Rename add-on"
                      >
                        <i
                          className="codicon codicon-edit"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                    <button
                      type="button"
                      className="neutral"
                      onClick={(event) => {
                        event.stopPropagation();
                        void actions.applyAddon(addonId).catch((error) => {
                          console.error('Failed to apply add-on', error);
                        });
                      }}
                      disabled={isDeleting || isEditing}
                      title="Apply add-on"
                    >
                      <i
                        className="codicon codicon-arrow-right"
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        void onDelete(addonId);
                      }}
                      disabled={isDeleting || isEditing}
                      title="Delete add-on"
                    >
                      <i className="codicon codicon-trash" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}

          {filteredAddons.length === 0 &&
            state.addons.length > 0 &&
            !isCreating && (
              <li className="section-empty" aria-live="polite">
                No add-ons match that search.
              </li>
            )}
        </ul>
      )}
    </div>
  );
};

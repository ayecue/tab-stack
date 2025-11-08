import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { useTabContext } from '../hooks/use-tab-context';
import { AddonItem } from './addon-item';

export const AddonsCollection: React.FC = () => {
  const { state, messagingService } = useTabContext();
  const [isCreating, setIsCreating] = useState(false);
  const [newAddonName, setNewAddonName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isCreating]);

  const startCreate = useCallback(() => {
    setEditingAddonId(null);
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
      messagingService.createAddon(normalized);
      cancelCreate();
    } catch (error) {
      console.error('Failed to create add-on', error);
      setLocalError('Unable to save add-on');
      setIsSaving(false);
    }
  }, [messagingService, newAddonName, cancelCreate]);

  const startRename = useCallback(
    (addonId: string, _currentName: string) => {
      cancelCreate();
      setEditingAddonId(addonId);
    },
    [cancelCreate]
  );

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
            const isEditing = editingAddonId === addonId;
            return (
              <AddonItem
                key={addonId}
                addonId={addonId}
                name={name}
                isEditing={isEditing}
                onStartRename={startRename}
                onCancelRename={cancelRename}
              />
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

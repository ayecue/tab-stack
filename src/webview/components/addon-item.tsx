import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useTabContext } from '../hooks/use-tab-context';

interface AddonItemProps {
  addonId: string;
  name: string;
  isEditing: boolean;
  onStartRename: (addonId: string, currentName: string) => void;
  onCancelRename: () => void;
}

export const AddonItem: React.FC<AddonItemProps> = ({
  addonId,
  name,
  isEditing,
  onStartRename,
  onCancelRename
}) => {
  const { state, messagingService } = useTabContext();
  const renameInputRef = useRef<HTMLInputElement | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);

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

  const submitRename = useCallback(async () => {
    const normalized = renameValue.trim();

    if (!normalized) {
      setRenameError('Add-on name is required');
      renameInputRef.current?.focus();
      return;
    }

    if (normalized === name) {
      onCancelRename();
      return;
    }

    if (
      state.addons.some((a) => a.name === normalized && a.addonId !== addonId)
    ) {
      setRenameError('An add-on with this name already exists');
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
      return;
    }

    try {
      setIsRenaming(true);
      messagingService.renameAddon(addonId, normalized);
      onCancelRename();
    } catch (error) {
      console.error('Failed to rename add-on', error);
      setRenameError('Unable to rename add-on');
      setIsRenaming(false);
      renameInputRef.current?.focus();
    }
  }, [
    messagingService,
    addonId,
    renameValue,
    onCancelRename,
    state.addons,
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

  const handleDelete = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      messagingService.deleteAddon(addonId);
    },
    [messagingService, addonId]
  );

  const handleApply = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      messagingService.applyAddon(addonId);
    },
    [messagingService, addonId]
  );

  const handleItemClick = useCallback(() => {
    if (isEditing) return;
    messagingService.applyAddon(addonId);
  }, [isEditing, messagingService, addonId]);

  const handleItemKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLLIElement>) => {
      if (isEditing) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        messagingService.applyAddon(addonId);
      }
    },
    [isEditing, messagingService, addonId]
  );

  return (
    <li
      className={`section-item${isEditing ? ' editing' : ''}`}
      tabIndex={0}
      onClick={handleItemClick}
      onKeyDown={handleItemKeyDown}
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
                onKeyDown={handleRenameKeyDown}
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
          {!isEditing && (
            <button
              type="button"
              className="neutral"
              onClick={(event) => {
                event.stopPropagation();
                onStartRename(addonId, name);
              }}
              title="Rename add-on"
            >
              <i className="codicon codicon-edit" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="neutral"
            onClick={handleApply}
            disabled={isEditing}
            title="Apply add-on"
          >
            <i className="codicon codicon-arrow-right" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="danger"
            onClick={handleDelete}
            disabled={isEditing}
            title="Delete add-on"
          >
            <i className="codicon codicon-trash" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
};

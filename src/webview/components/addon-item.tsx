import React, { useCallback } from 'react';

import { useTabContext } from '../hooks/use-tab-context';
import { useTooltip } from '../hooks/use-tooltip';
import { CollectionTooltipContent } from './common/collection-tooltip-content';
import { Tooltip } from './common/tooltip';

interface AddonItemProps {
  addonId: string;
  name: string;
  isEditing: boolean;
  onStartRename: (addonId: string, currentName: string) => void;
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
}

export const AddonItem: React.FC<AddonItemProps> = ({
  addonId,
  name,
  isEditing,
  onStartRename,
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
  columnCount
}) => {
  const { messagingService } = useTabContext();

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

  const { triggerProps, renderTooltip } = useTooltip({
    content: (
      <CollectionTooltipContent
        tabCount={tabCount}
        columnCount={columnCount}
      />
    )
  });

  return (
    <>
      <li
        className={`section-item${isEditing ? ' editing' : ''}`}
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
                  onKeyDown={(event) => onRenameKeyDown(event, addonId, name)}
                  aria-label="Rename add-on"
                  disabled={isRenaming}
                />
                <div className="inline-form-actions">
                  <Tooltip content="Save add-on name">
                    <button
                      type="button"
                      className="action-save"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSubmitRename(addonId, name);
                      }}
                      disabled={isRenaming}
                      aria-label="Save add-on name"
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
            {!isEditing && (
              <Tooltip content="Rename add-on">
                <button
                  type="button"
                  className="neutral"
                  onClick={(event) => {
                    event.stopPropagation();
                    onStartRename(addonId, name);
                  }}
                >
                  <i className="codicon codicon-edit" aria-hidden="true" />
                </button>
              </Tooltip>
            )}
            <Tooltip content="Apply add-on">
              <button
                type="button"
                className="neutral"
                onClick={handleApply}
                disabled={isEditing}
              >
                <i className="codicon codicon-arrow-right" aria-hidden="true" />
              </button>
            </Tooltip>
            <Tooltip content="Delete add-on">
              <button
                type="button"
                className="danger"
                onClick={handleDelete}
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

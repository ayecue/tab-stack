import React, { useCallback, useEffect, useRef, useState } from 'react';

interface UseCollectionRenameOptions {
  onRename: (id: string, newName: string) => void;
  entityLabel: string;
  isDuplicate?: (name: string, id: string) => boolean;
}

interface UseCollectionRenameResult {
  editingId: string | null;
  renameValue: string;
  setRenameValue: (value: string) => void;
  renameError: string | null;
  clearRenameError: () => void;
  isRenaming: boolean;
  renameInputRef: React.RefObject<HTMLInputElement | null>;
  startRename: (id: string, currentName: string) => void;
  cancelRename: () => void;
  submitRename: (id: string, currentName: string) => void;
  handleRenameKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    currentName: string
  ) => void;
}

export function useCollectionRename({
  onRename,
  entityLabel,
  isDuplicate
}: UseCollectionRenameOptions): UseCollectionRenameResult {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const renameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [editingId]);

  const cancelRename = useCallback(() => {
    setEditingId(null);
    setRenameValue('');
    setRenameError(null);
    setIsRenaming(false);
  }, []);

  const startRename = useCallback(
    (id: string, currentName: string) => {
      setEditingId(id);
      setRenameValue(currentName);
      setRenameError(null);
      setIsRenaming(false);
    },
    []
  );

  const clearRenameError = useCallback(() => {
    setRenameError(null);
  }, []);

  const submitRename = useCallback(
    (id: string, currentName: string) => {
      const normalized = renameValue.trim();

      if (!normalized) {
        setRenameError(`${entityLabel} name is required`);
        renameInputRef.current?.focus();
        return;
      }

      if (normalized === currentName) {
        cancelRename();
        return;
      }

      if (isDuplicate?.(normalized, id)) {
        setRenameError(`A ${entityLabel.toLowerCase()} with this name already exists`);
        renameInputRef.current?.focus();
        renameInputRef.current?.select();
        return;
      }

      try {
        setIsRenaming(true);
        onRename(id, normalized);
        cancelRename();
      } catch (err) {
        console.error(`Failed to rename ${entityLabel.toLowerCase()}`, err);
        setRenameError(`Unable to rename ${entityLabel.toLowerCase()}`);
        setIsRenaming(false);
        renameInputRef.current?.focus();
      }
    },
    [renameValue, entityLabel, isDuplicate, onRename, cancelRename]
  );

  const handleRenameKeyDown = useCallback(
    (
      event: React.KeyboardEvent<HTMLInputElement>,
      id: string,
      currentName: string
    ) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        submitRename(id, currentName);
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        cancelRename();
      }
    },
    [submitRename, cancelRename]
  );

  return {
    editingId,
    renameValue,
    setRenameValue,
    renameError,
    clearRenameError,
    isRenaming,
    renameInputRef,
    startRename,
    cancelRename,
    submitRename,
    handleRenameKeyDown
  };
}

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface UseCollectionCreateOptions {
  onCreate: (name: string) => void;
  entityLabel: string;
  onStart?: () => void;
}

interface UseCollectionCreateResult {
  isCreating: boolean;
  name: string;
  setName: (value: string) => void;
  error: string | null;
  clearError: () => void;
  isSaving: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  startCreate: () => void;
  cancelCreate: () => void;
  submitCreate: () => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function useCollectionCreate({
  onCreate,
  entityLabel,
  onStart
}: UseCollectionCreateOptions): UseCollectionCreateResult {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isCreating]);

  const cancelCreate = useCallback(() => {
    setIsCreating(false);
    setName('');
    setError(null);
    setIsSaving(false);
  }, []);

  const startCreate = useCallback(() => {
    onStart?.();
    setIsCreating(true);
    setName('');
    setError(null);
  }, [onStart]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const submitCreate = useCallback(() => {
    const normalized = name.trim();
    if (!normalized) {
      setError(`${entityLabel} name is required`);
      inputRef.current?.focus();
      return;
    }

    try {
      setIsSaving(true);
      onCreate(normalized);
      cancelCreate();
    } catch (err) {
      console.error(`Failed to create ${entityLabel.toLowerCase()}`, err);
      setError(`Unable to save ${entityLabel.toLowerCase()}`);
      setIsSaving(false);
    }
  }, [name, entityLabel, onCreate, cancelCreate]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitCreate();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        cancelCreate();
      }
    },
    [submitCreate, cancelCreate]
  );

  return {
    isCreating,
    name,
    setName,
    error,
    clearError,
    isSaving,
    inputRef,
    startCreate,
    cancelCreate,
    submitCreate,
    handleKeyDown
  };
}

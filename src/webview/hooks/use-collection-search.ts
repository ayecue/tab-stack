import { useEffect, useMemo, useRef, useState } from 'react';

interface UseCollectionSearchOptions<T> {
  items: T[];
  filterFn: (item: T, term: string) => boolean;
  debounceMs?: number;
}

interface UseCollectionSearchResult<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredItems: T[];
  clearSearch: () => void;
}

export function useCollectionSearch<T>({
  items,
  filterFn,
  debounceMs = 150
}: UseCollectionSearchOptions<T>): UseCollectionSearchResult<T> {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSetSearchTerm = (term: string) => {
    setSearchTerm(term);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebouncedTerm(term);
    }, debounceMs);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedTerm('');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const filteredItems = useMemo(() => {
    const trimmed = debouncedTerm.trim();
    if (!trimmed) {
      return items;
    }
    const term = trimmed.toLowerCase();
    return items.filter((item) => filterFn(item, term));
  }, [items, debouncedTerm, filterFn]);

  return {
    searchTerm,
    setSearchTerm: handleSetSearchTerm,
    filteredItems,
    clearSearch
  };
}

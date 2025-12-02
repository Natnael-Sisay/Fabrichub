import { useState, useCallback } from "react";
import { useDebounce } from "./useDebounce";

export function useSearch(initialQuery = "", debounceMs = 500) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(searchQuery, debounceMs);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchQuery,
    debouncedQuery,
    handleSearchChange,
    clearSearch,
  };
}


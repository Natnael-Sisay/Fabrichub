import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/api";
import { normalizeCategories } from "@/utils";
import type { CategoryOption } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetchCategories()
      .then((cats) => {
        const categoriesArray = Array.isArray(cats) ? cats : [];
        const normalized = normalizeCategories(categoriesArray);
        setCategories(normalized);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err : new Error("Failed to load categories")
        );
        setCategories([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { categories, isLoading, error };
}

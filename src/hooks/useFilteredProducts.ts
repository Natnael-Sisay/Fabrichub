import { useMemo } from "react";
import type { Product, SortField } from "@/types";

interface FilterState {
  selectedCategory: string;
  sortField: SortField;
  sortOrder: "asc" | "desc";
  priceMin: number;
  priceMax: number;
}

export function useFilteredProducts(products: Product[], filters: FilterState) {
  const { selectedCategory, sortField, sortOrder, priceMin, priceMax } =
    filters;

  return useMemo(() => {
    let filtered = products.filter((p) => {
      const price = p.price ?? 0;
      return price >= priceMin && price <= priceMax;
    });

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((p) => {
        const cat = p.category;
        if (!cat) return false;
        return (
          String(cat).toLowerCase() === String(selectedCategory).toLowerCase()
        );
      });
    }

    if (sortField && sortField !== "default") {
      const sorted = [...filtered];
      sorted.sort((a: Product, b: Product) => {
        const aVal = a[sortField as keyof Product];
        const bVal = b[sortField as keyof Product];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        return 0;
      });
      return sorted;
    }

    return filtered;
  }, [products, selectedCategory, sortField, sortOrder, priceMin, priceMax]);
}

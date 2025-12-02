export type SortField = "default" | "price" | "rating" | "title";

export type SortOrder = "asc" | "desc";

export interface ProductFilters {
  category: string;
  sortField: SortField;
  sortOrder: SortOrder;
  priceMin: number;
  priceMax: number;
  searchQuery: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}


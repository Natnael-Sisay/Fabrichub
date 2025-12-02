"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { CategoryOption, SortField } from "@/types";

interface ProductFiltersProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
  priceMin?: number;
  priceMax?: number;
  onPriceRangeChange?: (min: number, max: number) => void;
  min?: number;
  max?: number;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
  priceMin = 0,
  priceMax = 2000,
  onPriceRangeChange,
  min = 0,
  max = 2000,
}: ProductFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const MIN = min;
  const MAX = max;

  const [minVal, setMinVal] = useState<number>(priceMin ?? MIN);
  const [maxVal, setMaxVal] = useState<number>(priceMax ?? MAX);

  useEffect(() => {
    setMinVal(typeof priceMin === "number" ? priceMin : MIN);
  }, [priceMin, MIN]);

  useEffect(() => {
    setMaxVal(typeof priceMax === "number" ? priceMax : MAX);
  }, [priceMax, MAX]);

  const handleMinChange = (v: number) => {
    const newMin = Math.min(v, maxVal - 1);
    setMinVal(newMin);
    onPriceRangeChange?.(newMin, maxVal);
  };

  const handleMaxChange = (v: number) => {
    const newMax = Math.max(v, minVal + 1);
    setMaxVal(newMax);
    onPriceRangeChange?.(minVal, newMax);
  };

  const sortOptions = useMemo(
    () => [
      { value: "default", label: "Default" },
      { value: "price", label: "Price" },
      { value: "rating", label: "Rating" },
      { value: "title", label: "Name" },
    ],
    []
  );

  return (
    <Card className="bg-card rounded-lg p-6 sticky top-32 h-fit lg:mt-6 border-0">
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="w-full flex items-center justify-between"
        >
          <span className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters & Sort
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isFiltersOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      <div
        className={`${isFiltersOpen ? "block" : "hidden"} lg:block space-y-6`}
      >
        <div>
          <h3 className="font-semibold text-lg mb-3 text-foreground">
            Category
          </h3>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-2 py-1.5 border border-border rounded-md text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3 text-foreground">Sort</h3>
          <div className="mb-2">
            <select
              value={sortField}
              onChange={(e) => onSortFieldChange(e.target.value as SortField)}
              className="w-full px-2 py-1.5 border border-border rounded-md text-sm bg-background text-foreground"
              aria-label="Sort by"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={sortOrder === "asc" ? "default" : "outline"}
              size="sm"
              onClick={() => onSortOrderChange("asc")}
              className="flex-1 text-xs"
            >
              Asc
            </Button>
            <Button
              variant={sortOrder === "desc" ? "default" : "outline"}
              size="sm"
              onClick={() => onSortOrderChange("desc")}
              className="flex-1 text-xs"
            >
              Desc
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3 text-foreground">
            Price Range
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Min
                </label>
                <input
                  type="number"
                  min={MIN}
                  max={MAX}
                  value={minVal}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value)) {
                      handleMinChange(
                        Math.max(MIN, Math.min(value, maxVal - 1))
                      );
                    }
                  }}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                  placeholder={`${MIN}`}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Max
                </label>
                <input
                  type="number"
                  min={MIN}
                  max={MAX}
                  value={maxVal}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value)) {
                      handleMaxChange(
                        Math.min(MAX, Math.max(value, minVal + 1))
                      );
                    }
                  }}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                  placeholder={`${MAX}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

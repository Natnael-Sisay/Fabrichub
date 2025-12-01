"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortField: string;
  onSortFieldChange: (field: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
}: ProductFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price", label: "Price" },
    { value: "rating", label: "Rating" },
    { value: "title", label: "Name" },
  ];

  return (
    <Card className="bg-white rounded-lg p-6 sticky top-32 h-fit mt-6">
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
          <h3 className="font-semibold text-lg mb-3">Category</h3>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category} className="capitalize">
                {category.replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-3">Sort</h3>
          <div className="flex space-x-2">
            <Button
              variant={sortOrder === "asc" ? "default" : "outline"}
              size="sm"
              onClick={() => onSortOrderChange("asc")}
              className="flex-1 text-xs"
            >
              Ascending
            </Button>
            <Button
              variant={sortOrder === "desc" ? "default" : "outline"}
              size="sm"
              onClick={() => onSortOrderChange("desc")}
              className="flex-1 text-xs"
            >
              Descending
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3">Price Range</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>$2000</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-xs text-gray-500 text-center">$0 - $2000</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

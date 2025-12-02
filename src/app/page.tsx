"use client";

import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toggleFavorite } from "@/store/slices";
import { selectFavoriteIds } from "@/store/selectors";
import { ProductCard, ProductFilters } from "@/components/pages/product";
import {
  ProductCardSkeleton,
  ErrorState,
  EmptyState,
} from "@/components/states";
import { PageLayout } from "@/components/layout/page-layout";
import { SearchBar } from "@/components/common";
import type { Product, SortField } from "@/types";
import {
  useProducts,
  useInfiniteScroll,
  useSearch,
  useCategories,
  useFilteredProducts,
} from "@/hooks";
import { formatCategoryLabel } from "@/utils";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(selectFavoriteIds);

  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortField, setSortField] = useState<SortField>("default");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(2000);

  const { searchQuery, debouncedQuery, handleSearchChange } = useSearch(
    "",
    500
  );

  const { products, hasMore, isLoading, isError, loadProducts, loadMore } =
    useProducts();

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProducts({
      limit: 12,
      skip: 0,
      category: selectedCategory,
      q: debouncedQuery.trim() || undefined,
    });
  }, [selectedCategory, debouncedQuery, loadProducts]);

  const handleFavoriteToggle = (product: Product) => {
    dispatch(toggleFavorite(product));
  };

  const isProductFavorite = (productId: number) =>
    favoriteIds.includes(productId);

  const filteredProducts = useFilteredProducts(products, {
    selectedCategory,
    sortField,
    sortOrder,
    priceMin,
    priceMax,
  });

  useInfiniteScroll({
    hasMore,
    isLoading,
    itemCount: filteredProducts.length,
    containerRef: gridRef,
    onLoadMore: () => {
      loadMore({
        category: selectedCategory,
        q: debouncedQuery.trim() || undefined,
      });
    },
  });

  const loading = isLoading && products.length === 0;

  if (isError && products.length === 0) {
    return (
      <PageLayout>
        <ErrorState
          title="Failed to load products"
          message="We couldn't load the products. Please try again."
          onRetry={() =>
            loadProducts({
              limit: 12,
              skip: 0,
              category: selectedCategory,
              q: debouncedQuery.trim() || undefined,
            })
          }
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col lg:flex-row gap-8 pb-8">
        <aside className="lg:w-64 shrink-0">
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortField={sortField}
            onSortFieldChange={setSortField}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            priceMin={priceMin}
            priceMax={priceMax}
            onPriceRangeChange={(min, max) => {
              setPriceMin(min);
              setPriceMax(max);
            }}
          />
        </aside>

        <section className="flex-1">
          <div className="mb-6 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              {selectedCategory === "all"
                ? "All Products"
                : formatCategoryLabel(selectedCategory)}
            </h2>
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between">
              <div className="w-full max-w-md">
                <SearchBar
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </div>
            </div>
          </div>

          <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          >
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
              : filteredProducts.map((product, index) => (
                  <div key={product.id} data-product-card>
                    <ProductCard
                      product={product}
                      isFavorite={isProductFavorite(product.id)}
                      onFavoriteToggle={handleFavoriteToggle}
                      priority={index < 15}
                    />
                  </div>
                ))}
          </div>

          {!loading && filteredProducts.length === 0 && (
            <EmptyState
              title="No products found"
              message={
                selectedCategory === "all"
                  ? "We couldn't find any products matching your criteria."
                  : `No products found in ${formatCategoryLabel(
                      selectedCategory
                    )} category.`
              }
              action={
                selectedCategory !== "all"
                  ? {
                      label: "View All Products",
                      onClick: () => setSelectedCategory("all"),
                    }
                  : undefined
              }
            />
          )}

          {hasMore && isLoading && (
            <div className="py-8 text-center">
              <ProductCardSkeleton />
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}

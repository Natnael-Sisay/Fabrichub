"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toggleFavorite } from "@/store/slices";
import { selectFavoriteIds } from "@/store/selectors";
import { ProductCard, ProductFilters } from "@/components/pages/product";
import { ProductCardSkeleton, ErrorState } from "@/components/states";
import { SearchBar } from "@/components/common";
import { Button } from "@/components/ui/button";
import { fetchCategories } from "@/lib/api";
import { Product } from "@/types";
import { useProducts } from "@/hooks/useProducts";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useSearch } from "@/hooks/useSearch";
import { normalizeCategories, formatCategoryLabel } from "@/utils/category";
import type { CategoryOption, SortField } from "@/lib/types/filters";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(selectFavoriteIds);

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortField, setSortField] = useState<SortField>("default");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(2000);

  const { searchQuery, debouncedQuery, handleSearchChange } = useSearch(
    "",
    500
  );

  const {
    products,
    status,
    total,
    hasMore,
    isLoading,
    isError,
    loadProducts,
    loadMore,
  } = useProducts();

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        const categoriesArray = Array.isArray(cats) ? cats : [];
        const normalized = normalizeCategories(categoriesArray);
        setCategories(normalized);
      })
      .catch(() => setCategories([]));
  }, []);

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

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const price = p.price ?? 0;
      return price >= priceMin && price <= priceMax;
    });

    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter((p) => {
        const cat = p.category;
        if (!cat) return false;
        return (
          String(cat).toLowerCase() === String(selectedCategory).toLowerCase()
        );
      });
    }

    if (sortField && sortField !== "default") {
      const copy = [...list];
      copy.sort((a: Product, b: Product) => {
        const aVal = a[sortField as keyof Product];
        const bVal = b[sortField as keyof Product];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        return 0;
      });
      return copy;
    }

    return list;
  }, [products, selectedCategory, sortField, sortOrder, priceMin, priceMax]);

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
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 py-10">
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
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-10">
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
              <div className="w-full flex items-center justify-between">
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
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
                      />
                    </div>
                  ))}
            </div>

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {selectedCategory === "all"
                    ? "We couldn't find any products matching your criteria."
                    : `No products found in ${formatCategoryLabel(
                        selectedCategory
                      )} category.`}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory("all")}
                >
                  View All Products
                </Button>
              </div>
            )}

            {hasMore && isLoading && (
              <div className="py-8 text-center">
                <ProductCardSkeleton />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

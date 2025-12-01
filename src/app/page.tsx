"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/pages/product/ProductCard.component";
import { ProductCardSkeleton } from "@/components/states";
import { ProductFilters } from "@/components/pages/product/ProductFilters.component";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

const mockProducts: Product[] = [];

const categories: unknown = [];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortField, setSortField] = useState("default");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleFavoriteToggle = (product: Product) => {
    console.log("Favorite toggled:", product.title);
  };

  const filteredProducts = products
    .filter(
      (product) =>
        selectedCategory === "all" || product.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortField === "default") return 0;
      if (sortField === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      }
      if (sortField === "rating") {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
      }
      if (sortField === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
            />
          </aside>

          <section className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === "all"
                  ? "All Products"
                  : selectedCategory.replace(/-/g, " ")}
              </h2>
              <div className="text-sm text-gray-500">
                {filteredProducts.length} products
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))
                : filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={false}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  ))}
            </div>

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6">
                  {selectedCategory === "all"
                    ? "We couldn't find any products matching your criteria."
                    : `No products found in ${selectedCategory.replace(
                        /-/g,
                        " "
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
          </section>
        </div>
      </main>
    </div>
  );
}

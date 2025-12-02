"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectFavoritesArray } from "@/store/selectors";
import { toggleFavorite } from "@/store/slices";
import { ProductCard } from "@/components/pages/product";
import { PageLayout } from "@/components/layout/page-layout";
import { EmptyState } from "@/components/states";
import { Product } from "@/types";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavoritesArray);

  const handleFavoriteToggle = (product: Product) => {
    dispatch(toggleFavorite(product));
  };

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Favorites</h1>
        <p className="text-muted-foreground mt-2">
          {favorites.length} {favorites.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          message="Start adding products to your favorites to see them here."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={true}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

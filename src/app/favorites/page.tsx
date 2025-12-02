"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectFavoritesArray } from "@/store/selectors";
import { toggleFavorite } from "@/store/slices";
import { ProductCard } from "@/components/pages/product";
import { Product } from "@/types";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavoritesArray);

  const handleFavoriteToggle = (product: Product) => {
    dispatch(toggleFavorite(product));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Favorites</h1>
          <p className="text-muted-foreground mt-2">
            {favorites.length} {favorites.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-muted-foreground text-6xl mb-4">❤️</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No favorites yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start adding products to your favorites to see them here.
            </p>
          </div>
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
      </main>
    </div>
  );
}


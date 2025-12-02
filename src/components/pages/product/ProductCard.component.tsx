"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice, formatRating, formatCategoryLabel } from "@/utils";

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onFavoriteToggle?: (product: Product) => void;
}

function ProductCardComponent({
  product,
  isFavorite = false,
  onFavoriteToggle,
}: ProductCardProps) {
  const { id, title, price, rating, category, thumbnail } = product;

  return (
    <Link href={`/product/${id}`} className="block">
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-card rounded-xl p-0 max-w-60">
        <div className="relative h-36 bg-muted">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              width={240}
              height={144}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}

          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-7 w-7 rounded-full bg-card/90 hover:cursor-pointer hover:bg-card shadow-sm ${
              isFavorite ? "text-red-500" : "text-muted-foreground"
            }`}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
              onFavoriteToggle?.(product);
            }}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={`h-3.5 w-3.5 ${isFavorite ? "fill-current" : ""}`}
            />
          </Button>
        </div>

        <div className="p-2 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground capitalize">
              {category ? formatCategoryLabel(category) : ""}
            </span>
            <div className="flex items-center text-xs text-foreground">
              <Star
                className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1"
                aria-hidden="true"
              />
              {formatRating(rating)}
            </div>
          </div>

          <h3 className="font-medium text-sm leading-tight line-clamp-2 text-foreground hover:text-primary transition-colors">
            {title}
          </h3>

          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-foreground">
              {formatPrice(price)}
            </span>
            <span className="text-xs text-muted-foreground">
              {product.stock ?? "-"}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export const ProductCard = memo(ProductCardComponent, (prev, next) => {
  return (
    prev.product.id === next.product.id &&
    prev.isFavorite === next.isFavorite &&
    prev.product.thumbnail === next.product.thumbnail &&
    prev.product.price === next.product.price &&
    prev.product.rating === next.product.rating
  );
});

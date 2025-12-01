"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onFavoriteToggle?: (product: Product) => void;
}

export function ProductCard({
  product,
  isFavorite = false,
  onFavoriteToggle,
}: ProductCardProps) {
  const { id, title, price, rating, category, thumbnail } = product;

  return (
    <Link href={`/product/${id}`} className="block">
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-xl p-0 max-w-60">
        <div className="relative h-36 bg-gray-100">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              width={240}
              height={144}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}

          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 hover:bg-white shadow-sm ${
              isFavorite ? "text-red-500" : "text-gray-400"
            }`}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
              onFavoriteToggle?.(product);
            }}
          >
            <Heart
              className={`h-3.5 w-3.5 ${isFavorite ? "fill-current" : ""}`}
            />
          </Button>
        </div>

        <div className="p-2 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 capitalize">
              {(category ?? "").replace(/-/g, " ")}
            </span>
            <div className="flex items-center text-xs text-gray-600">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              {rating !== undefined && rating !== null
                ? rating.toFixed(1)
                : "-"}
            </div>
          </div>

          <h3 className="font-medium text-sm leading-tight line-clamp-2 text-gray-900 hover:text-blue-600 transition-colors">
            {title}
          </h3>

          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-gray-900">
              ${price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">
              {product.stock ?? "-"}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

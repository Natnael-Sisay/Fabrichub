"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Star, Package, Tag, Edit, Trash2 } from "lucide-react";
import ProductForm from "./ProductForm.component";
import { ProductFormMode, ProductFormValues } from "@/types/product";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatPrice, formatRating } from "@/utils/format";
import { formatCategoryLabel } from "@/utils/category";
import type { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product;
  isFavorite: boolean;
  isAuthenticated: boolean;
  onFavoriteToggle: () => void;
  onEdit: (values: ProductFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function ProductDetail({
  product,
  isFavorite,
  isAuthenticated,
  onFavoriteToggle,
  onEdit,
  onDelete,
}: ProductDetailProps) {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const mainImage = product.images?.[0] || product.thumbnail || "";
  const category = product.category || "Uncategorized";

  const handleEditSubmit = async (values: ProductFormValues) => {
    await onEdit(values);
    setIsEditFormOpen(false);
  };

  const handleDelete = async () => {
    await onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative">
              <Card className="overflow-hidden bg-card rounded-lg py-0 ">
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={product.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                {formatCategoryLabel(category)}
              </div>

              <h1 className="text-3xl font-bold text-foreground">
                {product.title}
              </h1>

              {product.brand && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm">Brand: {product.brand}</span>
                </div>
              )}

              <div className="flex items-center gap-6">
                {product.rating !== undefined && product.rating !== null && (
                  <div className="flex items-center gap-1">
                    <Star
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {formatRating(product.rating)}
                    </span>
                  </div>
                )}
                {product.stock !== undefined && (
                  <div className="flex items-center gap-1">
                    <Package
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-muted-foreground">
                      In Stock ({product.stock})
                    </span>
                  </div>
                )}
              </div>

              <div className="text-4xl font-bold text-foreground">
                {formatPrice(product.price)}
              </div>

              {isAuthenticated && (
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={onFavoriteToggle}
                    className="flex-1 sm:flex-initial text-primary border-primary"
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsEditFormOpen(true)}
                    className="flex-1 sm:flex-initial text-primary border-primary"
                    aria-label="Edit product"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="flex-1 sm:flex-initial text-destructive hover:text-destructive"
                    aria-label="Delete product"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}

              {product.description && (
                <Card className="p-4 bg-card">
                  <h2 className="font-semibold text-lg mb-3 text-foreground">
                    Description
                  </h2>
                  <p className="text-foreground leading-relaxed">
                    {product.description}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <ProductForm
        open={isEditFormOpen}
        onOpenChange={setIsEditFormOpen}
        mode={ProductFormMode.EDIT}
        product={product}
        onSubmit={handleEditSubmit}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}

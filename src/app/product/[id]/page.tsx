"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  toggleFavorite,
  updateExistingProduct,
  deleteExistingProduct,
} from "@/store/slices";
import { selectIsFavorite } from "@/store/selectors";
import { ProductDetail } from "@/components/pages/product";
import { ProductFormValues } from "@/types/product";
import { ErrorState } from "@/components/states";
import { useProductDetails } from "@/hooks/useProductDetails";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  const productId = Number(params.id);
  const { product, isLoading, isError } = useProductDetails(productId);
  const isFavorite = useAppSelector((state) =>
    selectIsFavorite(state, productId)
  );

  const handleFavoriteToggle = () => {
    if (product) {
      dispatch(toggleFavorite(product));
    }
  };

  const handleEdit = async (values: ProductFormValues) => {
    try {
      await dispatch(
        updateExistingProduct({ id: productId, payload: values })
      ).unwrap();
      toast.success("Product updated successfully!");
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to update product");
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteExistingProduct(productId)).unwrap();
      toast.success("Product deleted successfully!");
      router.push("/");
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to delete product");
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-muted rounded-lg h-96 animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 py-10">
          <div className="max-w-6xl mx-auto">
            <ErrorState
              title="Product Not Found"
              message="The product you're looking for doesn't exist or has been removed."
              onRetry={() => router.push("/")}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <ProductDetail
      product={product}
      isFavorite={isFavorite}
      isAuthenticated={!!session}
      onFavoriteToggle={handleFavoriteToggle}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

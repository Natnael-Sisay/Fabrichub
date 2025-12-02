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
import { ProductFormValues } from "@/types";
import { ErrorState, ProductDetailSkeleton } from "@/components/states";
import { PageLayout } from "@/components/layout/page-layout";
import { useProductDetails } from "@/hooks";
import { getErrorMessage } from "@/utils";
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
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteExistingProduct(productId)).unwrap();
      toast.success("Product deleted successfully!");
      router.push("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  if (isLoading) {
    return (
      <PageLayout maxWidth="6xl">
        <ProductDetailSkeleton />
      </PageLayout>
    );
  }

  if (isError || !product) {
    return (
      <PageLayout maxWidth="6xl">
        <ErrorState
          title="Product Not Found"
          message="The product you're looking for doesn't exist or has been removed."
          onRetry={() => router.push("/")}
        />
      </PageLayout>
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

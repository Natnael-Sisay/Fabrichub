import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchProduct } from "@/store/slices";
import { selectProductById, selectProductsStatus } from "@/store/selectors";

export function useProductDetails(productId: number) {
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => selectProductById(state, productId));
  const status = useAppSelector(selectProductsStatus);

  useEffect(() => {
    if (productId && !product && status !== "loading") {
      dispatch(fetchProduct(productId));
    }
  }, [productId, product, status, dispatch]);

  return {
    product,
    status,
    isLoading: status === "loading",
    isError: status === "failed",
  };
}


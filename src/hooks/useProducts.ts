import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchProductsList } from "@/store/slices";
import {
  selectProductsArray,
  selectProductsStatus,
  selectProductsTotal,
  selectProductsError,
} from "@/store/selectors";
import type { FetchProductsParams } from "@/lib/types/api";

const PAGE_LIMIT = 12;

export function useProducts(initialParams?: FetchProductsParams) {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProductsArray);
  const status = useAppSelector(selectProductsStatus);
  const total = useAppSelector(selectProductsTotal);
  const error = useAppSelector(selectProductsError);

  const loadProducts = useCallback(
    (params: FetchProductsParams) => {
      dispatch(fetchProductsList({ limit: PAGE_LIMIT, ...params }));
    },
    [dispatch]
  );

  const loadMore = useCallback(
    (params: FetchProductsParams) => {
      const currentSkip = products.length;
      dispatch(
        fetchProductsList({
          limit: PAGE_LIMIT,
          skip: currentSkip,
          ...params,
        })
      );
    },
    [dispatch, products.length]
  );

  useEffect(() => {
    if (initialParams) {
      loadProducts(initialParams);
    }
  }, []);

  const hasMore = products.length < total;
  const isLoading = status === "loading";
  const isError = status === "failed";

  return {
    products,
    status,
    error,
    total,
    hasMore,
    isLoading,
    isError,
    loadProducts,
    loadMore,
  };
}


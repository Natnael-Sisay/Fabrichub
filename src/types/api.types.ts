import type { Product } from "./product.types";

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

export type FetchProductsParams = {
  limit?: number;
  skip?: number;
  q?: string;
  category?: string;
};

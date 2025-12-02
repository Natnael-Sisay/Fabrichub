import client from "./client";
import type { Product } from "@/types/product";
import type { ProductsResponse, FetchProductsParams } from "@/lib/types/api";

export async function fetchProducts(
  params: FetchProductsParams = {}
): Promise<ProductsResponse> {
  const { limit = 10, skip = 0, q, category } = params;

  if (q && q.trim() !== "") {
    const res = await client.get(`/products/search`, {
      params: { q, limit, skip },
    });
    return res.data as ProductsResponse;
  }

  if (category && category !== "all") {
    const res = await client.get(
      `/products/category/${encodeURIComponent(category)}`,
      { params: { limit, skip } }
    );
    return res.data as ProductsResponse;
  }

  const res = await client.get("/products", { params: { limit, skip } });
  return res.data as ProductsResponse;
}

export async function fetchCategories(): Promise<string[]> {
  const res = await client.get("/products/categories");
  const data = res.data || [];
  if (Array.isArray(data)) {
    if (data.length > 0 && typeof data[0] === "string") {
      return data as string[];
    }
    return data.map(
      (item: { slug?: string; name?: string }) =>
        item?.slug || item?.name || String(item)
    );
  }
  return [];
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await client.get(`/products/${id}`);
  return res.data as Product;
}

export async function createProduct(
  payload: Partial<Product>
): Promise<Product> {
  const res = await client.post("/products/add", payload);
  return res.data as Product;
}

export async function updateProduct(
  id: number,
  payload: Partial<Product>
): Promise<Product> {
  const res = await client.put(`/products/${id}`, payload);
  return res.data as Product;
}

export async function deleteProduct(id: number): Promise<{ id: number }> {
  const res = await client.delete(`/products/${id}`);
  return { id };
}

import client from "./client";
import type { Product } from "@/types/product";

type ListParams = {
  limit?: number;
  skip?: number;
  q?: string;
  category?: string;
};

export async function fetchProducts(params: ListParams = {}) {
  const { limit = 10, skip = 0, q, category } = params;

  if (q && q.trim() !== "") {
    const res = await client.get(`/products/search`, {
      params: { q, limit, skip },
    });
    return res.data;
  }

  if (category && category !== "all") {
    const res = await client.get(
      `/products/category/${encodeURIComponent(category)}`,
      { params: { limit, skip } }
    );
    return res.data;
  }

  const res = await client.get("/products", { params: { limit, skip } });
  return res.data;
}

export async function fetchProductById(id: number) {
  const res = await client.get(`/products/${id}`);
  return res.data as Product;
}

export async function createProduct(payload: Partial<Product>) {
  const res = await client.post("/products/add", payload);
  return res.data;
}

export async function updateProduct(id: number, payload: Partial<Product>) {
  const res = await client.put(`/products/${id}`, payload);
  return res.data;
}

export async function deleteProduct(id: number) {
  const res = await client.delete(`/products/${id}`);
  return res.data;
}

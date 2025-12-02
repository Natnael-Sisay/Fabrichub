export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  rating?: number;
  category?: string;
  thumbnail?: string;
  images?: string[];
  brand?: string;
  stock?: number;
}

export type ProductId = Product["id"];

export enum ProductFormMode {
  CREATE = "CREATE",
  EDIT = "EDIT",
}

export type ProductFormValues = {
  title: string;
  description?: string;
  price: number;
  stock: number;
  brand?: string;
  category?: string;
};

export type CreateProductPayload = Partial<Product>;

export type UpdateProductPayload = Partial<Product>;
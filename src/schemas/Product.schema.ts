import { z } from "zod";

export const ProductSchema = z.object({
  title: z.string({ required_error: "Title is required" }).min(1, "Title is required"),
  description: z.string().optional(),
  price: z
    .number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  stock: z
    .number({ required_error: "Stock is required", invalid_type_error: "Stock must be a number" })
    .int("Stock must be a whole number")
    .min(0, "Stock must be 0 or greater"),
  brand: z.string().optional(),
  category: z.string().optional(),
});

import { z } from "zod";

export const ProductSchema = z.object({
  title: z.string({ message: "Title is required" }).min(1, "Title is required"),
  description: z.string().optional(),
  price: z
    .number({
      message: "Price is required",
    })
    .positive("Price must be greater than 0"),
  stock: z
    .number({
      message: "Stock is required",
    })
    .int("Stock must be a whole number")
    .min(0, "Stock must be 0 or greater"),
  brand: z.string().optional(),
  category: z.string().optional(),
});

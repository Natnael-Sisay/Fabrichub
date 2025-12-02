import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z
    .string({
      message: "Password is required",
    })
    .min(1, "Password is required"),
});

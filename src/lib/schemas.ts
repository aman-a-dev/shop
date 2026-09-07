import * as z from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().min(1, "Description is required").max(300),
  price: z.number().nonnegative("Price cannot be negative"),
  stock: z.number().int().nonnegative().default(0),
  status: z.enum(["ACTIVE", "OUT_OF_STOCK"]).default("ACTIVE"),
  images: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL"),
        isCover: z.boolean().optional(),
      }),
    )
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  avatar: z.string().url("Invalid avatar URL").optional(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

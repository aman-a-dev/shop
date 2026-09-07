"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import type { ProductModel as Product } from "@/generated/prisma/models/Product";
import type { UserModel as User } from "@/generated/prisma/models/User";
import type { Prisma } from "@/generated/prisma/client";
import type { ActionResult } from "./products";
import {
  createProductSchema,
  updateProductSchema,
  createUserSchema,
  updateUserSchema,
  type CreateProductInput,
  type UpdateProductInput,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/lib/schemas";

function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`)
    .join("; ");
}

// ---------- PRODUCT: CREATE ----------
export async function createProduct(
  input: CreateProductInput,
): Promise<ActionResult<Product>> {
  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: formatZodError(parsed.error) };
  }
  const data = parsed.data;

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        status: data.status,
        images: data.images?.length
          ? { createMany: { data: data.images } }
          : undefined,
      },
      include: { images: true },
    });

    revalidatePath("/");
    return { success: true, data: product };
  } catch (error) {
    console.error("createProduct error:", error);
    return { success: false, error: "Failed to create product" };
  }
}

// ---------- PRODUCT: UPDATE ----------
export async function updateProduct(
  id: number,
  input: UpdateProductInput,
): Promise<ActionResult<Product>> {
  const parsed = updateProductSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: formatZodError(parsed.error) };
  }

  // images are handled via dedicated add/remove image actions, not a bulk update here
  const { images, ...rest } = parsed.data;

  try {
    const data: Prisma.ProductUpdateInput = { ...rest };

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { images: true },
    });

    revalidatePath("/");
    revalidatePath(`/${id}`);
    return { success: true, data: product };
  } catch (error) {
    console.error("updateProduct error:", error);
    return { success: false, error: "Failed to update product" };
  }
}

// ---------- PRODUCT: DELETE ----------
export async function deleteProduct(
  id: number,
): Promise<ActionResult<{ id: number }>> {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/");
    return { success: true, data: { id } };
  } catch (error) {
    console.error("deleteProduct error:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

// ---------- USER: CREATE ----------
export async function createUser(
  input: CreateUserInput,
): Promise<ActionResult<User>> {
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: formatZodError(parsed.error) };
  }

  try {
    const user = await prisma.user.create({ data: parsed.data });
    revalidatePath("/admin/users");
    return { success: true, data: user };
  } catch (error) {
    console.error("createUser error:", error);
    return { success: false, error: "Failed to create user" };
  }
}

// ---------- USER: UPDATE ----------
export async function updateUser(
  id: number,
  input: UpdateUserInput,
): Promise<ActionResult<User>> {
  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: formatZodError(parsed.error) };
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: parsed.data,
    });
    revalidatePath("/admin/users");
    return { success: true, data: user };
  } catch (error) {
    console.error("updateUser error:", error);
    return { success: false, error: "Failed to update user" };
  }
}

// ---------- USER: DELETE ----------
export async function deleteUser(
  id: number,
): Promise<ActionResult<{ id: number }>> {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: true, data: { id } };
  } catch (error) {
    console.error("deleteUser error:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

// ---------- USER: Get ----------
export async function getUsers(): Promise<ActionResult<User[]>> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: "Failed to fetch users" };
  }
}

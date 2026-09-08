"use server";

import prisma from "@/lib/prisma";
import type { ProductModel as Product } from "@/generated/prisma/models/Product";
import type { ImageModel } from "@/generated/prisma/models/Image";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function serializeProduct<
  T extends { price: any; createdAt: Date; updatedAt: Date; images?: any[] },
>(product: T) {
  return {
    ...product,
    price: Number(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export type ProductWithImages = Product & { images: ImageModel[] };

export async function getAllProducts(): Promise<
  ActionResult<ProductWithImages[]>
> {
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });
    const serializedProducts = products.map(serializeProduct);
    return {
      success: true,
      data: serializedProducts as unknown as ProductWithImages[],
    };
  } catch (error) {
    console.error("getAllProducts error:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function getAllProductsAdmin(): Promise<
  ActionResult<ProductWithImages[]>
> {
  try {
    const products = await prisma.product.findMany({
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });
    const serializedProducts = products.map(serializeProduct);
    return {
      success: true,
      data: serializedProducts as unknown as ProductWithImages[],
    };
  } catch (error) {
    console.error("getAllProducts error:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function getProduct(id: number): Promise<ActionResult<Product>> {
  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
      include: { images: true },
    });
    return {
      success: true,
      data: serializeProduct(product) as unknown as Product,
    };
  } catch (error) {
    console.error("getProduct error:", error);
    return { success: false, error: "Product not found" };
  }
}

export async function searchProducts(
  query: string,
): Promise<ActionResult<ProductWithImages[]>> {
  try {
    const isNumeric = !isNaN(Number(query));
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          ...(isNumeric ? [{ id: Number(query) }] : []),
        ],
      },
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });
    const serializedProducts = products.map(serializeProduct);
    return {
      success: true,
      data: serializedProducts as unknown as ProductWithImages[],
    };
  } catch (error) {
    console.error("searchProducts error:", error);
    return { success: false, error: "Search failed" };
  }
}

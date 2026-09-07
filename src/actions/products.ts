"use server";
import prisma from "@/lib/prisma";
import type { ProductModel as Product } from "@/generated/prisma/models/Product";
import type { ImageModel } from "@/generated/prisma/models/Image";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── Helper to serialize Prisma special types to plain JS types ───────────────
function serializeProduct<
  T extends { price: any; createdAt: Date; updatedAt: Date; images?: any[] },
>(product: T) {
  return {
    ...product,
    price: Number(product.price), // Convert Decimal to plain Number
    createdAt: product.createdAt.toISOString(), // Convert Date to string
    updatedAt: product.updatedAt.toISOString(), // Convert Date to string
  };
}

// ---------- GET ALL ----------
export type ProductWithImages = Product & { images: ImageModel[] };

export async function getAllProducts(): Promise<
  ActionResult<ProductWithImages[]>
> {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
      },
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });

    // Serialize the array of products
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

    // Serialize the array of products
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

// ---------- GET ONE ----------
export async function getProduct(id: number): Promise<ActionResult<Product>> {
  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
      include: { images: true },
    });

    // Serialize the single product
    return {
      success: true,
      data: serializeProduct(product) as unknown as Product,
    };
  } catch (error) {
    console.error("getProduct error:", error);
    return { success: false, error: "Product not found" };
  }
}

// ---------- SEARCH ----------
export async function searchProducts(
  query: string,
): Promise<ActionResult<Product[]>> {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });

    // Serialize the search results
    const serializedProducts = products.map(serializeProduct);

    return { success: true, data: serializedProducts as unknown as Product[] };
  } catch (error) {
    console.error("searchProducts error:", error);
    return { success: false, error: "Search failed" };
  }
}

// actions/cart.ts (full updated file)

"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./products";

// ---------- PUBLIC CART ACTIONS (for logged-in users) ----------

async function getCurrentUserId() {
  // Replace with your actual auth logic
  return 1; // Mock
}

export async function addToCart(productId: number, quantity: number = 1) {
  try {
    const userId = await getCurrentUserId();

    let cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
      update: { quantity: { increment: quantity } },
      create: { cartId: cart.id, productId, quantity },
    });

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return { success: false, error: "Failed to add to cart" };
  }
}

export async function getCart() {
  try {
    const userId = await getCurrentUserId();
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
          },
        },
      },
    });
    return { success: true, data: cart };
  } catch (error) {
    console.error("getCart error:", error);
    return { success: false, error: "Failed to fetch cart" };
  }
}

export async function updateCartItemQuantity(
  cartItemId: number,
  quantity: number,
) {
  try {
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("updateCartItemQuantity error:", error);
    return { success: false, error: "Failed to update cart" };
  }
}

export async function removeFromCart(cartItemId: number) {
  try {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("removeFromCart error:", error);
    return { success: false, error: "Failed to remove from cart" };
  }
}

// ---------- ADMIN CART ACTIONS ----------

export type CartWithDetails = {
  id: number;
  userId: number;
  user: {
    id: number;
    name: string;
    role: string;
  };
  items: {
    id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
      images: { url: string }[];
    };
  }[];
  createdAt: string;
  updatedAt: string;
};

export async function getAllCarts(): Promise<ActionResult<CartWithDetails[]>> {
  try {
    const carts = await prisma.cart.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const serializedCarts = carts.map((cart) => ({
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
      })),
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
    }));

    return { success: true, data: serializedCarts as CartWithDetails[] };
  } catch (error) {
    console.error("getAllCarts error:", error);
    return { success: false, error: "Failed to fetch carts" };
  }
}

export async function searchCarts(
  query: string,
): Promise<ActionResult<CartWithDetails[]>> {
  try {
    const isNumeric = !isNaN(Number(query));
    const carts = await prisma.cart.findMany({
      where: {
        OR: [
          { user: { name: { contains: query, mode: "insensitive" } } },
          ...(isNumeric ? [{ user: { id: Number(query) } }] : []),
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const serializedCarts = carts.map((cart) => ({
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
      })),
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
    }));

    return { success: true, data: serializedCarts as CartWithDetails[] };
  } catch (error) {
    console.error("searchCarts error:", error);
    return { success: false, error: "Failed to search carts" };
  }
}

export async function getCartTotal(cartId: number): Promise<number> {
  try {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart) return 0;

    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
    return total;
  } catch (error) {
    console.error("getCartTotal error:", error);
    return 0;
  }
}

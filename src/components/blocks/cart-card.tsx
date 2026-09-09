"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formattedPrice } from "@/lib/utils";
import { updateCartItemQuantity, removeFromCart } from "@/actions/cart";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { toast } from "@/components/ui/toast";

interface CartCardProps {
  item: {
    id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
      images: { url: string; isCover: boolean }[];
    };
  };
  onRemoved: () => void;
}

export function CartCard({ item, onRemoved }: CartCardProps) {
  const { id: cartItemId, quantity: initialQuantity, product } = item;
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [imgError, setImgError] = useState(false);

  const coverImage =
    product.images.find((img) => img.isCover)?.url ||
    product.images[0]?.url ||
    "https://placehold.co/400x400?text=No+Image";

  const fallbackImage = "https://placehold.co/400x400?text=No+Image";

  // Debug: log the image URL to check correctness
  useEffect(() => {
    console.log("Cart image URL:", coverImage);
  }, [coverImage]);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    const previousQuantity = quantity;
    setQuantity(newQuantity);

    try {
      const result = await updateCartItemQuantity(cartItemId, newQuantity);
      if (!result.success) {
        setQuantity(previousQuantity);
        toast.add({
          title: "Update Failed",
          description: result.error || "Could not update quantity",
          type: "error",
        });
      }
    } catch (error) {
      setQuantity(previousQuantity);
      toast.add({
        title: "Error",
        description: "An unexpected error occurred",
        type: "error",
      });
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const result = await removeFromCart(cartItemId);
      if (result.success) {
        onRemoved();
        toast.add({
          title: "Removed",
          description: "Item removed from your cart",
          type: "success",
        });
      } else {
        setIsRemoving(false);
        toast.add({
          title: "Error",
          description: result.error || "Failed to remove item",
          type: "error",
        });
      }
    } catch (error) {
      setIsRemoving(false);
      toast.add({
        title: "Error",
        description: "An unexpected error occurred",
        type: "error",
      });
      console.error(error);
    }
  };

  // If image fails to load, we fallback to a regular <img> tag
  // This bypasses Next.js image optimization entirely.
  if (imgError) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0, padding: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card"
      >
        {/* Fallback image using <img> */}
        <div className="relative w-full sm:w-32 h-32 shrink-0 overflow-hidden rounded-md bg-muted">
          <img
            src={fallbackImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Rest of the card unchanged */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <Link
              href={`/${product.id}`}
              className="font-semibold text-lg hover:underline"
            >
              {product.name}
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              {formattedPrice(product.price)}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(quantity - 1)}
                disabled={isUpdating || isRemoving || quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(quantity + 1)}
                disabled={isUpdating || isRemoving}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold">
                {formattedPrice(product.price * quantity)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={handleRemove}
                disabled={isRemoving}
                aria-label="Remove item"
              >
                {isRemoving ? (
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0, padding: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card"
    >
      {/* Product Image with Next.js Image, unoptimized to bypass optimization */}
      <div className="relative w-full sm:w-32 h-32 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={coverImage}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized={true} // <--- bypass Next.js image optimization
          onError={() => setImgError(true)}
        />
      </div>

      {/* Product Details (same as above, but keep DRY – you could extract to a subcomponent) */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <Link
            href={`/${product.id}`}
            className="font-semibold text-lg hover:underline"
          >
            {product.name}
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            {formattedPrice(product.price)}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUpdateQuantity(quantity - 1)}
              disabled={isUpdating || isRemoving || quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUpdateQuantity(quantity + 1)}
              disabled={isUpdating || isRemoving}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold">
              {formattedPrice(product.price * quantity)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={handleRemove}
              disabled={isRemoving}
              aria-label="Remove item"
            >
              {isRemoving ? (
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

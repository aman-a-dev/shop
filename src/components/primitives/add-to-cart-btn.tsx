"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { addToCart } from "@/actions/cart";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "@/components/ui/toast"; // Adjust path if your toast file is elsewhere

interface AddToCartButtonProps {
  productId: number;
  isOutOfStock: boolean;
  variant?: "default" | "icon";
  className?: string;
}

export function AddToCartButton({
  productId,
  isOutOfStock,
  variant = "default",
  className,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isLoading) return;

    setIsLoading(true);
    try {
      const result = await addToCart(productId, 1);
      if (result.success) {
        setIsAdded(true);
        toast.add({
          title: "Added to cart",
          description: "Product has been added to your cart.",
          type: "success",
        });
        setTimeout(() => setIsAdded(false), 2000); // Reset icon after 2s
      } else {
        toast.add({
          title: "Error",
          description: result.error || "Failed to add to cart",
          type: "error",
        });
      }
    } catch (error) {
      toast.add({
        title: "Error",
        description: "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        size="icon"
        variant="secondary"
        disabled={isOutOfStock || isLoading}
        onClick={handleAddToCart}
        className={className}
        aria-label="Add to cart"
      >
        <AnimatePresence mode="wait">
          {isAdded ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="h-4 w-4 text-green-600" />
            </motion.div>
          ) : (
            <motion.div
              key="cart"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ShoppingCart className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    );
  }

  return (
    <Button
      disabled={isOutOfStock || isLoading}
      onClick={handleAddToCart}
      className={className}
    >
      <AnimatePresence mode="wait">
        {isAdded ? (
          <motion.span
            key="added"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" /> Added
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}

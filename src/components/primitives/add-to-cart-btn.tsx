"use client";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  productId: number;
  isOutOfStock: boolean;
  /** "lg" = full-width labeled button (product page). "icon" = compact circular button (card). */
  variant?: "lg" | "icon";
  className?: string;
}

export function AddToCartButton({
  productId,
  isOutOfStock,
  variant = "lg",
  className,
}: AddToCartButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    // TODO: wire this up to your cart store / server action
    console.log("Add to cart:", productId);
  };

  if (variant === "icon") {
    return (
      <Button
        size="icon"
        disabled={isOutOfStock}
        onClick={handleClick}
        aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
        className={cn("h-8 w-8 rounded-full shadow-sm", className)}
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className={cn("w-full gap-2", className)}
      disabled={isOutOfStock}
      onClick={handleClick}
    >
      <ShoppingCart className="h-5 w-5" />
      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}

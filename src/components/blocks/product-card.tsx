"use client";

import { cn } from "cn";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/primitives/add-to-cart-btn";
import { useFavorites } from "@/context/favourites-context";
import { Heart } from "lucide-react";
import type { ProductModel } from "@/generated/prisma/models/Product";
import type { ImageModel } from "@/generated/prisma/models/Image";
import { formattedPrice } from "@/lib/utils";

type ProductWithImages = ProductModel & { images: ImageModel[] };

interface ProductCardProps {
  product: ProductWithImages;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { id, name, description, price, stock, status, images } = product;
  const { isFavourite, toggleFavourite } = useFavorites();

  const favourited = isFavourite(String(id));
  const coverImage =
    images.find((img: ImageModel) => img.isCover)?.url || images[0]?.url;

  const isOutOfStock = status === "OUT_OF_STOCK" || stock === 0;
  const isLowStock = !isOutOfStock && stock > 0 && stock <= 5;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite(String(id));
  };

  return (
    <Link href={`/${id}`} className="group block w-full max-w-52.5">
      <Card
        size="sm"
        className={cn(
          "gap-0 pt-0 ring-foreground/10 transition-all duration-200 hover:shadow-md hover:ring-foreground/20",
          className,
        )}
      >
        {/* Image */}
        <div className="relative w-full overflow-hidden bg-linear-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
          {coverImage ? (
            <img
              src={coverImage}
              onError={() => alert("error")}
              alt={name}
              loading="lazy"
              className={cn(
                "h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.06]",
                isOutOfStock && "opacity-40 grayscale",
              )}
            />
          ) : (
            <img
              src="https://placehold.co/400x400?text=No+Image"
              alt="No Image"
              loading="lazy"
              className={cn(
                "h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.06]",
              )}
            />
          )}

          {/* Scrim so floating controls stay legible over bright photos */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-black/15 to-transparent" />

          {/* Status badge */}
          {isOutOfStock && (
            <span className="absolute left-2 top-2 rounded-full bg-neutral-900/85 px-2 py-0.5 text-[10px] font-medium text-white">
              Sold out
            </span>
          )}
          {isLowStock && (
            <span className="absolute left-2 top-2 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-medium text-white">
              Only {stock} left
            </span>
          )}

          {/* Favorite button — always visible so state is glanceable */}
          <Button
            size="icon"
            variant="secondary"
            onClick={handleToggleFavorite}
            aria-label={
              favourited ? "Remove from favorites" : "Add to favorites"
            }
            aria-pressed={favourited}
            className="absolute right-2 top-2 h-8 w-8 rounded-full shadow-sm"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                favourited && "fill-red-500 text-red-500",
              )}
            />
          </Button>

          {/* Add to cart — always visible so it works on touch devices */}
          <AddToCartButton
            productId={id}
            isOutOfStock={isOutOfStock}
            variant="icon"
            className="absolute bottom-2 right-2"
          />
        </div>

        {/* Header: name + description */}
        <CardHeader className="gap-0.5 px-3 pt-2.5">
          <CardTitle className="truncate text-[13px] font-medium leading-tight">
            {name}
          </CardTitle>
          <CardDescription className="truncate text-xs">
            {description}
          </CardDescription>
        </CardHeader>

        {/* Content: price */}
        <CardContent className="px-3 pt-1">
          <span className="text-sm font-semibold text-foreground">
            {formattedPrice(Number(price))}
          </span>
        </CardContent>

        {/* Footer: stock status */}
        <CardFooter className="px-3 pb-2.5 pt-0">
          {!isOutOfStock && (
            <span className="text-[11px] text-muted-foreground">
              {stock} in stock
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

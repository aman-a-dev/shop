"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/context/favourites-context";
import { getAllProducts, type ProductWithImages } from "@/actions/products";
import { ProductCard } from "@/components/blocks/product-card";
import { Heart } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";

export default function FavoritesPage() {
  const { favourites } = useFavorites();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const result = await getAllProducts();
      if (result.success) {
        setProducts(result.data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Filter products to only show those in the favourites array
  const favoriteProducts = products.filter((p) =>
    favourites.includes(String(p.id)),
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">My Favorites</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card shadow-sm overflow-hidden"
            >
              <Skeleton className="aspect-5/4 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">My Favorites</h1>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Heart className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No favorites yet</EmptyTitle>
            <EmptyDescription>
              Start adding products to your favorites to see them here.
            </EmptyDescription>
          </EmptyHeader>
          <div className="flex justify-center mt-4">
            <Link href="/" className={buttonVariants()}>
              Browse Products
            </Link>
          </div>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">My Favorites</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {favoriteProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

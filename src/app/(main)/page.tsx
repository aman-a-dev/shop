import { Suspense } from "react";
import { Package, AlertCircle } from "lucide-react";

import { getAllProducts } from "@/actions/products";
import { ProductCard } from "@/components/blocks/product-card";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Product Grid (async server component) ───────────────────────
async function ProductGrid() {
  const result = await getAllProducts();

  if (!result.success) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>Failed to load products</EmptyTitle>
          <EmptyDescription>{result.error}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const products = result.data;

  if (products.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Package className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>No products found</EmptyTitle>
          <EmptyDescription>
            Check back later for new arrivals.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ─── Skeleton Fallback ───────────────────────────────────────────
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border bg-card shadow-sm overflow-hidden"
        >
          <Skeleton className="aspect-5/4 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────
export default async function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Our Products</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
    </div>
  );
}

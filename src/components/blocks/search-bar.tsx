"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "cn";

import { getAllProducts } from "@/actions/products";
import { ProductCard } from "@/components/blocks/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import type { ProductWithImages } from "@/actions/products";
import { formattedPrice } from "@/lib/utils";

export function SearchBar() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const result = await getAllProducts();
      if (result.success) {
        setProducts(result.data);
        if (result.data.length > 0) {
          const prices = result.data.map((p) => Number(p.price));
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceRange([min, max]);
        }
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);
      const price = Number(p.price);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      return matchesQuery && matchesPrice;
    });
  }, [products, searchTerm, priceRange]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [],
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  // FIX: accept the correct union type
  const handlePriceChange = useCallback((value: number | readonly number[]) => {
    const range = Array.isArray(value) ? value : [value, value];
    setPriceRange([range[0], range[1]]);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mx-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 mx-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="mb-2 break-inside-avoid rounded-lg aspect-3/4"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <X className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>Failed to load products</EmptyTitle>
          <EmptyDescription>{error}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const minPrice = products.length
    ? Math.min(...products.map((p) => Number(p.price)))
    : 0;
  const maxPrice = products.length
    ? Math.max(...products.map((p) => Number(p.price)))
    : 1000;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mx-4">
        <div className="relative flex-1  bg-background">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9 pr-9 "
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle price filter"
          className={cn(showFilters && "bg-accent")}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price range</span>
                  <span className="font-medium">
                    {formattedPrice(priceRange[0])} –{" "}
                    {formattedPrice(priceRange[1])}
                  </span>
                </div>
                <Slider
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={handlePriceChange}
                  min={minPrice}
                  max={maxPrice}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formattedPrice(minPrice)}</span>
                  <span>{formattedPrice(maxPrice)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No products found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search or price filter.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.03,
                  ease: "easeOut",
                }}
                className="mb-2 break-inside-avoid"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

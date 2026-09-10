import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/primitives/add-to-cart-btn";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formattedPrice } from "@/lib/utils";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = parseInt(slug, 10);

  if (isNaN(id)) notFound();

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) notFound();

  const sortedImages = [...product.images].sort((a, b) => {
    if (a.isCover) return -1;
    if (b.isCover) return 1;
    return 0;
  });

  const images =
    sortedImages.length > 0
      ? sortedImages.map((img) => img.url)
      : ["https://placehold.co/1000x1000?text=No+Image"];

  const isOutOfStock = product.status === "OUT_OF_STOCK" || product.stock === 0;

  return (
    <div className="min-h-screen bg-muted/30 py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ─── Image Carousel ─────────────────────────────── */}
          <div className="w-full">
            <Carousel
              opts={{ align: "start", loop: images.length > 1 }}
              className="w-full"
            >
              {/* Fixed aspect ratio keeps every slide the same height */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted shadow-lg">
                <CarouselContent className="h-full">
                  {images.map((url, index) => (
                    <CarouselItem key={index} className="h-full basis-full">
                      <div className="relative h-full w-full">
                        <img
                          src={url}
                          alt={`${product.name} - image ${index + 1}`}
                          className="absolute inset-0 h-full w-full object-cover"
                          // use object-contain if you'd rather letterbox than crop:
                          // className="absolute inset-0 h-full w-full object-contain bg-muted"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </div>

              {/* Controls row at the bottom */}
              {images.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <CarouselPrevious
                    variant="outline"
                    className="static translate-y-0 h-9 w-9 rounded-full"
                  />
                  {/* Optional: page indicator */}
                  <span className="text-xs text-muted-foreground tabular-nums">
                    Swipe to browse
                  </span>
                  <CarouselNext
                    variant="outline"
                    className="static translate-y-0 h-9 w-9 rounded-full"
                  />
                </div>
              )}
            </Carousel>

            {/* Optional thumbnail strip */}
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {images.slice(0, 5).map((url, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-md border bg-muted"
                  >
                    <img
                      src={url}
                      alt={`thumb ${i + 1}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Details Card ───────────────────────────────── */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                {product.name}
              </CardTitle>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant={isOutOfStock ? "destructive" : "default"}>
                  {isOutOfStock ? "Out of Stock" : "In Stock"}
                </Badge>
                <Badge variant="outline">{product.status}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 flex-1">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-baseline flex-col lg:flex-row gap-3">
                <span className="text-4xl font-bold text-primary">
                  {formattedPrice(Number(product.price))}
                </span>
                {product.stock > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {product.stock} units available
                  </span>
                )}
              </div>

              <div className="pt-4 border-t mt-auto">
                <AddToCartButton
                  productId={product.id}
                  isOutOfStock={isOutOfStock}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

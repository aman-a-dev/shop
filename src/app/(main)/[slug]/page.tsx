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

// ─── Page ────────────────────────────────────────────────────────
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = parseInt(slug, 10);

  if (isNaN(id)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) {
    notFound();
  }

  // Order images: cover first, then the rest
  const sortedImages = product.images.sort((a, b) => {
    if (a.isCover) return -1;
    if (b.isCover) return 1;
    return 0;
  });

  // If no images, use a placeholder
  const images =
    sortedImages.length > 0
      ? sortedImages.map((img) => img.url)
      : ["https://placehold.co/1000x1000?text=No+Image"];

  const isOutOfStock = product.status === "OUT_OF_STOCK" || product.stock === 0;

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted shadow-lg">
            <Carousel className="h-full w-full">
              <CarouselContent>
                {images.map((url, index) => (
                  <CarouselItem key={index} className="h-full">
                    <div className="relative h-full w-full">
                      <img
                        src={url}
                        alt={`${product.name} - image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Only show navigation if more than one image */}
              {images.length > 1 && (
                <>
                  <CarouselPrevious
                    variant="secondary"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-70 hover:opacity-100"
                  />
                  <CarouselNext
                    variant="secondary"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-70 hover:opacity-100"
                  />
                </>
              )}
            </Carousel>
            {/* Optional: image counter or dots could be added here */}
          </div>

          {/* Details Card */}
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

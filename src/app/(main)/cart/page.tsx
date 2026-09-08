import { Suspense } from "react";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { getCart } from "@/actions/cart"; // now exported
import { CartList } from "@/components/blocks/cart-list";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { formattedPrice } from "@/lib/utils";

async function CartContent() {
  const result = await getCart();
  const phoneNo = "251902991919";
  if (!result.success) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>Failed to load cart</EmptyTitle>
          <EmptyDescription>{result.error}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const cart = result.data;

  if (!cart || cart.items.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShoppingCart className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>Your cart is empty</EmptyTitle>
          <EmptyDescription>
            Looks like you haven&apos;t added anything to your cart yet.
          </EmptyDescription>
        </EmptyHeader>
        <div className="flex justify-center mt-4">
          <Link href="/" className={buttonVariants()}>
            Continue Shopping
          </Link>
        </div>
      </Empty>
    );
  }

  // Serialize Decimal to Number
  const serializedItems = cart.items.map((item) => ({
    ...item,
    product: {
      ...item.product,
      price: Number(item.product.price),
    },
  }));

  const total = serializedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="space-y-6">
      <CartList initialItems={serializedItems} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg bg-card">
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{formattedPrice(total)}</p>
        </div>
        <Button
          render={<a href={`tel:${phoneNo}`} />}
          size="lg"
          className="w-full sm:w-auto"
        >
          Buy Now
        </Button>
        <p className="text-xs text-center">To buy call to {phoneNo} now.</p>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg"
        >
          <Skeleton className="w-full sm:w-32 h-32 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full sm:w-1/3 mt-4" />
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center p-4 border rounded-lg mt-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}

export default async function CartPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Shopping Cart</h1>
      <Suspense fallback={<CartSkeleton />}>
        <CartContent />
      </Suspense>
    </div>
  );
}

export const dynamic = "force-dynamic";

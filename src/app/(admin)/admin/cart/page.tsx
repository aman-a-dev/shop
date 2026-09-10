"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getAllCarts, searchCarts, type CartWithDetails } from "@/actions/cart";
import { getCartTotal } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { Loader2, ShoppingCart, User, Copy, Check } from "lucide-react";
import { SearchBar } from "@/components/blocks/search";

// Inner component that uses useSearchParams
function CartsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [carts, setCarts] = useState<CartWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCart, setSelectedCart] = useState<CartWithDetails | null>(
    null,
  );
  const [cartTotal, setCartTotal] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchCarts = async (query?: string) => {
    setLoading(true);
    const result = query ? await searchCarts(query) : await getAllCarts();
    if (result.success) {
      setCarts(result.data);
    } else {
      toast.add({ type: "error", title: "Error", description: result.error });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCarts(searchQuery);
  }, [searchQuery]);

  const handleViewCart = async (cart: CartWithDetails) => {
    setSelectedCart(cart);
    const total = await getCartTotal(cart.id);
    setCartTotal(total);
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Carts</h1>
        <SearchBar placeholder="Search by user name or ID..." />
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cart ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="mx-auto size-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : carts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No carts found.
                </TableCell>
              </TableRow>
            ) : (
              carts.map((cart) => {
                const itemCount = cart.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                );
                const total = cart.items.reduce(
                  (sum, item) =>
                    sum + Number(item.product.price) * item.quantity,
                  0,
                );
                return (
                  <TableRow key={cart.id}>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-2">
                        #{cart.id}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6"
                          onClick={() =>
                            copyToClipboard(String(cart.id), cart.id)
                          }
                        >
                          {copiedId === cart.id ? (
                            <Check className="size-3 text-green-500" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        <span className="font-medium">{cart.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          (ID: {cart.user.id})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{itemCount}</TableCell>
                    <TableCell>${total.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(cart.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCart(cart)}
                      >
                        <ShoppingCart className="mr-2 size-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedCart}
        onOpenChange={(open) => !open && setSelectedCart(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Cart #{selectedCart?.id} - {selectedCart?.user.name}
            </DialogTitle>
          </DialogHeader>
          {selectedCart && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                User: {selectedCart.user.name} (ID: {selectedCart.user.id},
                Role: {selectedCart.user.role})
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCart.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.product.name}
                        </TableCell>
                        <TableCell>
                          ETB {Number(item.product.price).toFixed(2)}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          ETB
                          {(Number(item.product.price) * item.quantity).toFixed(
                            2,
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ${cartTotal !== null ? cartTotal.toFixed(2) : "..."}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Main page with Suspense boundary
export default function CartsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-60">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <CartsContent />
    </Suspense>
  );
}

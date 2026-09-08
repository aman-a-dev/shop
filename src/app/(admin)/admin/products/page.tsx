// app/(admin)/admin/products/page.tsx
"use client";

import { Suspense } from "react";
import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import {
  getAllProductsAdmin,
  searchProducts,
  type ProductWithImages,
} from "@/actions/products";
import { createProduct, updateProduct, deleteProduct } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { Plus, Pencil, Trash2, Loader2, Copy, Check } from "lucide-react";

import { SearchBar } from "@/components/blocks/search";
import { ConfirmDialog } from "@/components/blocks/confirm-dialog";
import { ImageUpload } from "@/components/blocks/image-upload";

// Inner component that uses useSearchParams
function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] =
    useState<ProductWithImages | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchProducts = async (query?: string) => {
    setLoading(true);
    const result = query
      ? await searchProducts(query)
      : await getAllProductsAdmin();
    if (result.success) {
      setProducts(result.data as ProductWithImages[]);
    } else {
      toast.add({ type: "error", title: "Error", description: result.error });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(searchQuery);
  }, [searchQuery]);

  const handleDelete = async (id: number) => {
    const result = await deleteProduct(id);
    if (result.success) {
      toast.add({
        type: "success",
        title: "Success",
        description: "Product deleted successfully",
      });
      fetchProducts(searchQuery);
    } else {
      toast.add({ type: "error", title: "Error", description: result.error });
    }
    setDeletingId(null);
  };

  const handleToggleStatus = async (product: ProductWithImages) => {
    const newStatus = product.status === "ACTIVE" ? "OUT_OF_STOCK" : "ACTIVE";
    const result = await updateProduct(product.id, { status: newStatus });
    if (result.success) {
      toast.add({
        type: "success",
        title: "Success",
        description: `Product status updated to ${newStatus}`,
      });
      fetchProducts(searchQuery);
    } else {
      toast.add({ type: "error", title: "Error", description: result.error });
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center flex-col justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <div className="flex items-center gap-4">
          <SearchBar placeholder="Search by name, description, or ID..." />
          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <Loader2 className="mx-auto size-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      {product.id}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() =>
                          copyToClipboard(String(product.id), product.id)
                        }
                      >
                        {copiedId === product.id ? (
                          <Check className="size-3 text-green-500" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {product.description}
                  </TableCell>
                  <TableCell>ETB {Number(product.price).toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.status === "ACTIVE"}
                        onCheckedChange={() => handleToggleStatus(product)}
                      />
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.status === "ACTIVE"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <div className="flex -space-x-2">
                        {product.images.slice(0, 3).map((img, i) => (
                          <img
                            key={i}
                            src={img.url}
                            alt=""
                            className="size-8 rounded-full border-2 border-background object-cover"
                          />
                        ))}
                        {product.images.length > 3 && (
                          <span className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                            +{product.images.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        None
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setDeletingId(product.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProductForm
        product={editingProduct}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          setIsDialogOpen(false);
          fetchProducts(searchQuery);
        }}
      />

      <ConfirmDialog
        open={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}

// ProductForm component (unchanged, but keep it inside same file)
// ProductForm component (updated)
function ProductForm({
  product,
  open,
  onOpenChange,
  onSuccess,
}: {
  product: ProductWithImages | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images?.map((img) => img.url) || [],
  );

  // Sync imageUrls when product changes (e.g., editing different product)
  useEffect(() => {
    setImageUrls(product?.images?.map((img) => img.url) || []);
  }, [product]);

  const [, formAction] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const data = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        stock: parseInt(formData.get("stock") as string, 10),
        status: formData.get("status") as "ACTIVE" | "OUT_OF_STOCK",
        images: imageUrls.map((url) => ({ url, isCover: false })),
      };

      let result;
      if (product) {
        const { images, ...updateData } = data;
        // images is sent as part of data; updateProduct will handle syncing
        result = await updateProduct(product.id, data);
      } else {
        result = await createProduct(data);
      }

      if (result.success) {
        toast.add({
          type: "success",
          title: "Success",
          description: product
            ? "Product updated successfully"
            : "Product created successfully",
        });
        onSuccess();
        return { success: true };
      } else {
        toast.add({ type: "error", title: "Error", description: result.error });
        return { success: false, error: result.error };
      }
    },
    null,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {/* ... other fields unchanged ... */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Images</label>
            <ImageUpload
              value={imageUrls}
              onChange={setImageUrls}
              maxImages={5}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 size-4 animate-spin" />}
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

// Main page with Suspense boundary
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-60">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

"use client";
import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { getAllProductsAdmin, ProductWithImages } from "@/actions/products";
import { createProduct, updateProduct, deleteProduct } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] =
    useState<ProductWithImages | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await getAllProductsAdmin();
    if (result.success) {
      setProducts(result.data as ProductWithImages[]);
    } else {
      toast.add({ type: "error", title: "Error", description: result.error });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const result = await deleteProduct(id);
    if (result.success) {
      toast.add({
        type: "success",
        title: "Success",
        description: "Product deleted successfully",
      });
      fetchProducts();
    } else {
      toast.add({ type: "error", title: "Error", description: result.error });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 size-4" /> Add Product
        </Button>
      </div>

      {isDialogOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => {
            setIsDialogOpen(false);
            fetchProducts();
          }}
        />
      )}

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="mx-auto size-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.status === "ACTIVE" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}
                    >
                      {product.status}
                    </span>
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
                        onClick={() => handleDelete(product.id)}
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
    </div>
  );
}

function ProductForm({
  product,
  onClose,
  onSuccess,
}: {
  product: ProductWithImages | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [, formAction] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const data = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        stock: parseInt(formData.get("stock") as string, 10),
        status: formData.get("status") as "ACTIVE" | "OUT_OF_STOCK",
        images: formData.get("images")
          ? (formData.get("images") as string)
              .split("\n")
              .map((url) => ({ url: url.trim(), isCover: false }))
              .filter((u) => u.url)
          : [],
      };

      let result;
      if (product) {
        // Images are omitted during update as per admin.ts comments
        const { images, ...updateData } = data;
        result = await updateProduct(product.id, updateData);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {product ? "Edit Product" : "Create Product"}
        </h2>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input name="name" defaultValue={product?.name} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              defaultValue={product?.description}
              required
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                name="price"
                type="number"
                step="0.01"
                defaultValue={Number(product?.price)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock</label>
              <Input
                name="stock"
                type="number"
                defaultValue={product?.stock}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              defaultValue={product?.status || "ACTIVE"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
            </select>
          </div>
          {!product && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Image URLs (one per line)
              </label>
              <textarea
                name="images"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              />
            </div>
          )}
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
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

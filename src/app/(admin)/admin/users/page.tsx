// app/(admin)/admin/users/page.tsx
"use client";

import { Suspense } from "react";
import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { getUsers, createUser, updateUser, deleteUser } from "@/actions/admin";
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
import type { UserModel as User } from "@/generated/prisma/models/User";

// Inner component that uses useSearchParams
function UsersContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<
    "id" | "username" | "telegramId" | null
  >(null);

  const fetchUsers = async (query?: string) => {
    setLoading(true);
    const result = await getUsers(query);
    if (result.success) {
      setUsers(result.data as User[]);
    } else {
      toast.add({ type: "error", title: "Error", description: result.error });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(searchQuery);
  }, [searchQuery]);

  const handleDelete = async (id: number) => {
    const result = await deleteUser(id);
    if (result.success) {
      toast.add({
        type: "success",
        title: "Success",
        description: "User deleted successfully",
      });
      fetchUsers(searchQuery);
    } else {
      toast.add({ type: "error", title: "Error", description: result.error });
    }
    setDeletingId(null);
  };

  const copyToClipboard = (
    text: string,
    id: number,
    field: "id" | "username" | "telegramId",
  ) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedId(null);
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <div className="flex items-center gap-4">
          <SearchBar placeholder="Search by name, username, telegram ID, or ID..." />
          <Button
            onClick={() => {
              setEditingUser(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" /> Add User
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Telegram ID</TableHead>
              <TableHead>Avatar</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Loader2 className="mx-auto size-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      {user.id}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() =>
                          copyToClipboard(String(user.id), user.id, "id")
                        }
                      >
                        {copiedId === user.id && copiedField === "id" ? (
                          <Check className="size-3 text-green-500" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    {user.username ? (
                      <div className="flex items-center gap-2">
                        <span>{user.username}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6"
                          onClick={() =>
                            copyToClipboard(user.username!, user.id, "username")
                          }
                        >
                          {copiedId === user.id &&
                          copiedField === "username" ? (
                            <Check className="size-3 text-green-500" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.telegramId ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">
                          {user.telegramId}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6"
                          onClick={() =>
                            copyToClipboard(
                              user.telegramId!,
                              user.id,
                              "telegramId",
                            )
                          }
                        >
                          {copiedId === user.id &&
                          copiedField === "telegramId" ? (
                            <Check className="size-3 text-green-500" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        None
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingUser(user);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setDeletingId(user.id)}
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

      <UserForm
        user={editingUser}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          setIsDialogOpen(false);
          fetchUsers(searchQuery);
        }}
      />

      <ConfirmDialog
        open={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}

// UserForm component (unchanged)
function UserForm({
  user,
  open,
  onOpenChange,
  onSuccess,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [, formAction] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const data = {
        name: formData.get("name") as string,
        username: (formData.get("username") as string) || undefined,
        telegramId: (formData.get("telegramId") as string) || undefined,
        role: formData.get("role") as "USER" | "ADMIN",
      };

      const result = user
        ? await updateUser(user.id, data)
        : await createUser(data);

      if (result.success) {
        toast.add({
          type: "success",
          title: "Success",
          description: user
            ? "User updated successfully"
            : "User created successfully",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input name="name" defaultValue={user?.name} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input
              name="username"
              defaultValue={user?.username || ""}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telegram ID</label>
            <Input
              name="telegramId"
              defaultValue={user?.telegramId || ""}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select
              name="role"
              defaultValue={user?.role || "USER"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
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
export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-60">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <UsersContent />
    </Suspense>
  );
}

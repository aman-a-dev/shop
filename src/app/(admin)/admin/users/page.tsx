"use client";
import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
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
import { toast } from "@/components/ui/toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { UserModel as User } from "@/generated/prisma/models/User";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await getUsers();
    if (result.success) {
      setUsers(result.data as User[]);
    } else {
      toast.add({ type: "error", title: "Error", description: result.error });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const result = await deleteUser(id);
    if (result.success) {
      toast.add({
        type: "success",
        title: "Success",
        description: "User deleted successfully",
      });
      fetchUsers();
    } else {
      toast.add({ type: "error", title: "Error", description: result.error });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button
          onClick={() => {
            setEditingUser(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 size-4" /> Add User
        </Button>
      </div>

      {isDialogOpen && (
        <UserForm
          user={editingUser}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => {
            setIsDialogOpen(false);
            fetchUsers();
          }}
        />
      )}

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Loader2 className="mx-auto size-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === "ADMIN" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
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
                        onClick={() => handleDelete(user.id)}
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

function UserForm({
  user,
  onClose,
  onSuccess,
}: {
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [, formAction] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const data = {
        name: formData.get("name") as string,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {user ? "Edit User" : "Create User"}
        </h2>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input name="name" defaultValue={user?.name} required />
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

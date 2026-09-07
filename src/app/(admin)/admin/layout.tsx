import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex h-12 items-center px-4 font-bold text-xl text-foreground">
              Admin Panel
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="ml-3">
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 w-full"
                    />
                  }
                  tooltip="Dashboard"
                >
                  <LayoutDashboard className="size-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href="/admin/users"
                      className="flex items-center gap-2 w-full"
                    />
                  }
                  tooltip="Users"
                >
                  <Users className="size-4" />
                  <span>Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href="/admin/products"
                      className="flex items-center gap-2 w-full"
                    />
                  }
                  tooltip="Products"
                >
                  <Package className="size-4" />
                  <span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href="/admin/cart"
                      className="flex items-center gap-2 w-full"
                    />
                  }
                  tooltip="Carts"
                >
                  <ShoppingCart className="size-4" />
                  <span>Carts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href="/admin/cart"
                      className="flex items-center gap-2 w-full"
                    />
                  }
                  tooltip="Carts"
                >
                  <User className="size-4" />
                  <span>Switch to User</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4 text-sm text-muted-foreground">
              Admin Dashboard
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </TooltipProvider>
  );
}

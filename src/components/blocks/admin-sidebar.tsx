"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/cart", label: "Carts", icon: ShoppingCart },
  { href: "/", label: "Switch to User", icon: User },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenu className="ml-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              render={
                <Link
                  href={item.href}
                  className="flex items-center gap-2 w-full"
                  onClick={handleLinkClick}
                />
              }
              tooltip={item.label}
              isActive={isActive}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

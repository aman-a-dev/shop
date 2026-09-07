"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Heart, ShoppingCart, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  color: string;
  activeColor: string;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    icon: Home,
    href: "/",
    color: "text-muted-foreground",
    activeColor: "text-primary",
  },
  {
    label: "Favourites",
    icon: Heart,
    href: "/favourites",
    color: "text-muted-foreground",
    activeColor: "text-rose-500",
  },
  {
    label: "Cart",
    icon: ShoppingCart,
    href: "/cart",
    color: "text-muted-foreground",
    activeColor: "text-emerald-500",
  },
  {
    label: "Profile",
    icon: User,
    href: "/profile",
    color: "text-muted-foreground",
    activeColor: "text-violet-500",
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Glassmorphism background */}
      <div className="mx-4 mb-4">
        <div className="relative">
          {/* Background with blur effect */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl shadow-black/10" />

          {/* Animated background pill for active/hover state */}
          <AnimatePresence>
            {(hoveredIndex !== null ||
              navItems.findIndex((item) => item.href === pathname) !== -1) && (
              <motion.div
                className="absolute top-2 bottom-2 rounded-2xl bg-muted/50"
                initial={false}
                animate={{
                  x: `${(hoveredIndex ?? navItems.findIndex((item) => item.href === pathname)) * 100}%`,
                  width: `${100 / navItems.length}%`,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ left: 0 }}
              />
            )}
          </AnimatePresence>

          {/* Nav items */}
          <div className="relative flex items-center justify-around px-2 py-3">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className={cn(
                    "relative flex flex-col items-center justify-center w-full py-2 px-3",
                    "transition-colors duration-200",
                    isActive ? item.activeColor : item.color,
                  )}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Icon with bounce animation */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={cn(
                        "transition-all duration-300",
                        isActive && "drop-shadow-sm",
                      )}
                    />
                  </motion.div>

                  {/* Label with slide animation */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="text-[10px] font-medium mt-1"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className={cn(
                        "absolute -bottom-1 w-1 h-1 rounded-full",
                        item.activeColor.replace("text-", "bg-"),
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Heart,
  ShoppingCart,
  User,
  Plus,
  Headphones,
  Mail,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BottomNavWithFab() {
  const pathname = usePathname();
  const router = useRouter();
  const [isFabOpen, setIsFabOpen] = useState(false);

  const leftItems = [
    { label: "Home", icon: Home, href: "/", color: "text-primary" },
    {
      label: "Favourites",
      icon: Heart,
      href: "/favourites",
      color: "text-rose-500",
    },
  ];

  const rightItems = [
    {
      label: "Cart",
      icon: ShoppingCart,
      href: "/cart",
      color: "text-emerald-500",
    },
    {
      label: "Profile",
      icon: User,
      href: "/profile",
      color: "text-violet-500",
    },
  ];

  // FAB items with label, icon, and link
  const fabItems = [
    { label: "Support", icon: Headphones, href: "/support" },
    { label: "Contact", icon: Mail, href: "/contact" },
    { label: "Admin", icon: Settings, href: "/admin" },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="relative mx-4 mb-4">
        {/* Main nav bar */}
        <div className="bg-background/90 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl shadow-black/10 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left items */}
            <div className="flex gap-8">
              {leftItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <motion.button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "relative p-2 rounded-xl transition-colors",
                      isActive ? item.color : "text-muted-foreground",
                    )}
                  >
                    <motion.div
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    </motion.div>

                    {isActive && (
                      <motion.div
                        layoutId="dot"
                        className={cn(
                          "absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2",
                          item.color.replace("text-", "bg-"),
                        )}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Spacer for FAB */}
            <div className="w-16" />

            {/* Right items */}
            <div className="flex gap-8">
              {rightItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <motion.button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "relative p-2 rounded-xl transition-colors",
                      isActive ? item.color : "text-muted-foreground",
                    )}
                  >
                    <motion.div
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    </motion.div>

                    {isActive && (
                      <motion.div
                        layoutId="dot"
                        className={cn(
                          "absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2",
                          item.color.replace("text-", "bg-"),
                        )}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <motion.button
          onClick={() => setIsFabOpen(!isFabOpen)}
          whileTap={{ scale: 0.9 }}
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 
                     bg-primary rounded-2xl shadow-lg shadow-primary/30 
                     flex items-center justify-center text-primary-foreground"
          animate={{ rotate: isFabOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Plus size={28} />
        </motion.button>

        {/* FAB Menu with label, icon, and link */}
        <AnimatePresence>
          {isFabOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute left-1/2 -translate-x-1/2 -top-48 
                         bg-background/95 backdrop-blur-xl border border-border/50 
                         rounded-2xl shadow-xl p-2 flex flex-col gap-1 min-w-[160px]"
            >
              {fabItems.map((item, i) => {
                const Icon = item.icon;

                return (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      router.push(item.href);
                      setIsFabOpen(false);
                    }}
                    className="px-4 py-2.5 text-sm text-foreground hover:bg-muted 
                               rounded-xl transition-colors text-left
                               flex items-center gap-3"
                  >
                    <Icon size={18} className="text-muted-foreground" />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

"use client";

import { useState } from "react";
import { CartCard } from "@/components/blocks/cart-card";
import { motion, AnimatePresence } from "motion/react";

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    images: { url: string; isCover: boolean }[];
  };
}

interface CartListProps {
  initialItems: CartItem[];
}

export function CartList({ initialItems }: CartListProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-muted-foreground"
      >
        Your cart is now empty.
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <CartCard
            key={item.id}
            item={item}
            onRemoved={() => handleRemove(item.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

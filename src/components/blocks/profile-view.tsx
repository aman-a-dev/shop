"use client";

import { motion } from "motion/react";
import { LifeBuoy, ShieldUser, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";

type ProfileUser = {
  id: number;
  name: string;
  username: string | null;
  avatar: string | null;
  role: "USER" | "ADMIN";
};

export function ProfileView({ user }: { user: ProfileUser }) {
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-1 flex-col"
    >
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
        className="flex flex-col items-center gap-3 py-6"
      >
        <Avatar size="lg" className="size-20">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center gap-0.5 text-center">
          <span className="text-base font-medium">{user.name}</span>
          {user.username && (
            <span className="text-sm text-muted-foreground">
              @{user.username}
            </span>
          )}
          <span className="text-xs text-muted-foreground">ID {user.id}</span>
        </div>
      </motion.div>

      {/* Bottom items: support + admin */}
      <div className="mt-auto pt-6">
        <ItemGroup>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.12, ease: "easeOut" }}
          >
            <Item
              variant="outline"
              render={<a href="https://t.me/Aman_a_dev" />}
            >
              <ItemMedia variant="icon">
                <LifeBuoy />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Support</ItemTitle>
                <ItemDescription>Get help or contact us</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="size-4 text-muted-foreground" />
              </ItemActions>
            </Item>
          </motion.div>

          {user.role === "ADMIN" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.18, ease: "easeOut" }}
            >
              <Item variant="outline" render={<a href="/admin" />}>
                <ItemMedia variant="icon">
                  <ShieldUser />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Admin panel</ItemTitle>
                  <ItemDescription>Manage products and orders</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </ItemActions>
              </Item>
            </motion.div>
          )}
        </ItemGroup>
      </div>
    </motion.div>
  );
}

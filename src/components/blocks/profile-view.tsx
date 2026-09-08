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
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

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
      <Card className="border-border/60">
        {/* Profile */}
        <CardContent className="flex flex-col items-center px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div className="rounded-full p-1 ring-1 ring-border/70 shadow-sm">
              <Avatar size="lg" className="size-24">
                {user.avatar && (
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="text-xl font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col items-center gap-0.5">
              <span className="text-base font-semibold tracking-tight">
                {user.name}
              </span>

              {user.username && (
                <span className="text-sm text-muted-foreground">
                  @{user.username}
                </span>
              )}

              <span className="text-xs text-muted-foreground/70">
                ID {user.id}
              </span>
            </div>
          </motion.div>
        </CardContent>

        {/* Actions */}
        <CardContent className="border-t border-border/50 p-4">
          <ItemGroup className="gap-2">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.12 }}
            >
              <Item
                variant="outline"
                render={<a href="https://t.me/Aman_a_dev" />}
                className="cursor-pointer transition-all duration-200 hover:bg-muted/50 hover:shadow-sm active:scale-[0.99]"
              >
                <ItemMedia variant="icon">
                  <LifeBuoy />
                </ItemMedia>

                <ItemContent>
                  <ItemTitle className="font-medium">Support</ItemTitle>
                  <ItemDescription className="text-xs">
                    Get help or contact us
                  </ItemDescription>
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
                transition={{ duration: 0.3, delay: 0.18 }}
              >
                <Item
                  variant="outline"
                  render={<Link href="/admin" />}
                  className="cursor-pointer transition-all duration-200 hover:bg-muted/50 hover:shadow-sm active:scale-[0.99]"
                >
                  <ItemMedia variant="icon">
                    <ShieldUser />
                  </ItemMedia>

                  <ItemContent>
                    <ItemTitle className="font-medium">Admin panel</ItemTitle>
                    <ItemDescription className="text-xs">
                      Manage products and orders
                    </ItemDescription>
                  </ItemContent>

                  <ItemActions>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </ItemActions>
                </Item>
              </motion.div>
            )}
          </ItemGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
}

"use client";

import { motion } from "motion/react";
import { LifeBuoy, ShieldUser, ChevronRight, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type ProfileUser = {
  id: number;
  name: string;
  username: string | null;
  avatar: string | null;
  role: "USER" | "ADMIN";
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
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
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-1 flex-col gap-5 p-4 md:p-8 max-w-lg mx-auto w-full"
    >
      {/* Profile Header Card */}
      <motion.div variants={item}>
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-b from-muted/50 to-background">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col items-center gap-5">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative"
              >
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-md" />
                <Avatar className="relative size-24 ring-4 ring-background shadow-sm">
                  {user.avatar && (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  )}
                  <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {user.role === "ADMIN" && (
                  <Badge
                    variant="secondary"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 gap-1.5 px-2.5 py-0.5 text-[11px] font-medium shadow-sm"
                  >
                    <ShieldUser className="size-3" />
                    Admin
                  </Badge>
                )}
              </motion.div>

              <div className="flex flex-col items-center gap-1.5 text-center">
                <h2 className="text-xl font-semibold tracking-tight">
                  {user.name}
                </h2>
                {user.username && (
                  <p className="text-sm text-muted-foreground font-medium">
                    @{user.username}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/70 font-mono mt-0.5">
                  ID: {user.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Support & Admin Section */}
      <motion.div variants={item} className="mt-auto">
        <Card className="overflow-hidden shadow-sm">
          <CardContent className="p-0">
            <ItemGroup className="gap-0">
              <motion.div
                whileTap={{ scale: 0.995 }}
                transition={{ duration: 0.15 }}
              >
                <Item
                  render={
                    <a
                      href="https://t.me/Aman_a_dev"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  className="group rounded-none px-5 py-4 hover:bg-muted/40 transition-colors duration-200 cursor-pointer"
                >
                  <ItemMedia variant="icon">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/8 text-primary transition-transform duration-200 group-hover:scale-105">
                      <LifeBuoy className="size-4" />
                    </div>
                  </ItemMedia>
                  <ItemContent className="gap-0.5">
                    <ItemTitle className="text-[15px] font-medium">
                      Support
                    </ItemTitle>
                    <ItemDescription className="text-[13px]">
                      Get help or contact us
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight className="size-4 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                  </ItemActions>
                </Item>
              </motion.div>

              {user.role === "ADMIN" && (
                <>
                  <Separator className="mx-5 w-auto" />
                  <motion.div
                    whileTap={{ scale: 0.995 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Item
                      render={<Link href="/admin" />}
                      className="group rounded-none px-5 py-4 hover:bg-muted/40 transition-colors duration-200 cursor-pointer"
                    >
                      <ItemMedia variant="icon">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/8 text-primary transition-transform duration-200 group-hover:scale-105">
                          <ShieldUser className="size-4" />
                        </div>
                      </ItemMedia>
                      <ItemContent className="gap-0.5">
                        <ItemTitle className="text-[15px] font-medium">
                          Admin Panel
                        </ItemTitle>
                        <ItemDescription className="text-[13px]">
                          Manage products and orders
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <ChevronRight className="size-4 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                      </ItemActions>
                    </Item>
                  </motion.div>
                </>
              )}
            </ItemGroup>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

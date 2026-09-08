"use client";

import { motion } from "motion/react";
import {
  LifeBuoy,
  ShieldUser,
  ChevronRight,
  Settings,
  Bell,
  CreditCard,
  LogOut,
  User,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      className="flex flex-1 flex-col gap-6 p-4 md:p-6"
    >
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
      >
        <Card className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="size-24 ring-4 ring-background">
                  {user.avatar && (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  )}
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {user.role === "ADMIN" && (
                  <Badge
                    variant="secondary"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 gap-1"
                  >
                    <ShieldUser className="size-3" />
                    Admin
                  </Badge>
                )}
              </div>

              <div className="flex flex-col items-center gap-1 text-center">
                <h2 className="text-xl font-semibold tracking-tight">
                  {user.name}
                </h2>
                {user.username && (
                  <p className="text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">ID: {user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Support & Admin Section */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
        className="mt-auto"
      >
        <Card>
          <CardContent className="px-0 py-0">
            <ItemGroup className="gap-0">
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.2 }}
              >
                <Item
                  render={<a href="https://t.me/Aman_a_dev" />}
                  className="rounded-none px-6 py-4 hover:bg-muted/50 cursor-pointer"
                >
                  <ItemMedia variant="icon">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">
                      <LifeBuoy className="size-4 text-blue-500" />
                    </div>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-sm font-medium">
                      Support
                    </ItemTitle>
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
                <>
                  <Separator />
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.25 }}
                  >
                    <Item
                      render={<Link href="/admin" />}
                      className="rounded-none px-6 py-4 hover:bg-muted/50 cursor-pointer"
                    >
                      <ItemMedia variant="icon">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                          <ShieldUser className="size-4 text-primary" />
                        </div>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle className="text-sm font-medium">
                          Admin Panel
                        </ItemTitle>
                        <ItemDescription className="text-xs">
                          Manage products and orders
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <ChevronRight className="size-4 text-muted-foreground" />
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

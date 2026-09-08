"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@/context/telegram-context";
import { signInWithTelegram } from "@/actions/auth";
import { ProfileView } from "@/components/blocks/profile-view";

type ProfileUser = {
  id: number;
  name: string;
  username: string | null;
  avatar: string | null;
  role: "USER" | "ADMIN";
};

export default function ProfilePage() {
  const { ready, initDataRaw } = useTelegram();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!initDataRaw) {
      setError("Please open this app from within Telegram.");
      return;
    }

    signInWithTelegram(initDataRaw)
      .then((result) => setUser(result.user))
      .catch(() => setError("Could not load your profile."));
  }, [ready, initDataRaw]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-8">
      <ProfileView user={user} />
    </div>
  );
}

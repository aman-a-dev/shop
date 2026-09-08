// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/context/telegram-context";
import { signInWithTelegram } from "@/actions/auth";

export default function SplashPage() {
  const router = useRouter();
  const { ready, initDataRaw } = useTelegram();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return; // wait for TelegramProvider's effect to finish

    if (!initDataRaw) {
      setError("Please open this app from within Telegram.");
      return;
    }

    signInWithTelegram(initDataRaw)
      .then(() => router.replace("/profile"))
      .catch((err) => {
        console.error(err);
        setError("Sign-in failed. Please try again.");
      });
  }, [ready, initDataRaw, router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}

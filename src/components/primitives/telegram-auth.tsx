// telegram-auth.tsx
"use client";
import { useEffect } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react"; // Changed import
import { signInWithTelegram } from "@/actions/auth";

export function TelegramAuth() {
  const launchParams = useLaunchParams();
  const initDataRaw = launchParams.initDataRaw;

  useEffect(() => {
    if (typeof initDataRaw === "string" && initDataRaw.length > 0) {
      signInWithTelegram(initDataRaw).catch((err) => {
        console.error("Telegram Auth Failed:", err);
      });
    }
  }, [initDataRaw]);

  return null;
}

"use client";
import { useEffect } from "react";
import { useTelegram } from "@/context/telegram-context";
import { signInWithTelegram } from "@/actions/auth";

export function TelegramAuth() {
  const { initDataRaw } = useTelegram();

  useEffect(() => {
    if (initDataRaw) {
      signInWithTelegram(initDataRaw).catch((err) => {
        console.error("Telegram Auth Failed:", err);
      });
    }
  }, [initDataRaw]);

  return null;
}

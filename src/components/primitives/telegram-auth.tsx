"use client";

import { useEffect } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { signInWithTelegram } from "@/actions/auth";

export function TelegramAuth() {
  useEffect(() => {
    const launchParams = retrieveLaunchParams();
    const initDataRaw = launchParams.initDataRaw;

    if (typeof initDataRaw === "string" && initDataRaw.length > 0) {
      signInWithTelegram(initDataRaw).catch(console.error);
    }
  }, []);

  return null;
}

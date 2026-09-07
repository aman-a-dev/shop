"use client";

import { useEffect } from "react";
import { miniApp } from "@telegram-apps/sdk-react";

export function TelegramTheme() {
  useEffect(() => {
    const isDark = miniApp.isDark();
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return null;
}

"use client";

import { useEffect, useState } from "react";
import { init, backButton, viewport } from "@telegram-apps/sdk-react";

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    init(); // initializes the SDK, binds to window.Telegram.WebApp
    backButton.mount();
    viewport.mount();
    viewport.expand(); // full height, avoids the collapsed-sheet look
    setReady(true);
  }, []);

  if (!ready) return null; // avoid SSR/client mismatch
  return <>{children}</>;
}

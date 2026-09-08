// context/telegram-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { init, backButton, viewport } from "@telegram-apps/sdk-react";

interface TelegramContextValue {
  ready: boolean;
  initDataRaw?: string;
}

const TelegramContext = createContext<TelegramContextValue>({ ready: false });

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [initDataRaw, setInitDataRaw] = useState<string | undefined>();

  useEffect(() => {
    // Read initData straight from the proven-working global.
    const webApp = (window as any).Telegram?.WebApp;
    if (webApp?.initData) {
      setInitDataRaw(webApp.initData);
    }

    // SDK setup for back button / viewport — isolated so a failure
    // here can never block initData or the rest of the app.
    try {
      init();
      backButton.mount();
      viewport.mount();
      viewport.expand();
    } catch (err) {
      console.error("Telegram SDK feature init failed (non-blocking):", err);
    }

    setReady(true);
  }, []);

  return (
    <TelegramContext.Provider value={{ ready, initDataRaw }}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  return useContext(TelegramContext);
}

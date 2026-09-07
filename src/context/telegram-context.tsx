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
    // Initialize the SDK
    init();

    // Mount required components
    backButton.mount();
    viewport.mount();
    viewport.expand();

    // Get launch params – use the global WebApp object
    const webApp = (window as any).Telegram?.WebApp;
    if (webApp?.initData) {
      setInitDataRaw(webApp.initData);
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

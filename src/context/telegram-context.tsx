"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  init,
  backButton,
  viewport,
  retrieveLaunchParams,
} from "@telegram-apps/sdk-react";

interface TelegramContextValue {
  ready: boolean;
  initDataRaw?: string;
}

const TelegramContext = createContext<TelegramContextValue>({ ready: false });

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [initDataRaw, setInitDataRaw] = useState<string | undefined>();

  useEffect(() => {
    try {
      init();
      backButton.mount();
      viewport.mount();
      viewport.expand();

      const launchParams = retrieveLaunchParams();
      if (typeof launchParams.initDataRaw === "string") {
        setInitDataRaw(launchParams.initDataRaw);
      }
    } catch (err) {
      console.error("Telegram SDK init failed:", err);
    } finally {
      setReady(true);
    }
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

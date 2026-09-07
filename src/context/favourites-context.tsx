// context/favourites-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

const STORAGE_KEY = "favourites";

type FavoritesContextType = {
  favourites: string[];
  isFavourite: (id: string) => boolean;
  toggleFavourite: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>([]);

  // 1. Load from localStorage ONLY on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavourites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load favourites", e);
    }
  }, []);

  // Memoized to prevent unnecessary re-renders in child components
  const isFavourite = useCallback(
    (id: string) => favourites.includes(id),
    [favourites],
  );

  // 2. Update state AND save to localStorage synchronously
  const toggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((fid) => fid !== id) : [...prev, id];

      // Save immediately to localStorage.
      // This guarantees it persists the exact moment you click,
      // completely avoiding any useEffect race conditions on refresh.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return next;
    });
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favourites, isFavourite, toggleFavourite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

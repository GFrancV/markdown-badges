import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useCopyClipboard } from "@/hooks/use-copy-clipboard";

type FavoritesContextType = {
  favorites: Badge[];
  isFavorite: (id: string) => boolean;
  toggle: (badge: Badge | null) => void;
  copyAll: () => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = "mb:favorites";

function readFromStorage(): Badge[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { copy } = useCopyClipboard();

  const [favorites, setFavorites] = useState<Badge[]>([]);

  useEffect(() => {
    setFavorites(readFromStorage());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((b) => b.id === id),
    [favorites],
  );

  const toggle = useCallback((badge: Badge | null) => {
    if (!badge) return;

    setFavorites((prev) =>
      prev.some((b) => b.id === badge.id)
        ? prev.filter((b) => b.id !== badge.id)
        : [...prev, badge],
    );
  }, []);

  const copyAll = useCallback(() => {
    const markdown = favorites.map((b) => b.markdown).join("\n");
    copy(markdown);
  }, [favorites, copy]);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggle, copyAll }),
    [favorites, isFavorite, toggle, copyAll],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

import { useCopyClipboard } from "@/hooks/use-copy-clipboard";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type FavoritesContextType = {
  favorites: Badge[];
  isFavorite: (id: string) => boolean;
  toggle: (badge: Badge | null) => void;
  copyAll: () => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = "mb:favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { copy } = useCopyClipboard();

  const [favorites, setFavorites] = useState<Badge[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id: string) => favorites.some((b) => b.id === id);

  const toggle = (badge: Badge | null) => {
    if (!badge) return;

    setFavorites((prev) =>
      isFavorite(badge.id)
        ? prev.filter((b) => b.id !== badge.id)
        : [...prev, badge],
    );
  };

  const copyAll = () => {
    const markdown = favorites.map((b) => b.markdown).join("\n");
    copy(markdown);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggle, copyAll }}
    >
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

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

type SelectionContextType = {
  isSelected: (id: string) => boolean;
  toggle: (badge: Badge) => void;
  clearAll: () => void;
  copyAll: () => void;
  count: number;
  badges: Badge[];
};

const SelectionContext = createContext<SelectionContextType | null>(null);

const noopSelection: SelectionContextType = {
  isSelected: () => false,
  toggle: () => {},
  clearAll: () => {},
  copyAll: async () => {},
  count: 0,
  badges: [],
};

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedMap, setSelectedMap] = useState<Map<string, Badge>>(new Map());

  const isSelected = useCallback(
    (id: string) => selectedMap.has(id),
    [selectedMap],
  );

  const toggle = useCallback((badge: Badge) => {
    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (next.has(badge.id)) {
        next.delete(badge.id);
      } else {
        next.set(badge.id, badge);
      }
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setSelectedMap(new Map()), []);

  const copyAll = useCallback(async () => {
    const badges = Array.from(selectedMap.values());
    if (!badges.length) return;

    const markdown = badges.map((b) => b.markdown).join("\n");
    try {
      await navigator.clipboard.writeText(markdown);
      clearAll();
      toast.success(
        `${badges.length} badge${badges.length > 1 ? "s" : ""} copied`,
      );
    } catch {
      toast.error("Error copying to the clipboard");
    }
  }, [selectedMap]);

  const value = useMemo(
    () => ({
      isSelected,
      toggle,
      clearAll,
      copyAll,
      count: selectedMap.size,
      badges: Array.from(selectedMap.values()),
    }),
    [isSelected, toggle, clearAll, copyAll, selectedMap],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  return useContext(SelectionContext) ?? noopSelection;
}

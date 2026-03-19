import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useCopyClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;

    const timer = setTimeout(() => setIsCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const copy = useCallback(async (content: string) => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard", {
        description: content.slice(0, 60) + (content.length > 60 ? "..." : ""),
      });
      setIsCopied(true);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  return { isCopied, copy };
}

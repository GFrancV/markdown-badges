import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useCopyClipboard(content: string) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCopied) {
      timer = setTimeout(() => setIsCopied(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [isCopied]);

  const copy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard", {
        description: content.slice(0, 60) + (content.length > 60 ? "..." : ""),
      });
      setIsCopied(true);

      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return { isCopied, copy };
}

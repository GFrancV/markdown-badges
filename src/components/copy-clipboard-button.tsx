import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyClipboard } from "@/hooks/use-copy-clipboard";
import { cn } from "@/lib/utils";

type CopyClipboardButtonProps = {
  content: string;
  className?: string;
  onCopy?: () => void;
};

export function CopyClipboardButton({
  content,
  className,
  onCopy,
}: CopyClipboardButtonProps) {
  const { isCopied, copy } = useCopyClipboard();

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      onClick={(e) => {
        e.stopPropagation();
        copy(content);
        onCopy?.();
      }}
      className={cn(
        className,
        isCopied ? "text-primary" : "text-muted-foreground",
      )}
      aria-label="Copy to clipboard"
    >
      {isCopied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
    </Button>
  );
}

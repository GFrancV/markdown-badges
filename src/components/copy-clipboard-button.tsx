import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyClipboard } from "@/hooks/use-copy-clipboard";
import { cn } from "@/lib/utils";

type CopyClipboardButtonProps = {
  content: string;
  className?: string;
};

export function CopyClipboardButton({
  content,
  className,
}: CopyClipboardButtonProps) {
  const { isCopied, copy } = useCopyClipboard();

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      onClick={(e) => {
        e.stopPropagation();
        copy(content);
      }}
      className={cn(
        className,
        isCopied ? "text-primary" : "text-muted-foreground",
      )}
    >
      {isCopied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
    </Button>
  );
}

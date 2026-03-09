import { ClipboardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyClipboard } from "@/hooks/use-copy-clipboard";

export function BadgeCopyButton({
  badge,
  className,
}: {
  badge: string;
  className?: string;
}) {
  const { copy } = useCopyClipboard(badge);

  return (
    <Button className={className} onClick={copy}>
      <ClipboardIcon />
      Copy Markdown
    </Button>
  );
}

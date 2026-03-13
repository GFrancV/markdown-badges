import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useCopyClipboard } from "@/hooks/use-copy-clipboard";
import { cn } from "@/lib/utils";

export function BadgeCard({ badge }: { badge: Badge }) {
  const { name, url, category } = badge;

  const { isCopied, copy } = useCopyClipboard();

  return (
    <div
      onClick={() => copy(`![${name}](${url})`)}
      className="relative group bg-[#1e1e1e] cursor-pointer text-white rounded-sm border border-transparent transition p-6 text-center flex flex-col hover:bg-primary/20 hover:border-primary badget-element h-full"
    >
      <Typography as="h3" size="h4" className="mt-1 mb-3">
        {name}
      </Typography>
      <img
        src={url}
        alt={`${name} badge`}
        width="100"
        height="28"
        className="mt-auto h-7 w-auto mx-auto mb-4"
        loading="lazy"
      />
      <div className="mt-2">
        <Button
          variant="outline"
          className="rounded-full group-hover:border-primary group-hover:text-primary"
        >
          {category}
        </Button>
      </div>
      <button
        className={cn(
          "absolute top-0 right-0 m-2 transition duration-300 group-hover:text-primary text-xl",
          isCopied ? "text-primary" : "text-gray-600",
        )}
      >
        {!isCopied ? (
          <ClipboardIcon size={22} />
        ) : (
          <ClipboardCheckIcon size={22} />
        )}
      </button>
    </div>
  );
}

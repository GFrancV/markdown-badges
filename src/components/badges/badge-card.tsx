import {
  ClipboardCheckIcon,
  ClipboardIcon,
  PanelRightOpenIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Typography } from "@/components/ui/typography";

interface BadgeCardProps {
  badge: Badge;
  onSelect?: (badge: Badge) => void;
}

export function BadgeCard({ badge, onSelect }: BadgeCardProps) {
  const { name, url, category } = badge;
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = async () => {
    if (onSelect) {
      onSelect(badge);
      return;
    }
    await navigator.clipboard.writeText(`![${name}](${url})`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 700);
    toast.success("Copied to clipboard");
  };

  return (
    <div
      onClick={handleClick}
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
      <span className="absolute top-0 right-0 m-2 text-gray-600 transition duration-300 group-hover:text-primary">
        {onSelect ? (
          <PanelRightOpenIcon size={18} />
        ) : isCopied ? (
          <ClipboardCheckIcon size={22} />
        ) : (
          <ClipboardIcon size={22} />
        )}
      </span>
    </div>
  );
}

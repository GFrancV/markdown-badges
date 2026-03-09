import { useState } from "react";

import { cn } from "@/lib/utils";

const BADGE_STYLES = [
  { id: "flat", label: "flat" },
  { id: "flat-square", label: "flat-square" },
  { id: "for-the-badge", label: "for-the-badge" },
  { id: "plastic", label: "plastic" },
] as const;

export type BadgeStyleId = (typeof BADGE_STYLES)[number]["id"];

function getBadgeUrlWithStyle(url: string, style: BadgeStyleId): string {
  return url.replace(/style=[^&]+/, `style=${style}`);
}

type BadgeVariantsProps = {
  badge: Badge;
  style?: BadgeStyleId;
  className?: string;
  onStyleChange?: (badgeUrl: string) => void;
};

export function BadgeVariants({
  badge,
  style = "flat",
  className,
  onStyleChange,
}: BadgeVariantsProps) {
  const [selectedStyle, setSelectedStyle] = useState<BadgeStyleId>(style);

  const handleClick = (style: BadgeStyleId, badgeUrl: string) => {
    setSelectedStyle(style);
    onStyleChange?.(badgeUrl);
  };

  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {BADGE_STYLES.map((style) => {
        const styleUrl = getBadgeUrlWithStyle(badge.url, style.id);
        const isSelected = selectedStyle === style.id;

        return (
          <button
            key={style.id}
            onClick={() => handleClick(style.id, styleUrl)}
            className={cn(
              "flex flex-col items-center justify-center gap-2 bg-[#1e1e1e] rounded-md p-3 border transition-colors",
              isSelected
                ? "border-primary bg-primary/15"
                : "border-transparent hover:bg-primary/15",
            )}
          >
            <img
              src={styleUrl}
              alt={`${badge.name} ${style.label} style`}
              height="20"
              className="h-5 w-auto"
            />
            <span className="text-xs text-gray-400">{style.label}</span>
          </button>
        );
      })}
    </div>
  );
}

import { useState } from "react";

import { cn } from "@/lib/utils";

const BADGE_STYLES = [
  { id: "flat", label: "flat" },
  { id: "flat-square", label: "flat-square" },
  { id: "for-the-badge", label: "for-the-badge" },
  { id: "plastic", label: "plastic" },
] as const;

type BadgeStyleId = (typeof BADGE_STYLES)[number]["id"];

function getBadgeUrlWithStyle(url: string, style: BadgeStyleId): string {
  return url.replace(/style=[^&]+/, `style=${style}`);
}

export function BadgeVariants({
  badge,
  className,
}: {
  badge: Badge;
  className?: string;
}) {
  const [selectedStyle, setSelectedStyle] =
    useState<BadgeStyleId>("for-the-badge");

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {BADGE_STYLES.map((style) => {
        const styleUrl = getBadgeUrlWithStyle(badge.url, style.id);
        const isSelected = selectedStyle === style.id;
        return (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-2 bg-[#1e1e1e] rounded-md p-3 border transition-colors",
              isSelected
                ? "border-primary bg-primary/10"
                : "border-transparent hover:border-white/20",
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

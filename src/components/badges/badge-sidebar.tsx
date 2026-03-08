import {
  ClipboardCheckIcon,
  ClipboardIcon,
  ExternalLinkIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

function getSourceFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace("img.", "");
  } catch {
    return "shields.io";
  }
}

function getDefaultStyle(url: string): BadgeStyleId {
  const match = url.match(/style=([^&]+)/);
  const style = match?.[1] as BadgeStyleId | undefined;
  return BADGE_STYLES.some((s) => s.id === style) ? style! : "for-the-badge";
}

interface BadgeSidebarProps {
  badge: Badge | null;
  onClose: () => void;
}

export function BadgeSidebar({ badge, onClose }: BadgeSidebarProps) {
  const [selectedStyle, setSelectedStyle] =
    useState<BadgeStyleId>("for-the-badge");
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    if (badge) {
      setSelectedStyle(getDefaultStyle(badge.url));
    }
  }, [badge]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (badge) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [badge]);

  const isOpen = badge !== null;

  const currentUrl = badge
    ? getBadgeUrlWithStyle(badge.url, selectedStyle)
    : "";
  const currentMarkdown = badge ? `![${badge.name}](${currentUrl})` : "";

  const source = badge ? getSourceFromUrl(badge.url) : "";

  const handleCopyMarkdown = async () => {
    if (!badge) return;
    await navigator.clipboard.writeText(currentMarkdown);
    toast.success("Copied to clipboard", {
      description:
        currentMarkdown.slice(0, 60) +
        (currentMarkdown.length > 60 ? "..." : ""),
    });
    setIsCopying(true);

    setTimeout(() => {
      setIsCopying(false);
    }, 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={badge?.name ?? "Badge details"}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[#161616] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {badge && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  badge
                  {badge.name}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {badge.category}
                  <span className="mx-1.5 opacity-50">·</span>
                  {source}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close sidebar"
                className="ml-4 text-gray-500 hover:text-white transition-colors rounded-md p-1 hover:bg-white/10"
              >
                <XIcon size={20} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Preview section */}
              <section>
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3">
                  Preview
                </p>
                {/* Large preview */}
                <div className="flex justify-center items-center bg-[#1e1e1e] rounded-md p-6 mb-3">
                  <img
                    src={currentUrl}
                    alt={`${badge.name} badge preview`}
                    height="28"
                    className="h-7 w-auto"
                  />
                </div>

                {/* Style variants grid */}
                <div className="grid grid-cols-2 gap-2">
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
                        <span className="text-xs text-gray-400">
                          {style.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Markdown section */}
              <section>
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3">
                  Markdown
                </p>
                <div className="relative">
                  <pre
                    className="w-full bg-[#1e1e1e] rounded-md p-4 text-sm text-emerald-400 break-all whitespace-pre-wrap font-mono leading-relaxed pr-8 cursor-pointer select-none group"
                    onClick={handleCopyMarkdown}
                  >
                    {currentMarkdown}
                  </pre>
                  <Button
                    asChild
                    variant="ghost"
                    className="absolute top-0.5 right-0.5 group-hover:"
                  >
                    <span>
                      {isCopying ? <ClipboardCheckIcon /> : <ClipboardIcon />}
                    </span>
                  </Button>
                </div>
              </section>
            </div>

            {/* Footer actions */}
            <div className="p-6 border-t border-white/10 space-y-2">
              <Button className="w-full" onClick={handleCopyMarkdown}>
                <ClipboardIcon />
                Copy Markdown
              </Button>
              <Button
                variant="outline"
                className="w-full dark:border-white/10 dark:hover:bg-white/10"
                asChild
              >
                <a
                  href={`/badges/${badge.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon />
                  View badge page
                </a>
              </Button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

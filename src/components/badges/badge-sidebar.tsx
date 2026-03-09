import { ExternalLinkIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { BadgeCopyButton } from "@/components/badges/badge-copy-button";
import { BadgeVariants } from "@/components/badges/badge-variants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface BadgeSidebarProps {
  badge: Badge | null;
  onClose: () => void;
}

export function BadgeSidebar({ badge, onClose }: BadgeSidebarProps) {
  const [styleUrl, setStyleUrl] = useState(badge?.url ?? "");
  const [markdownCode, setMarkdownCode] = useState(badge?.markdown ?? "");

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

  useEffect(() => {
    setMarkdownCode(`![${badge?.name}](${styleUrl})`);
  }, [styleUrl, badge]);

  const isOpen = badge !== null;

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
                <Typography size="h4" className="mb-2">
                  {badge.name}
                </Typography>
                <div className="flex items-center gap-2 flex-wrap">
                  {badge.category.map((categoryElement) => (
                    <Badge variant="outline" className="h-fit">
                      <a
                        href={`/?category=${categoryElement}`}
                        className="hover:underline"
                      >
                        {categoryElement}
                      </a>
                    </Badge>
                  ))}
                </div>
              </div>
              <Button onClick={onClose} variant="ghost">
                <XIcon size={20} />
              </Button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Preview section */}
              <section>
                <Typography
                  size="sm"
                  variant="muted"
                  className="uppercase mb-2"
                >
                  Preview
                </Typography>
                {/* Large preview */}
                <div className="flex justify-center items-center bg-[#1e1e1e] rounded-md p-6 mb-3">
                  <img
                    src={styleUrl}
                    alt={`${badge.name} badge preview`}
                    height="28"
                    className="h-7 w-auto"
                  />
                </div>

                <BadgeVariants badge={badge} onStyleChange={setStyleUrl} />
              </section>

              {/* Markdown section */}
              <section>
                <Typography
                  size="sm"
                  variant="muted"
                  className="uppercase mb-2"
                >
                  Markdown
                </Typography>
                <CodeBlock code={markdownCode} language="markdown" />
              </section>
            </div>

            {/* Footer actions */}
            <div className="p-6 border-t border-white/10 space-y-2">
              <BadgeCopyButton className="w-full" badge={markdownCode} />
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

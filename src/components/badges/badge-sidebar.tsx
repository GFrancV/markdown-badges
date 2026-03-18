import {
  ClipboardIcon,
  ExternalLinkIcon,
  HeartIcon,
  HeartOffIcon,
} from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Typography } from "@/components/ui/typography";
import { useFavorites } from "@/context/favorites-context";
import { useCopyClipboard } from "@/hooks/use-copy-clipboard";
import { getRelatedBadges } from "@/services/badges";

type BadgeSidebarContextType = {
  open: (badge: Badge) => void;
  close: () => void;
};

const BadgeSidebarContext = createContext<BadgeSidebarContextType | null>(null);

export function BadgeSidebarProvider({ children }: { children: ReactNode }) {
  const { copy } = useCopyClipboard();
  const { toggle, isFavorite } = useFavorites();

  const previousUrl = useRef("");

  const [isOpen, setIsOpen] = useState(false);
  const [badge, setBadge] = useState<Badge | null>(null);

  const relatedBadges = useMemo<Badge[] | null>(() => {
    if (!badge) return null;

    return getRelatedBadges(badge);
  }, [badge]);

  const open = (badge: Badge) => {
    setBadge(badge);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTimeout(() => setBadge(null), 300);
  };

  useEffect(() => {
    const handlePopState = () => close();
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    previousUrl.current = window.location.pathname + window.location.search;
    window.history.pushState(null, "", `/badges/${badge?.id}`);

    return () => {
      window.history.pushState(null, "", previousUrl.current);
    };
  }, [isOpen, badge?.id]);

  return (
    <BadgeSidebarContext.Provider value={{ open, close }}>
      {children}
      <Sheet open={isOpen} onOpenChange={close}>
        <SheetContent>
          <SheetHeader className="border-b ">
            <SheetTitle asChild>
              <Typography size="h3">{badge?.name}</Typography>
            </SheetTitle>
            <SheetDescription>{badge?.category}</SheetDescription>
          </SheetHeader>
          <div className="px-6 space-y-8">
            <section>
              <Typography as="h3" variant="accent" className="mb-1">
                Preview
              </Typography>
              <img
                src={badge?.url}
                alt={`${badge?.name} badge`}
                width="120"
                height="32"
                className="h-8 w-auto mx-auto"
                loading="lazy"
              />
            </section>
            <section>
              <Typography as="h3" variant="accent" className="mb-1">
                Markdown
              </Typography>
              <CodeBlock language="markdown" code={badge?.markdown ?? ""} />
            </section>
            <section>
              <Typography as="h3" variant="accent" className="mb-1">
                Image URL
              </Typography>
              <CodeBlock
                language="html"
                code={
                  badge
                    ? `<img src="${badge.url}" alt="${badge.name} badge">`
                    : ""
                }
              />
            </section>
            <section>
              <Typography as="h3" variant="accent" className="mb-1">
                Related
              </Typography>
              <div className="grid grid-cols-2 gap-2">
                {relatedBadges?.map((badge) => (
                  <a key={badge.id} href={`/badges/${badge?.id}`}>
                    <div className=" bg-[#1e1e1e] rounded-sm border border-transparent transition p-6 text-center flex flex-col hover:bg-primary/20 hover:border-primary">
                      <img
                        src={badge?.url}
                        alt={`${badge?.name} badge`}
                        width="50"
                        height="20"
                        className="h-5 w-auto mx-auto"
                        loading="lazy"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
          <SheetFooter>
            <Button onClick={() => copy(badge?.markdown ?? "")}>
              <ClipboardIcon className="mr-2" width={12} />
              Copy Markdown
            </Button>
            <Button variant="secondary" onClick={() => toggle(badge)}>
              {isFavorite(badge?.id ?? "") ? (
                <>
                  <HeartOffIcon className="mr-2" width={12} />
                  Remove from favorites
                </>
              ) : (
                <>
                  <HeartIcon className="mr-2" width={12} />
                  Add to favorites
                </>
              )}
            </Button>
            <Button asChild variant="secondary">
              <a href={`/badges/${badge?.id}`}>
                <ExternalLinkIcon className="mr-2" width={12} />
                View badge page
              </a>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </BadgeSidebarContext.Provider>
  );
}

export function useBadgeSidebar() {
  const context = useContext(BadgeSidebarContext);
  if (!context)
    throw new Error(
      "useBadgeSidebar must be used within a BadgeSidebarProvider",
    );

  return context;
}

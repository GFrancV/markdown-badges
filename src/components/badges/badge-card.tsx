import { CopyClipboardButton } from "@/components/copy-clipboard-button";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useBadgeSidebar } from "./badge-sidebar";

export function BadgeCard({ badge }: { badge: Badge }) {
  const { name, url, category } = badge;

  const { open } = useBadgeSidebar();

  return (
    <div
      onClick={() => open(badge)}
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
      <CopyClipboardButton
        content={`![${name}](${url})`}
        className="absolute top-1 right-1 transition duration-300 group-hover:text-primary"
      />
    </div>
  );
}

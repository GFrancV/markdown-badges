import { MarkdownDark } from "@/components/ui/svgs/markdownDark";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn(className, "flex gap-2 items-center")}>
      <MarkdownDark className="size-9! stroke-2" />
      <Typography as="span" size="h4">
        Markdown Badges
      </Typography>
    </div>
  );
}

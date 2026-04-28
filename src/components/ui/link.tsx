import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type LinkProps = ComponentProps<"a"> & {
  external?: boolean;
};

function Link({ className, external = false, children, ...props }: LinkProps) {
  const externalProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <a
      className={cn(
        "text-primary underline underline-offset-4 transition-colors hover:text-primary/80",
        className,
      )}
      {...externalProps}
      {...props}
    >
      {children}
    </a>
  );
}

export { Link };

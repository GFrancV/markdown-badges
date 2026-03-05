import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent-foreground",
      destructive: "text-destructive",
    },
    size: {
      default: "text-base leading-7",
      h1: "text-h1 text-4xl font-bold tracking-tight text-balance",
      h2: "text-3xl font-semibold tracking-tight",
      h3: "text-2xl font-semibold tracking-tight",
      h4: "text-xl font-semibold tracking-tight",
      sm: "text-sm leading-none font-medium",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface Props
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: ElementType;
}

function Typography({
  as: Component = "p",
  className,
  variant = "default",
  size = "default",
  ...props
}: Props) {
  return (
    <Component
      data-slot="typography"
      data-variant={variant}
      data-size={size}
      className={cn(typographyVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Typography, typographyVariants };

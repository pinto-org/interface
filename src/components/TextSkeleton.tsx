import { cn } from "@/utils/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";
import { Skeleton } from "./ui/Skeleton";

const heights = {
  h1: "h-[3.772rem]",
  h2: "h-[2.475rem]",
  h3: "h-[2.2rem]",
  h4: "h-[1.65rem]",
  lg: "h-[1.375rem]",
  body: "h-[1.375rem]",
  sm: "h-[1.1rem]",
  xs: "h-[.9625rem]",
  "same-h1": "h-[3.429rem]",
  "same-h2": "h-[2.25rem]",
  "same-h3": "h-[2rem]",
  "same-h4": "h-[1.5rem]",
  "same-body": "h-[1.25rem]",
  "same-sm": "h-[1rem]",
  "same-xs": "h-[.875rem]",
};

const desktopHeights = Object.fromEntries(
  Object.entries(heights).map(([key, value]) => [key, `sm:${value}`]),
) as Record<keyof typeof heights, string>;

/**
 * mapped to font size heights
 */
const loadingWrapperVariants = cva("", {
  variants: {
    height: {
      default: "",
      ...heights,
    },
    desktopHeight: {
      default: "",
      ...desktopHeights,
    },
  },
});

export interface ITextSkeleton
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingWrapperVariants> {
  loading?: boolean;
}

const TextSkeleton = React.forwardRef<HTMLDivElement, ITextSkeleton>(
  ({ children, height, desktopHeight, loading = false, className, ...props }, ref) => {
    if (loading) {
      return (
        <Skeleton className={cn(loadingWrapperVariants({ height, desktopHeight }), className)} ref={ref} {...props} />
      );
    }

    return <>{children}</>;
  },
);

export default TextSkeleton;

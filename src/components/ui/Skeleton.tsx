import { cn } from "@/utils/utils";
import React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = React.forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("animate-pulse rounded-md bg-gray-200", className)} {...props} />;
});

export { Skeleton };

import { FontVariant } from "@/utils/theme";
import { cn } from "@/utils/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-[#e5e7eb]", className)} {...props} />;
}

export interface ISkeletonText extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  variant: FontVariant;
}

export { Skeleton };

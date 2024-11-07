import { FontVariant, textConfig } from "@/utils/theme";
import { cn } from "@/utils/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export interface ISkeletonText extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  variant: FontVariant;
}

const { methods } = textConfig;

const SkeletonText = ({ width, variant }: ISkeletonText) => {
  return <Skeleton className={cn(`h-[${methods.lineHeight(variant)}]`, `w-[${width}rem]`)} />;
};

export { Skeleton, SkeletonText };

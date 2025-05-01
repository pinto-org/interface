import { cn } from "@/utils/utils";
import { HTMLAttributes, forwardRef } from "react";

export type InlineCenterSpanProps = HTMLAttributes<HTMLSpanElement> & {
  gap1?: boolean;
};

export const InlineCenterSpan = forwardRef<HTMLSpanElement, InlineCenterSpanProps>(
  ({ children, gap1 = false, ...props }, ref) => {
    return (
      <span {...props} ref={ref} className={cn("inline-flex items-center", gap1 && "gap-1", props.className)}>
        {children}
      </span>
    );
  },
);

export const Row = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div {...props} ref={ref} className={cn("flex flex-row items-center", className)} />;
});

export const Col = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div {...props} ref={ref} className={cn("flex flex-col", className)} />;
});

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

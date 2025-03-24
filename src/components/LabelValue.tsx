import { cn } from "@/utils/utils";
import React from "react";

interface ILabelValue extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
  titleClassName?: string;
  valueClassName?: string;
}

const LabelValue = React.forwardRef<HTMLDivElement, ILabelValue>(
  ({ title, children, className, titleClassName, valueClassName, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-row justify-between gap-2", className)} {...props}>
      <div className={cn("pinto-sm-light text-pinto-light", titleClassName)}>{title}</div>
      <div className={cn("pinto-sm text-pinto-primary text-right justify-self-end", valueClassName)}>{children}</div>
    </div>
  ),
);
LabelValue.displayName = "LabelValue";

export default LabelValue;

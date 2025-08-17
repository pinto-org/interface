import * as LabelPrimitive from "@radix-ui/react-label";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { Row } from "@/components/Container";
import { cn } from "@/utils/utils";
import TooltipSimple from "../TooltipSimple";

const labelVariants = cva(
  "font-[340] text-[1rem] sm:text-[1.25rem] text-pinto-gray-4 -tracking-[0.02em] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "",
        section: "pinto-sm-light sm:pinto-body-light text-pinto-light sm:text-pinto-light",
        form: "text-sm sm:text-sm text-pinto-gray-4",
      },
      expanded: {
        true: "flex h-10 items-center",
      },
    },
  },
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, variant = "default", expanded, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ variant, expanded }), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

type TooltipLabelProps = {
  children: React.ReactNode;
  tooltipText?: React.ReactNode;
} & React.ComponentProps<typeof LabelPrimitive.Root>;

export const TooltipLabel = ({ children, tooltipText, ...props }: TooltipLabelProps) => {
  return (
    <Row className="flex flex-row gap-1 items-center">
      <Label variant="form" {...props}>
        {children}
      </Label>
      <TooltipSimple content={tooltipText} variant="outlined" disabled={!tooltipText} />
    </Row>
  );
};

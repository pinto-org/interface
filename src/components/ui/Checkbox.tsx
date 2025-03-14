"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { cn } from "@/utils/utils";
import { VariantProps, cva } from "class-variance-authority";

const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 border rounded-[0.125rem] focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-pinto-white",
  {
    variants: {
      variant: {
        default: "border-pinto-green-4 text-pinto-green-4",
        error: "bg-white border-pinto-red-2 text-pinto-red-2",
      },
    },
  },
);

type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>;

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, variant, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        checkboxVariants({
          variant,
        }),
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <CheckIcon className="h-4 w-4 text-current" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  ),
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

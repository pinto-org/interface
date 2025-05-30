import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/utils/utils";
import { VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";

const baseSwitchClass = clsx(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full shadow-none border-pinto-gray-2 transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "data-[state=checked]:bg-pinto-green-1 data-[state=unchecked]:bg-white data-[state=checked]:border-pinto-green-4 data-[state=checked]:border-[0.25px]",
);

const switchVariants = cva(baseSwitchClass, {
  variants: {
    variant: {
      default: "h-5 w-9",
      omegaLarge: "sm:h-14 sm:w-[6.5rem] h-11 w-20",
    },
  },
});

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & VariantProps<typeof switchVariants>
>(({ className, variant = "default", ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchVariants({ variant }), className)}
    {...props}
    style={{ borderWidth: "0.01px", ...props.style }}
    ref={ref}
  >
    {props.children ? props.children : <SwitchThumb variant={variant} />}
  </SwitchPrimitives.Root>
));

const baseSwitchThumbClass = clsx(
  "pointer-events-none block rounded-full bg-pinto-gray-2 shadow-none ring-0 transition-transform",
  "data-[state=checked]:bg-pinto-green-4",
);

const switchThumbVariants = cva(baseSwitchThumbClass, {
  variants: {
    variant: {
      default: "h-4 w-4 data-[state=checked]:translate-x-[1.0625rem] data-[state=unchecked]:translate-x-[0.125rem]",
      omegaLarge: clsx(
        "w-9 h-9 data-[state=checked]:translate-x-[2.5rem] data-[state=unchecked]:translate-x-[0.1875rem]", // mobile
        "sm:w-12 sm:h-12 sm:data-[state=checked]:translate-x-[3.125rem] sm:data-[state=unchecked]:translate-x-[0.25625rem]", // mobile +
      ),
    },
  },
});

const SwitchThumb = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Thumb>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Thumb> & VariantProps<typeof switchThumbVariants>
>(({ className, variant = "default", ...props }, ref) => (
  <SwitchPrimitives.Thumb {...props} className={cn(switchThumbVariants({ variant }), className)} ref={ref} />
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch, SwitchThumb };

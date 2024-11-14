import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/utils/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full shadow-none border-pinto-gray-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-pinto-green-1 data-[state=unchecked]:bg-white data-[state=checked]:border-pinto-green-4 data-[state=checked]:border-[0.25px]",
      className,
    )}
    {...props}
    style={{ borderWidth: "0.01px", ...props.style }}
    ref={ref}
  >
    {props.children ? props.children : <SwitchThumb />}
  </SwitchPrimitives.Root>
));

const SwitchThumb = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Thumb>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Thumb>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Thumb
    {...props}
    className={cn(
      "pointer-events-none block h-[18px] w-[18px] ml-[1px] rounded-full bg-pinto-gray-2 shadow-none ring-0 transition-transform data-[state=checked]:bg-pinto-green-4 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
      className,
    )}
    ref={ref}
  />
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch, SwitchThumb };

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { deriveTextStyles } from "@/utils/theme";
import { cn } from "@/utils/utils";
import clsx from "clsx";

const outlineBase = clsx(
  "border border-pinto-gray-2 bg-pinto-gray-1 shadow-sm hover:bg-pinto-gray-2/50 hover:text-accent-foreground",
);

const primaryBase = clsx("text-pinto-green hover:text-pinto-green");

const secondaryBase = clsx("text-pinto-gray-5 hover:text-pinto-gray-5");

const outlineShadowBase = clsx(
  // E9F0F6 is pinto-gray-blue
  "shadow-[0px_1px_8px_0px_#E9F0F6] border-pinto-gray-blue bg-white/100 hover:bg-pinto-gray-1",
);

const roundedBase = clsx("rounded-full");

const buttonVariants = cva(
  "box-border inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-pinto-gray-2 disabled:text-pinto-gray-4",
  {
    variants: {
      variant: {
        default: "bg-pinto-green-4 text-white hover:bg-pinto-green-4/90 transition-all",
        defaultAlt: "bg-pinto-green-1 text-pinto-green hover:bg-pinto-green-1/80 transition-all",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: outlineBase,
        "outline-rounded": `${outlineBase} ${roundedBase}`,
        "outline-primary": `${outlineBase} ${primaryBase}`,
        "outline-secondary": `${outlineBase} ${secondaryBase}`,
        "outline-gray-shadow": `${outlineBase} ${outlineShadowBase}`,
        "outline-white": "border border-pinto-gray-2 bg-white hover:bg-pinto-gray-2/50 hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-pinto-gray-2 hover:hover:bg-pinto-gray-2/50",
        link: "text-primary underline-offset-4 hover:underline",
        "silo-action":
          "hover:bg-pinto-green-1 h-[2.5rem] rounded-[1rem] font-[400] text-[1.25rem] text-pinto-gray-5 flex flex-row justify-start gap-[0.625rem] disabled:bg-transparent disabled:text-pinto-gray-5 disabled:opacity-30",
        morning: "bg-pinto-morning-orange text-pinto-morning",
        gradient:
          "bg-gradient-primary hover:bg-gradient-primary-hover text-white disabled:text-white disabled:opacity-60",
        pagination:
          "bg-pinto-green-1 text-pinto-green hover:bg-pinto-green-1/80 transition-all rounded-sm disabled:bg-transparent disabled:text-pinto-gray-4 text-pinto-green-4",
      },
      size: {
        default: `h-10 w-max px-2 py-2 sm:px-4 sm:py-2 ${deriveTextStyles("body-light", true)}`,
        xlargest: `h-[3.75rem] text-2xl font-medium`,
        xxl: `px-3 py-2 sm:px-6 sm:py-4 ${deriveTextStyles("h4", true)} font-[500]`,
        xl: `h-12 px-3 py-3 sm:px-4 sm:py-3 ${deriveTextStyles("body-light", true)}`,
        lg: "h-10 rounded-md px-8",
        md: `h-10 px-2 py-2 sm:px-4 sm:py-2 ${deriveTextStyles("sm", true)}`,
        sm: `h-8 rounded-md px-3 ${deriveTextStyles("xs", true)}`,
        xs: `h-6 rounded-[4px] px-1`,
        icon: "h-9 w-9 min-w-9 sm:h-12 sm:w-12 sm:min-w-12",
      },
      width: {
        default: "w-max",
        full: "w-full",
      },
      noShrink: {
        true: "flex-shrink-0",
      },
      rounded: {
        full: "rounded-full",
        some: "rounded-[0.75rem]",
      },
      hover: {
        green4: "hover:border-pinto-green-4",
      },
      noPadding: {
        true: "p-0 sm:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = "default",
      asChild = false,
      noShrink = true,
      noPadding = false,
      rounded,
      width = "default",
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            noShrink,
            noPadding,
            rounded,
            width,
          }),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

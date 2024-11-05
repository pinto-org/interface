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

const roundedBase = clsx("rounded-full");

const buttonVariants = cva(
  "box-border inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-pinto-gray-2 disabled:text-pinto-gray-4",
  {
    variants: {
      variant: {
        default: "bg-pinto text-white hover:bg-pinto/80 transition-all",
        defaultAlt: "bg-pinto-green-1 text-pinto-green hover:bg-pinto-green-1/80 transition-all",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: outlineBase,
        "outline-rounded": `${outlineBase} ${roundedBase}`,
        "outline-primary": `${outlineBase} ${primaryBase}`,
        "outline-secondary": `${outlineBase} ${secondaryBase}`,
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-pinto-gray-2 hover:hover:bg-pinto-gray-2/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: `h-10 w-max px-2 py-2 sm:px-4 sm:py-2 ${deriveTextStyles("body-light", true)}`,
        lg: "h-10 rounded-md px-8",
        md: `h-10 px-2 py-2 sm:px-4 sm:py-2 ${deriveTextStyles("sm", true)}`,
        sm: `h-8 rounded-md px-3 ${deriveTextStyles("xs", true)}`,
        icon: "h-9 w-9",
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
            noShrink: noShrink,
            noPadding,
            rounded,
            width,
            className,
          }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

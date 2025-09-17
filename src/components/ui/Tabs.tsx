import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/utils";
import clsx from "clsx";

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      primary:
        "h-[3.25rem] justify-center rounded-[0.75rem] bg-white border border-pinto-gray-2 p-0.5 sm:p-1 text-muted-foreground",
      text: "flex-row justify-between overflow-x-auto",
      textSecondary: "flex flex-row gap-4 w-full overflow-x-auto",
    },
    borderBottom: {
      true: "border-b",
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    borderBottom: false,
  },
});

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "rounded-[0.75rem] text-pinto-gray-4 px-3 text-[1rem] sm:text-[1.25rem] py-2.5 sm:py-1.5 font-medium ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-pinto-green-1 data-[state=active]:text-pinto-green data-[state=active]:shadow-sm",
        text: "pinto-h3 py-2 pr-4 pl-0 text-left data-[state=active]:text-pinto-secondary data-[state=inactive]:text-pinto-gray-4",
        textSecondary: clsx(
          "pb-2 border-b-2 pinto-sm",
          "data-[state=inactive]:text-pinto-gray-4 data-[state=inactive]:border-transparent",
          "data-[state=active]:border-pinto-green-4 data-[state=active]:font-medium",
        ),
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

// Context for sharing variant between TabsList and TabsTrigger
type TabsVariant = VariantProps<typeof tabsListVariants>["variant"];
const TabsVariantContext = React.createContext<TabsVariant | undefined>(undefined);

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant, borderBottom, ...props }, ref) => (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.List ref={ref} className={cn(tabsListVariants({ variant, borderBottom }), className)} {...props} />
    </TabsVariantContext.Provider>
  ),
);
TabsList.displayName = TabsPrimitive.List.displayName;

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant, ...props }, ref) => {
    // Use provided variant, fallback to context, then default
    const contextVariant = React.useContext(TabsVariantContext);
    const finalVariant = variant ?? contextVariant ?? "primary";

    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(tabsTriggerVariants({ variant: finalVariant }), className)}
        {...props}
      />
    );
  },
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

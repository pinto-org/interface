import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import * as React from "react";

import { cn } from "@/utils/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "relative inline-flex h-[3.25rem] items-center justify-center rounded-[0.75rem] bg-white border border-pinto-gray-2 p-0.5 sm:p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, value, ...props }, ref) => {
  // Create a ref to track the active state from DOM
  const [isActive, setIsActive] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const checkActive = () => {
      const isCurrentlyActive = button.getAttribute("data-state") === "active";
      setIsActive(isCurrentlyActive);
    };

    // Initial check
    checkActive();

    // Use MutationObserver to watch for data-state changes
    const observer = new MutationObserver(checkActive);
    observer.observe(button, { attributes: true, attributeFilter: ["data-state"] });

    return () => observer.disconnect();
  }, []);

  return (
    <TabsPrimitive.Trigger ref={ref} value={value} asChild {...props}>
      <motion.button
        ref={buttonRef}
        className={cn(
          "relative inline-flex items-center justify-center whitespace-nowrap rounded-[0.75rem] px-3 text-[1rem] sm:text-[1.25rem] py-2.5 sm:py-1.5 font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 z-10",
          className,
        )}
        animate={{
          color: isActive ? "#246645" : "#9C9C9C", // pinto-green vs pinto-gray-4
        }}
        transition={{ duration: 0.2 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-pinto-green-1 rounded-[0.75rem] shadow-sm"
            style={{ zIndex: -1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />
        )}
      </motion.button>
    </TabsPrimitive.Trigger>
  );
});
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

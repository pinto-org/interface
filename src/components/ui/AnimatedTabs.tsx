import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import * as React from "react";

import { cn } from "@/utils/utils";

const Tabs = TabsPrimitive.Root;

// Context to share active button dimensions
const TabsContext = React.createContext<{
  activeButtonRect: { width: number; height: number; left: number; top: number } | null;
  setActiveButtonRect: (rect: { width: number; height: number; left: number; top: number } | null) => void;
} | null>(null);

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const [activeButtonRect, setActiveButtonRect] = React.useState<{
    width: number;
    height: number;
    left: number;
    top: number;
  } | null>(null);

  return (
    <TabsContext.Provider value={{ activeButtonRect, setActiveButtonRect }}>
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          "relative inline-flex h-[3.25rem] items-center justify-center rounded-[0.75rem] bg-white border border-pinto-gray-2 p-0.5 sm:p-1 text-muted-foreground",
          className,
        )}
        {...props}
      >
        {/* Single animated background */}
        {activeButtonRect && (
          <motion.div
            className="absolute bg-pinto-green-1 rounded-[0.75rem] shadow-sm"
            style={{ zIndex: 0 }}
            initial={false}
            animate={{
              width: activeButtonRect.width,
              height: activeButtonRect.height,
              left: activeButtonRect.left,
              top: activeButtonRect.top,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 40,
              mass: 1,
            }}
          />
        )}
        {props.children}
      </TabsPrimitive.List>
    </TabsContext.Provider>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, value, ...props }, ref) => {
  const [isActive, setIsActive] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const tabsContext = React.useContext(TabsContext);

  // Debounce function for resize/zoom events
  const debounce = React.useCallback((func: () => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }, []);

  React.useLayoutEffect(() => {
    const button = buttonRef.current;
    if (!button || !tabsContext) return;

    const checkActiveAndUpdatePosition = () => {
      const isCurrentlyActive = button.getAttribute("data-state") === "active";
      setIsActive(isCurrentlyActive);

      if (isCurrentlyActive) {
        // Get button position relative to the tabs list container
        const listElement = button.closest('[role="tablist"]') as HTMLElement;
        if (listElement) {
          // Use offsetLeft/offsetTop for more reliable positioning relative to parent
          const left = Math.round(button.offsetLeft);
          const top = Math.round(button.offsetTop);
          const width = Math.round(button.offsetWidth);
          const height = Math.round(button.offsetHeight);

          tabsContext.setActiveButtonRect({
            width,
            height,
            left,
            top,
          });
        }
      }
    };

    // Debounced version for resize events
    const debouncedCheck = debounce(checkActiveAndUpdatePosition, 100);

    // Initial check with small delay to ensure DOM is ready
    const initialCheck = () => {
      setTimeout(checkActiveAndUpdatePosition, 10);
    };
    initialCheck();

    // MutationObserver for data-state changes
    const observer = new MutationObserver(checkActiveAndUpdatePosition);
    observer.observe(button, { attributes: true, attributeFilter: ["data-state"] });

    // ResizeObserver for container size changes
    const resizeObserver = new ResizeObserver(debouncedCheck);
    const listElement = button.closest('[role="tablist"]');
    if (listElement) {
      resizeObserver.observe(listElement);
    }

    // Window resize listener for zoom level changes
    window.addEventListener("resize", debouncedCheck);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedCheck);
    };
  }, [tabsContext, debounce]);

  return (
    <TabsPrimitive.Trigger ref={ref} value={value} asChild {...props}>
      <motion.button
        ref={buttonRef}
        className={cn(
          "relative inline-flex items-center justify-center whitespace-nowrap rounded-[0.75rem] px-3 text-[1rem] sm:text-[1.25rem] py-2.5 sm:py-1.5 font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 z-10",
          className,
        )}
        initial={false}
        animate={{
          color: isActive ? "#246645" : "#9C9C9C", // pinto-green vs pinto-gray-4
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
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

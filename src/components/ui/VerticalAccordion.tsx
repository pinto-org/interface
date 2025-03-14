import { deriveTextStyles } from "@/utils/theme";
import { cn } from "@/utils/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button, ButtonProps } from "./Button";
import IconImage from "./IconImage";

interface IChildren {
  children: React.ReactNode;
}

interface Context {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  disableOpen?: boolean;
  hideTriggerOnOpen?: boolean;
  marginOnOpen?: boolean;
}

export interface VerticalAccordionProps extends Context {
  children: React.ReactNode;
}

const VerticalAccordionContext = createContext<Context | null>(null);

const useVerticalAccordionContext = (): Context => {
  const context = useContext(VerticalAccordionContext);
  if (!context) {
    throw new Error("useVerticalAccordionContext must be used within a VerticalAccordionProvider");
  }
  return context;
};

const Component = ({ children }: IChildren) => {
  const { open, hideTriggerOnOpen, marginOnOpen } = useVerticalAccordionContext();
  const [contentHeight, setContentHeight] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Measure content height when content changes
  useEffect(() => {
    if (contentRef.current) {
      const observer = new ResizeObserver((entries) => {
        setContentHeight(entries[0].target.scrollHeight);
      });

      observer.observe(contentRef.current);
      return () => observer.disconnect();
    }
  }, []);

  // Reset animation complete state when accordion closes
  useEffect(() => {
    if (!open) {
      setIsAnimationComplete(false);
    }
  }, [open]);

  // Handle animation end
  const handleTransitionEnd = () => {
    if (open) {
      setIsAnimationComplete(true);
    }
  };

  return (
    <div className="inline-block">
      <div
        className={cn("transition-[max-height] duration-275 ease-in-out overflow-hidden")}
        style={{ maxHeight: open ? `${contentHeight}px` : "0px" }}
        onTransitionEnd={handleTransitionEnd}
      >
        <div ref={contentRef}>{children}</div>
      </div>
      <div
        ref={buttonRef}
        className={cn(
          "transition-all duration-275 ease-in-out",
          marginOnOpen && open ? "mt-2" : "mt-0",
          hideTriggerOnOpen && isAnimationComplete && open && "opacity-0 h-0 overflow-hidden",
        )}
      >
        <VerticalAccordionTrigger />
      </div>
    </div>
  );
};

const VerticalAccordionTrigger = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "children">>((props, ref) => {
  const { open, title, disableOpen, onOpenChange } = useVerticalAccordionContext();

  return (
    <Button
      ref={ref}
      onClick={() => {
        if (!disableOpen) {
          onOpenChange(!open);
        }
      }}
      rounded="some"
      width="full"
      className={cn(
        `flex flex-row bg-pinto-gray-1 hover:bg-pinto-gray-2/40 p-2 h-14 ${deriveTextStyles("sm", true)}`,
        disableOpen && "cursor-default hover:pg-pinto-gray-1",
        props.className,
      )}
    >
      <div className="flex flex-row w-full items-center gap-2 text-black justify-center">
        {title}
        <IconImage
          src={ChevronDownIcon}
          size={4}
          className={cn("transition-transform duration-250", open && "rotate-180 relative top-0.5")}
        />
      </div>
    </Button>
  );
});

const VerticalAccordionProvider = ({ children, ...props }: Context & IChildren) => {
  return <VerticalAccordionContext.Provider value={props}>{children}</VerticalAccordionContext.Provider>;
};

const VerticalAccordion = ({
  children,
  title,
  open,
  onOpenChange,
  hideTriggerOnOpen,
  marginOnOpen,
}: VerticalAccordionProps) => {
  return (
    <VerticalAccordionProvider
      title={title}
      open={open}
      hideTriggerOnOpen={hideTriggerOnOpen}
      marginOnOpen={marginOnOpen}
      onOpenChange={onOpenChange}
    >
      <Component>{children}</Component>
    </VerticalAccordionProvider>
  );
};

export default VerticalAccordion;

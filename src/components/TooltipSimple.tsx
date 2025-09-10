import {
  TooltipContent as RadixStyledTooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import useIsMobile from "@/hooks/display/useIsMobile";
import { cn } from "@/utils/utils";
import { TooltipContent, TooltipPortal } from "@radix-ui/react-tooltip";
import { ReactNode, useCallback, useState } from "react";
import { InfoOutlinedIcon, InfoSolidIcon } from "./Icons";

interface TooltipSimpleProps {
  variant?: "pinto" | "stalk" | "seeds" | "pods" | "gray" | "outlined" | "green" | "unstyled";
  children?: ReactNode;
  content?: ReactNode;
  opaque?: boolean;
  props?: [x: string];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  showOnMobile?: boolean;
  triggerClassName?: string;
  className?: string;
  sideOffset?: number;
  disabled?: boolean;
}

const variantMap = {
  pinto: "text-pinto",
  stalk: "text-pinto-stalk-gold",
  seeds: "text-pinto-seed-silver",
  pods: "text-pinto-pod-bronze",
  gray: "text-pinto-gray-4",
  green: "text-pinto-green-4",
  outlined: "text-pinto-gray-4",
  unstyled: "",
};

export default function TooltipSimple({
  variant = "pinto",
  children,
  content,
  opaque,
  side = "top",
  align = "center",
  showOnMobile,
  triggerClassName,
  className,
  sideOffset = 0,
  disabled = false,
  ...props
}: TooltipSimpleProps) {
  const [open, setOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const ContentComponent = variant === "unstyled" ? TooltipContent : RadixStyledTooltipContent;

  // manually handle open and close on mobile
  const handleOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setOpen((prev) => !prev);
    },
    [open],
  );

  const handleClose = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(false);
  }, []);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={0}>
      {/* manually handle open and close on mobile */}
      <Tooltip open={isMobile ? open : undefined}>
        <TooltipTrigger
          asChild
          className={`cursor-pointer ${showOnMobile ? "" : "hidden sm:flex"}`}
          onClick={isMobile ? handleOpen : undefined}
          onMouseEnter={isMobile ? handleOpen : undefined}
          onMouseLeave={isMobile ? handleClose : undefined}
          onTouchStart={isMobile ? handleOpen : undefined}
        >
          {children || (
            <span
              className={cn(
                `${opaque ? "opacity-[0.4]" : "opacity-100"} ${variantMap[variant] || "text-pinto-gray-4"}`,
                triggerClassName,
              )}
            >
              {["pinto", "gray", "stalk", "seeds", "pods", "green"].includes(variant) ? (
                <InfoSolidIcon color="currentColor" height="1rem" width="1rem" />
              ) : (
                <InfoOutlinedIcon color="currentColor" height="1rem" width="1rem" />
              )}
            </span>
          )}
        </TooltipTrigger>
        <TooltipPortal>
          <ContentComponent
            side={side}
            align={align}
            sideOffset={sideOffset}
            {...props}
            className={cn(showOnMobile && "max-w-[calc(100vw-2rem)] sm:max-w-none", className)}
          >
            {content}
          </ContentComponent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}

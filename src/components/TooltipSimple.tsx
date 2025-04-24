import {
  TooltipContent as RadixStyledTooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/utils/utils";
import { TooltipContent, TooltipPortal } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";
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
  ...props
}: TooltipSimpleProps) {
  const ContentComponent = variant === "unstyled" ? TooltipContent : RadixStyledTooltipContent;
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild className={`${showOnMobile ? "" : "hidden sm:flex"}`}>
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
          <ContentComponent side={side} align={align} sideOffset={sideOffset} className={className} {...props}>
            {content}
          </ContentComponent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}

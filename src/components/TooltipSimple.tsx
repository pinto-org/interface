import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { cn } from "@/utils/utils";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";
import { InfoOutlinedIcon, InfoSolidIcon } from "./Icons";

interface TooltipSimpleProps {
  variant?: "pinto" | "stalk" | "seeds" | "pods" | "gray" | "outlined";
  children?: ReactNode;
  content?: ReactNode;
  opaque?: boolean;
  props?: [x: string];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  triggerClassName?: string;
}

export default function TooltipSimple({
  variant = "pinto",
  children,
  content,
  opaque,
  side = "top",
  align = "center",
  triggerClassName,
  ...props
}: TooltipSimpleProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {children || (
            <span
              className={cn(
                `${opaque ? "opacity-[0.4]" : "opacity-100"} ${
                  variant === "pinto"
                    ? "text-pinto"
                    : variant === "stalk"
                      ? "text-pinto-stalk-gold"
                      : variant === "seeds"
                        ? "text-pinto-seed-silver"
                        : variant === "pods"
                          ? "text-pinto-pod-bronze"
                          : "text-pinto-gray-4"
                }`,
                triggerClassName,
              )}
            >
              {variant === "pinto" ||
              variant === "gray" ||
              variant === "stalk" ||
              variant === "seeds" ||
              variant === "pods" ? (
                <InfoSolidIcon color="currentColor" />
              ) : (
                <InfoOutlinedIcon color="currentColor" />
              )}
            </span>
          )}
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side={side} align={align} {...props}>
            {content}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}

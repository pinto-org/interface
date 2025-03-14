import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { cn } from "@/utils/utils";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";
import { InfoOutlinedIcon, InfoSolidIcon } from "./Icons";

interface TooltipSimpleProps {
  variant?: "pinto" | "stalk" | "seeds" | "pods" | "gray" | "outlined" | "green";
  children?: ReactNode;
  content?: ReactNode;
  opaque?: boolean;
  props?: [x: string];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  showOnMobile?: boolean;
  triggerClassName?: string;
}

export default function TooltipSimple({
  variant = "pinto",
  children,
  content,
  opaque,
  side = "top",
  align = "center",
  showOnMobile,
  triggerClassName,
  ...props
}: TooltipSimpleProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild className={`${showOnMobile ? "" : "hidden sm:flex"}`}>
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
                          : variant === "gray"
                            ? "text-pinto-gray-4"
                            : variant === "green"
                              ? "text-pinto-green-4"
                              : variant === "outlined"
                                ? "text-pinto-gray-4"
                                : "text-pinto-gray-4"
                }`,
                triggerClassName,
              )}
            >
              {variant === "pinto" ||
              variant === "gray" ||
              variant === "stalk" ||
              variant === "seeds" ||
              variant === "pods" ||
              variant === "green" ? (
                <InfoSolidIcon color="currentColor" height="1rem" width="1rem" />
              ) : (
                <InfoOutlinedIcon color="currentColor" height="1rem" width="1rem"/>
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

import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { InfoOutlinedIcon, InfoSolidIcon } from "./Icons";

interface ParentComponentProps {
  variant?: "pinto" | "stalk" | "seed" | "pod" | "gray" | "outlined";
  children?: ReactNode;
  content?: ReactNode;
  props?: [x: string];
}

export default function TooltipSimple({ variant = "pinto", children, content, ...props }: ParentComponentProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <span
              className={`${variant === "pinto" ? "text-pinto" : variant === "stalk" ? "text-pinto-stalk-gold" : variant === "seed" ? "text-pinto-seed-silver" : variant === "pod" ? "text-pinto-pod-bronze" : "text-pinto-gray-4"}`}
            >
              {variant === "pinto" ||
              variant === "gray" ||
              variant === "stalk" ||
              variant === "seed" ||
              variant === "pod" ? (
                <InfoSolidIcon color={"currentColor"} />
              ) : (
                <InfoOutlinedIcon color={"currentColor"} />
              )}
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent {...props}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

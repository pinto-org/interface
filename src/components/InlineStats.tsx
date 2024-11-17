import { cn } from "@/utils/utils";
import { Separator } from "@radix-ui/react-separator";
import React from "react";
import TooltipSimple from "./TooltipSimple";
import Text from "./ui/Text";

export type InlineStat = {
  label: string;
  tooltip?: string;
  value: string;
};

export interface InlineStatsProps {
  title?: string;
  stats: InlineStat[];
  snug?: boolean; // If true, the values will have padding between & not have the justify-between classname
  variant?: "sm" | "md"
}

const InlineStats = ({ title, stats, snug, variant = "md" }: InlineStatsProps) => {
  return (
    <div className="flex flex-col gap-3">
      {title ? <Text variant={variant === "md" ? "body-light" : "sm-light" }>{title}</Text> : null}
      <div className={cn(
          "flex flex-row px-2",
          snug ? "justify-start" : "justify-between gap-1",
        )}
      >
        {stats.map(({ label, tooltip, value }, i) => {
          const isOnly = stats.length === 1;
          const isLast = !isOnly && i === stats.length - 1;
          const isFirst = !isOnly && i === 0;
          const isMiddle = !isFirst && !isLast && !isOnly;

          return (
            <React.Fragment key={`inline-stat-${label}-${value}-${i.toString()}`}>
              <div className={cn("flex flex-col gap-1",
                  isFirst ? "pr-3" : "px-3",
                  isMiddle ? "px-3" : "",
                  isLast ? "pl-3" : "",
              )}>
                <Text
                  variant={variant === "md" ? "body-light" : "sm-light"}
                  color="green4"
                  className={"inline-flex items-center gap-1"}
                  align={isFirst ? "left" : isLast ? "right" : "center"}
                >
                  <Text as="span" variant="inherit" color="inherit" className="opacity-60">
                    {label}
                  </Text>
                  {tooltip && <TooltipSimple content={tooltip} triggerClassName="text-pinto-green-4 w-4 h-4" />}
                </Text>
                <Text variant={"body-light"} color="green4" align={isFirst ? "left" : isLast ? "right" : "center"}>
                  {value}
                </Text>
              </div>
              {!isLast && <Separator orientation="vertical" className="bg-pinto-green-4/30 w-[1px] h-[48px]" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default InlineStats;

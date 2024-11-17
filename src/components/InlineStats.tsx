import { cn } from "@/utils/utils";
import { Separator } from "@radix-ui/react-separator";
import React from "react";
import TooltipSimple from "./TooltipSimple";
import Text from "./ui/Text";

export type InlineStat = {
  label: string;
  tooltip?: string;
  value: string;
  notApplicable?: boolean;
};

export interface InlineStatsProps {
  title?: string;
  stats: InlineStat[];
  variant?: "sm" | "md";
}

const InlineStats = ({ title, stats, variant = "md" }: InlineStatsProps) => {
  return (
    <div className="flex flex-col gap-3">
      {title ? <Text variant={variant === "md" ? "body-light" : "sm-light"}>{title}</Text> : null}
      <div
        className={cn("flex flex-row ", variant === "sm" ? "justify-start gap-0 px-0" : "justify-between gap-1 px-2")}
      >
        {stats.map(({ label, tooltip, value, notApplicable }, i) => {
          const isLast = i === stats.length - 1;
          const isFirst = i === 0;
          const isMiddle = !isFirst && !isLast;

          return (
            <React.Fragment key={`inline-stat-${label}-${value}-${i.toString()}`}>
              <div className={cn("flex flex-col gap-1", isMiddle && "px-3", isFirst && "pr-3", isLast && "pl-3")}>
                <Text
                  variant={variant === "md" ? "body-light" : "sm-light"}
                  color="green4"
                  className={cn(
                    "inline-flex items-center gap-1",
                    notApplicable ? "opacity-50" : "",
                    isFirst && "text-left self-start",
                    isLast && "text-right self-end",
                    !isFirst && !isLast && "text-center self-center",
                  )}
                >
                  <Text as="span" variant="inherit" color="inherit" align="inherit" className="opacity-60">
                    {label}
                  </Text>
                  {tooltip && <TooltipSimple content={tooltip} triggerClassName="text-pinto-green-4 w-4 h-4" />}
                </Text>
                <Text
                  variant={"body-light"}
                  color="green4"
                  align={isFirst ? "left" : isLast ? "right" : "center"}
                  className={cn(notApplicable ? "opacity-50" : "")}
                >
                  {notApplicable ? "N/A" : value}
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

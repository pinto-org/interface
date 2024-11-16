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
  title: string;
  stats: InlineStat[];
}

const InlineStats = ({ title, stats }: InlineStatsProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Text variant="body-light">{title}</Text>
      <div className="flex flex-row w-full justify-between px-2">
        {stats.map(({ label, tooltip, value }, i) => {
          const isLast = i === stats.length - 1;
          const isFirst = i === 0;

          return (
            <React.Fragment key={`inline-stat-${label}-${value}-${i.toString()}`}>
              <div className={cn("flex flex-col gap-1")}>
                <Text
                  variant="body-light"
                  color="green4"
                  className="inline-flex items-center gap-1"
                  align={isFirst ? "left" : isLast ? "right" : "center"}
                >
                  <Text as="span" variant="inherit" color="inherit" className="opacity-60">
                    {label}
                  </Text>
                  {tooltip && <TooltipSimple content={tooltip} triggerClassName="text-pinto-green-4 w-4 h-4" />}
                </Text>
                <Text variant="body-light" color="green4" align={isFirst ? "left" : isLast ? "right" : "center"}>
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

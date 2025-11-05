import useIsMobile from "@/hooks/display/useIsMobile";
import { formatNum } from "@/utils/format";
import { cn } from "@/utils/utils";
import { Separator } from "@radix-ui/react-separator";
import React from "react";
import TooltipSimple from "./TooltipSimple";

export type InlineStat = {
  label: string;
  tooltip?: string;
  value: string;
  rawValue?: number;
  notApplicable?: boolean;
};

interface StatItemProps {
  stat: InlineStat;
  index: number;
  totalStats: number;
  variant: "sm-alt" | "sm" | "md";
  previousStat?: InlineStat;
  mode?: "apy";
  styleAsRow?: boolean;
}

interface MobileStatItemProps {
  stat: InlineStat;
  index: number;
  totalStats: number;
}

const StatItem = ({ stat, index, totalStats, variant, mode, styleAsRow }: StatItemProps) => {
  const { label, tooltip, value, notApplicable } = stat;
  const isLast = index === totalStats - 1;
  const isFirst = index === 0;
  const isMiddle = !isFirst && !isLast;

  const noSeparator = label === "30D:" || label === "90D:";

  return (
    <React.Fragment>
      <div
        className={cn(
          "flex",
          variant === "sm-alt" || (mode === "apy" && styleAsRow) ? "flex-row grow w-full self-center" : "flex-col",
          "gap-1",
          isMiddle && "px-3",
          isFirst && "pr-3",
          isLast && "pl-3",
        )}
      >
        <div
          className={cn(
            "inline-flex items-center gap-1",
            notApplicable ? "opacity-50" : "",
            isFirst && "text-left self-start",
            isLast && "text-right self-end",
            !isFirst && !isLast && "text-center self-center",
            variant === "sm-alt" && "text-center self-center",
            variant === "md" ? "pinto-body-light" : "pinto-sm-light",
            "text-pinto-green-4",
          )}
        >
          <span className="opacity-60">{label}</span>
          {tooltip && <TooltipSimple content={tooltip} triggerClassName="text-pinto-green-4 w-4 h-4" />}
        </div>
        <div
          className={cn(
            notApplicable ? "opacity-50" : "",
            "pinto-body-light",
            "text-pinto-green-4",
            isFirst ? "text-left" : isLast ? "text-right" : "text-center",
          )}
        >
          {notApplicable ? "N/A" : value}
        </div>
      </div>
      {!isLast && !noSeparator && (
        <Separator
          orientation="vertical"
          className={cn("bg-pinto-green-4/30 w-[1px] self-center", variant === "sm-alt" ? "h-6" : "h-12")}
        />
      )}
    </React.Fragment>
  );
};

const MobileStatItem = ({ stat, index, totalStats }: MobileStatItemProps) => {
  const { label, value, rawValue, notApplicable } = stat;
  const isLast = index === totalStats - 1;

  const _value = rawValue ? (rawValue >= 10 ? rawValue / 10 : rawValue * 100) : undefined;
  const decimals = _value ? (_value > 999 || _value < 10 ? 1 : 0) : 1;
  const suffix = _value ? (_value > 999 ? "K%" : "%") : "";

  const noSeparator = label === "30D:" || label === "90D:";

  return (
    <div className="flex flex-row items-center">
      <div className={cn("leading-none", notApplicable && "opacity-50", "flex flex-1 gap-1")}>
        <span>{label}</span>
        {notApplicable
          ? "N/A"
          : _value
            ? `${formatNum(_value, { maxDecimals: decimals, minDecimals: decimals })}${suffix}`
            : value}
      </div>
      {!isLast && !noSeparator && <Separator orientation="vertical" className="bg-pinto-green-4/30 w-[1px] h-6" />}
    </div>
  );
};

export interface InlineStatsProps {
  title?: string;
  stats: InlineStat[];
  variant?: "sm-alt" | "sm" | "md";
  mode?: "apy";
  styleAsRow?: boolean;
}

const shouldDisplayStat = (stat: InlineStat, previousStat?: InlineStat): boolean => {
  if (stat.rawValue === 0) return false;
  if (stat.label === "90D:" && (previousStat?.rawValue || 0) > 0) return false;
  return true;
};

const checkApyMode = (stats: InlineStat[]) => {
  // Index 0 is 24H APY, Index 1 is 7D APY, Index 2 is 30D APY, Index 3 is 90D APY
  // Check if both are zero or undefined/null
  const has24h = !(!stats[0]?.rawValue || stats[0].rawValue === 0);
  const has7d = !(!stats[1]?.rawValue || stats[1].rawValue === 0);
  const has30d = !(!stats[2]?.rawValue || stats[2].rawValue === 0);
  const has90d = !(!stats[3]?.rawValue || stats[3].rawValue === 0);

  // Return mode based on available data
  if (has24h) {
    return "triple";
  } else if (!has24h && has7d) {
    return "double";
  } else if (!has24h && !has7d && (has30d || has90d)) {
    return "single";
  } else {
    return "none";
  }
};

const InlineStats = ({ title, stats, variant = "md", mode, styleAsRow }: InlineStatsProps) => {
  const isMobile = useIsMobile();
  const apyMode = checkApyMode(stats);

  // Filter out stats that shouldn't be displayed
  const displayableStats = stats.filter((stat, i) => shouldDisplayStat(stat, stats[i - 1]));

  return (
    <>
      {(!isMobile || !mode || mode !== "apy") && (
        <div
          className={cn(
            "flex gap-3",
            mode === "apy" && styleAsRow ? "flex-row justify-between h-[5.125rem]" : "flex-col",
          )}
        >
          {title ? (
            <div
              className={cn(
                variant === "md" ? "sm:pinto-body-light" : "sm:pinto-sm-light",
                "pinto-sm",
                styleAsRow && "self-center",
              )}
            >
              {title}
            </div>
          ) : null}
          <div
            className={cn(
              "flex flex-row",
              variant === "sm" ? "justify-start gap-0 px-0" : "justify-between gap-1 px-2",
            )}
          >
            {apyMode === "none" && mode === "apy" ? (
              <StatItem
                key={`inline-stat-none`}
                stat={{ label: "24H:", notApplicable: true, value: "0" }}
                index={0}
                totalStats={1}
                variant={variant}
                mode={mode}
                styleAsRow={styleAsRow}
              />
            ) : (
              displayableStats.map((stat, i) => (
                <StatItem
                  key={`inline-stat-${stat.label}-${stat.value}-${i.toString()}`}
                  stat={stat}
                  index={i}
                  totalStats={displayableStats.length}
                  variant={variant}
                  previousStat={i > 0 ? displayableStats[i - 1] : undefined}
                  mode={mode}
                  styleAsRow={styleAsRow}
                />
              ))
            )}
          </div>
        </div>
      )}
      {mode === "apy" && isMobile && (
        <div className={cn("flex", styleAsRow ? "flex-row justify-between items-center" : "flex-col")}>
          {title ? (
            <div className={`${variant === "md" ? "sm:pinto-body-light" : "sm:pinto-sm-light"} pinto-sm`}>{title}</div>
          ) : null}
          <div
            className={cn(
              "flex sm:hidden flex-row gap-1 items-center rounded-full bg-pinto-green-1 px-2 py-1",
              apyMode === "single" || apyMode === "double" ? "w-fit" : "w-full",
            )}
          >
            <div
              className={cn(
                "pinto-sm-light text-pinto-green-4 gap-2 grid items-center",
                apyMode === "triple" && "grid-cols-3 w-full",
                apyMode === "double" && "grid-cols-2",
                apyMode === "single" && "grid-cols-1",
              )}
            >
              {apyMode === "none" ? (
                <MobileStatItem
                  key={"inline-stat-alt-none"}
                  stat={{ label: "24H:", value: "0", notApplicable: true }}
                  index={0}
                  totalStats={1}
                />
              ) : (
                displayableStats.map((stat, i) => (
                  <MobileStatItem
                    key={`inline-stat-alt-${stat.label}-${stat.value}`}
                    stat={stat}
                    index={i}
                    totalStats={displayableStats.length}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InlineStats;

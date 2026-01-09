import { TokenValue } from "@/classes/TokenValue";
import { cn } from "@/utils/utils";
import React from "react";

interface HoverTooltipProps {
  podAmount: TokenValue;
  placeInLineStart: TokenValue;
  placeInLineEnd: TokenValue;
  visible: boolean;
  alignRight?: boolean;
}

const MILLION = 1_000_000;
const THOUSAND = 1_000;

/**
 * Formats large numbers for display (e.g., 1000000 -> "1M")
 */
export function formatNumber(value: number): string {
  if (value >= MILLION) {
    return `${(value / MILLION).toFixed(1)}M`;
  }
  if (value >= THOUSAND) {
    return `${(value / THOUSAND).toFixed(0)}K`;
  }
  return value.toFixed(0);
}

function HoverTooltipComponent({
  podAmount,
  placeInLineStart,
  placeInLineEnd,
  visible,
  alignRight = false,
}: HoverTooltipProps) {
  if (!visible) return null;

  const formattedPods = formatNumber(podAmount.toNumber());
  const formattedStart = formatNumber(placeInLineStart.toNumber());
  const formattedEnd = formatNumber(placeInLineEnd.toNumber());

  const textClassName = cn("text-[0.875rem] font-[340] text-pinto-gray-4", alignRight ? "text-right" : "text-left");

  const valueClassName = "text-pinto-gray-5 font-[400]";

  return (
    <div className="bg-white border border-pinto-gray-2 shadow-md rounded-lg px-3 py-2 pointer-events-none whitespace-nowrap">
      <div className={textClassName}>
        <span className={valueClassName}>{formattedPods}</span> Pods
      </div>
      <div className={textClassName}>
        Place{" "}
        <span className={valueClassName}>
          {formattedStart} - {formattedEnd}
        </span>
      </div>
    </div>
  );
}

export const HoverTooltip = React.memo<HoverTooltipProps>(HoverTooltipComponent);

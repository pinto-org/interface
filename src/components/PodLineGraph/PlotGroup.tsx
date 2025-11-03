import { cn } from "@/utils/utils";
import React from "react";

interface PlotGroupProps {
  leftPercent: number;
  widthPercent: number;
  borderRadius: string;
  isGreen: boolean;
  isActive: boolean;
  disableInteractions?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children?: React.ReactNode;
}

function PlotGroupComponent({
  leftPercent,
  widthPercent,
  borderRadius,
  isGreen,
  isActive,
  disableInteractions,
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
}: PlotGroupProps) {
  return (
    <div
      className="absolute"
      style={{ left: `${leftPercent}%`, width: `${widthPercent}%`, minWidth: "4px", height: "100%", top: "0%", zIndex: isActive ? 20 : 1 }}
    >
      <div
        className={cn(
          "absolute inset-0 transition-all",
          !disableInteractions && "cursor-pointer",
          isGreen ? "bg-pinto-green-1" : "bg-pinto-morning-orange",
        )}
        style={{ borderRadius }}
        onClick={disableInteractions ? undefined : onClick}
        onMouseEnter={disableInteractions ? undefined : onMouseEnter}
        onMouseLeave={disableInteractions ? undefined : onMouseLeave}
      />
      {children}
    </div>
  );
}

export const PlotGroup = React.memo(PlotGroupComponent);



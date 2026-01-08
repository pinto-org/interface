import { cn } from "@/utils/utils";
import React, { useMemo } from "react";

interface PlotGroupProps {
  leftPercent: number;
  widthPercent: number;
  isHighlighted: boolean;
  isActive: boolean;
  disableInteractions?: boolean;
  onClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
  children?: React.ReactNode;
}

const Z_INDEX_ACTIVE = 20;
const Z_INDEX_DEFAULT = 1;
const MIN_PLOT_WIDTH = "4px";

/**
 * Determines background color based on plot state
 */
function getBackgroundColor(isHighlighted: boolean, isActive: boolean): string {
  if (isHighlighted && isActive) {
    return "bg-pinto-yellow-active"; // Yellow for hover/selected
  }
  if (isHighlighted && !isActive) {
    return "bg-pinto-green-1"; // Green for harvestable plots
  }
  return "bg-pinto-morning-orange"; // Default orange
}

function PlotGroupComponent({
  leftPercent,
  widthPercent,
  isHighlighted,
  isActive,
  disableInteractions = false,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  children,
}: PlotGroupProps) {
  const backgroundColor = useMemo(() => getBackgroundColor(isHighlighted, isActive), [isHighlighted, isActive]);

  const eventHandlers = useMemo(
    () =>
      disableInteractions
        ? {}
        : {
            onClick,
            onMouseEnter,
            onMouseMove,
            onMouseLeave,
          },
    [disableInteractions, onClick, onMouseEnter, onMouseMove, onMouseLeave],
  );

  return (
    <div
      className="absolute inset-y-0"
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        minWidth: MIN_PLOT_WIDTH,
        zIndex: isActive ? Z_INDEX_ACTIVE : Z_INDEX_DEFAULT,
      }}
    >
      <div
        className={cn("absolute inset-0 transition-all", !disableInteractions && "cursor-pointer", backgroundColor)}
        {...eventHandlers}
      />
      {children}
    </div>
  );
}

export const PlotGroup = React.memo<PlotGroupProps>(PlotGroupComponent);

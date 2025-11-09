import { TokenValue } from "@/classes/TokenValue";

export const MIN_PLOT_WIDTH_PERCENT = 0.3;
const PERCENT_MULTIPLIER = 100;

/**
 * Converts a value to percentage of total
 */
function toPercent(value: number, total: number): number {
  return total > 0 ? (value / total) * PERCENT_MULTIPLIER : 0;
}

export interface GroupLayout {
  leftPercent: number;
  displayWidthPercent: number;
}

export interface PartialSelection {
  start: number;
  end: number;
}

export function computeGroupLayout(
  groupStartMinusHarvestable: TokenValue,
  groupEndMinusHarvestable: TokenValue,
  podLine: TokenValue,
): GroupLayout {
  const podLineNum = podLine.toNumber();
  const startNum = groupStartMinusHarvestable.toNumber();
  const endNum = groupEndMinusHarvestable.toNumber();

  const leftPercent = toPercent(startNum, podLineNum);
  const widthPercent = toPercent(endNum - startNum, podLineNum);
  const displayWidthPercent = Math.max(widthPercent, MIN_PLOT_WIDTH_PERCENT);

  return { leftPercent, displayWidthPercent };
}

export function computePartialSelectionPercent(
  groupStart: TokenValue,
  groupEnd: TokenValue,
  rangeStart: TokenValue,
  rangeEnd: TokenValue,
): PartialSelection | null {
  // Check if range overlaps with group
  if (!rangeStart.lt(groupEnd) || !rangeEnd.gt(groupStart)) {
    return null;
  }

  const groupTotal = groupEnd.sub(groupStart).toNumber();
  if (groupTotal <= 0) return null;

  // Calculate overlap boundaries
  const overlapStart = rangeStart.gt(groupStart) ? rangeStart : groupStart;
  const overlapEnd = rangeEnd.lt(groupEnd) ? rangeEnd : groupEnd;

  const overlapStartOffset = overlapStart.sub(groupStart).toNumber();
  const overlapEndOffset = overlapEnd.sub(groupStart).toNumber();

  return {
    start: toPercent(overlapStartOffset, groupTotal),
    end: toPercent(overlapEndOffset, groupTotal),
  };
}

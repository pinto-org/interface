import { TokenValue } from "@/classes/TokenValue";

export const MIN_PLOT_WIDTH_PERCENT = 0.3;

export function computeGroupLayout(
  groupStartMinusHarvestable: TokenValue,
  groupEndMinusHarvestable: TokenValue,
  podLine: TokenValue,
  isLastGroup: boolean,
): { leftPercent: number; displayWidthPercent: number; borderRadius: string } {
  const leftPercent = podLine.gt(0)
    ? (groupStartMinusHarvestable.toNumber() / podLine.toNumber()) * 100
    : 0;
  const widthPercent = podLine.gt(0)
    ? ((groupEndMinusHarvestable.toNumber() - groupStartMinusHarvestable.toNumber()) / podLine.toNumber()) * 100
    : 0;
  const displayWidthPercent = Math.max(widthPercent, MIN_PLOT_WIDTH_PERCENT);

  let borderRadius = "2px";
  if (isLastGroup && leftPercent + displayWidthPercent > 99) {
    borderRadius = "0 2px 2px 0";
  }

  return { leftPercent, displayWidthPercent, borderRadius };
}

export function computePartialSelectionPercent(
  groupStart: TokenValue,
  groupEnd: TokenValue,
  rangeStart: TokenValue,
  rangeEnd: TokenValue,
): { start: number; end: number } | null {
  if (!(rangeStart.lt(groupEnd) && rangeEnd.gt(groupStart))) return null;

  const overlapStart = rangeStart.gt(groupStart) ? rangeStart : groupStart;
  const overlapEnd = rangeEnd.lt(groupEnd) ? rangeEnd : groupEnd;

  const groupTotal = groupEnd.sub(groupStart).toNumber();
  if (groupTotal <= 0) return null;

  const overlapStartOffset = overlapStart.sub(groupStart).toNumber();
  const overlapEndOffset = overlapEnd.sub(groupStart).toNumber();

  return {
    start: (overlapStartOffset / groupTotal) * 100,
    end: (overlapEndOffset / groupTotal) * 100,
  };
}



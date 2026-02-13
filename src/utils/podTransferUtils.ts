import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { PodTransferData } from "@/pages/transfer/actions/TransferPods";
import { Plot } from "@/utils/types";

/**
 * Converts a cumulative offset range [rangeStart, rangeEnd] across sorted plots
 * into per-plot PodTransferData records with relative start/end values.
 *
 * Adapted from CreateListing's `listingData` useMemo logic.
 *
 * @param selectedPlots - Plots sorted by index
 * @param podRange - [rangeStart, rangeEnd] cumulative offset (0 to totalPods)
 * @returns PodTransferData[] with one entry per intersecting plot
 */
export function computeTransferData(selectedPlots: Plot[], podRange: [number, number]): PodTransferData[] {
  const result: PodTransferData[] = [];
  let cumulativeStart = 0;

  for (const plot of selectedPlots) {
    const plotPods = plot.pods.toNumber();
    const cumulativeEnd = cumulativeStart + plotPods;

    // Check if this plot intersects with the selected range
    if (podRange[1] > cumulativeStart && podRange[0] < cumulativeEnd) {
      const startInPlot = Math.max(0, podRange[0] - cumulativeStart);
      const endInPlot = Math.min(plotPods, podRange[1] - cumulativeStart);

      if (endInPlot > startInPlot) {
        result.push({
          id: plot.index,
          start: TokenValue.fromHuman(startInPlot, PODS.decimals),
          end: TokenValue.fromHuman(endInPlot, PODS.decimals),
        });
      }
    }

    cumulativeStart = cumulativeEnd;
  }

  return result;
}

/**
 * Converts a cumulative offset (relative to sorted plots) into an absolute
 * TokenValue index on the pod line.
 *
 * Adapted from CreateListing's `selectedPodRange` useMemo logic.
 *
 * @param offset - Cumulative offset (0 to totalPods)
 * @param sortedPlots - Plots sorted by index
 * @returns Absolute TokenValue index on the pod line
 */
export function offsetToAbsoluteIndex(offset: number, sortedPlots: Plot[]): TokenValue {
  let remainingOffset = offset;

  for (const plot of sortedPlots) {
    const plotPods = plot.pods.toNumber();
    if (remainingOffset <= plotPods) {
      return plot.index.add(TokenValue.fromHuman(remainingOffset, PODS.decimals));
    }
    remainingOffset -= plotPods;
  }

  // Fallback: offset exceeds total pods, clamp to end of last plot
  const lastPlot = sortedPlots[sortedPlots.length - 1];
  return lastPlot.index.add(lastPlot.pods);
}

/**
 * Computes a consolidated summary range from transfer data records.
 *
 * - totalPods: sum of (end - start) across all records
 * - placeInLineStart: first record's (id + start) - harvestableIndex
 * - placeInLineEnd: last record's (id + end) - harvestableIndex
 *
 * @param transferData - Array of PodTransferData (must have at least one entry)
 * @param harvestableIndex - Current harvestable index on the pod line
 * @returns { totalPods, placeInLineStart, placeInLineEnd }
 */
export function computeSummaryRange(
  transferData: PodTransferData[],
  harvestableIndex: TokenValue,
): { totalPods: TokenValue; placeInLineStart: TokenValue; placeInLineEnd: TokenValue } {
  const totalPods = transferData.reduce((sum, record) => sum.add(record.end.sub(record.start)), TokenValue.ZERO);

  const first = transferData[0];
  const last = transferData[transferData.length - 1];

  const rangeStart = first.id.add(first.start);
  const rangeEnd = last.id.add(last.end);

  return {
    totalPods,
    placeInLineStart: rangeStart.sub(harvestableIndex),
    placeInLineEnd: rangeEnd.sub(harvestableIndex),
  };
}

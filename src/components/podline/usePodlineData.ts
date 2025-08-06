import { TokenValue } from "@/classes/TokenValue";
import { useHarvestableIndex, usePodIndex } from "@/state/useFieldData";
import { useMemo } from "react";
import { PodSegment, PodSegmentType, PodlineData, PodlineViewMode } from "./types";
import { usePlotClustering } from "./usePlotClustering";

/**
 * Hook to process pod data for the podline visualization
 */
export function usePodlineData(viewMode: PodlineViewMode = "current", farmerField?: any) {
  const harvestableIndex = useHarvestableIndex();
  const podIndex = usePodIndex();

  // Get metrics for clustering
  const totalPodsIssued = podIndex || TokenValue.ZERO;
  const currentHarvestableIndex = harvestableIndex || TokenValue.ZERO;
  const allPlots = farmerField?.plots || [];

  // Use clustering to group adjacent/nearby plots (only for current view)
  const plotClusters = usePlotClustering(
    viewMode === "current" ? allPlots : [],
    totalPodsIssued,
    currentHarvestableIndex,
    {
      enabled: viewMode === "current",
      proximityThreshold: 0.03, // 3% of total pod line
      minClusterSize: 2,
      maxIndividualPlotSize: 0.01, // 1% of total pod line
    },
  );

  const podlineData = useMemo((): PodlineData => {
    const segments: PodSegment[] = [];

    // Calculate user totals - use provided farmerField or fallback to zero values
    const userTotalPods = farmerField
      ? farmerField.totalUnharvestablePods.add(farmerField.totalHarvestablePods)
      : TokenValue.ZERO;
    const userHarvestablePods = farmerField?.totalHarvestablePods || TokenValue.ZERO;

    if (viewMode === "historical") {
      // Include harvested segment for historical view
      if (currentHarvestableIndex.gt(0)) {
        const harvestedSegment: PodSegment = {
          type: "harvested",
          podCount: currentHarvestableIndex,
          startIndex: TokenValue.ZERO,
          endIndex: currentHarvestableIndex,
          isUserOwned: false,
          isHarvestable: true,
          metadata: {
            source: "HARVESTED",
            viewMode,
          },
        };
        segments.push(harvestedSegment);
      }
      // Add remaining pods that haven't been harvested yet
      if (totalPodsIssued.gt(currentHarvestableIndex)) {
        const remainingPods = totalPodsIssued.sub(currentHarvestableIndex);
        const remainingSegment: PodSegment = {
          type: "other-pods",
          podCount: remainingPods,
          startIndex: currentHarvestableIndex,
          endIndex: totalPodsIssued,
          isUserOwned: false,
          isHarvestable: false,
        };
        segments.push(remainingSegment);
      }
    } else {
      // Current view: Show current pod queue with clustering

      // Track current position for gap detection
      let currentPosition = currentHarvestableIndex;

      // Process plot clusters and create segments
      console.log(`🎯 [PODLINE DEBUG] Processing ${plotClusters.length} plot clusters for visualization`);
      for (const cluster of plotClusters) {
        const clusterStart = cluster.startIndex;
        const clusterEnd = cluster.endIndex;
        console.log(
          `📊 [PODLINE DEBUG] Processing cluster: type=${cluster.clusterType}, plots=${cluster.plots.length}, pods=${cluster.totalPods.toHuman()}, range=${clusterStart.toHuman()}-${clusterEnd.toHuman()}`,
        );

        // Skip fully harvested clusters
        if (clusterEnd.lte(currentHarvestableIndex || TokenValue.ZERO)) {
          continue;
        }

        // Add gap segment if there's a gap before this cluster
        if (clusterStart.gt(currentPosition)) {
          const gapSize = clusterStart.sub(currentPosition);
          const gapSegment: PodSegment = {
            type: "other-pods",
            podCount: gapSize,
            startIndex: currentPosition,
            endIndex: clusterStart,
            isUserOwned: false,
            isHarvestable: false,
          };
          segments.push(gapSegment);
        }

        // Add user's cluster segment
        const effectiveStart = TokenValue.max(clusterStart, currentHarvestableIndex || TokenValue.ZERO);
        const effectivePods = clusterEnd.sub(effectiveStart);

        if (effectivePods.gt(0)) {
          // Create aggregate metadata from all plots in cluster
          const seasons = cluster.plots.map((p) => p.season).filter(Boolean) as number[];
          const avgSeason =
            seasons.length > 0 ? Math.round(seasons.reduce((sum, s) => sum + s, 0) / seasons.length) : undefined;

          const temperatures = cluster.plots
            .map((p) => (p.beansPerPod ? (1 / p.beansPerPod.toNumber()) * 100 - 100 : undefined))
            .filter(Boolean) as number[];
          const avgTemperature =
            temperatures.length > 0 ? temperatures.reduce((sum, t) => sum + t, 0) / temperatures.length : undefined;

          const sources = [...new Set(cluster.plots.map((p) => p.source).filter(Boolean))];

          const userSegment: PodSegment = {
            type: "user-pods",
            podCount: effectivePods,
            startIndex: effectiveStart,
            endIndex: clusterEnd,
            isUserOwned: true,
            isHarvestable: clusterStart.lt(currentHarvestableIndex || TokenValue.ZERO),
            cluster, // Include reference to the cluster for click handling
            metadata: {
              season: avgSeason,
              temperature: avgTemperature,
              source: sources.join(", "),
            },
          };
          console.log(
            `✅ [PODLINE DEBUG] Created cluster segment: ${cluster.clusterType} with ${cluster.plots.length} plots, ${effectivePods.toHuman()} pods from ${effectiveStart.toHuman()} to ${clusterEnd.toHuman()}`,
          );
          segments.push(userSegment);
          currentPosition = clusterEnd;
        }
      }

      // Fill remaining space to total pods issued
      if (totalPodsIssued.gt(currentPosition)) {
        const remainingPods = totalPodsIssued.sub(currentPosition);
        const remainingSegment: PodSegment = {
          type: "other-pods",
          podCount: remainingPods,
          startIndex: currentPosition,
          endIndex: totalPodsIssued,
          isUserOwned: false,
          isHarvestable: false,
        };
        segments.push(remainingSegment);
      }
    }

    // Sort segments by start index to ensure proper order
    segments.sort((a, b) => a.startIndex.sub(b.startIndex).toNumber());

    // Merge adjacent segments of the same type for cleaner visualization
    const mergedSegments = mergeAdjacentSegments(segments);

    const userSegmentsCount = mergedSegments.filter((s) => s.isUserOwned).length;
    const clusteredSegmentsCount = mergedSegments.filter((s) => s.cluster).length;
    console.log(
      `🎯 [PODLINE DEBUG] Final result: ${mergedSegments.length} total segments, ${userSegmentsCount} user-owned segments, ${clusteredSegmentsCount} cluster-based segments`,
    );

    return {
      segments: mergedSegments,
      totalPodsIssued,
      harvestableIndex: currentHarvestableIndex,
      totalPodsPaidBack: currentHarvestableIndex, // In current implementation, this equals harvestableIndex
      userTotalPods,
      userHarvestablePods,
    };
  }, [farmerField, harvestableIndex, podIndex, viewMode, plotClusters]);

  const isLoading = farmerField?.isLoading || !harvestableIndex || !podIndex;

  return {
    data: podlineData,
    isLoading,
    refetch: farmerField?.refetch,
  };
}

/**
 * Merge adjacent segments of the same type to reduce visual complexity
 */
function mergeAdjacentSegments(segments: PodSegment[]): PodSegment[] {
  if (segments.length <= 1) return segments;

  const merged: PodSegment[] = [];
  let current = segments[0];

  for (let i = 1; i < segments.length; i++) {
    const next = segments[i];

    // Check if we can merge with the current segment
    // Don't merge user-owned segments to preserve individual plot clickability
    if (
      current.type === next.type &&
      current.isUserOwned === next.isUserOwned &&
      current.endIndex.eq(next.startIndex) && // Adjacent segments
      !(current.isUserOwned && next.isUserOwned) // Don't merge when both segments are user-owned
    ) {
      // Merge the segments
      current = {
        ...current,
        podCount: current.podCount.add(next.podCount),
        endIndex: next.endIndex,
      };
    } else {
      // Can't merge, add current to result and move to next
      merged.push(current);
      current = next;
    }
  }

  // Add the last segment
  merged.push(current);

  return merged;
}

/**
 * Get the appropriate segment type based on plot characteristics
 */
function getSegmentType(isUserOwned: boolean, isHarvestable: boolean, isHistoricalView: boolean): PodSegmentType {
  if (isHistoricalView && isHarvestable) {
    return "harvested";
  }

  if (isUserOwned) {
    return "user-pods";
  }

  return "other-pods";
}

/**
 * Helper hook to get summary statistics for display
 */
export function usePodlineSummary(viewMode: PodlineViewMode = "current", farmerField?: any) {
  const { data } = usePodlineData(viewMode, farmerField);

  return useMemo(() => {
    const userSegments = data.segments.filter((s) => s.isUserOwned);
    const harvestableSegments = data.segments.filter((s) => s.isHarvestable && s.isUserOwned);

    const userPodsInLine = userSegments.reduce((sum, segment) => sum.add(segment.podCount), TokenValue.ZERO);

    const harvestableUserPods = harvestableSegments.reduce(
      (sum, segment) => sum.add(segment.podCount),
      TokenValue.ZERO,
    );

    // Calculate user's earliest position in line
    const earliestUserPosition =
      userSegments.length > 0 ? userSegments[0].startIndex.sub(data.harvestableIndex) : TokenValue.ZERO;

    return {
      totalPodsIssued: data.totalPodsIssued,
      totalPodsPaidBack: data.totalPodsPaidBack,
      userPodsInLine,
      harvestableUserPods,
      earliestPositionInLine: TokenValue.max(earliestUserPosition, TokenValue.ZERO),
      hasHarvestablePods: harvestableUserPods.gt(0),
      hasPodsInLine: userPodsInLine.gt(0),
    };
  }, [data, viewMode]);
}

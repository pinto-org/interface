import { TokenValue } from "@/classes/TokenValue";
import { Plot } from "@/utils/types";
import { useMemo } from "react";
import { PlotCluster, PlotClusteringConfig } from "./types";

// Default clustering configuration
const DEFAULT_CLUSTERING_CONFIG: PlotClusteringConfig = {
  proximityThreshold: 0.03, // 3% of total pod line
  minClusterSize: 2,
  maxIndividualPlotSize: 0.01, // 1% of total pod line
  enabled: true,
};

/**
 * Hook to cluster plots that are adjacent or within a proximity threshold
 */
export function usePlotClustering(
  plots: Plot[],
  totalPodsIssued: TokenValue,
  harvestableIndex: TokenValue,
  config: Partial<PlotClusteringConfig> = {},
) {
  const clusteringConfig: PlotClusteringConfig = { ...DEFAULT_CLUSTERING_CONFIG, ...config };

  return useMemo(() => {
    if (!clusteringConfig.enabled || plots.length === 0) {
      // Return individual clusters when clustering is disabled
      return plots.map((plot, index) => createSinglePlotCluster(plot, index.toString(), harvestableIndex));
    }

    console.log(`🔍 [CLUSTERING] Starting clustering for ${plots.length} plots`);

    // Calculate proximity threshold in absolute terms
    const proximityThresholdValue = totalPodsIssued.mul(clusteringConfig.proximityThreshold);
    const maxIndividualSizeValue = totalPodsIssued.mul(clusteringConfig.maxIndividualPlotSize);

    console.log(
      `📏 [CLUSTERING] Proximity threshold: ${proximityThresholdValue.toHuman()} pods (${(clusteringConfig.proximityThreshold * 100).toFixed(1)}%)`,
    );

    const clusters: PlotCluster[] = [];
    const sortedPlots = [...plots].sort((a, b) => a.index.sub(b.index).toNumber());

    let i = 0;
    while (i < sortedPlots.length) {
      const currentPlot = sortedPlots[i];
      const currentPlotSize = currentPlot.pods || TokenValue.ZERO;

      // Check if this plot is large enough to remain individual
      if (currentPlotSize.gt(maxIndividualSizeValue)) {
        console.log(
          `🎯 [CLUSTERING] Large plot kept individual: ${currentPlotSize.toHuman()} pods at index ${currentPlot.index.toHuman()}`,
        );
        clusters.push(createSinglePlotCluster(currentPlot, clusters.length.toString(), harvestableIndex));
        i++;
        continue;
      }

      // Look ahead to find plots that can be clustered together
      const clusterPlots = [currentPlot];
      let j = i + 1;

      while (j < sortedPlots.length) {
        const nextPlot = sortedPlots[j];
        const nextPlotSize = nextPlot.pods || TokenValue.ZERO;

        // Don't cluster with large plots
        if (nextPlotSize.gt(maxIndividualSizeValue)) {
          break;
        }

        // Calculate gap between current cluster end and next plot start
        const clusterEnd = getClusterEndIndex(clusterPlots);
        const gap = nextPlot.index.sub(clusterEnd);

        console.log(
          `📊 [CLUSTERING] Checking gap of ${gap.toHuman()} pods between cluster and plot at ${nextPlot.index.toHuman()}`,
        );

        // If gap is within threshold, add to cluster
        if (gap.lte(proximityThresholdValue)) {
          clusterPlots.push(nextPlot);
          console.log(`✅ [CLUSTERING] Added plot to cluster (now ${clusterPlots.length} plots)`);
          j++;
        } else {
          break;
        }
      }

      // Create cluster if we have enough plots, otherwise create individual clusters
      if (clusterPlots.length >= clusteringConfig.minClusterSize) {
        const cluster = createMultiPlotCluster(clusterPlots, clusters.length.toString(), harvestableIndex);
        console.log(
          `🎯 [CLUSTERING] Created multi-plot cluster: ${cluster.plots.length} plots, ${cluster.totalPods.toHuman()} total pods`,
        );
        clusters.push(cluster);
      } else {
        // Create individual clusters for plots that don't meet clustering requirements
        for (const plot of clusterPlots) {
          clusters.push(createSinglePlotCluster(plot, clusters.length.toString(), harvestableIndex));
        }
      }

      i = j;
    }

    const multiPlotClusters = clusters.filter((c) => c.clusterType === "multi");
    console.log(
      `🎯 [CLUSTERING] Final result: ${clusters.length} total clusters, ${multiPlotClusters.length} multi-plot clusters`,
    );

    return clusters;
  }, [plots, totalPodsIssued, harvestableIndex, clusteringConfig]);
}

/**
 * Create a single-plot cluster
 */
function createSinglePlotCluster(plot: Plot, clusterId: string, harvestableIndex: TokenValue): PlotCluster {
  const totalPods = plot.pods || TokenValue.ZERO;
  const harvestablePods = plot.harvestablePods || TokenValue.ZERO;
  const unharvestablePods = plot.unharvestablePods || TokenValue.ZERO;
  const isHarvestable = harvestablePods.gt(0);

  return {
    plots: [plot],
    totalPods,
    totalHarvestablePods: harvestablePods,
    totalUnharvestablePods: unharvestablePods,
    startIndex: plot.index,
    endIndex: plot.index.add(totalPods),
    hasHarvestablePods: isHarvestable,
    allPlotsHarvestable: isHarvestable,
    clusterType: "single",
    clusterId,
  };
}

/**
 * Create a multi-plot cluster
 */
function createMultiPlotCluster(plots: Plot[], clusterId: string, harvestableIndex: TokenValue): PlotCluster {
  if (plots.length === 0) {
    throw new Error("Cannot create cluster with no plots");
  }

  // Sort plots by index to ensure proper ordering
  const sortedPlots = [...plots].sort((a, b) => a.index.sub(b.index).toNumber());

  // Calculate totals
  let totalPods = TokenValue.ZERO;
  let totalHarvestablePods = TokenValue.ZERO;
  let totalUnharvestablePods = TokenValue.ZERO;
  let harvestableCount = 0;

  for (const plot of sortedPlots) {
    const plotPods = plot.pods || TokenValue.ZERO;
    const plotHarvestablePods = plot.harvestablePods || TokenValue.ZERO;
    const plotUnharvestablePods = plot.unharvestablePods || TokenValue.ZERO;

    totalPods = totalPods.add(plotPods);
    totalHarvestablePods = totalHarvestablePods.add(plotHarvestablePods);
    totalUnharvestablePods = totalUnharvestablePods.add(plotUnharvestablePods);

    if (plotHarvestablePods.gt(0)) {
      harvestableCount++;
    }
  }

  const firstPlot = sortedPlots[0];
  const lastPlot = sortedPlots[sortedPlots.length - 1];
  const endIndex = lastPlot.index.add(lastPlot.pods || TokenValue.ZERO);

  return {
    plots: sortedPlots,
    totalPods,
    totalHarvestablePods,
    totalUnharvestablePods,
    startIndex: firstPlot.index,
    endIndex,
    hasHarvestablePods: totalHarvestablePods.gt(0),
    allPlotsHarvestable: harvestableCount === sortedPlots.length,
    clusterType: "multi",
    clusterId,
  };
}

/**
 * Get the end index of a cluster of plots
 */
function getClusterEndIndex(plots: Plot[]): TokenValue {
  if (plots.length === 0) return TokenValue.ZERO;

  const sortedPlots = [...plots].sort((a, b) => a.index.sub(b.index).toNumber());
  const lastPlot = sortedPlots[sortedPlots.length - 1];

  return lastPlot.index.add(lastPlot.pods || TokenValue.ZERO);
}

/**
 * Helper hook to get clustering statistics for debugging
 */
export function useClusteringStats(clusters: PlotCluster[]) {
  return useMemo(() => {
    const multiClusters = clusters.filter((c) => c.clusterType === "multi");
    const singleClusters = clusters.filter((c) => c.clusterType === "single");
    const totalPlots = clusters.reduce((sum, cluster) => sum + cluster.plots.length, 0);

    return {
      totalClusters: clusters.length,
      multiPlotClusters: multiClusters.length,
      singlePlotClusters: singleClusters.length,
      totalPlots,
      averagePlotsPerCluster: totalPlots / clusters.length,
      clusteringEfficiency: multiClusters.length > 0 ? (totalPlots - clusters.length) / totalPlots : 0,
    };
  }, [clusters]);
}

import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import { Plot } from "@/utils/types";
import React, { memo, useState } from "react";
import { ClusterPlotsTable } from "./ClusterPlotsTable";
import { PlotCluster } from "./types";

interface ClusterDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cluster: PlotCluster | null;
}

export const ClusterDetailsDialog = memo(({ open, onOpenChange, cluster }: ClusterDetailsDialogProps) => {
  const handlePlotClick = (plot: Plot) => {
    // Could navigate to field or show additional actions in the future
  };

  if (!cluster) return null;

  const isMultiPlot = cluster.clusterType === "multi";
  const allHarvestable = cluster.allPlotsHarvestable;
  const hasHarvestable = cluster.hasHarvestablePods;
  const harvestableCount = cluster.plots.filter((p) => p.harvestablePods?.gt(0) ?? false).length;

  return (
    <>
      <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <ResponsiveDialog.Content className="max-w-4xl max-h-[80vh] flex flex-col will-change-transform">
          <ResponsiveDialog.Header className="border-b pb-4 flex-shrink-0">
            <ResponsiveDialog.Title className="pinto-h3 font-normal">
              {isMultiPlot ? `Plot Cluster (${cluster.plots.length} Plots)` : "My Plot"}
              {hasHarvestable && (
                <span className="ml-2 text-sm text-green-600 font-normal">
                  ({allHarvestable ? "All" : `${harvestableCount}`} harvestable)
                </span>
              )}
            </ResponsiveDialog.Title>
          </ResponsiveDialog.Header>

          <div className="flex-1 overflow-y-auto pt-4 min-h-0">
            <ClusterPlotsTable
              cluster={cluster}
              onPlotClick={handlePlotClick}
              showActions={hasHarvestable}
              enablePagination={true}
              initialPageSize={10}
              compact={false}
            />
          </div>
        </ResponsiveDialog.Content>
      </ResponsiveDialog>
    </>
  );
});

ClusterDetailsDialog.displayName = "ClusterDetailsDialog";

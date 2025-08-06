import { formatter } from "@/utils/format";
import { Plot } from "@/utils/types";
import { cn } from "@/utils/utils";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs";
import { PlotDetailsDialog } from "./PlotDetailsDialog";
import PodlineBarChart from "./PodlineBarChart";
import { ViewMyPodsDialog } from "./ViewMyPodsDialog";
import { PodSegment, PodlineViewMode, PodlineVisualizationProps } from "./types";
import { usePodlineData, usePodlineSummary } from "./usePodlineData";

const PodlineVisualization = React.memo(
  ({
    className,
    defaultViewMode = "current",
    showActions = true,
    height = 80,
    farmerField,
  }: PodlineVisualizationProps) => {
    const [viewMode, setViewMode] = useState<PodlineViewMode>(defaultViewMode);
    const [showPodsDialog, setShowPodsDialog] = useState(false);
    const [showPlotDialog, setShowPlotDialog] = useState(false);
    const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
    const navigate = useNavigate();

    // Fetch podline data and summary with farmer field data
    const { data, isLoading } = usePodlineData(viewMode, farmerField);
    const summary = usePodlineSummary(viewMode, farmerField);

    // Get farmer field data
    const hasPods = farmerField?.plots?.length > 0;

    // Handle segment interactions
    const handleSegmentClick = useCallback(
      (segment: PodSegment, _datasetIndex: number) => {
        console.log(`🎯 [PODLINE CLICK] Segment clicked:`, {
          isUserOwned: segment.isUserOwned,
          hasPlot: !!segment.plot,
          podCount: segment.podCount.toHuman(),
          plotSeason: segment.plot?.season,
        });

        if (segment.isUserOwned && segment.plot) {
          // Show plot details dialog for user-owned segments
          setSelectedPlot(segment.plot);
          setShowPlotDialog(true);
        } else if (segment.isUserOwned) {
          // Fallback to navigation if no plot data (shouldn't happen)
          console.log(`⚠️ [PODLINE CLICK] User segment without plot data - falling back to navigation`);
          if (segment.isHarvestable) {
            navigate("/field?action=harvest");
          } else {
            navigate("/field");
          }
        }
      },
      [navigate],
    );

    const handleSegmentHover = useCallback((_segment: PodSegment | null, _datasetIndex?: number) => {
      // Could add hover state management here if needed
    }, []);

    // Action button handlers
    const handleHarvestClick = useCallback(() => {
      navigate("/field?action=harvest");
    }, [navigate]);

    const handleViewPodsClick = useCallback(() => {
      console.log("🚀 [PERFORMANCE] View Pods clicked at:", new Date().toISOString());
      console.time("⏱️  View Pods Dialog Open");
      setShowPodsDialog(true);
    }, []);

    const handleToggleChange = useCallback((value: string) => {
      setViewMode(value as PodlineViewMode);
    }, []);

    if (isLoading) {
      return (
        <div className={cn("rounded-[20px] bg-gray-1 p-6", className)}>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      );
    }

    return (
      <div className={cn("rounded-[20px] bg-gray-1", className)}>
        {/* Header with title and toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <h3 className="pinto-body sm:pinto-h3 text-pinto-gray-5 font-normal">Pod Line</h3>

            {/* Summary metrics */}
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <div className="text-pinto-gray-4 pinto-sm">Total: {formatter.number(data.totalPodsIssued)} Pods</div>
              {viewMode === "historical" && (
                <div className="text-pinto-green-4 pinto-sm">Paid Back: {formatter.number(data.totalPodsPaidBack)}</div>
              )}
              {summary.hasPodsInLine && (
                <div className="text-pinto-green-4 pinto-sm">Your Pods: {formatter.number(summary.userPodsInLine)}</div>
              )}
            </div>
          </div>

          {/* View mode toggle */}
          <div className="mt-3 sm:mt-0">
            <Tabs value={viewMode} onValueChange={handleToggleChange}>
              <TabsList className="h-8 bg-pinto-gray-1 p-1">
                <TabsTrigger
                  value="historical"
                  className="h-6 px-3 text-xs font-normal data-[state=active]:bg-white data-[state=active]:text-pinto-gray-5"
                >
                  Historical
                </TabsTrigger>
                <TabsTrigger
                  value="current"
                  className="h-6 px-3 text-xs font-normal data-[state=active]:bg-white data-[state=active]:text-pinto-gray-5"
                >
                  Current
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Main chart */}
        <div className=" relative">
          {/* View my pods link positioned above the chart */}
          {hasPods && (
            <div className="absolute top-2 right-3 z-10">
              <Button variant="hoverTextPrimary" onClick={handleViewPodsClick} noPadding className="text-sm">
                View my pods
              </Button>
            </div>
          )}

          <PodlineBarChart
            viewMode={viewMode}
            height={height * 2}
            farmerField={farmerField}
            onSegmentClick={handleSegmentClick}
            onSegmentHover={handleSegmentHover}
          />
        </div>

        {/* Action buttons */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-3 px-6 pb-6">
            {summary.hasHarvestablePods && (
              <Button
                onClick={handleHarvestClick}
                variant="default"
                size="sm"
                className="bg-pinto-green-4 hover:bg-pinto-green-5 text-white flex items-center gap-2"
              >
                <span className="text-lg">🌱</span>
                Harvest your pods!
              </Button>
            )}

            {!summary.hasPodsInLine && !summary.hasHarvestablePods && (
              <div className="text-pinto-gray-4 pinto-sm italic">
                No pods in the line.
                <button
                  type="button"
                  onClick={() => navigate("/field?action=sow")}
                  className="ml-1 text-pinto-green-4 hover:underline"
                >
                  Sow some Pinto to get started!
                </button>
              </div>
            )}
          </div>
        )}

        {/* Additional info for current view */}
        {viewMode === "current" && summary.hasPodsInLine && (
          <div className="px-6 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-pinto-gray-4 pinto-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Your pods</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span>Other farmers' pods</span>
              </div>
              {data.harvestableIndex.gt(0) && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Harvestable zone</span>
                </div>
              )}
            </div>

            {summary.earliestPositionInLine.gt(0) && (
              <div className="mt-2 text-pinto-gray-4 pinto-xs">
                Your earliest pod is {formatter.number(summary.earliestPositionInLine)} positions in line
              </div>
            )}
          </div>
        )}

        {/* View My Pods Dialog */}
        <ViewMyPodsDialog open={showPodsDialog} onOpenChange={setShowPodsDialog} hasPods={hasPods} />

        {/* Plot Details Dialog */}
        <PlotDetailsDialog open={showPlotDialog} onOpenChange={setShowPlotDialog} plot={selectedPlot} />
      </div>
    );
  },
);

PodlineVisualization.displayName = "PodlineVisualization";

export default PodlineVisualization;

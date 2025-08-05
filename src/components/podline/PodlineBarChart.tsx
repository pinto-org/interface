import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  LinearScale,
  Plugin,
} from "chart.js";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ReactChart } from "../ReactChart";
import {
  createPodlineDatasets,
  createPodlineGradients,
  podlineTheme,
  podlineTooltipPlugin,
  segmentInteractionPlugin,
  timelineLabelsPlugin,
} from "./podlineChartHelpers";
import { PodSegment, PodlineBarChartProps } from "./types";
import { usePodlineData } from "./usePodlineData";

// Register Chart.js components for horizontal bar chart
Chart.register(BarController, BarElement, CategoryScale, LinearScale);

const PodlineBarChart = React.memo(
  ({ viewMode, height = 80, onSegmentClick, onSegmentHover }: Omit<PodlineBarChartProps, "data">) => {
    const chartRef = useRef<Chart | null>(null);
    const [hoveredSegment, setHoveredSegment] = useState<PodSegment | null>(null);

    // Fetch data based on current view mode
    const { data } = usePodlineData(viewMode);

    // Create gradient functions
    const gradients = useMemo(() => createPodlineGradients(podlineTheme), []);

    // Transform segments into Chart.js datasets
    const chartData = useCallback(
      (ctx: CanvasRenderingContext2D | null): ChartData<"bar"> => {
        const datasets = createPodlineDatasets(
          data.segments,
          data.totalPodsIssued,
          gradients,
          viewMode === "current", // Use fixed width for current view
        );

        // Apply gradients with canvas context if available
        const contextualDatasets = datasets.map((dataset) => ({
          ...dataset,
          backgroundColor:
            typeof dataset.backgroundColor === "function"
              ? (dataset.backgroundColor as any)(ctx)
              : dataset.backgroundColor,
        }));

        return {
          labels: [""], // Single category for horizontal timeline
          datasets: contextualDatasets,
        };
      },
      [data.segments, data.totalPodsIssued, data.harvestableIndex, gradients, viewMode],
    );

    // Chart.js options for horizontal stacked bar
    const chartOptions: ChartOptions<"bar"> = useMemo(
      () => ({
        indexAxis: "y" as const, // Makes it horizontal
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false, // We use custom tooltip plugin
          },
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            max: 100, // 100% width - ensures consistent width
            min: 0, // Ensures consistent starting point
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            stacked: true,
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        },
        layout: {
          padding: {
            top: 30, // Consistent spacing for both modes
            bottom: 25, // Space for timeline labels
            left: 10,
            right: 10,
          },
        },
        animation: false,
        elements: {
          bar: {
            borderRadius: 8, // Rounded corners
            borderWidth: 2, // Border width
            borderSkipped: false, // Ensure all borders are drawn
          },
        },
        interaction: {
          intersect: true,
          mode: "dataset",
        },
        onHover: (_event, activeElements) => {
          // Change cursor on hover
          if (chartRef.current?.canvas) {
            chartRef.current.canvas.style.cursor = activeElements.length > 0 ? "pointer" : "default";
          }
        },
      }),
      [viewMode],
    );

    // Handle segment interactions
    const handleSegmentHover = useCallback(
      (segment: PodSegment | null, datasetIndex?: number) => {
        setHoveredSegment(segment);
        onSegmentHover?.(segment, datasetIndex);
      },
      [onSegmentHover],
    );

    const handleSegmentClick = useCallback(
      (segment: PodSegment, datasetIndex: number) => {
        onSegmentClick?.(segment, datasetIndex);
      },
      [onSegmentClick],
    );

    // Chart.js plugins
    const plugins = useMemo((): Plugin[] => {
      const pluginList: Plugin[] = [];

      // Timeline labels plugin
      pluginList.push(timelineLabelsPlugin(data.totalPodsIssued, data.harvestableIndex, viewMode));

      // Segment interaction plugin
      pluginList.push(segmentInteractionPlugin(data.segments, handleSegmentClick, handleSegmentHover));

      // Custom tooltip plugin
      pluginList.push(podlineTooltipPlugin(hoveredSegment, data.totalPodsIssued));

      return pluginList;
    }, [
      data.segments,
      data.totalPodsIssued,
      data.harvestableIndex,
      viewMode,
      hoveredSegment,
      handleSegmentClick,
      handleSegmentHover,
    ]);

    // Don't render if no data
    if (data.segments.length === 0) {
      return (
        <div className="flex items-center justify-center text-pinto-gray-4 bg-gray-50 rounded-lg" style={{ height }}>
          <span className="pinto-sm">No pod data available</span>
        </div>
      );
    }

    return (
      <div style={{ height, width: "100%" }}>
        <ReactChart
          ref={chartRef}
          type="bar"
          data={chartData}
          options={chartOptions}
          plugins={plugins}
          width={6}
          height={2}
        />
      </div>
    );
  },
);

PodlineBarChart.displayName = "PodlineBarChart";

export default PodlineBarChart;

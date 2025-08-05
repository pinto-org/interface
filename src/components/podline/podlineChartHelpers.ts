import { TokenValue } from "@/classes/TokenValue";
import { Plugin } from "chart.js";
import { PodSegment, PodlineTheme } from "./types";

/**
 * Podline color theme configuration
 */
export const podlineTheme: PodlineTheme = {
  harvested: {
    background: "rgba(34, 197, 94, 0.2)", // Light green with transparency like morning
    border: "#22c55e", // Dark green border
  },
  userPods: {
    background: "rgba(254, 225, 140, 0.3)", // Morning yellow background
    border: "#D9AD0F", // Morning yellow border
  },
  otherPods: {
    background: "rgba(233, 231, 224, 0.2)", // Morning light gray background
    border: "#9C9C9C", // Gray border
  },
};

/**
 * Create gradient functions for podline segments
 */
export const createPodlineGradients = (theme: PodlineTheme) => {
  return {
    harvested: (ctx: CanvasRenderingContext2D | null) => {
      if (!ctx) return theme.harvested.background;
      const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
      gradient.addColorStop(0, theme.harvested.background);
      gradient.addColorStop(1, `${theme.harvested.background}aa`); // 67% opacity
      return gradient;
    },
    userPods: (ctx: CanvasRenderingContext2D | null) => {
      if (!ctx) return theme.userPods.background;
      const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
      gradient.addColorStop(0, theme.userPods.background);
      gradient.addColorStop(1, `${theme.userPods.background}dd`); // 87% opacity
      return gradient;
    },
    otherPods: (ctx: CanvasRenderingContext2D | null) => {
      if (!ctx) return theme.otherPods.background;
      const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
      gradient.addColorStop(0, theme.otherPods.background);
      gradient.addColorStop(1, `${theme.otherPods.background}66`); // 40% opacity
      return gradient;
    },
  };
};

/**
 * Plugin to render timeline labels and indicators
 */
export const timelineLabelsPlugin = (
  totalPodsIssued: TokenValue,
  harvestableIndex?: TokenValue,
  viewMode?: "historical" | "current",
): Plugin => ({
  id: "timelineLabels",
  afterDraw: (chart) => {
    const { ctx, scales } = chart;
    const xScale = scales.x;
    const yScale = scales.y;

    if (!xScale || !yScale) return;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#6b7280"; // Gray-500
    ctx.font = "12px ui-sans-serif, system-ui, -apple-system";

    // Draw "0" label on the left
    const leftX = xScale.left;
    const labelY = yScale.bottom + 8;
    ctx.textAlign = "left";
    ctx.fillText("0", leftX, labelY);

    // Draw total pods issued on the right
    const rightX = xScale.right;
    ctx.textAlign = "right";
    ctx.fillText(`${totalPodsIssued.toHuman("short")} Total Pods Issued`, rightX, labelY);

    // Draw harvestable index indicator (only in historical view)
    if (harvestableIndex?.gt(0) && totalPodsIssued.gt(0) && viewMode === "historical") {
      const harvestableRatio = harvestableIndex.div(totalPodsIssued).toNumber();
      const harvestableX = xScale.left + (xScale.right - xScale.left) * harvestableRatio;

      ctx.strokeStyle = "#22c55e"; // Green-500
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(harvestableX, yScale.top - 10);
      ctx.lineTo(harvestableX, yScale.bottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw label
      ctx.textAlign = "center";
      ctx.fillStyle = "#22c55e";
      ctx.font = "11px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText("Harvestable", harvestableX, yScale.top - 20);
    }

    ctx.restore();
  },
});

/**
 * Plugin to handle segment clicks and interactions
 */
export const segmentInteractionPlugin = (
  segments: PodSegment[],
  onSegmentClick?: (segment: PodSegment, datasetIndex: number) => void,
  onSegmentHover?: (segment: PodSegment | null, datasetIndex?: number) => void,
): Plugin => ({
  id: "segmentInteraction",
  afterEvent: (chart, args) => {
    const { event } = args;

    if (event.type === "click" && onSegmentClick) {
      const activeElements = chart.getElementsAtEventForMode(event as any, "nearest", { intersect: true }, false);

      if (activeElements.length > 0) {
        const { datasetIndex } = activeElements[0];
        const segment = segments[datasetIndex];
        if (segment) {
          onSegmentClick(segment, datasetIndex);
        }
      }
    }

    if ((event.type === "mousemove" || event.type === "mouseout") && onSegmentHover) {
      if (event.type === "mouseout") {
        onSegmentHover(null);
        return;
      }

      const activeElements = chart.getElementsAtEventForMode(event as any, "nearest", { intersect: true }, false);

      if (activeElements.length > 0) {
        const { datasetIndex } = activeElements[0];
        const segment = segments[datasetIndex];
        if (segment) {
          onSegmentHover(segment, datasetIndex);
        }
      } else {
        onSegmentHover(null);
      }
    }
  },
});

/**
 * Plugin to render custom tooltips for pod segments
 */
export const podlineTooltipPlugin = (hoveredSegment: PodSegment | null, totalPodsIssued: TokenValue): Plugin => ({
  id: "podlineTooltip",
  afterDraw: (chart) => {
    if (!hoveredSegment) return;

    const { ctx, scales } = chart;
    const xScale = scales.x;
    const yScale = scales.y;

    if (!xScale || !yScale) return;

    ctx.save();

    // Calculate tooltip position
    const segmentStartRatio = hoveredSegment.startIndex.div(totalPodsIssued).toNumber();
    const segmentEndRatio = hoveredSegment.endIndex.div(totalPodsIssued).toNumber();
    const segmentCenterRatio = (segmentStartRatio + segmentEndRatio) / 2;
    const tooltipX = xScale.left + (xScale.right - xScale.left) * segmentCenterRatio;
    const tooltipY = yScale.top - 40;

    // Tooltip content
    const lines = [`${hoveredSegment.podCount.toHuman()} Pods`, `Position: ${hoveredSegment.startIndex.toHuman()}`];

    if (hoveredSegment.metadata?.temperature) {
      lines.push(`Temperature: ${hoveredSegment.metadata.temperature.toFixed(1)}%`);
    }

    if (hoveredSegment.isUserOwned) {
      lines.push(hoveredSegment.isHarvestable ? "✅ Harvestable" : "⏳ In Line");
    }

    // Calculate tooltip dimensions
    ctx.font = "12px ui-sans-serif, system-ui, -apple-system";
    const maxWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
    const padding = 8;
    const tooltipWidth = maxWidth + padding * 2;
    const tooltipHeight = lines.length * 16 + padding * 2;

    // Adjust position to keep tooltip in bounds
    let finalX = tooltipX - tooltipWidth / 2;
    if (finalX < 0) finalX = 5;
    if (finalX + tooltipWidth > chart.width) finalX = chart.width - tooltipWidth - 5;

    // Draw tooltip background
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(finalX, tooltipY - tooltipHeight, tooltipWidth, tooltipHeight);

    // Draw tooltip text
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    lines.forEach((line, index) => {
      ctx.fillText(line, finalX + padding, tooltipY - tooltipHeight + padding + index * 16);
    });

    ctx.restore();
  },
});

/**
 * Plugin to ensure rounded corners are properly applied to all segments
 */
export const roundedCornersPlugin: Plugin = {
  id: "roundedCorners",
  beforeDatasetDraw: (chart) => {
    const { ctx } = chart;
    chart.data.datasets.forEach((_dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((element: any) => {
        if (element?.options) {
          element.options.borderRadius = 8;
          element.options.borderSkipped = false;
        }
      });
    });
  },
};

/**
 * Helper function to create Chart.js dataset from pod segments
 */
export const createPodlineDatasets = (
  segments: PodSegment[],
  totalPodsIssued: TokenValue,
  gradients: ReturnType<typeof createPodlineGradients>,
  fixedWidth?: boolean,
) => {
  // Calculate total width of all segments
  const totalSegmentWidth = segments.reduce((sum, seg) => sum.add(seg.podCount), TokenValue.ZERO);

  return segments.map((segment, index) => {
    let width: number;

    if (fixedWidth) {
      // Use consistent scaling based on segment proportion of total segments
      const segmentRatio = segment.podCount.div(totalSegmentWidth).toNumber();
      width = Math.max(segmentRatio * 100, 0.1);
    } else {
      // Original behavior - scale based on totalPodsIssued
      const widthRatio = segment.podCount.div(totalPodsIssued).toNumber();
      width = Math.max(widthRatio * 100, 0.1);
    }

    let backgroundColor: string | CanvasGradient;
    let borderColor: string;

    switch (segment.type) {
      case "harvested":
        backgroundColor = gradients.harvested(null);
        borderColor = podlineTheme.harvested.border;
        break;
      case "user-pods":
        backgroundColor = gradients.userPods(null);
        borderColor = podlineTheme.userPods.border;
        break;
      default:
        backgroundColor = gradients.otherPods(null);
        borderColor = podlineTheme.otherPods.border;
    }

    return {
      label: `${segment.type}-${index}`,
      data: [width],
      backgroundColor,
      borderColor, // Always show border for all segments
      borderWidth: 2, // Consistent border width
      segment,
    };
  });
};

import { TokenValue } from "@/classes/TokenValue";
import { Plot } from "@/utils/types";

/**
 * View mode for the podline visualization
 */
export type PodlineViewMode = "historical" | "current";

/**
 * Configuration for plot clustering behavior
 */
export interface PlotClusteringConfig {
  /** Percentage of total pod line length to use as clustering threshold (0.01 = 1%) */
  proximityThreshold: number;
  /** Minimum number of plots required to form a cluster */
  minClusterSize: number;
  /** Maximum size for individual plots as percentage of total pod line (larger plots won't be clustered) */
  maxIndividualPlotSize: number;
  /** Whether clustering is enabled */
  enabled: boolean;
}

/**
 * A cluster of adjacent or nearby plots
 */
export interface PlotCluster {
  /** Array of plots in this cluster */
  plots: Plot[];
  /** Total pods across all plots in cluster */
  totalPods: TokenValue;
  /** Total harvestable pods in cluster */
  totalHarvestablePods: TokenValue;
  /** Total unharvestable pods in cluster */
  totalUnharvestablePods: TokenValue;
  /** Starting index of the cluster (earliest plot) */
  startIndex: TokenValue;
  /** Ending index of the cluster (latest plot) */
  endIndex: TokenValue;
  /** Whether any plots in cluster are harvestable */
  hasHarvestablePods: boolean;
  /** Whether all plots in cluster are harvestable */
  allPlotsHarvestable: boolean;
  /** Type of cluster */
  clusterType: "single" | "multi";
  /** Cluster ID for tracking */
  clusterId: string;
}

/**
 * Type of pod segment based on ownership and harvestability
 */
export type PodSegmentType = "harvested" | "user-pods" | "other-pods";

/**
 * Individual pod segment for the horizontal bar chart
 */
export interface PodSegment {
  /** Segment type determining color and interaction */
  type: PodSegmentType;
  /** Number of pods in this segment */
  podCount: TokenValue;
  /** Starting position in the pod line */
  startIndex: TokenValue;
  /** Ending position in the pod line */
  endIndex: TokenValue;
  /** Whether this segment belongs to the current user */
  isUserOwned: boolean;
  /** Whether pods in this segment are harvestable */
  isHarvestable: boolean;
  /** Reference to the plot cluster (for user-owned segments) */
  cluster?: PlotCluster;
  /** Reference to the original plot data (for backwards compatibility) */
  plot?: Plot;
  /** Optional metadata for display */
  metadata?: {
    /** Season when pods were created */
    season?: number;
    /** Temperature at time of sowing */
    temperature?: number;
    /** Source of the pods (SOW, MARKET, TRANSFER) */
    source?: string;
    /** View mode for animation purposes */
    viewMode?: PodlineViewMode;
  };
}

/**
 * Processed podline data ready for Chart.js consumption
 */
export interface PodlineData {
  /** Array of pod segments sorted by position */
  segments: PodSegment[];
  /** Total pods issued in the system */
  totalPodsIssued: TokenValue;
  /** Current harvestable index */
  harvestableIndex: TokenValue;
  /** Total pods paid back (for historical view) */
  totalPodsPaidBack: TokenValue;
  /** User's total pods */
  userTotalPods: TokenValue;
  /** User's harvestable pods */
  userHarvestablePods: TokenValue;
}

/**
 * Chart.js dataset for a pod segment
 */
export interface PodlineChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | CanvasGradient;
  borderColor?: string;
  borderWidth?: number;
  /** Segment metadata for interactions */
  segment: PodSegment;
}

/**
 * Props for the main podline visualization component
 */
export interface PodlineVisualizationProps {
  className?: string;
  /** Initial view mode */
  defaultViewMode?: PodlineViewMode;
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Custom height for the chart */
  height?: number;
  /** Farmer field data to avoid redundant hook calls */
  farmerField?: any;
}

/**
 * Props for the podline bar chart component
 */
export interface PodlineBarChartProps {
  /** Current view mode */
  viewMode: PodlineViewMode;
  /** Height of the chart in pixels */
  height?: number;
  /** Farmer field data to avoid redundant hook calls */
  farmerField?: any;
  /** Callback when a segment is clicked */
  onSegmentClick?: (segment: PodSegment, datasetIndex: number) => void;
  /** Callback when mouse hovers over a segment */
  onSegmentHover?: (segment: PodSegment | null, datasetIndex?: number) => void;
}

/**
 * Configuration for podline colors and styling
 */
export interface PodlineTheme {
  harvested: {
    background: string;
    border: string;
  };
  userPods: {
    background: string;
    border: string;
  };
  userPodsCluster: {
    background: string;
    border: string;
  };
  otherPods: {
    background: string;
    border: string;
  };
}

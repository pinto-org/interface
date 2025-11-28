import useTractorDailySnapshots from "@/state/tractor/useTractorDailySnapshots";
import { useTractorExecutionEvents } from "./useTractorExecutionEvents";

/**
 * FUTURE IMPROVEMENT: Per-Blueprint Tip Calculation
 *
 * Current Implementation:
 * This system calculates a generic average tip across all blueprint types
 * (Sow, ConvertUp, etc.) and applies multipliers (0.75x, 1x, 1.25x) to
 * provide Low/Medium/High presets.
 *
 * Why This Works Now:
 * During the initial ramp-up phase, execution volume is relatively low and
 * tip patterns are similar across blueprint types. A generic average provides
 * sufficient accuracy for users to make informed decisions.
 *
 * Related Files:
 * - src/state/tractor/useTractorDailySnapshots.ts (subgraph query)
 * - src/components/Tractor/form/SowOrderV0Fields.tsx (form integration)
 * - src/components/Tractor/form/fields/sharedFields.tsx (tip display)
 */

/**
 * Tip levels with low/medium/high multipliers
 */
export interface TipLevels {
  low: number; // 0.75x average
  medium: number; // 1x average
  high: number; // 1.25x average
}

/**
 * Result interface for the average tractor tip hook
 */
export interface AverageTractorTipResult {
  averageTip: number; // The calculated average tip in Pinto
  tipLevels: TipLevels; // Dynamic tip levels based on average
  isLoading: boolean; // True while fetching data
  isError: boolean; // True if all methods failed
  dataSource: "subgraph" | "events" | "default"; // Which source was used
}

/**
 * Default tip values to use as final fallback
 * These are the current hardcoded values from the codebase
 */
const DEFAULT_TIP_LEVELS: TipLevels = {
  low: 0.15,
  medium: 0.2,
  high: 0.25,
};

/**
 * Calculate tip levels from an average tip value
 * Applies multipliers: 0.75x (low), 1x (medium), 1.25x (high)
 */
function calculateTipLevels(averageTip: number): TipLevels {
  return {
    low: averageTip * 0.75,
    medium: averageTip,
    high: averageTip * 1.25,
  };
}

/**
 * Hook that calculates average operator tips for the Tractor system.
 *
 * This hook implements a three-tier fallback strategy:
 * 1. Primary: Query subgraph for tractorDailySnapshots (last 60 days)
 * 2. Fallback: Fetch TractorExecution events from blockchain
 * 3. Final fallback: Use hardcoded default values (0.15, 0.2, 0.25)
 *
 * The hook calculates average tip per execution and returns tip levels
 * with low (0.75x), medium (1x), and high (1.25x) multipliers.
 *
 * @returns Object containing average tip, tip levels, loading state, error state, and data source
 */
export function useAverageTractorTip(): AverageTractorTipResult {
  // Primary data source: Subgraph query
  const subgraphQuery = useTractorDailySnapshots(60, { enabled: true });

  // Fallback data source: Event fetching (only enabled if subgraph fails)
  const shouldFetchEvents =
    subgraphQuery.isError || (!subgraphQuery.isLoading && (!subgraphQuery.data || subgraphQuery.data.length === 0));

  const eventsQuery = useTractorExecutionEvents({
    enabled: shouldFetchEvents,
  });

  // Calculate from subgraph data if available
  if (subgraphQuery.data && subgraphQuery.data.length > 0) {
    try {
      let totalTips = 0;
      let totalExecutions = 0;

      // Sum up tips and executions across all daily snapshots
      for (const snapshot of subgraphQuery.data) {
        totalTips += snapshot.deltaTotalPosBeanTips;
        totalExecutions += snapshot.deltaTotalExecutions;
      }

      // Calculate average if we have executions
      if (totalExecutions > 0) {
        const averageTip = totalTips / totalExecutions;

        // Validate the calculated average is reasonable
        if (averageTip > 0 && averageTip < 100 && !Number.isNaN(averageTip)) {
          console.debug("[useAverageTractorTip] Calculated from subgraph", {
            totalTips,
            totalExecutions,
            averageTip,
            dataPoints: subgraphQuery.data.length,
          });

          return {
            averageTip,
            tipLevels: calculateTipLevels(averageTip),
            isLoading: false,
            isError: false,
            dataSource: "subgraph",
          };
        } else {
          console.warn("[useAverageTractorTip] Invalid average calculated from subgraph", {
            averageTip,
            totalTips,
            totalExecutions,
          });
        }
      } else {
        console.debug("[useAverageTractorTip] No executions in subgraph data");
      }
    } catch (error) {
      console.error("[useAverageTractorTip] Error calculating from subgraph data", error);
    }
  }

  // Calculate from events if subgraph failed and events are available
  if (shouldFetchEvents && eventsQuery.data && eventsQuery.data.length > 0) {
    try {
      let totalTips = 0n;
      let totalExecutions = 0;

      // Sum up tips from all events
      for (const event of eventsQuery.data) {
        totalTips += event.args.amount;
        totalExecutions += 1;
      }

      // Calculate average if we have executions
      if (totalExecutions > 0) {
        // Convert from wei to Pinto (6 decimals)
        const averageTip = Number(totalTips) / 1e6 / totalExecutions;

        // Validate the calculated average is reasonable
        if (averageTip > 0 && averageTip < 100 && !Number.isNaN(averageTip)) {
          console.debug("[useAverageTractorTip] Calculated from events", {
            totalTips: totalTips.toString(),
            totalExecutions,
            averageTip,
            dataPoints: eventsQuery.data.length,
          });

          return {
            averageTip,
            tipLevels: calculateTipLevels(averageTip),
            isLoading: false,
            isError: false,
            dataSource: "events",
          };
        } else {
          console.warn("[useAverageTractorTip] Invalid average calculated from events", {
            averageTip,
            totalTips: totalTips.toString(),
            totalExecutions,
          });
        }
      } else {
        console.debug("[useAverageTractorTip] No executions in events data");
      }
    } catch (error) {
      console.error("[useAverageTractorTip] Error calculating from events data", error);
    }
  }

  // Determine loading state
  const isLoading = subgraphQuery.isLoading || (shouldFetchEvents && eventsQuery.isLoading);

  // If still loading, return loading state with default values
  if (isLoading) {
    return {
      averageTip: DEFAULT_TIP_LEVELS.medium,
      tipLevels: DEFAULT_TIP_LEVELS,
      isLoading: true,
      isError: false,
      dataSource: "default",
    };
  }

  // Final fallback: Use hardcoded defaults
  const bothFailed = subgraphQuery.isError && shouldFetchEvents && eventsQuery.isError;
  const noData =
    (!subgraphQuery.data || subgraphQuery.data.length === 0) &&
    shouldFetchEvents &&
    (!eventsQuery.data || eventsQuery.data.length === 0);

  if (bothFailed || noData) {
    console.warn("[useAverageTractorTip] Using hardcoded defaults", {
      subgraphError: subgraphQuery.isError,
      eventsError: eventsQuery.isError,
      subgraphDataLength: subgraphQuery.data?.length ?? 0,
      eventsDataLength: eventsQuery.data?.length ?? 0,
    });
  }

  return {
    averageTip: DEFAULT_TIP_LEVELS.medium,
    tipLevels: DEFAULT_TIP_LEVELS,
    isLoading: false,
    isError: bothFailed,
    dataSource: "default",
  };
}

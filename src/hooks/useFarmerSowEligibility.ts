import { TokenValue } from "@/classes/TokenValue";
import { useFarmerField } from "@/state/useFarmerField";
import { useMemo } from "react";

const MINIMUM_SOW_REQUIREMENT = TokenValue.fromHuman("1000", 6); // 1000 Pinto

export interface FarmerSowEligibility {
  /** Total pods owned by farmer */
  totalPods: TokenValue;
  /** Whether farmer meets minimum sow requirement */
  meetsRequirement: boolean;
  /** Amount still needed to meet requirement */
  amountNeeded: TokenValue;
  /** Progress percentage (0-100) */
  progressPercentage: number;
}

/**
 * Hook to check if farmer meets the minimum sow requirement for referrals
 */
export function useFarmerSowEligibility(): FarmerSowEligibility {
  const farmerField = useFarmerField();

  const result = useMemo(() => {
    // Calculate total pods from all plots
    const totalPods = farmerField.plots.reduce(
      (total, plot) =>
        total.add(plot.unharvestablePods ?? TokenValue.ZERO).add(plot.harvestablePods ?? TokenValue.ZERO),
      TokenValue.ZERO,
    );

    const meetsRequirement = totalPods.gte(MINIMUM_SOW_REQUIREMENT);
    const amountNeeded = meetsRequirement ? TokenValue.ZERO : MINIMUM_SOW_REQUIREMENT.sub(totalPods);

    const progressPercentage = totalPods.isZero
      ? 0
      : Math.min(100, totalPods.div(MINIMUM_SOW_REQUIREMENT).mul(100).toNumber());

    return {
      totalPods,
      meetsRequirement,
      amountNeeded,
      progressPercentage,
    };
  }, [farmerField.plots]);

  return result;
}

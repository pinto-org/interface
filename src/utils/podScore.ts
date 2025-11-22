/**
 * Pod Score Calculation Utility
 *
 * Provides the Pod Score calculation function for evaluating pod listings.
 * Pod Score = (Return / Place in Line) * 1e6
 * where Return = (1/pricePerPod - 1)
 */

/**
 * Calculate Pod Score for a pod listing
 *
 * Formula: (1/pricePerPod - 1) / placeInLine * 1e6
 *
 * @param pricePerPod - Price per pod (must be > 0)
 * @param placeInLine - Position in harvest queue in millions (must be > 0)
 * @returns Pod Score value, or undefined for invalid inputs
 */
export const calculatePodScore = (pricePerPod: number, placeInLine: number): number | undefined => {
  // Handle edge cases: invalid price or place in line
  if (pricePerPod <= 0 || placeInLine <= 0) {
    return undefined;
  }

  // Calculate return: (1/pricePerPod - 1)
  // When pricePerPod < 1.0: positive return (good deal)
  // When pricePerPod = 1.0: zero return (break even)
  // When pricePerPod > 1.0: negative return (bad deal)
  const returnValue = 1 / pricePerPod - 1;

  // Calculate Pod Score: return / placeInLine * 1e6
  const podScore = (returnValue / placeInLine) * 1e6;

  // Filter out invalid results (NaN, Infinity)
  if (!Number.isFinite(podScore)) {
    return undefined;
  }

  return podScore;
};

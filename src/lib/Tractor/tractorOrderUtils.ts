import { TokenValue } from "@/classes/TokenValue";
import { PINTO } from "@/constants/tokens";

// Utility types
export interface SanitizedNumericStrInput {
  str: string;
  tv: TokenValue;
}

export type TipLevel = "low" | "average" | "high";

// Input field IDs for accessibility
export const inputIds = {
  totalAmount: "total-amount-input",
  minPerSeason: "min-per-season-input", 
  maxPerSeason: "max-per-season-input",
  temperature: "temperature-input",
  podLineLength: "pod-line-length-input",
  operatorTip: "operator-tip-input",
  morningAuction: "morning-auction-input",
} as const;

// Style constants for consistent UI
export const tractorOrderStyles = {
  inputs: "rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] pinto-sm whitespace-nowrap flex-1",
  activeButton: "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C]",
  inactiveButton: "bg-white border-pinto-gray-2 text-pinto-gray-4",
} as const;

/**
 * Sanitizes and validates numeric input values
 */
export function sanitizeNumericInputValue(value: string, valueDecimals: number): SanitizedNumericStrInput {
  if (!value || value === "") {
    return {
      str: "",
      tv: TokenValue.ZERO,
    };
  }

  // Remove commas and trim whitespace
  let cleanValue = value.replace(/,/g, "").trim();
  
  // Handle percentage signs for temperature
  const hasPercentage = cleanValue.endsWith("%");
  if (hasPercentage) {
    cleanValue = cleanValue.slice(0, -1);
  }

  // Basic numeric validation
  if (!/^\d*\.?\d*$/.test(cleanValue)) {
    return {
      str: value, // Return original for display
      tv: TokenValue.ZERO,
    };
  }

  try {
    const tokenValue = TokenValue.fromHuman(cleanValue, valueDecimals);
    return {
      str: hasPercentage ? `${cleanValue}%` : cleanValue,
      tv: tokenValue,
    };
  } catch {
    return {
      str: value,
      tv: TokenValue.ZERO,
    };
  }
}

/**
 * Calculates estimated number of executions based on form values
 */
export function calculateEstimatedExecutions(
  totalAmount: string,
  minSoil: string,
  maxPerSeason: string,
  decimals: number
): string {
  const cleanedTotal = sanitizeNumericInputValue(totalAmount, decimals);
  const cleanedMin = sanitizeNumericInputValue(minSoil, decimals);
  const cleanedMax = sanitizeNumericInputValue(maxPerSeason, decimals);

  if (cleanedTotal.tv.eq(0) || cleanedMin.tv.eq(0) || cleanedMax.tv.eq(0)) {
    return "0";
  }

  try {
    // Use average of min and max for estimation
    const avgPerExecution = cleanedMin.tv.add(cleanedMax.tv).div(2);
    if (avgPerExecution.eq(0)) return "0";
    
    const estimatedExecutions = cleanedTotal.tv.div(avgPerExecution);
    return Math.ceil(estimatedExecutions.toNumber()).toString();
  } catch {
    return "0";
  }
}

/**
 * Calculates estimated total tip amount
 */
export function calculateEstimatedTotalTip(
  operatorTip: string,
  totalAmount: string,
  minSoil: string,
  maxPerSeason: string,
  decimals: number
): string {
  const cleanedTip = sanitizeNumericInputValue(operatorTip, decimals);
  const executions = calculateEstimatedExecutions(totalAmount, minSoil, maxPerSeason, decimals);
  
  if (cleanedTip.tv.eq(0) || executions === "0") {
    return "0";
  }

  try {
    const totalTip = cleanedTip.tv.mul(parseInt(executions));
    return totalTip.toHuman();
  } catch {
    return "0";
  }
}

/**
 * Calculates pod line value based on percentage increment
 */
export function calculatePodLineValue(podLine: TokenValue, increment: number): TokenValue {
  try {
    const multiplier = TokenValue.fromHuman((1 + increment / 100).toString(), 18);
    return podLine.mul(multiplier);
  } catch {
    return podLine;
  }
}

/**
 * Gets tip value based on level and base amount
 */
export function getTipValue(level: TipLevel, baseAmount: number): string {
  const multipliers = {
    low: 0.5,
    average: 1,
    high: 1.5,
  };
  
  return (baseAmount * multipliers[level]).toString();
}

/**
 * Validates form completeness
 */
export function validateRequiredFields(formState: {
  totalAmount: string;
  minSoil: string;
  maxPerSeason: string;
  temperature: string;
  podLineLength: string;
  operatorTip: string;
}): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  if (!formState.totalAmount || formState.totalAmount === "0") {
    missingFields.push("Total Amount");
  }
  if (!formState.minSoil) {
    missingFields.push("Min per Season");
  }
  if (!formState.maxPerSeason) {
    missingFields.push("Max per Season");
  }
  if (!formState.temperature) {
    missingFields.push("Temperature");
  }
  if (!formState.podLineLength) {
    missingFields.push("Pod Line Length");
  }
  if (!formState.operatorTip) {
    missingFields.push("Operator Tip");
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Validates min/max season amounts
 */
export function validateMinMaxAmounts(minSoil: string, maxPerSeason: string, decimals: number): string | null {
  if (!minSoil || !maxPerSeason) return null;
  
  const cleanedMin = sanitizeNumericInputValue(minSoil, decimals);
  const cleanedMax = sanitizeNumericInputValue(maxPerSeason, decimals);
  
  if (cleanedMin.tv.gt(cleanedMax.tv)) {
    return "Min per Season must be less than or equal to Max per Season";
  }
  
  return null;
}
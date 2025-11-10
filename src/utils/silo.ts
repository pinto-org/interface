import { TokenValue } from "@/classes/TokenValue";

/**
 * Returns appropriate labels for stalk and seeds based on their values
 * @param stalkValue - The stalk value (can be positive or negative)
 * @param seedsValue - The seeds value (can be positive or negative)
 * @returns Object with stalkLabel and seedsLabel
 */
export function getSiloLabels(stalkValue: TokenValue, seedsValue: TokenValue) {
  // console.log("stalkValue", stalkValue);
  // console.log("seedsValue", seedsValue);
  const stalkLabel = stalkValue.gte(0) ? "Stalk Gained" : "Stalk Burnt";
  const seedsLabel = seedsValue.gte(0) ? "Seeds Gained" : "Seeds Lost";

  return {
    stalkLabel,
    seedsLabel,
  };
}

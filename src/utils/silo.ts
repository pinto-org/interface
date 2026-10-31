import { TokenValue } from "@/classes/TokenValue";

/**
 * Returns appropriate labels for stalk and seeds based on their values
 * @param stalkValue - The stalk value (can be positive or negative)
 * @param seedsValue - The seeds value (can be positive or negative)
 * @returns Object with stalkLabel and seedsLabel
 */
/**
 * USD value of a Silo deposit (or of a token's deposits in aggregate).
 *
 * Whitelisted tokens are valued at current BDV x the PINTO price in their pool.
 * De-whitelisted tokens (e.g. PINTO:wstETH LP) have no current BDV, and the BDV
 * recorded at deposit time is stale, so they are valued at market: amount x the
 * token's USD price (the price contract's `lpUsd`, i.e. `usePriceData().tokenPrices`).
 * This is the same source the amount input uses, so both show the same value.
 */
export function getSiloDepositUsdValue({
  isWhitelisted,
  amount,
  currentBdv,
  depositBdv,
  bdvPrice,
  tokenUsdPrice,
}: {
  isWhitelisted: boolean | undefined;
  amount: TokenValue | undefined;
  currentBdv: TokenValue | undefined;
  depositBdv: TokenValue | undefined;
  bdvPrice: TokenValue;
  tokenUsdPrice: TokenValue | undefined;
}): TokenValue {
  if (isWhitelisted) return (currentBdv ?? TokenValue.ZERO).mul(bdvPrice);
  if (tokenUsdPrice?.gt(0)) return tokenUsdPrice.mul(amount ?? TokenValue.ZERO);
  // Market price not loaded yet: fall back to the recorded BDV.
  return (depositBdv ?? TokenValue.ZERO).mul(bdvPrice);
}

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

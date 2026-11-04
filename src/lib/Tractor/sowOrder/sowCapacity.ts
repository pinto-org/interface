import { basinWellABI } from "@/constants/abi/basinWellABI";
import { diamondABI } from "@/constants/abi/diamondABI";
import { siloHelpersABI } from "@/constants/abi/SiloHelpersABI";
import { tractorHelpersABI } from "@/constants/abi/TractorHelpersABI";
import type { TractorTokenStrategyUnion } from "../core/token-strategy";
import { formatUnits, isAddress, maxUint256, parseUnits, type Address, type PublicClient } from "viem";

// Matches the ordinary Sow form's encoded maxGrownStalkPerBdv (1e16 * 1e6).
export const SOW_FORM_MAX_GROWN_STALK = 10n ** 22n;
export const SOW_FORM_MINIMUM_CAP = 25_000_000n;

export function parseSowPinto(value: string): bigint | undefined {
  const clean = value.replace(/,/g, "").replace(/^\./, "0.");
  return /^\d+(\.\d{0,6})?$/.test(clean) ? parseUnits(clean, 6) : undefined;
}

/** Form values are token amounts, not display-rounded labels. */
export function defaultSowAmounts(total: string) {
  const amount = parseSowPinto(total);
  if (amount === undefined || amount <= 0n) return undefined;
  return {
    minimum: formatUnits(amount < SOW_FORM_MINIMUM_CAP ? amount : SOW_FORM_MINIMUM_CAP, 6),
    maximum: formatUnits(amount, 6),
  };
}

/** Reserve a tip for every minimum-sized fill, including a possible last fill.
 * This is a current-inventory check, not a guarantee of future market prices/Soil.
 */
export function sowFundingRequired(total: bigint, minimum: bigint, tip: bigint): bigint {
  if (total <= 0n || minimum <= 0n || tip < 0n) throw new Error("Invalid Sow funding amounts");
  return total + ((total + minimum - 1n) / minimum) * tip;
}

/** Largest total whose minimum-sized fills and tips fit in current capacity. */
export function maxSowFundedAmount(capacity: bigint, minimum: bigint, tip: bigint): bigint {
  if (capacity < 0n || minimum <= 0n || tip < 0n) throw new Error("Invalid Sow funding amounts");
  const fullFills = capacity / (minimum + tip);
  const remainder = capacity % (minimum + tip);
  return fullFills * minimum + (remainder > tip ? remainder - tip : 0n);
}

export type SowCapacityContext = {
  account: Address;
  diamond: Address;
  pinto: Address;
  siloHelpers: Address;
  tractorHelpers: Address;
  strategy: TractorTokenStrategyUnion;
};

/** Read real, unlocked Silo inventory, then quote fee-paying one-token exits.
 * Every read uses one block. No wallet balances, USD prices or missing-as-zero
 * fallbacks: any failed selected-source read makes the whole quote unavailable.
 */
export async function quoteSowCapacity(client: PublicClient, context: SowCapacityContext) {
  const { account, diamond, pinto, siloHelpers, tractorHelpers, strategy } = context;
  const blockNumber = await client.getBlockNumber();
  const whitelist = await client.readContract({
    address: siloHelpers,
    abi: siloHelpersABI,
    functionName: "getWhitelistStatusAddresses",
    blockNumber,
  });
  let tokens: readonly Address[];
  if (strategy.type === "SPECIFIC_TOKEN") {
    if (strategy.addresses?.length !== 1) throw new Error("Select one source token");
    tokens = strategy.addresses.map((token) => {
      if (!isAddress(token, { strict: false })) throw new Error("Invalid source address");
      return token;
    });
  } else if (strategy.type === "LOWEST_SEEDS" || strategy.type === "LOWEST_PRICE") {
    const [indices] = await client.readContract({
      address: tractorHelpers,
      abi: tractorHelpersABI,
      functionName: strategy.type === "LOWEST_SEEDS" ? "getTokensAscendingSeeds" : "getTokensAscendingPrice",
      args: [false],
      blockNumber,
    });
    tokens = indices.map((index) => {
      if (!whitelist[index]) throw new Error("Unknown withdrawal source");
      return whitelist[index];
    });
  } else {
    // The ordinary Sow encoder does not currently support MULTI_TOKENS.
    throw new Error("Unsupported Sow source strategy");
  }
  const known = new Set(whitelist.map((token) => token.toLowerCase()));
  if (
    !tokens.length ||
    tokens.some((token) => !known.has(token.toLowerCase())) ||
    new Set(tokens.map((token) => token.toLowerCase())).size !== tokens.length
  ) {
    throw new Error("Invalid withdrawal sources");
  }
  const sources = await Promise.all(
    tokens.map(async (token) => {
      const tip = await client.readContract({
        address: diamond,
        abi: diamondABI,
        functionName: "stemTipForToken",
        args: [token],
        blockNumber,
      });
      const [, , amount] = await client.readContract({
        address: siloHelpers,
        abi: siloHelpersABI,
        functionName: "getDepositStemsAndAmountsToWithdraw",
        args: [account, token, maxUint256, tip - SOW_FORM_MAX_GROWN_STALK],
        blockNumber,
      });
      const pintos =
        amount === 0n || token.toLowerCase() === pinto.toLowerCase()
          ? amount
          : await client.readContract({
              address: token,
              abi: basinWellABI,
              functionName: "getRemoveLiquidityOneTokenOut",
              args: [amount, pinto],
              blockNumber,
            });
      return { token, amount, pintos };
    }),
  );
  return { blockNumber, sources, pintos: sources.reduce((sum, source) => sum + source.pintos, 0n) };
}

export function checkSowFunding(pintos: bigint, total: string, minimum: string, tip: string) {
  const amount = parseSowPinto(total);
  const min = parseSowPinto(minimum);
  const reward = parseSowPinto(tip);
  return (
    amount !== undefined &&
    amount > 0n &&
    min !== undefined &&
    min > 0n &&
    reward !== undefined &&
    sowFundingRequired(amount, min, reward) <= pintos
  );
}

import { TokenValue } from "@/classes/TokenValue";
import { FarmerBalance } from "@/state/useFarmerBalances";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FarmFromMode, Token, TokenDepositData } from "./types";
import { DepositData } from "./types";
import { diamondABI } from "@/constants/abi/diamondABI";
import { calculateConvertData } from "@/utils/convert";
import { encodeFunctionData } from "viem";
import { DepositGroup } from "@/components/CombineSelect";
import convert from "@/encoders/silo/convert";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateID = (prefix = "") => {
  const hash = Math.random().toString(36).slice(-7);
  return `${prefix}-${hash}`;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => { };

export function unpackStem(data: string | number | bigint): bigint {
  // Convert input to BigInt if it isn't already
  const dataBigInt = BigInt(data);

  // Extract stem using mask
  const mask = (1n << 96n) - 1n;
  let stem = dataBigInt & mask;

  // Handle negative numbers (two's complement)
  if (stem & (1n << 95n)) {
    // Check if the sign bit is set
    stem = stem - (1n << 96n);
  }

  return stem;
}

export const isProd = () => {
  return import.meta.env.VITE_NETLIFY_CONTEXT === "production";
};

export const isLocalhost = () => {
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
};

export const isNetlifyPreview = () => {
  return import.meta.env.VITE_NETLIFY_CONTEXT === "deploy-preview";
};

export const isDev = () => {
  return isLocalhost() || isNetlifyPreview() || process.env.NODE_ENV === "development";
};

export function exists<T>(value: T | undefined | null): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function existsNot(value: any): value is undefined | null {
  return !exists(value);
}

/**
 * Check if a value is an object
 * @param value - The value to check
 * @returns True if the value is an object, false otherwise. Excludes arrays.
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

export function calculatePipeCallClipboardSlot(pipeCallLength: number, slot: number) {
  if (!pipeCallLength || !slot) return 0;
  return 2 + pipeCallLength + (1 + slot * 2);
}

export function getBalanceFromMode(balance: FarmerBalance | undefined, mode: FarmFromMode) {
  if (!balance) return TokenValue.ZERO;
  switch (mode) {
    case FarmFromMode.INTERNAL:
      return balance.internal;
    case FarmFromMode.EXTERNAL:
      return balance.external;
    default:
      return balance.total;
  }
}

export function timeRemaining(time: Date, targetTime?: Date) {
  const now = targetTime ?? new Date();
  const diffMs = time.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = 60 - now.getMinutes();
  const diffSecs = 60 - now.getSeconds();

  if (diffHrs <= 0 && diffMins <= 0 && diffSecs <= 0) return "0m 0s";

  return diffHrs > 0 ? `${diffHrs}h ${diffMins}m ${diffSecs}s` : `${diffMins}m ${diffSecs}s`;
}

interface PlantEventData {
  amount: bigint;
  blockHash: string;
  transactionHash: string;
}

interface DepositEventData {
  amount: bigint;
  stem: bigint;
  blockHash: string;
  transactionHash: string;
}

interface PlantDepositMap {
  [key: string]: {
    plant?: PlantEventData;
    deposit?: DepositEventData;
  };
}

interface PlantDepositInfo {
  isPlantDeposit: boolean;
  plantedAmount: bigint;
}

export function identifyPlantDeposits(
  deposits: any[],
  plantEvents: PlantEventData[] | undefined,
  depositEvents: DepositEventData[] | undefined,
): Map<string, PlantDepositInfo> {
  // Create lookup by transaction hash
  const eventMap: PlantDepositMap = {};

  // Group plant and deposit events by transaction hash
  plantEvents?.forEach((plant) => {
    if (!eventMap[plant.transactionHash]) {
      eventMap[plant.transactionHash] = {};
    }
    eventMap[plant.transactionHash].plant = plant;
  });

  depositEvents?.forEach((deposit) => {
    if (!eventMap[deposit.transactionHash]) {
      eventMap[deposit.transactionHash] = {};
    }
    eventMap[deposit.transactionHash].deposit = deposit;
  });

  // Map deposit IDs to their plant deposit info
  const plantDepositMap = new Map<string, PlantDepositInfo>();

  deposits.forEach((deposit) => {
    let isPlantDeposit = false;
    let plantedAmount = 0n;

    // Check all transactions that could contain this deposit
    Object.values(eventMap).forEach((events) => {
      if (events.plant && events.deposit) {
        // Direct match - amount and stem match exactly
        if (events.deposit.amount === deposit.depositedAmount && events.deposit.stem === deposit.stem) {
          isPlantDeposit = true;
          plantedAmount = events.plant.amount;
        }

        // Combined deposit case - plant amount is part of total amount
        // and stems match
        if (events.deposit.stem === deposit.stem && deposit.depositedAmount >= events.plant.amount) {
          const remainder = deposit.depositedAmount - events.plant.amount;
          // Allow for small remainder from regular deposit combined with plant
          if (remainder === 0n || remainder >= 1000000n) {
            // Minimum reasonable deposit size
            isPlantDeposit = true;
            plantedAmount = events.plant.amount;
          }
        }
      }
    });

    plantDepositMap.set(deposit.id.toString(), {
      isPlantDeposit,
      plantedAmount,
    });
  });

  return plantDepositMap;
}

interface RatioDeposit {
  stem: string;
  ratio: TokenValue;
}

export function createSmartGroups(deposits: DepositData[], targetGroups: number = 20): DepositGroup[] {
  const MAX_DEPOSITS = 200;
  const MIN_BDV = TokenValue.fromHuman(25, 6);

  // Filter and map deposits, including BDV for small deposit handling
  const validDeposits = deposits
    .filter((d) => !d.isGerminating)
    .map((d) => ({
      stem: d.stem.toHuman(),
      ratio: d.stalk.total.div(d.depositBdv),
      bdv: d.depositBdv,
    }))
    .sort((a, b) => b.ratio.sub(a.ratio).toNumber());

  // Only slice if we have more than MAX_DEPOSITS
  const slicedDeposits = validDeposits.length > MAX_DEPOSITS 
    ? validDeposits.slice(-MAX_DEPOSITS)
    : validDeposits;

  if (slicedDeposits.length === 0) return [];

  // Calculate ratio differences between adjacent deposits
  const ratioDiffs = slicedDeposits.slice(1).map((deposit, i) => ({
    diff: slicedDeposits[i].ratio.sub(deposit.ratio),
    index: i + 1,
    // Don't create breakpoint if current or next deposit is small
    isValidBreakpoint: !(
      slicedDeposits[i].bdv.lte(MIN_BDV) || 
      slicedDeposits[i + 1].bdv.lte(MIN_BDV)
    ),
  }));

  // Sort ratio differences to find natural breakpoints, excluding small deposits
  const sortedDiffs = [...ratioDiffs]
    .filter(d => d.isValidBreakpoint)
    .sort((a, b) => b.diff.sub(a.diff).toNumber());

  // Select the top N-1 breakpoints (for N groups)
  const numBreakpoints = Math.min(targetGroups - 1, sortedDiffs.length);
  const breakpoints = sortedDiffs
    .slice(0, numBreakpoints)
    .sort((a, b) => a.index - b.index)
    .map((b) => b.index);

  // Create groups based on calculated breakpoints
  const newGroups: DepositGroup[] = [];
  let groupId = 1;
  let currentGroup: typeof validDeposits[0][] = [];

  slicedDeposits.forEach((deposit, index) => {
    currentGroup.push(deposit);

    // Only create new group at breakpoint if it wouldn't leave a small deposit alone
    const isBreakpoint = breakpoints.includes(index + 1);
    const nextDeposit = slicedDeposits[index + 1];
    const isLastDeposit = index === slicedDeposits.length - 1;
    
    const shouldBreak = isBreakpoint || isLastDeposit;
    const wouldLeaveSmallDeposit = nextDeposit && nextDeposit.bdv.lte(MIN_BDV);

    if (shouldBreak && !wouldLeaveSmallDeposit) {
      if (currentGroup.length > 0) {
        newGroups.push({
          id: groupId++,
          deposits: currentGroup.map((d) => d.stem),
        });
      }
      currentGroup = [];
    }
  });

  return newGroups;
}

export function encodeGroupCombineCalls(
  validGroups: DepositGroup[],
  token: Token,
  deposits: DepositData[],
): `0x${string}`[] {
  // Exclude groups with only one deposit, since they are already alone
  const groupsToEncode = validGroups.filter((group) => group.deposits.length > 1);

  return groupsToEncode.map((group) => {
    // Get selected deposits for this group
    const selectedDepositData = group.deposits
      .map((stem) => deposits.find((d) => d.stem.toHuman() === stem))
      .filter(Boolean);

    const totalAmount = selectedDepositData.reduce((sum, deposit) => {
      if (!deposit) return sum;
      return deposit.amount.add(sum);
    }, TokenValue.ZERO);

    const convertData = calculateConvertData(token, token, totalAmount, totalAmount);
    if (!convertData) throw new Error("Failed to prepare combine data");

    const stems = selectedDepositData.filter((d): d is DepositData => d !== undefined).map((d) => d.stem.toBigInt());
    const amounts = selectedDepositData
      .filter((d): d is DepositData => d !== undefined)
      .map((d) => d.amount.toBigInt());

    // Use the imported convert function instead
    return convert(convertData, stems, amounts).callData;
  });
}

// Add a new function to handle claim reward grouping and encoding
export function encodeClaimRewardCombineCalls(
  deposits: DepositData[],
  token: Token,
  targetGroups: number = 20,
): `0x${string}`[] {
  console.log("Processing deposits for", token.symbol, ":", {
    depositCount: deposits.length,
  });

  // Use our existing smart grouping logic
  const groups = createSmartGroups(deposits, targetGroups);

  console.log("Created groups for", token.symbol, ":", {
    groupCount: groups.length,
    groups: groups.map((g) => ({
      id: g.id,
      depositCount: g.deposits.length,
    })),
  });

  // Use our existing encode function
  const result = encodeGroupCombineCalls(groups, token, deposits);

  console.log("Final encoded calls for", token.symbol, ":", {
    groupCount: groups.length,
    encodedCallCount: result.length,
  });

  return result;
}

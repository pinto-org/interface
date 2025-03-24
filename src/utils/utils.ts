import { TokenValue } from "@/classes/TokenValue";
import { FarmerBalance } from "@/state/useFarmerBalances";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FarmFromMode } from "./types";
import { MayArray } from "./types.generic";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateID = (prefix = "") => {
  const hash = Math.random().toString(36).slice(-7);
  return `${prefix}-${hash}`;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

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

export function arrayify<T>(value: MayArray<T>): T[];
export function arrayify<T, U>(value: MayArray<T>, map: (v: T, i: number, arr: T[]) => U): U[];
export function arrayify<T, U = T>(value: MayArray<T>, map?: (v: T, i: number, arr: T[]) => U): (T | U)[] {
  const array = Array.isArray(value) ? value : [value];
  return map ? array.map(map) : array;
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

export function caseIdToDescriptiveText(caseId: number, column: "price" | "soil_demand" | "pod_rate" | "l2sr") {
  switch (column) {
    case "price":
      if ((caseId % 36) % 9 < 3) return "P < $1.00";
      else if ((caseId % 36) % 9 < 6) return "P > $1.00";
      //(caseId % 36 < 9)
      else return "P > Q";
    case "soil_demand":
      if (caseId % 3 === 0) return "Decreasing";
      else if (caseId % 3 === 1) return "Steady";
      else return "Increasing";
    case "pod_rate":
      if ((caseId % 36) / 9 === 0) return "Excessively Low";
      else if ((caseId % 36) / 9 === 1) return "Reasonably Low";
      else if ((caseId % 36) / 9 === 2) return "Reasonably High";
      else return "Excessively High";
    case "l2sr":
      if (caseId / 36 === 0) {
        return "Extremely Low";
      } else if (caseId / 36 === 1) {
        return "Reasonably Low";
      } else if (caseId / 36 === 2) {
        return "Reasonably High";
      } else {
        return "Extremely High";
      }
  }
}

import { TokenValue } from "@/classes/TokenValue";
import { FarmerBalance } from "@/state/useFarmerBalances";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FarmFromMode } from "./types";

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

export const getEnv = () => {
  const env = import.meta.env;
  console.log("ENV: ", env);
};

export const isDev = () => {
  return import.meta.env.DEV;
};

export function exists<T>(value: T | undefined | null): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

export function existsNot(value: any): value is undefined | null {
  return !exists(value);
}

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

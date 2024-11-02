import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function exists<T>(value: T | undefined | null): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

export function existsNot(value: any): value is undefined | null {
  return !exists(value);
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  // use BN here to avoid floating point errors
  const length = Number(BigInt(array.length) / BigInt(chunkSize));

  return Array.from({ length: length }, (_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize));
}

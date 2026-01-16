import { useMemo } from "react";
import { generateAddressName } from "../utils/addressNameGenerator";

/**
 * Hook that generates and memoizes a human-readable name from an Ethereum address
 *
 * The generated name is deterministic and will always be the same for a given address.
 * Uses memoization to prevent unnecessary recalculations when the component re-renders.
 *
 * @param address - Ethereum address (0x-prefixed hex string) or undefined
 * @returns Generated name string in format "Word1-Word2-Word3-Word4"
 *
 * @example
 * const name = useAddressName('0x113ad340...');
 * // Returns "Scrappy-Turkey-Picker-Haystack"
 *
 * @example
 * const name = useAddressName(undefined);
 * // Returns "Unknown-Unknown-Unknown-Unknown"
 */
export function useAddressName(address: string | undefined): string {
  return useMemo(() => {
    if (!address) {
      return "Unknown-Unknown-Unknown-Unknown";
    }
    return generateAddressName(address);
  }, [address]);
}

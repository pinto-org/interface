import { usePriceData } from "@/state/usePriceData";
import { useMemo } from "react";

/**
 * Hook to create a dynamic browser tab title that includes the current Pinto price
 * Format: "$1.0234 • {originalTitle}" or falls back to baseTitle if no price data
 */
export function useDynamicTabTitle(baseTitle: string): string {
  const priceData = usePriceData();

  return useMemo(() => {
    // Fall back to base title only if price data is unavailable
    if (!priceData.price) {
      return baseTitle;
    }

    // Format price to 4 decimal places and create dynamic title with full base title
    const formattedPrice = `$${Number(priceData.price.toHuman()).toFixed(4)}`;
    return `${formattedPrice} • ${baseTitle}`;
  }, [priceData.price, baseTitle]);
}

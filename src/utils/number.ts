import { TV } from "@/classes/TokenValue";

/**
 * Normalizes a TokenValue to be zero or greater.
 * @param tv - The TokenValue to normalize.
 * @returns The normalized TokenValue.
 */
export const normalizeTV = (tv: TV) => {
  if (tv.lt(0)) return TV.ZERO;
  return tv;
};

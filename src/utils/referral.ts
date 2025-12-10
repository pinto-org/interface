import type { Address } from "viem";
import { isAddress, zeroAddress } from "viem";

/**
 * Encode an Ethereum address to base64 for URL shortening
 * Treats the address as raw bytes (20 bytes) and encodes to base64
 *
 * @param address - Ethereum address (0x prefixed hex string)
 * @returns Base64 encoded string (28 characters)
 */
export function encodeReferralAddress(address: Address): string {
  // Remove 0x prefix
  const hex = address.slice(2);

  // Convert hex string to byte array
  const hexPairs = hex.match(/.{1,2}/g) || [];
  const bytes = new Uint8Array(hexPairs.map((byte) => Number.parseInt(byte, 16)));

  // Convert bytes to base64
  const base64 = btoa(String.fromCharCode(...bytes));

  return base64;
}

/**
 * Decode a base64 referral code back to an Ethereum address
 *
 * @param encoded - Base64 encoded referral code
 * @returns Ethereum address or null if invalid
 */
export function decodeReferralAddress(encoded: string): Address | null {
  try {
    // Decode base64 to bytes
    const decoded = atob(encoded);
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      bytes[i] = decoded.charCodeAt(i);
    }

    // Convert bytes to hex string
    const hex = `0x${Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")}`;

    // Validate it's a proper address
    if (!isAddress(hex)) return null;
    if (hex === zeroAddress) return null;

    return hex as Address;
  } catch {
    return null;
  }
}

/**
 * Check if a referral code is valid (can be decoded to a valid address)
 *
 * @param code - Base64 encoded referral code
 * @returns true if valid, false otherwise
 */
export function isValidReferralCode(code: string): boolean {
  return decodeReferralAddress(code) !== null;
}

/**
 * Calculate Pinto sown from referee pods and temperature
 * Formula: refereePods / (1 + temperature/100)
 *
 * @param refereePods - Pods earned by referee (BigInt string)
 * @param temperature - Temperature at time of sow (percentage, e.g., 500 = 500%)
 * @returns Calculated Pinto sown as BigInt string
 */
export function calculatePintoSown(refereePods: string, temperature: number): string {
  const pods = BigInt(refereePods);
  // Temperature is in percentage (e.g., 500 means 500%)
  // Formula: pods / (1 + temperature/100) = pods * 100 / (100 + temperature)
  const temperatureFactor = BigInt(100 + temperature);
  const pintoSown = (pods * 100n) / temperatureFactor;
  return pintoSown.toString();
}

/**
 * Calculate total pods created from referrer and referee pods
 *
 * @param referrerPods - Pods earned by referrer (BigInt string)
 * @param refereePods - Pods earned by referee (BigInt string)
 * @returns Total pods created as BigInt string
 */
export function calculateTotalPodsCreated(referrerPods: string, refereePods: string): string {
  const total = BigInt(referrerPods) + BigInt(refereePods);
  return total.toString();
}

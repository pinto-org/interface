import type { ConnectedWallet } from "@privy-io/react-auth";

/**
 * Global references for Privy connector state
 * These refs allow the Privy connector to access current wallet state
 * without recreating the wagmi config (which would break reconnection)
 */
export interface PrivyRefs {
  embeddedWallet: ConnectedWallet | undefined;
  logout: (() => Promise<void>) | null;
}

/**
 * Global Privy refs object
 * Updated when Privy authentication state changes
 */
export const privyRefs: PrivyRefs = {
  embeddedWallet: undefined,
  logout: null,
};

/**
 * Updates the global Privy refs with current wallet and logout function
 * Called when Privy authentication state changes
 *
 * @param wallet - The current Privy embedded wallet (if authenticated)
 * @param logout - The Privy logout function
 */
export function updatePrivyRefs(wallet?: ConnectedWallet, logout?: () => Promise<void>): void {
  privyRefs.embeddedWallet = wallet;
  privyRefs.logout = logout || null;
}

/**
 * Gets the current Privy embedded wallet
 * Used by the Privy connector to access wallet state
 *
 * @returns The current embedded wallet, or undefined if not authenticated
 */
export function getPrivyEmbeddedWallet(): ConnectedWallet | undefined {
  return privyRefs.embeddedWallet;
}

/**
 * Gets the current Privy logout function
 * Used by the Privy connector to handle disconnection
 *
 * @returns The logout function, or null if not available
 */
export function getPrivyLogout(): (() => Promise<void>) | null {
  return privyRefs.logout;
}

/**
 * Clears the Privy refs (sets to undefined/null)
 * Called when user disconnects or Privy authentication is lost
 */
export function clearPrivyRefs(): void {
  privyRefs.embeddedWallet = undefined;
  privyRefs.logout = null;
}

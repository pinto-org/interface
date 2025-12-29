import type { Connector } from "wagmi";

/**
 * Filters wagmi connectors to return only EOA (externally owned account) wallets
 * Excludes Privy connectors and generic injected connectors
 * Removes duplicate connectors based on ID
 *
 * @param connectors - Array of wagmi connectors
 * @returns Filtered array of EOA connectors
 */
export function filterEOAConnectors(connectors: Connector[]): Connector[] {
  const seen = new Set<string>();

  return connectors.filter((connector) => {
    if (!connector) return false;

    const id = connector.id.toLowerCase();

    // Exclude Privy connectors
    if (id.includes("privy")) {
      return false;
    }

    // Exclude generic "injected" connector (we want specific wallets only)
    if (id === "injected" || connector.name.toLowerCase() === "injected") {
      return false;
    }

    // Remove duplicates
    if (seen.has(id)) {
      return false;
    }

    seen.add(id);
    return true;
  });
}

/**
 * Checks if a connector is WalletConnect based on type or ID
 * @param connector - The wagmi connector to check
 * @returns True if connector is WalletConnect
 */
export function isWalletConnectConnector(connector: Connector): boolean {
  const connectorId = connector.id.toLowerCase();

  return (
    connector.type === "walletConnect" ||
    connector.type === "wallet_connect" ||
    connectorId === "walletconnect" ||
    connectorId === "wallet_connect" ||
    connectorId.includes("walletconnect")
  );
}

/**
 * Checks if a connector is Coinbase Wallet based on type, ID, or name
 * @param connector - The wagmi connector to check
 * @returns True if connector is Coinbase Wallet
 */
// export function isCoinbaseWalletConnector(connector: Connector): boolean {
//   const connectorId = connector.id.toLowerCase();
//   const connectorName = connector.name.toLowerCase();

//   return connector.type === "coinbaseWallet" || connectorId.includes("coinbase") || connectorName.includes("coinbase");
// }

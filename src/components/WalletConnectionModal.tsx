import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Separator } from "@/components/ui/Separator";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { withTracking } from "@/utils/analytics";
import { isDev, isLocalhost, isNetlifyPreview, isProd } from "@/utils/utils";
import { TENDERLY_RPC_URL } from "@/utils/wagmi/chains";
import {
  baseNetwork as base,
  localhostNetwork as localhost,
  tenderlyTestnetNetwork as testnet,
} from "@/utils/wagmi/chains";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useChainId, useConnect, useSwitchChain } from "wagmi";

interface WalletConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Email/Social Login Button Component
 * Uses Privy for email and social authentication
 */
function EmailLoginButton() {
  const { login } = useLogin();
  const { ready, authenticated } = usePrivy();

  const handleClick = () => {
    if (!ready) {
      console.warn("Privy is not ready yet");
      return;
    }

    if (authenticated) {
      return;
    }

    // Track analytics
    withTracking(
      ANALYTICS_EVENTS.WALLET.CONNECT_BUTTON_CLICK,
      () => {
        // Open Privy login modal
        login();
      },
      {
        wallet_type: "email",
        source: "wallet_connection_modal",
      },
    )();
  };

  return (
    <Button
      variant="outline"
      size="xl"
      width="full"
      className="flex flex-row items-center justify-start gap-3 h-14 text-pinto-gray-5 hover:text-pinto-gray-5"
      onClick={handleClick}
      disabled={!ready}
    >
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      </div>
      <span className="font-medium">Continue with Email</span>
    </Button>
  );
}

/**
 * Get wallet icon URL from Astrolab CDN
 * Uses https://cdn.astrolab.fi/assets/images/wallets/ for wallet icons
 * This CDN has icons for all major wallets
 */
const getWalletIcon = (connectorId: string, connectorName: string): string | undefined => {
  // Map connector to wallet identifier for Astrolab CDN
  const getWalletId = (): string | undefined => {
    // Check for injected wallet detection first (EIP-6963)
    if (connectorId.includes("injected") && typeof window !== "undefined" && window.ethereum) {
      const provider = window.ethereum;
      if (provider.isMetaMask) return "metamask";
      if (provider.isRabby) return "rabby";
      if (provider.isCoinbaseWallet) return "coinbase";
      if (provider.isBraveWallet) return "brave";
    }

    // Map connector IDs and names to wallet identifiers
    const connectorIdLower = connectorId.toLowerCase();
    const nameLower = connectorName.toLowerCase();

    // Check by connector ID first
    if (connectorIdLower === "injected" || connectorIdLower.includes("injected")) {
      // For injected, try to detect specific wallet
      if (typeof window !== "undefined" && window.ethereum) {
        if (window.ethereum.isMetaMask) return "metamask";
        if (window.ethereum.isRabby) return "rabby";
        if (window.ethereum.isCoinbaseWallet) return "coinbase";
        if (window.ethereum.isBraveWallet) return "brave";
      }
      // If can't detect, return undefined (will show fallback)
      return undefined;
    }

    if (connectorIdLower.includes("metamask") || nameLower.includes("metamask")) {
      return "metamask";
    }
    if (connectorIdLower.includes("rabby") || nameLower.includes("rabby")) {
      return "rabby";
    }
    if (connectorIdLower.includes("coinbase") || nameLower.includes("coinbase")) {
      return "coinbase";
    }
    if (connectorIdLower.includes("walletconnect") || nameLower.includes("walletconnect")) {
      return "walletconnect";
    }
    if (connectorIdLower.includes("brave") || nameLower.includes("brave")) {
      return "brave";
    }
    if (connectorIdLower.includes("phantom") || nameLower.includes("phantom")) {
      return "phantom";
    }

    return undefined;
  };

  const walletId = getWalletId();
  if (!walletId) {
    return undefined;
  }

  // Use Astrolab CDN for wallet icons
  // https://cdn.astrolab.fi/assets/images/wallets/{wallet-name}.svg
  const iconUrl = `https://cdn.astrolab.fi/assets/images/wallets/${walletId}.svg`;
  return iconUrl;
};

/**
 * Wallet Buttons Component
 * Uses wagmi connectors (same as ConnectKit uses) and maps them to ConnectKit wallet icons
 * This is the headless approach - we use the same connectors as ConnectKit and match icons
 */
function WalletButtons({ onConnect }: { onConnect?: () => void }) {
  const { connectors, connectAsync, isPending } = useConnect();
  const { address, isConnected, status: accountStatus, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const [connectingWalletId, setConnectingWalletId] = useState<string | null>(null);

  // Use refs to access latest account state and switchChain in async callbacks
  const accountStateRef = useRef({ address, isConnected, accountStatus, chainId });
  const switchChainRef = useRef(switchChain);
  useEffect(() => {
    accountStateRef.current = { address, isConnected, accountStatus, chainId };
    switchChainRef.current = switchChain;
  }, [address, isConnected, accountStatus, chainId, switchChain]);

  // Filter out any Privy connectors and the generic "injected" connector
  // We only want specific wallets (MetaMask, Rabby, WalletConnect, etc.), not the generic injected connector
  const eoaConnectors = useMemo(() => {
    const seen = new Set<string>();

    return connectors.filter((connector) => {
      if (!connector) return false;

      const id = connector.id.toLowerCase();
      if (id.includes("privy")) {
        return false;
      }

      if (id === "injected" || connector.name.toLowerCase() === "injected") {
        return false;
      }

      if (seen.has(id)) {
        return false;
      }

      seen.add(id);
      return true;
    });
  }, [connectors]);

  const handleConnect = async (connectorId: string) => {
    const connector = eoaConnectors.find((c) => c.id === connectorId);
    if (!connector) {
      console.error(`Connector not found: ${connectorId}`);
      return;
    }

    // Check if this is a WalletConnect connector BEFORE connecting
    // WalletConnect connector can have various IDs, check by type or ID
    // IMPORTANT: Check connector.type first, as it's the most reliable indicator
    const isWalletConnect =
      connector.type === "walletConnect" ||
      connector.type === "wallet_connect" ||
      connectorId.toLowerCase() === "walletconnect" ||
      connectorId.toLowerCase() === "wallet_connect" ||
      connectorId.toLowerCase().includes("walletconnect");

    // Check if this is Coinbase Wallet
    const isCoinbaseWallet =
      connector.type === "coinbaseWallet" ||
      connectorId.toLowerCase().includes("coinbase") ||
      connector.name.toLowerCase().includes("coinbase");

    // CRITICAL: Only proceed if this is NOT WalletConnect, or if it IS WalletConnect
    // This prevents WalletConnect modal from opening when connecting to other wallets
    if (!isWalletConnect) {
      // For non-WalletConnect connectors (MetaMask, Rabby, etc.), connect directly
      setConnectingWalletId(connectorId);

      try {
        // Track analytics and connect
        await withTracking(
          ANALYTICS_EVENTS.WALLET.CONNECT_BUTTON_CLICK,
          async () => {
            // Connect to the selected connector (injected wallets will trigger browser prompt)
            // For Coinbase Wallet, this may open a QR modal if extension is not installed

            // Determine if we should specify chain ID during connection
            // - In production: always connect to base mainnet
            // - In dev mode: connect to base mainnet first, then show chain selection modal for user to switch
            let connectChainId: number | undefined = undefined;

            if (isProd()) {
              // Production: always connect to base mainnet
              connectChainId = base.id;
            } else if (isNetlifyPreview()) {
              // Preview: use testnet if available, otherwise base
              connectChainId = !!TENDERLY_RPC_URL ? testnet.id : base.id;
            } else {
              // Dev mode (localhost): connect to base mainnet first
              // Chain selection modal will allow user to switch to localhost or other chains
              connectChainId = base.id;
            }

            // Connect (with or without chain ID based on environment)
            await connectAsync({
              connector,
              ...(connectChainId ? { chainId: connectChainId } : {}),
            });

            // Wait for account to be available (for all wallets, but especially Coinbase Wallet)
            // In dev mode, chain selection will be handled by the modal after connection
            // In production, wallet should already be on the correct chain from connectAsync
            const shouldWaitForAccountSync = isCoinbaseWallet || import.meta.env.DEV;
            if (shouldWaitForAccountSync) {
              // Wait for account to be available (poll with timeout)
              const maxWaitTime = 5000; // 5 seconds max
              const pollInterval = 100; // Check every 100ms
              const startTime = Date.now();

              while (Date.now() - startTime < maxWaitTime) {
                // Check if account is available using ref to get latest state
                const currentState = accountStateRef.current;
                if (currentState.isConnected && currentState.address) {
                  break;
                }
                await new Promise((resolve) => setTimeout(resolve, pollInterval));
              }

              // Final check after waiting
              const finalState = accountStateRef.current;
              if (!finalState.isConnected || !finalState.address) {
                console.warn(`${connector.name} account did not sync within timeout`);
                console.warn("Current state:", finalState);
              }
            }
          },
          {
            wallet_type: connectorId,
            wallet_name: connector.name,
            source: "wallet_connection_modal",
          },
        )();

        // Close modal after successful connection
        onConnect?.();
      } catch (error) {
        console.error(`Connection error for ${connector.name}:`, error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          connectorId: connectorId,
          connectorName: connector.name,
          connectorType: connector.type,
          connectorReady: connector.ready,
        });

        // For Coinbase Wallet, the error might be because extension is not installed
        // and QR modal couldn't open. In this case, we should inform the user.
        if (isCoinbaseWallet) {
          console.warn("Coinbase Wallet connection failed. This might be because:");
          console.warn("1. Coinbase Wallet extension is not installed");
          console.warn("2. QR modal couldn't open (check if headlessMode is disabled)");
          console.warn("3. User cancelled the connection");
        }

        // Don't close modal on error, let user try again
      } finally {
        setConnectingWalletId(null);
      }
    } else {
      // For WalletConnect, close our custom modal first so ConnectKit's QR modal can show
      setConnectingWalletId(connectorId);

      try {
        // Close custom modal before WalletConnect QR modal opens
        onConnect?.();
        // Small delay to ensure modal closes before QR modal opens
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Track analytics and connect
        await withTracking(
          ANALYTICS_EVENTS.WALLET.CONNECT_BUTTON_CLICK,
          async () => {
            // Connect to WalletConnect - this will trigger the QR modal (showQrModal: true)
            await connectAsync({ connector });
          },
          {
            wallet_type: connectorId,
            wallet_name: connector.name,
            source: "wallet_connection_modal",
          },
        )();
      } catch (error) {
        console.error("WalletConnect connection error:", error);
        // WalletConnect modal might have opened, so we don't reopen our modal
      } finally {
        setConnectingWalletId(null);
      }
    }
  };

  if (eoaConnectors.length === 0) {
    return (
      <div className="text-sm text-pinto-gray-4 text-center py-6">
        No wallets available. Please install a wallet extension.
      </div>
    );
  }

  return (
    <>
      {eoaConnectors.map((connector) => {
        const isConnecting = isPending && connectingWalletId === connector.id;
        const icon = getWalletIcon(connector.id, connector.name);

        return (
          <Button
            key={connector.id}
            variant="outline"
            size="xl"
            width="full"
            className="flex flex-row items-center justify-start gap-3 h-14 text-pinto-gray-5 hover:text-pinto-gray-5 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleConnect(connector.id)}
            disabled={isPending && !isConnecting}
          >
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 relative">
              {icon ? (
                <>
                  <img
                    src={icon}
                    alt={connector.name}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      console.error(`Icon failed to load for ${connector.name}:`, icon);
                      // Hide image and show fallback
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.parentElement?.querySelector(".wallet-icon-fallback") as HTMLElement;
                      if (fallback) {
                        fallback.style.display = "flex";
                      }
                    }}
                  />
                  <div className="wallet-icon-fallback w-6 h-6 rounded-full bg-pinto-gray-2 flex items-center justify-center hidden">
                    <span className="text-xs font-medium text-pinto-gray-5">
                      {connector.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-6 h-6 rounded-full bg-pinto-gray-2 flex items-center justify-center">
                  <span className="text-xs font-medium text-pinto-gray-5">
                    {connector.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <span className="font-medium flex-1">{connector.name}</span>
            {isConnecting && (
              <div className="ml-auto flex-shrink-0">
                <div className="w-4 h-4 border-2 border-pinto-green-4 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </Button>
        );
      })}
    </>
  );
}

/**
 * Chain Selection Modal Component (shown after wallet connection in dev mode)
 */
function ChainSelectionAfterConnect({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();

  const handleChainSelect = async (selectedChainId: number) => {
    try {
      await switchChain({ chainId: selectedChainId });
      onOpenChange(false);
      // Reload page to ensure all state is synced with the new chain
      window.location.reload();
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[300px] w-auto">
        <DialogHeader>
          <DialogTitle>Select Chain</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-2 mt-4">
              {chains.map((chain) => (
                <Button
                  key={`selectChain${chain.id}`}
                  onClick={() => handleChainSelect(chain.id)}
                  type="button"
                  variant="outline"
                  className={`font-[400] text-[1.5rem] p-8 w-full text-pinto-gray-5 hover:text-pinto-gray-5 rounded-[1rem] flex flex-row gap-2 items-center ${
                    chainId === chain.id ? "border-pinto-green bg-pinto-green-4 text-white" : ""
                  }`}
                >
                  {chain.name}
                </Button>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Main Wallet Connection Modal Component
 * Provides two authentication paths:
 * 1. Email/Social login via Privy
 * 2. External wallet connection via wagmi (MetaMask, Rabby, WalletConnect, etc.)
 */
export default function WalletConnectionModal({ open, onOpenChange }: WalletConnectionModalProps) {
  const { address, isConnected } = useAccount();
  const { error: connectError } = useConnect();
  const [showChainSelection, setShowChainSelection] = useState(false);

  // Track previous address and modal open state to detect new connections
  // Initialize with undefined to properly detect first connection
  const prevAddressRef = useRef<`0x${string}` | undefined>(undefined);
  const hasShownChainSelectionForThisConnectionRef = useRef(false);

  // Close wallet modal and show chain selection in dev mode after NEW connection
  useEffect(() => {
    // Check if address changed BEFORE updating the ref
    const addressChanged = address && address !== prevAddressRef.current;
    const modalIsOpen = open;

    // Reset flag when modal closes or wallet disconnects
    if (!modalIsOpen || !address) {
      hasShownChainSelectionForThisConnectionRef.current = false;
    }

    // Show chain selection modal when:
    // 1. We're in dev mode
    // 2. Wallet modal is currently open
    // 3. Address just changed (new connection happened)
    // 4. Wallet is connected
    // 5. We haven't shown the chain selection modal for this connection yet
    if (
      isDev() &&
      modalIsOpen &&
      addressChanged &&
      address &&
      isConnected &&
      !hasShownChainSelectionForThisConnectionRef.current
    ) {
      hasShownChainSelectionForThisConnectionRef.current = true;

      // Update refs AFTER checking (so next render won't trigger again)
      prevAddressRef.current = address;

      // Use a two-step approach:
      // 1. First, set chain selection modal to open (this will trigger a re-render)
      // 2. Then, after state has updated, close wallet modal
      setShowChainSelection(true);

      // Use a longer delay to ensure React has time to process the state update
      // and render the ChainSelectionAfterConnect component
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 500);
      return () => clearTimeout(timer);
    } else if (modalIsOpen && address && isConnected && !isDev()) {
      // In production/preview, just close the modal if it's open
      // Update refs
      prevAddressRef.current = address;

      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Update refs even if we don't show the modal
      prevAddressRef.current = address;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, open, isConnected, onOpenChange]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription className="text-pinto-gray-4">Choose a wallet to connect to Pinto</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-6">
            {/* Email/Social Login Section (Privy) */}
            <div className="flex flex-col gap-3">
              <EmailLoginButton />
            </div>

            {/* Separator */}
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs text-pinto-gray-4 font-medium">OR</span>
              <Separator className="flex-1" />
            </div>

            {/* External Wallet Section (wagmi) */}
            <div className="flex flex-col gap-3">
              <WalletButtons
                onConnect={() => {
                  // Don't close modal here - let the useEffect handle it
                  // This allows us to show chain selection modal in dev mode
                }}
              />
            </div>
          </div>

          {connectError && (
            <div className="mt-6 p-4 bg-red-50/50 border border-red-200/50 rounded-lg text-sm text-red-600">
              <div className="font-medium mb-1">Connection Error</div>
              <div className="text-pinto-gray-5">{connectError.message}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chain Selection Modal (shown after wallet connection in dev mode) */}
      {/* Always render in dev mode so it can open when showChainSelection becomes true */}
      {isDev() && (
        <ChainSelectionAfterConnect
          open={showChainSelection}
          onOpenChange={(open) => {
            setShowChainSelection(open);
            // If chain selection modal is closed and wallet is connected,
            // make sure wallet modal stays closed
            if (!open && address) {
              onOpenChange(false);
            }
          }}
        />
      )}
    </>
  );
}

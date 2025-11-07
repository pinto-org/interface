import { isDev } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

export interface UseChainSelectionReturn {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleConnect: () => void;
}

/**
 * Hook for managing chain selection modal state in development mode
 *
 * Features:
 * - Shows chain selection modal after wallet connection in dev mode
 * - Tracks connection state to detect new connections
 * - Prevents showing modal multiple times for same connection
 * - Automatically closes wallet modal when chain selection opens
 *
 * @param walletModalOpen - Whether the wallet connection modal is currently open
 * @param onWalletModalClose - Callback to close the wallet connection modal
 * @returns Chain selection state and handlers
 */
export function useChainSelection(
  walletModalOpen: boolean,
  onWalletModalClose: (open: boolean) => void,
): UseChainSelectionReturn {
  const { address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  const prevAddressRef = useRef<`0x${string}` | undefined>(undefined);
  const hasShownForConnectionRef = useRef(false);

  // Reset flag when modal closes or wallet disconnects
  useEffect(() => {
    if (!walletModalOpen || !address) {
      hasShownForConnectionRef.current = false;
    }
  }, [walletModalOpen, address]);

  // Show chain selection modal after new connection in dev mode
  useEffect(() => {
    const addressChanged = address && address !== prevAddressRef.current;
    const shouldShowChainSelection =
      isDev() && walletModalOpen && addressChanged && address && isConnected && !hasShownForConnectionRef.current;

    if (shouldShowChainSelection) {
      hasShownForConnectionRef.current = true;
      prevAddressRef.current = address;

      setIsOpen(true);

      const timer = setTimeout(() => {
        onWalletModalClose(false);
      }, 500);

      return () => clearTimeout(timer);
    } else if (walletModalOpen && address && isConnected && !isDev()) {
      // In production, just close wallet modal
      prevAddressRef.current = address;

      const timer = setTimeout(() => {
        onWalletModalClose(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      prevAddressRef.current = address;
    }
  }, [address, walletModalOpen, isConnected, onWalletModalClose]);

  const handleConnect = () => {
    // Connection handled by useWalletConnection
    // This is just a placeholder for modal close logic
  };

  return {
    isOpen,
    setIsOpen,
    handleConnect,
  };
}

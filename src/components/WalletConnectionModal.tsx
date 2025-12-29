import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Separator } from "@/components/ui/Separator";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { useChainSelection } from "@/hooks/wallet/useChainSelection";
import { trackSimpleEvent } from "@/utils/analytics";
import { isDev } from "@/utils/utils";
import { useEffect } from "react";
import { useConnect } from "wagmi";
import { ChainSelectionModal } from "./wallet-connection/ChainSelectionModal";
import { EmailLoginButton } from "./wallet-connection/EmailLoginButton";
import { WalletConnectorList } from "./wallet-connection/WalletConnectorList";

interface WalletConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Main Wallet Connection Modal Component
 * Provides two authentication paths:
 * 1. Email/Social login via Privy
 * 2. External wallet connection via wagmi (MetaMask, Rabby, WalletConnect, etc.)
 */
export default function WalletConnectionModal({ open, onOpenChange }: WalletConnectionModalProps) {
  const { error: connectError } = useConnect();
  const { isOpen: showChainSelection, setIsOpen: setShowChainSelection } = useChainSelection(open, onOpenChange);

  // Track modal open/close
  useEffect(() => {
    if (open) {
      trackSimpleEvent(ANALYTICS_EVENTS.WALLET.CONNECT_MODAL_OPEN, {
        source: "wallet_connection_modal",
      });
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription className="text-pinto-gray-4">Choose a wallet to connect to Pinto</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col gap-3">
              <EmailLoginButton onConnect={() => onOpenChange(false)} />
            </div>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs text-pinto-gray-4 font-medium">OR</span>
              <Separator className="flex-1" />
            </div>

            <div className="flex flex-col gap-3">
              <WalletConnectorList />
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

      {isDev() && <ChainSelectionModal open={showChainSelection} onOpenChange={setShowChainSelection} />}
    </>
  );
}

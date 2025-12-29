import { Button } from "@/components/ui/Button";
import { useWalletConnection } from "@/hooks/wallet/useWalletConnection";
import type { Connector } from "wagmi";

interface WalletConnectorButtonProps {
  connector?: Connector;
  walletName: string;
  walletIcon: string;
  isInstalled: boolean;
  onConnect: () => void;
  disabled?: boolean;
}

/**
 * Single wallet connector button with icon and loading state
 * Handles connection to a specific wallet connector
 */
export function WalletConnectorButton({
  connector,
  walletName,
  walletIcon,
  isInstalled,
  onConnect,
  disabled,
}: WalletConnectorButtonProps) {
  const { connect, isPending, connectingWalletId } = useWalletConnection({
    onSuccess: onConnect,
  });

  const isConnecting = connector && isPending && connectingWalletId === connector.id;

  const handleClick = () => {
    // Only connect if wallet is installed and connector exists
    if (!isInstalled || !connector) {
      return;
    }
    connect(connector.id);
  };

  return (
    <Button
      variant="outline"
      size="xl"
      width="full"
      className={`flex flex-row items-center justify-start gap-3 h-14 text-pinto-gray-5 hover:text-pinto-gray-5 disabled:opacity-50 disabled:cursor-not-allowed ${
        !isInstalled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={handleClick}
      disabled={disabled || (isPending && !isConnecting)}
    >
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 relative">
        <img
          src={walletIcon}
          alt={walletName}
          className="w-6 h-6 rounded-full"
          onError={(e) => {
            console.error(`Icon failed to load for ${walletName}:`, walletIcon);
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const fallback = target.parentElement?.querySelector(".wallet-icon-fallback") as HTMLElement;
            if (fallback) {
              fallback.style.display = "flex";
            }
          }}
        />
        <div className="wallet-icon-fallback w-6 h-6 rounded-full bg-pinto-gray-2 flex items-center justify-center hidden">
          <span className="text-xs font-medium text-pinto-gray-5">{walletName.charAt(0).toUpperCase()}</span>
        </div>
      </div>
      <span className="font-medium flex-1">{walletName}</span>
      {isConnecting && (
        <div className="ml-auto flex-shrink-0">
          <div className="w-4 h-4 border-2 border-pinto-green-4 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </Button>
  );
}

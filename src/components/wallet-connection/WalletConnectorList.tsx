import { getLegacyWalletProvider } from "@/utils/wagmi/legacyWalletProviders";
import { useEffect, useSyncExternalStore } from "react";
import { useConnectors } from "wagmi";
import { WalletConnectorButton } from "./WalletConnectorButton";

import coinbaseIcon from "@/assets/wallets/coinbase.png";
import metamaskIcon from "@/assets/wallets/metamask.png";
import rabbyIcon from "@/assets/wallets/rabby.png";
import walletconnectIcon from "@/assets/wallets/walletconnect.png";

interface WalletConnectorListProps {
  onConnect?: () => void;
}

function subscribeToLegacyWallets(onChange: () => void) {
  window.addEventListener("ethereum#initialized", onChange);
  window.addEventListener("focus", onChange);
  return () => {
    window.removeEventListener("ethereum#initialized", onChange);
    window.removeEventListener("focus", onChange);
  };
}

/**
 * List of wallet connectors in a fixed order
 * Shows: Rabby, MetaMask, WalletConnect, Coinbase Wallet
 */
export function WalletConnectorList({ onConnect }: WalletConnectorListProps) {
  const connectors = useConnectors();
  const findConnector = (id: string) => connectors.find((connector) => connector.id === id);
  const hasLegacyRabby = useSyncExternalStore(
    subscribeToLegacyWallets,
    () => !!getLegacyWalletProvider("rabby"),
    () => !!getLegacyWalletProvider("rabby"),
  );
  const hasLegacyMetaMask = useSyncExternalStore(
    subscribeToLegacyWallets,
    () => !!getLegacyWalletProvider("metamask"),
    () => !!getLegacyWalletProvider("metamask"),
  );

  // Request announcements again when the dialog opens in case an extension loaded after Wagmi.
  useEffect(() => {
    window.dispatchEvent(new Event("eip6963:requestProvider"));
  }, []);

  const rabby = findConnector("io.rabby") ?? (hasLegacyRabby ? findConnector("rabbyLegacy") : undefined);
  const metaMask =
    findConnector("io.metamask") ??
    findConnector("io.metamask.flask") ??
    (hasLegacyMetaMask ? findConnector("metamaskLegacy") : undefined);
  const walletConnect = findConnector("walletConnect");
  const wallets = [
    { name: "Rabby Wallet", icon: rabbyIcon, connector: rabby },
    { name: "MetaMask", icon: metamaskIcon, connector: metaMask },
    { name: "WalletConnect", icon: walletconnectIcon, connector: walletConnect },
    { name: "Coinbase Wallet", icon: coinbaseIcon, connector: findConnector("coinbaseWalletSDK") },
  ];

  return (
    <>
      {wallets.map(({ name, icon, connector }) => (
        <WalletConnectorButton
          key={name}
          connector={connector}
          walletName={name}
          walletIcon={icon}
          onConnect={onConnect}
        />
      ))}
      {(!rabby || !metaMask) && (
        <p className="text-sm text-pinto-gray-4">
          If your wallet is greyed out, allow its extension to run on this site and reload.
          {walletConnect && " You can also use WalletConnect."}
        </p>
      )}
    </>
  );
}

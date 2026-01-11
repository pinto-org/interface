import { useMemo } from "react";
import { useConnect } from "wagmi";
import type { Connector } from "wagmi";
import { WalletConnectorButton } from "./WalletConnectorButton";

import coinbaseIcon from "@/assets/wallets/coinbase.png";
import metamaskIcon from "@/assets/wallets/metamask.png";
import rabbyIcon from "@/assets/wallets/rabby.png";
import walletconnectIcon from "@/assets/wallets/walletconnect.png";

interface WalletConnectorListProps {
  onConnect?: () => void;
}

interface WalletConfig {
  id: string;
  name: string;
  icon: string;
  checkInstalled?: () => boolean;
}

const WALLET_ORDER: WalletConfig[] = [
  {
    id: "rabby",
    name: "Rabby Wallet",
    icon: rabbyIcon,
    checkInstalled: () => typeof window !== "undefined" && window.ethereum?.isRabby === true,
  },
  {
    id: "metamask",
    name: "MetaMask",
    icon: metamaskIcon,
    checkInstalled: () => typeof window !== "undefined" && window.ethereum?.isMetaMask === true,
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: walletconnectIcon,
    checkInstalled: () => true, // WalletConnect is always available (QR code)
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: coinbaseIcon,
    checkInstalled: () => true, // Coinbase Wallet can use QR code if extension not installed
  },
];

/**
 * List of wallet connectors in a fixed order
 * Shows: Rabby, MetaMask, WalletConnect, Coinbase Wallet
 */
export function WalletConnectorList({ onConnect }: WalletConnectorListProps) {
  const { connectors } = useConnect();

  const orderedWallets = useMemo(() => {
    return WALLET_ORDER.map((walletConfig) => {
      // Find matching connector
      const connector = connectors.find((c) => {
        const idLower = c.id.toLowerCase();
        const nameLower = c.name.toLowerCase();
        const configIdLower = walletConfig.id.toLowerCase();

        return (
          idLower.includes(configIdLower) ||
          nameLower.includes(configIdLower) ||
          (configIdLower === "walletconnect" && (c.type === "walletConnect" || c.type === "wallet_connect"))
        );
      });

      const isInstalled = walletConfig.checkInstalled?.() ?? false;

      return {
        config: walletConfig,
        connector,
        isInstalled,
        icon: walletConfig.icon,
      };
    });
  }, [connectors]);

  return (
    <>
      {orderedWallets.map(({ config, connector, isInstalled, icon }) => (
        <WalletConnectorButton
          key={config.id}
          connector={connector}
          walletName={config.name}
          walletIcon={icon}
          isInstalled={isInstalled}
          onConnect={() => onConnect?.()}
        />
      ))}
    </>
  );
}

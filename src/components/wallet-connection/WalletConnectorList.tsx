import { useConnectors } from "wagmi";
import { WalletConnectorButton } from "./WalletConnectorButton";

import coinbaseIcon from "@/assets/wallets/coinbase.png";
import metamaskIcon from "@/assets/wallets/metamask.png";
import rabbyIcon from "@/assets/wallets/rabby.png";
import walletconnectIcon from "@/assets/wallets/walletconnect.png";

interface WalletConnectorListProps {
  onConnect?: () => void;
}

const WALLET_ORDER = [
  {
    id: "io.rabby",
    name: "Rabby Wallet",
    icon: rabbyIcon,
  },
  {
    id: "io.metamask",
    fallbackId: "io.metamask.flask",
    name: "MetaMask",
    icon: metamaskIcon,
  },
  {
    id: "walletConnect",
    name: "WalletConnect",
    icon: walletconnectIcon,
  },
  {
    id: "coinbaseWalletSDK",
    name: "Coinbase Wallet",
    icon: coinbaseIcon,
  },
];

/**
 * List of wallet connectors in a fixed order
 * Shows: Rabby, MetaMask, WalletConnect, Coinbase Wallet
 */
export function WalletConnectorList({ onConnect }: WalletConnectorListProps) {
  const connectors = useConnectors();

  return (
    <>
      {WALLET_ORDER.map(({ id, fallbackId, name, icon }) => (
        <WalletConnectorButton
          key={id}
          connector={
            connectors.find((connector) => connector.id === id) ??
            connectors.find((connector) => connector.id === fallbackId)
          }
          walletName={name}
          walletIcon={icon}
          onConnect={onConnect}
        />
      ))}
    </>
  );
}

import type { EIP1193Provider } from "viem";

type LegacyWalletProvider = EIP1193Provider & {
  isBraveWallet?: true;
  isMetaMask?: true;
  isRabby?: true;
  _isRabby?: boolean;
  _metamask?: object;
};

type BrowserWallets = Window & {
  rabby?: LegacyWalletProvider;
  ethereum?: LegacyWalletProvider & { providers?: LegacyWalletProvider[] };
};

export function getLegacyWalletProvider(wallet: "rabby" | "metamask"): LegacyWalletProvider | undefined {
  if (typeof window === "undefined") return undefined;

  const { rabby, ethereum } = window as BrowserWallets;
  const providers = Array.isArray(ethereum?.providers) ? [...ethereum.providers, ethereum] : [ethereum];

  if (wallet === "rabby") {
    return [rabby, ...providers].find(
      (provider) => typeof provider?.request === "function" && (provider.isRabby || provider._isRabby),
    );
  }

  return providers.find(
    (provider) =>
      typeof provider?.request === "function" &&
      provider.isMetaMask &&
      provider._metamask &&
      !provider.isBraveWallet &&
      !provider.isRabby &&
      !provider._isRabby,
  );
}

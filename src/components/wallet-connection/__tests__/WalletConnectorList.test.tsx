import { getBaseConnectors } from "@/utils/wagmi/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { http, WagmiProvider, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { WalletConnectorList } from "../WalletConnectorList";

vi.hoisted(() => {
  vi.stubEnv("VITE_CHAINS", "8453");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderWalletButtons(
  announcedWallets: { rdns: string; name: string }[],
  globals: Record<string, unknown> = { ethereum: { isBraveWallet: true } },
) {
  const browser = Object.assign(new EventTarget(), globals);
  vi.stubGlobal("window", browser);

  browser.addEventListener("eip6963:requestProvider", () => {
    for (const wallet of announcedWallets) {
      browser.dispatchEvent(
        new CustomEvent("eip6963:announceProvider", {
          detail: { info: { ...wallet, uuid: crypto.randomUUID() }, provider: {} },
        }),
      );
    }
  });

  const config = createConfig({
    chains: [base],
    transports: { [base.id]: http() },
    connectors: getBaseConnectors(),
    storage: null,
  });

  const html = renderToStaticMarkup(
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={new QueryClient()}>
        <WalletConnectorList />
      </QueryClientProvider>
    </WagmiProvider>,
  );

  return html.match(/<button[^>]*>.*?<\/button>/g) ?? [];
}

describe("wallet extension availability", () => {
  it.each(["io.metamask", "io.metamask.flask"])("enables Rabby and %s alongside a built-in wallet", (rdns) => {
    const buttons = renderWalletButtons([
      { rdns: "io.rabby", name: "Rabby Wallet" },
      { rdns, name: "MetaMask" },
    ]);

    for (const name of ["Rabby Wallet", "MetaMask"]) {
      const button = buttons.find((markup) => markup.includes(`>${name}</span>`));
      expect(button).toBeDefined();
      expect(button).not.toContain('disabled=""');
      expect(button).not.toContain(" opacity-50 cursor-not-allowed");
    }
  });

  it("keeps unannounced extensions disabled even if another wallet sets isMetaMask", () => {
    const buttons = renderWalletButtons([{ rdns: "com.brave.wallet", name: "Brave Wallet" }], {
      ethereum: { isBraveWallet: true, isMetaMask: true },
    });

    for (const name of ["Rabby Wallet", "MetaMask"]) {
      const button = buttons.find((markup) => markup.includes(`>${name}</span>`));
      expect(button).toContain('disabled=""');
    }
  });

  it("enables Rabby from its dedicated provider and MetaMask from the legacy provider list", () => {
    const request = vi.fn();
    const buttons = renderWalletButtons([], {
      rabby: { _isRabby: true, isMetaMask: true, request },
      ethereum: {
        isBraveWallet: true,
        isMetaMask: true,
        providers: [
          { isMetaMask: true, isRabby: true, _metamask: {}, request },
          { isMetaMask: true, _metamask: {}, request },
        ],
      },
    });

    for (const name of ["Rabby Wallet", "MetaMask"]) {
      const button = buttons.find((markup) => markup.includes(`>${name}</span>`));
      expect(button).toBeDefined();
      expect(button).not.toContain('disabled=""');
    }
  });
});

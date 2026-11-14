import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { http, WagmiProvider, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { WalletConnectorList } from "../WalletConnectorList";

vi.hoisted(() => {
  vi.stubEnv("VITE_CHAINS", "8453");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderWalletButtons(announcedWallets: { rdns: string; name: string }[], isMetaMask = false) {
  const browser = Object.assign(new EventTarget(), {
    ethereum: { isBraveWallet: true, isMetaMask },
  });
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
    connectors: [injected()],
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
    const buttons = renderWalletButtons([{ rdns: "com.brave.wallet", name: "Brave Wallet" }], true);

    for (const name of ["Rabby Wallet", "MetaMask"]) {
      const button = buttons.find((markup) => markup.includes(`>${name}</span>`));
      expect(button).toContain('disabled=""');
    }
  });
});

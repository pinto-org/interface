import type { Connector } from "@wagmi/core";
import type { Address } from "viem";

/** This opt-in connector never switches chains and rechecks consent at the
 * provider boundary, after all asynchronous simulation/estimation work. */
export function guardedWalletConnector(
  connector: Connector,
  expected: { account: Address; chainId: number },
  assertCurrent: () => void,
): Connector {
  return {
    ...connector,
    // Use the guarded EIP-1193 provider path, not a custom client that bypasses it.
    getClient: undefined,
    async getAccounts() {
      assertCurrent();
      const result = await connector.getAccounts();
      assertCurrent();
      return result;
    },
    async getChainId() {
      assertCurrent();
      const result = await connector.getChainId();
      assertCurrent();
      if (result !== expected.chainId) throw new Error("Wallet network changed. Review the quote again.");
      return result;
    },
    async getProvider() {
      assertCurrent();
      // In particular, WalletConnect.getProvider({chainId}) may switch chains.
      // Omitting that argument retrieves the already connected provider only.
      const provider = (await connector.getProvider()) as {
        request(args: { method: string; params?: unknown }): Promise<any>;
      };
      assertCurrent();
      return new Proxy(provider, {
        get(target, property) {
          if (property !== "request") {
            const value = Reflect.get(target, property);
            return typeof value === "function" ? value.bind(target) : value;
          }
          return async (args: { method: string; params?: unknown }) => {
            assertCurrent();
            const sendsTransaction = args.method === "eth_sendTransaction" || args.method === "wallet_sendTransaction";
            if ((args.method.startsWith("wallet_") && !sendsTransaction) || args.method === "eth_requestAccounts") {
              throw new Error("Wallet context changes are not allowed during withdrawal preparation");
            }
            // Viem can retry through wallet_sendTransaction. The fallback must
            // pass the same fresh context checks as the first submission.
            if (sendsTransaction) {
              const [chain, accounts] = await Promise.all([
                target.request({ method: "eth_chainId" }),
                target.request({ method: "eth_accounts" }),
              ]);
              assertCurrent();
              const transaction = (args.params as { from?: string; chainId?: string }[])?.[0];
              if (
                BigInt(chain) !== BigInt(expected.chainId) ||
                accounts[0]?.toLowerCase() !== expected.account.toLowerCase() ||
                transaction?.from?.toLowerCase() !== expected.account.toLowerCase() ||
                (transaction.chainId !== undefined && BigInt(transaction.chainId) !== BigInt(expected.chainId))
              )
                throw new Error("Wallet or transaction context changed. Review the quote again.");
            }
            // No asynchronous gap between the final guard and handing the
            // explicitly addressed request to the connected wallet.
            return target.request(args);
          };
        },
      });
    },
  } as Connector;
}

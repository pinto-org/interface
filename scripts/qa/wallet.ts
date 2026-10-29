// TEST ONLY: public disposable Anvil account; never imported by src/ or builds.
import { createConfig, createConnector, http } from "wagmi";
import { createTestClient, custom, numberToHex, type Address } from "viem";
import { localhostNetwork } from "../../src/utils/wagmi/chains";
import { mnemonicToAccount } from "viem/accounts";
import { assertQaTransaction, qaAccount, qaAccounts, qaDiamond, qaOperator, qaObserver } from "./transaction-policy";
import { createQaReadControls } from "./read-controls";

export { qaAccount, qaOperator, qaObserver };
const rpc = "http://127.0.0.1:18569";
const signer = mnemonicToAccount("test test test test test test test test test test test junk");
const operatorSigner = mnemonicToAccount("test test test test test test test test test test test junk", { addressIndex: 1 });
if (signer.address.toLowerCase() !== qaAccount.toLowerCase()) throw new Error("Unexpected QA signer");
if (operatorSigner.address.toLowerCase() !== qaOperator.toLowerCase()) throw new Error("Unexpected QA operator");
export const qaState = { account: qaAccount as Address, reportedChainId: 1337, rejectNext: false, sends: [] as { hash: string; transaction: unknown }[] };
export const qaReadControls = createQaReadControls(() => window.dispatchEvent(new Event("qa-wallet-update")));
let notifyAccountChange: (account: Address) => void = () => {};
let notifyChainChange: (chainId: number) => void = () => {};
// Simulates a wallet reporting an unsupported chain. The RPC never leaves port 18569.
export function selectQaReportedChain(chainId: 1337 | 1338) {
  if (chainId !== 1337 && chainId !== 1338) throw new Error("Unknown QA chain scenario");
  qaState.reportedChainId = chainId;
  notifyChainChange(chainId);
  window.dispatchEvent(new Event("qa-wallet-update"));
}
function assertQaReportedChain() {
  if (qaState.reportedChainId !== 1337) throw new Error("QA wallet is simulating an unsupported network; sending/signing is disabled");
}
export function selectQaAccount(account: Address) {
  if (!qaAccounts.includes(account as typeof qaAccounts[number])) throw new Error("Unknown local QA account");
  qaState.account = account;
  notifyAccountChange(account);
  window.dispatchEvent(new Event("qa-wallet-update"));
}
async function request(method: string, params: unknown[] = []) {
  const response = await fetch(rpc, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const body = await response.json();
  if (body.error) throw Object.assign(new Error(body.error.message), { code: body.error.code });
  return body.result;
}
const connector = createConnector((config) => {
  let connected = false;
  notifyAccountChange = (account) => {
    if (connected) config.emitter.emit("change", { accounts: [account] });
  };
  notifyChainChange = (chainId) => {
    if (connected) config.emitter.emit("change", { chainId });
  };
  const provider = {
    async request({ method, params = [] }: { method: string; params?: any[] }) {
      const account = qaState.account;
      const activeSigner = account === qaAccount ? signer : account === qaOperator ? operatorSigner : undefined;
      if (method === "eth_accounts" || method === "eth_requestAccounts") return [account];
      if (method === "eth_chainId") return numberToHex(qaState.reportedChainId);
      if (method === "eth_signTypedData_v4") {
        assertQaReportedChain();
        if (await request("eth_chainId") !== numberToHex(1337) || !(await request("web3_clientVersion")).startsWith("anvil/"))
          throw new Error("QA signer requires the isolated local Anvil fork");
        assertQaReportedChain();
        const typed = JSON.parse(params[1]);
        if (!activeSigner || qaState.account !== account || params[0]?.toLowerCase() !== account.toLowerCase() ||
            typed.primaryType !== "Blueprint" || typed.domain?.name !== "Tractor" ||
            typed.domain?.version !== "1.0.0" || BigInt(typed.domain?.chainId ?? 0) !== 1337n ||
            typed.domain?.verifyingContract?.toLowerCase() !== qaDiamond ||
            typed.message?.publisher?.toLowerCase() !== account.toLowerCase())
          throw new Error("QA typed signing is limited to this fork's disposable Tractor publisher");
        return activeSigner.signTypedData(typed);
      }
      if (method === "personal_sign") {
        assertQaReportedChain();
        if (await request("eth_chainId") !== numberToHex(1337) || !(await request("web3_clientVersion")).startsWith("anvil/"))
          throw new Error("QA signer requires the isolated local Anvil fork");
        assertQaReportedChain();
        if (!activeSigner || qaState.account !== account || !/^0x[0-9a-fA-F]{64}$/.test(params[0]) || params[1]?.toLowerCase() !== account.toLowerCase())
          throw new Error("QA signing is limited to this disposable account's blueprint hashes");
        return activeSigner.signMessage({ message: { raw: params[0] } });
      }
      if (method === "eth_sendTransaction") {
        assertQaReportedChain();
        if (qaState.rejectNext) {
          qaState.rejectNext = false;
          window.dispatchEvent(new Event("qa-wallet-update"));
          throw Object.assign(new Error("User rejected local QA transaction"), { code: 4001 });
        }
        const tx = params[0];
        assertQaTransaction(tx, account);
        if (await request("eth_chainId") !== numberToHex(1337)) throw new Error("Wrong QA RPC chain");
        if (!(await request("web3_clientVersion")).startsWith("anvil/")) throw new Error("Not Anvil");
        if (qaState.account !== account) throw new Error("Local QA account changed before submission");
        assertQaReportedChain();
        const hash = await request(method, params);
        qaState.sends.push({ hash, transaction: tx });
        window.dispatchEvent(new Event("qa-wallet-update"));
        return hash;
      }
      if (!/^eth_(chainId|call|estimateGas|get[A-Za-z]+|gasPrice|maxPriorityFeePerGas|feeHistory)$/.test(method))
        throw new Error(`Unsupported QA wallet method: ${method}`);
      return request(method, params);
    },
  };
  return {
    id: "pinto-local-qa", name: "Disposable local QA wallet", type: "mock",
    async connect() { connected = true; return { accounts: [qaState.account], chainId: qaState.reportedChainId }; },
    async disconnect() { connected = false; },
    async getAccounts() { return [qaState.account]; },
    async getChainId() { return qaState.reportedChainId; },
    async isAuthorized() { return connected; },
    async getProvider() { return provider; },
    onAccountsChanged(accounts: string[]) { config.emitter.emit("change", { accounts: accounts as Address[] }); },
    onChainChanged(chain: string) { config.emitter.emit("change", { chainId: Number(chain) }); },
    onDisconnect() { connected = false; config.emitter.emit("disconnect"); },
  };
});
export const anvilTestClient = createTestClient({ mode: "anvil", chain: localhostNetwork, transport: http(rpc) });
export default createConfig({
  chains: [localhostNetwork], connectors: [connector], multiInjectedProviderDiscovery: false,
  transports: { [localhostNetwork.id]: custom({
    async request({ method, params }: { method: string; params?: unknown[] }) {
      await qaReadControls.beforeRequest(method, params);
      return request(method, params);
    },
  }, { retryCount: 0 }) },
});

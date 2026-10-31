import { decodeFunctionData, multicall3Abi, toFunctionSelector } from "viem";
import { qaDiamond } from "./transaction-policy";

const depositSelectors = new Set([
  "getDepositsForAccount(address,address[])",
  "getTokenDepositsForAccount(address,address)",
  "getAutoConvertOutputLock(address,int96)",
].map(toFunctionSelector));
const exitSelectors = new Set([
  "swapPintoDeposits(address,int96[],uint256[],uint256,uint256,uint8)",
  "redeemDepositsToPinto(address,int96[],uint256[],uint256,uint256,uint8)",
  "redeemDepositsToPairedToken(address,int96[],uint256[],uint256,uint256,uint8)",
].map(toFunctionSelector));
const multicall = "0xca11bde05977b3631167028862be2a173976ca11";

function isDepositRead(to: string | undefined, data: string | undefined): boolean {
  return to?.toLowerCase() === qaDiamond && typeof data === "string" &&
    depositSelectors.has(data.slice(0, 10).toLowerCase() as `0x${string}`);
}

function includesDepositRead(tx: { to?: string; data?: string } | undefined): boolean {
  if (isDepositRead(tx?.to, tx?.data)) return true;
  if (tx?.to?.toLowerCase() !== multicall || !tx.data) return false;
  try {
    const decoded = decodeFunctionData({ abi: multicall3Abi, data: tx.data as `0x${string}` });
    return decoded.functionName === "aggregate3" && decoded.args[0].some((call) =>
      isDepositRead(call.target, call.callData));
  } catch { return false; }
}

/** Local transport faults only. Never fabricates a successful result or intercepts a send. */
export function createQaReadControls(changed: () => void = () => {}) {
  const state = { failDepositReads: false, failedReads: 0, holdNextEstimate: false, estimatePending: false };
  let resume: (() => void) | undefined;
  return {
    state,
    setDepositFailure(fail: boolean) { state.failDepositReads = fail; changed(); },
    armEstimateHold() {
      if (state.estimatePending) throw new Error("Release the pending QA estimate first");
      state.holdNextEstimate = true;
      changed();
    },
    releaseEstimate() {
      const release = resume;
      resume = undefined;
      state.holdNextEstimate = false;
      state.estimatePending = false;
      release?.();
      changed();
    },
    async beforeRequest(method: string, params: readonly unknown[] = []) {
      const tx = params[0] as { to?: string; data?: string } | undefined;
      // A failed aggregate can also fail unrelated reads sharing that RPC request.
      // That is deliberate transport failure, not a fabricated per-call response.
      if (state.failDepositReads && method === "eth_call" && includesDepositRead(tx)) {
        state.failedReads += 1;
        changed();
        throw Object.assign(new Error("Local QA: deposit/lock RPC read intentionally failed"), { code: -32099 });
      }
      if (tx?.to?.toLowerCase() !== qaDiamond || typeof tx.data !== "string") return;
      const selector = tx.data.slice(0, 10).toLowerCase() as `0x${string}`;
      if (state.holdNextEstimate && method === "eth_estimateGas" && exitSelectors.has(selector)) {
        state.holdNextEstimate = false;
        state.estimatePending = true;
        await new Promise<void>((resolve) => { resume = resolve; changed(); });
      }
    },
  };
}

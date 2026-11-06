import { decodeFunctionData, erc20Abi, type Address, type Hex } from "viem";
import { siloedPintoABI } from "../../src/constants/abi/siloedPintoABI";

export const qaAccount: Address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
export const qaOperator: Address = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
// Existing fork depositor; Anvil impersonation only, never a real wallet signer.
export const qaObserver: Address = "0xa0AA5f404664A175Cd84e29B36840556f1C888E4";
export const qaAccounts = [qaAccount, qaOperator, qaObserver] as const;
export const qaDiamond = "0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f";
export const qaSiloedPinto = "0x00b174d66ada7d63789087f50a9b9e0e48446dc1";
const approvalTokens = new Set([
  "0xb170000aeefa790fa61d6e837d1035906839a3c8",
  "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // Base USDC, local buy-route QA only.
  "0x4200000000000000000000000000000000000006", // Base WETH, local swap/unwrap QA only.
  "0x3e111115a82df6190e36adf0d552880663a4dbf1",
  "0x3e11226fe3d85142b734abce6e58918d5828d1b4",
  "0x3e1133ac082716ddc3114bbefeed8b1731ea9cb1",
  "0x3e1155245ff9a6a019bc35827e801c6ed2ce91b9",
]);

/** Local test wallet only: never permits arbitrary token sends or native value. */
export function assertQaTransaction(
  tx: { from?: string; to?: string; value?: string; chainId?: string; data?: Hex },
  expected: Address = qaAccount,
) {
  if (!qaAccounts.some((address) => address.toLowerCase() === expected.toLowerCase()) ||
      tx.from?.toLowerCase() !== expected.toLowerCase() || BigInt(tx.value ?? 0) !== 0n)
    throw new Error("QA wallet only permits its selected local test account and zero native value");
  if (tx.chainId !== undefined && BigInt(tx.chainId) !== 1337n) throw new Error("Wrong QA transaction chain");
  const target = tx.to?.toLowerCase();
  if (target === qaDiamond) return;
  // Test-only wrapper coverage: self-receiving wrap/unwrap, at most one token.
  // This does not authorize arbitrary wrapper calls, approvals or third-party recipients.
  if (target === qaSiloedPinto && tx.data) {
    const decoded = decodeFunctionData({ abi: siloedPintoABI, data: tx.data });
    if (decoded.functionName === "depositFromSilo") {
      const [stems, amounts, receiver, mode] = decoded.args;
      if (stems.length > 0 && stems.length <= 16 && stems.length === amounts.length &&
          amounts.every((amount) => amount > 0n) && amounts.reduce((sum, amount) => sum + amount, 0n) <= 1_000_000n &&
          receiver.toLowerCase() === expected.toLowerCase() && mode <= 1) return;
    }
    if (decoded.functionName === "redeemToSilo") {
      const [shares, receiver, owner, mode] = decoded.args;
      if (shares > 0n && shares <= 10n ** 18n && receiver.toLowerCase() === expected.toLowerCase() &&
          owner.toLowerCase() === expected.toLowerCase() && mode <= 3) return;
    }
    if (decoded.functionName === "redeemAdvanced") {
      const [shares, receiver, owner, fromMode, toMode] = decoded.args;
      if (shares > 0n && shares <= 10n ** 18n && receiver.toLowerCase() === expected.toLowerCase() &&
          owner.toLowerCase() === expected.toLowerCase() && fromMode <= 3 && toMode <= 1) return;
    }
    throw new Error("QA wrapper calls must be bounded deposit wrap/unwrap back to the selected account");
  }
  if (!target || !approvalTokens.has(target) || !tx.data || tx.data.length !== 138)
    throw new Error("QA wallet only permits the Pinto Diamond or specific token approvals");
  const decoded = decodeFunctionData({ abi: erc20Abi, data: tx.data });
  if (decoded.functionName !== "approve" || decoded.args[0].toLowerCase() !== qaDiamond)
    throw new Error("QA token approval must target the Pinto Diamond");
}

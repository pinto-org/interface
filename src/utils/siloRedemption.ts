import { autoConvertABI } from "@/constants/abi/autoConvertABI";
import { type Address, type Client, parseAbi, parseUnits, toFunctionSelector, zeroAddress } from "viem";
import { getBlock, readContract } from "viem/actions";

export const redemptionViews = parseAbi([
  "function facetAddress(bytes4 selector) view returns(address)",
  "function getTokenDepositsForAccount(address account,address token) view returns((address token,uint256[] depositIds,(uint128 amount,uint128 bdv)[] tokenDeposits))",
  "function grownStalkForDeposit(address account,address token,int96 stem) view returns(uint256)",
  "function getGerminatingStem(address token) view returns(int96)",
  "function tokens() view returns(address[])",
]);

export const REDEMPTION_WARMUP_MESSAGE =
  "Fee-free withdrawals are warming up after the upgrade. They will open once the protocol has updated its rates.";

export type RedemptionDeposit = { stem: bigint; amount: bigint; bdv: bigint; available: bigint; eligible: boolean };
export type RedemptionRequest = {
  account: Address;
  diamond: Address;
  well: Address;
  pinto: Address;
  kind: "lp" | "lp-paired" | "pinto";
};
export type RedemptionSnapshot = RedemptionRequest & {
  blockNumber: bigint;
  timestamp: bigint;
  supported: boolean;
  enabled: boolean;
  warmingUp?: boolean;
  threshold: bigint;
  ema?: { meanScaled: bigint; activeSeasons: number; configuredSeasons: number; lastSeason: number };
  outputToken: Address;
  deposits: RedemptionDeposit[];
};
export type RedemptionSelection = { stems: bigint[]; amounts: bigint[]; amount: bigint };

/** All eligibility, balances and curve discovery come from one block. */
export async function readRedemptionSnapshot(
  client: Client,
  request: RedemptionRequest,
  blockNumber?: bigint,
): Promise<RedemptionSnapshot> {
  const block = await getBlock(client, blockNumber === undefined ? { blockTag: "latest" } : { blockNumber });
  const options = { address: request.diamond, blockNumber: block.number };
  const base: RedemptionSnapshot = {
    ...request,
    blockNumber: block.number,
    timestamp: block.timestamp,
    supported: false,
    enabled: false,
    threshold: 0n,
    outputToken: zeroAddress,
    deposits: [],
  };
  const facet = await readContract(client, {
    ...options,
    abi: redemptionViews,
    functionName: "facetAddress",
    args: [toFunctionSelector("getSiloRedemptionPolicy()")],
  });
  // A genuinely absent selector is a legacy deployment; RPC failures are NOT.
  if (facet === zeroAddress) return base;
  if (request.kind === "lp-paired") {
    for (const signature of [
      "getRedeemDepositsToPairedTokenOut(address,address,int96[],uint256[])",
      "redeemDepositsToPairedToken(address,int96[],uint256[],uint256,uint256,uint8)",
    ]) {
      const route = await readContract(client, {
        ...options,
        abi: redemptionViews,
        functionName: "facetAddress",
        args: [toFunctionSelector(signature)],
      });
      if (route === zeroAddress) return base;
    }
  }
  const [[threshold], [meanScaled, activeSeasons, configuredSeasons, lastSeason], enabled] = await Promise.all([
    readContract(client, { ...options, abi: autoConvertABI, functionName: "getSiloRedemptionPolicy" }),
    readContract(client, { ...options, abi: autoConvertABI, functionName: "getSiloRedemptionEmaState" }),
    readContract(client, {
      ...options,
      abi: autoConvertABI,
      functionName: "isSiloRedemptionWell",
      args: [request.well],
    }),
  ]);
  const ema = { meanScaled, activeSeasons, configuredSeasons, lastSeason };
  if (!enabled || threshold === 0n)
    return {
      ...base,
      supported: true,
      threshold,
      ema,
      warmingUp: enabled && threshold === 0n && meanScaled === 0n && configuredSeasons > 0,
    };
  const token = request.kind === "pinto" ? request.pinto : request.well;
  const [crates, germinatingStem, tokens] = await Promise.all([
    readContract(client, {
      ...options,
      abi: redemptionViews,
      functionName: "getTokenDepositsForAccount",
      args: [request.account, token],
    }),
    readContract(client, { ...options, abi: redemptionViews, functionName: "getGerminatingStem", args: [token] }),
    readContract(client, {
      address: request.well,
      blockNumber: block.number,
      abi: redemptionViews,
      functionName: "tokens",
    }),
  ]);
  if (tokens.length !== 2 || tokens[0].toLowerCase() !== request.pinto.toLowerCase())
    throw new Error("Unsupported fee-exempt Well");
  if (crates.token.toLowerCase() !== token.toLowerCase() || crates.depositIds.length !== crates.tokenDeposits.length)
    throw new Error("Invalid deposit response");
  const deposits = await Promise.all(
    crates.depositIds.map(async (id, i) => {
      const stem = BigInt.asIntN(96, id);
      const { amount, bdv } = crates.tokenDeposits[i];
      // The getter includes exact signed grown-Stalk adjustments. Stem age alone
      // can incorrectly accept or reject deposits after conversions/transfers.
      const grown =
        bdv > 0n && stem < germinatingStem
          ? await readContract(client, {
              ...options,
              abi: redemptionViews,
              functionName: "grownStalkForDeposit",
              args: [request.account, token, stem],
            })
          : 0n;
      return {
        stem,
        amount,
        bdv,
        available: amount,
        eligible: bdv > 0n && stem < germinatingStem && grown / bdv >= threshold && amount > 0n,
      };
    }),
  );
  return {
    ...base,
    supported: true,
    enabled: true,
    threshold,
    ema,
    outputToken: request.kind === "lp" ? request.pinto : tokens[1],
    deposits,
  };
}

/** Take the youngest qualifying deposits first, then encode strictly ascending stems. */
export function selectRedemptionDeposits(
  deposits: readonly RedemptionDeposit[],
  requested: bigint,
): RedemptionSelection {
  if (requested <= 0n) throw new Error("Enter a positive amount");
  let remaining = requested;
  const selected: { stem: bigint; amount: bigint }[] = [];
  const seen = new Set<string>();
  for (const deposit of [...deposits].sort((a, b) => (a.stem > b.stem ? -1 : a.stem < b.stem ? 1 : 0))) {
    if (seen.has(deposit.stem.toString())) throw new Error("Duplicate deposit stem");
    seen.add(deposit.stem.toString());
    if (!deposit.eligible || deposit.available <= 0n || remaining === 0n) continue;
    if (deposit.available > deposit.amount) throw new Error("Invalid unlocked balance");
    const amount = remaining < deposit.available ? remaining : deposit.available;
    selected.push({ stem: deposit.stem, amount });
    remaining -= amount;
  }
  if (remaining > 0n) throw new Error("Amount exceeds your eligible, unlocked deposits");
  if (selected.length > 32) throw new Error("Choose a smaller amount: this exit would need more than 32 deposits");
  selected.reverse();
  return { stems: selected.map((d) => d.stem), amounts: selected.map((d) => d.amount), amount: requested };
}

export function redemptionSelectionKey(selection: RedemptionSelection) {
  return selection.stems.map((stem, i) => `${stem}:${selection.amounts[i]}`).join(",");
}

export function parseRedemptionAmount(value: string, decimals: number): bigint {
  if (!/^\d+(\.\d*)?$/.test(value) || (value.split(".")[1]?.length ?? 0) > decimals)
    throw new Error("Enter an amount with valid token precision");
  return parseUnits(value, decimals);
}

export function redemptionMinimum(output: bigint, slippageBps: number): bigint {
  if (output <= 0n || !Number.isInteger(slippageBps) || slippageBps < 0 || slippageBps > 100)
    throw new Error("Invalid output or slippage");
  const minimum = (output * BigInt(10_000 - slippageBps)) / 10_000n;
  if (minimum === 0n) throw new Error("Output is too small");
  return minimum;
}

export async function quoteRedemption(client: Client, snapshot: RedemptionSnapshot, selection: RedemptionSelection) {
  if (!snapshot.supported || !snapshot.enabled)
    throw new Error(snapshot.warmingUp ? REDEMPTION_WARMUP_MESSAGE : "Fee-exempt exits are not enabled for this Well");
  const options = { address: snapshot.diamond, blockNumber: snapshot.blockNumber, abi: autoConvertABI };
  const args = [snapshot.account, snapshot.well, selection.stems, selection.amounts] as const;
  if (snapshot.kind === "lp")
    return readContract(client, { ...options, functionName: "getRedeemDepositsToPintoOut", args });
  const [token, amount] = await readContract(client, {
    ...options,
    functionName: snapshot.kind === "lp-paired" ? "getRedeemDepositsToPairedTokenOut" : "getSwapPintoDepositsOut",
    args,
  });
  if (token.toLowerCase() !== snapshot.outputToken.toLowerCase()) throw new Error("Quote output token changed");
  return amount;
}

export function redemptionWriteFunction(kind: RedemptionRequest["kind"]) {
  return kind === "lp"
    ? "redeemDepositsToPinto"
    : kind === "lp-paired"
      ? "redeemDepositsToPairedToken"
      : "swapPintoDeposits";
}

/** Keep the reviewed assets, minimum and deadline; revalidation cannot widen consent. */
export async function revalidateRedemption(
  client: Client,
  reviewed: RedemptionSnapshot,
  selection: RedemptionSelection,
  minimum: bigint,
) {
  if (minimum <= 0n) throw new Error("Invalid minimum receipt");
  const fresh = await readRedemptionSnapshot(client, reviewed);
  const selected = selectRedemptionDeposits(fresh.deposits, selection.amount);
  if (redemptionSelectionKey(selected) !== redemptionSelectionKey(selection)) {
    throw new Error("Your eligible deposits changed. Refresh and review the new quote.");
  }
  if (fresh.outputToken.toLowerCase() !== reviewed.outputToken.toLowerCase())
    throw new Error("Output token changed. Refresh the quote.");
  const deadline = reviewed.timestamp + 1_200n;
  if (fresh.timestamp > deadline) throw new Error("Quote expired. Refresh and review a new quote.");
  if ((await quoteRedemption(client, fresh, selected)) < minimum)
    throw new Error("Price moved beyond your minimum. Review a new quote.");
  return { selected, deadline };
}

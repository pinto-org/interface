import { Clipboard } from "@/classes/Clipboard";
import { autoConvertABI } from "@/constants/abi/autoConvertABI";
import { JUNCTION_ADDRESS, PIPELINE_ADDRESS } from "@/constants/address";
import { API_SERVICES } from "@/constants/endpoints";
import {
  type RedemptionSelection,
  type RedemptionSnapshot,
  quoteRedemption,
  readRedemptionSnapshot,
  redemptionMinimum,
  redemptionSelectionKey,
  redemptionWriteFunction,
  selectRedemptionDeposits,
} from "@/utils/siloRedemption";
import {
  type Address,
  type Client,
  type Hex,
  decodeFunctionData,
  encodeFunctionData,
  erc20Abi,
  isAddress,
  parseAbi,
} from "viem";
import { getBlock, readContract } from "viem/actions";

export const ALLOWANCE_HOLDER: Address = "0x0000000000001fF3684f28c67538d4D072C22734";
export const ROUTE_LIFETIME_MS = 60_000;
export const routeABI = parseAbi([
  "function advancedFarm((bytes callData,bytes clipboard)[] data) payable returns(bytes[])",
  "function advancedPipe((address target,bytes callData,bytes clipboard)[] pipes,uint256 value) payable returns(bytes[])",
  "function transferToken(address token,address recipient,uint256 amount,uint8 fromMode,uint8 toMode) payable",
  "function getReserves() view returns(uint256[])",
  "function gte(uint256 a,uint256 b) pure returns(bool)",
  "function check(bool condition) pure",
]);
const holderABI = parseAbi([
  "function exec(address operator,address token,uint256 amount,address target,bytes data) payable returns(bytes)",
]);
const eq = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const uint = (v: unknown): v is string => typeof v === "string" && /^(0|[1-9]\d*)$/.test(v) && BigInt(v) < 2n ** 256n;
export type RoutedSwap = {
  sellToken: Address;
  buyToken: Address;
  sellAmount: bigint;
  buyAmount: bigint;
  minimum: bigint;
  data: Hex;
  sources: string[];
  fills?: {
    from: Address;
    to: Address;
    source: string;
    proportionBps: number;
    fromSymbol?: string;
    toSymbol?: string;
  }[];
};
export type RouteLeg = {
  snapshot: RedemptionSnapshot;
  selection: RedemptionSelection;
  output: bigint;
  minimum: bigint;
  swap?: RoutedSwap;
};
export type RedemptionRoute = {
  chainId: number;
  account: Address;
  diamond: Address;
  buyToken: Address;
  fetchedAt: number;
  deadline: bigint;
  legs: RouteLeg[];
  expected: bigint;
  minimum: bigint;
};

/** Integer reserve weighting, with exact conservation and no zero-sized legs. */
export function splitByReserves(amount: bigint, reserves: readonly bigint[]) {
  if (amount <= 0n || !reserves.length || reserves.some((r) => r <= 0n)) throw new Error("No usable pool liquidity");
  const total = reserves.reduce((a, b) => a + b, 0n);
  let allocated = 0n;
  const parts = reserves.map((reserve, i) => {
    const part = i === reserves.length - 1 ? amount - allocated : (amount * reserve) / total;
    allocated += part;
    return part;
  });
  if (parts.some((part) => part === 0n)) throw new Error("Amount is too small to route through every pool");
  return parts;
}

/** Partition one reviewed selection, never selecting the same units twice. */
export function partitionSelection(selection: RedemptionSelection, amounts: readonly bigint[]): RedemptionSelection[] {
  if (amounts.some((a) => a <= 0n) || amounts.reduce((a, b) => a + b, 0n) !== selection.amount)
    throw new Error("Invalid withdrawal allocation");
  let index = 0;
  let used = 0n;
  return amounts.map((amount) => {
    let left = amount;
    const stems: bigint[] = [],
      values: bigint[] = [];
    while (left > 0n) {
      if (index >= selection.stems.length) throw new Error("Invalid deposit selection");
      const remaining = selection.amounts[index] - used;
      const take = remaining < left ? remaining : left;
      if (take <= 0n) throw new Error("Invalid deposit selection");
      stems.push(selection.stems[index]);
      values.push(take);
      used += take;
      left -= take;
      if (used === selection.amounts[index]) {
        index++;
        used = 0n;
      }
    }
    return { stems, amounts: values, amount };
  });
}

export function validateRoutedSwap(
  raw: unknown,
  sellToken: Address,
  buyToken: Address,
  sellAmount: bigint,
  bps: number,
): RoutedSwap {
  const q = raw as any;
  const invalid = () => {
    throw new Error("0x returned an unsupported quote. Refresh the route.");
  };
  if (!q || q.liquidityAvailable !== true) throw new Error("0x has no liquidity for one of the withdrawal assets");
  if (
    !isAddress(q.sellToken ?? "", { strict: false }) ||
    !isAddress(q.buyToken ?? "", { strict: false }) ||
    !eq(q.sellToken, sellToken) ||
    !eq(q.buyToken, buyToken) ||
    !uint(q.sellAmount) ||
    BigInt(q.sellAmount) !== sellAmount ||
    !uint(q.buyAmount) ||
    !uint(q.minBuyAmount) ||
    BigInt(q.minBuyAmount) <= 0n ||
    BigInt(q.buyAmount) < BigInt(q.minBuyAmount) ||
    BigInt(q.minBuyAmount) < (BigInt(q.buyAmount) * BigInt(10_000 - bps)) / 10_000n
  )
    return invalid();
  if (
    !q.issues ||
    !Array.isArray(q.issues.invalidSourcesPassed) ||
    q.issues.invalidSourcesPassed.length ||
    !eq(q.allowanceTarget ?? "", ALLOWANCE_HOLDER) ||
    (q.issues.allowance && !eq(q.issues.allowance.spender ?? "", ALLOWANCE_HOLDER))
  )
    return invalid();
  const tx = q.transaction;
  if (!tx || !eq(tx.to ?? "", ALLOWANCE_HOLDER) || tx.value !== "0" || !/^0x([\da-fA-F]{2})+$/.test(tx.data ?? ""))
    return invalid();
  try {
    const { args } = decodeFunctionData({ abi: holderABI, data: tx.data });
    if (!eq(args[1], sellToken) || args[2] !== sellAmount || !eq(args[0], args[3]) || args[4].length < 10)
      return invalid();
  } catch {
    return invalid();
  }
  return {
    sellToken,
    buyToken,
    sellAmount,
    buyAmount: BigInt(q.buyAmount),
    minimum: BigInt(q.minBuyAmount),
    data: tx.data,
    sources: [
      ...new Set<string>(
        (Array.isArray(q.route?.fills) ? q.route.fills : []).flatMap((fill: any) =>
          typeof fill?.source === "string" ? [fill.source] : [],
        ),
      ),
    ],
    // Display metadata only. Never use these fields to construct transaction calls.
    fills: (Array.isArray(q.route?.fills) ? q.route.fills : []).flatMap((fill: any) => {
      if (!fill || typeof fill !== "object") return [];
      const proportionBps = Number(fill.proportionBps);
      if (
        !isAddress(fill.from ?? "") ||
        !isAddress(fill.to ?? "") ||
        typeof fill.source !== "string" ||
        !/^\d+$/.test(String(fill.proportionBps)) ||
        !Number.isInteger(proportionBps) ||
        proportionBps < 0 ||
        proportionBps > 10000
      )
        return [];
      const symbol = (address: Address) => {
        const token = Array.isArray(q.route?.tokens)
          ? q.route.tokens.find((t: any) => typeof t.address === "string" && eq(t.address, address))
          : undefined;
        return typeof token?.symbol === "string" && token.symbol.length <= 32 ? token.symbol : undefined;
      };
      return [
        {
          from: fill.from,
          to: fill.to,
          source: fill.source,
          proportionBps,
          fromSymbol: symbol(fill.from),
          toSymbol: symbol(fill.to),
        },
      ];
    }),
  };
}

async function fetchSwap(
  account: Address,
  sellToken: Address,
  buyToken: Address,
  amount: bigint,
  bps: number,
  signal?: AbortSignal,
) {
  if (!API_SERVICES.router) throw new Error("0x routing service is not configured");
  const params = new URLSearchParams({
    chainId: "8453",
    sellToken,
    buyToken,
    sellAmount: String(amount),
    taker: PIPELINE_ADDRESS,
    txOrigin: account,
    recipient: PIPELINE_ADDRESS,
    sellEntireBalance: "true",
    slippageBps: String(bps),
    excludedSources: "Pinto",
  });
  const response = await fetch(`${API_SERVICES.router}/swap/allowance-holder/quote/?${params}`, { signal });
  if (!response.ok)
    throw new Error(
      response.status === 429 ? "0x rate limit reached. Try again shortly." : "Could not fetch a 0x route",
    );
  return validateRoutedSwap(await response.json(), sellToken, buyToken, amount, bps);
}

export async function readRoutePoolState(
  client: Client,
  request: { account: Address; diamond: Address; pinto: Address; wells: Address[]; kind: "pinto" | "lp-paired" | "lp" },
) {
  const block = await getBlock(client, { blockTag: "latest" });
  const snapshots = await Promise.all(
    request.wells.map((well) => readRedemptionSnapshot(client, { ...request, well }, block.number)),
  );
  const pools = await Promise.all(
    snapshots
      .filter((snapshot) => snapshot.enabled)
      .map(async (snapshot) => {
        const reserves = await readContract(client, {
          address: snapshot.well,
          abi: routeABI,
          functionName: "getReserves",
          blockNumber: block.number,
        });
        if (reserves.length !== 2 || reserves[0] <= 0n || reserves[1] <= 0n)
          throw new Error("An enabled pool has no liquidity");
        return { snapshot, weight: reserves[0] };
      }),
  );
  return { pools, warmingUp: pools.length === 0 && snapshots.some((snapshot) => snapshot.warmingUp) };
}

export async function readRoutePools(client: Client, request: Parameters<typeof readRoutePoolState>[1]) {
  return (await readRoutePoolState(client, request)).pools;
}

export async function quoteRoute(
  client: Client,
  pools: Awaited<ReturnType<typeof readRoutePools>>,
  amount: bigint,
  buyToken: Address,
  chainId: number,
  slippageBps: number,
  signal?: AbortSignal,
): Promise<RedemptionRoute> {
  if (![8453, 1337, 41337].includes(chainId))
    throw new Error("This route supports Base and its configured local forks only");
  if (!pools.length) throw new Error("No enabled fee-exempt pools on this deployment");
  if (!Number.isInteger(slippageBps) || slippageBps < 0 || slippageBps > 100) throw new Error("Invalid slippage");
  const first = pools[0].snapshot;
  if (first.kind !== "lp" && eq(first.pinto, buyToken)) throw new Error("Choose a non-Pinto final token");
  const selection = selectRedemptionDeposits(first.deposits, amount);
  for (const { snapshot } of pools) {
    if (
      snapshot.blockNumber !== first.blockNumber ||
      !eq(snapshot.account, first.account) ||
      !eq(snapshot.diamond, first.diamond) ||
      redemptionSelectionKey(selectRedemptionDeposits(snapshot.deposits, amount)) !== redemptionSelectionKey(selection)
    )
      throw new Error("Pool eligibility changed. Refresh the route.");
  }
  const allocations = partitionSelection(
    selection,
    splitByReserves(
      amount,
      pools.map((p) => p.weight),
    ),
  );
  const legBps = Math.floor(slippageBps / 2);
  const legs: RouteLeg[] = [];
  // Sequential requests respect the proxy's rate limits. Any missing leg fails the whole route.
  const fetchedAt = Date.now();
  for (let i = 0; i < pools.length; i++) {
    signal?.throwIfAborted();
    const snapshot = pools[i].snapshot;
    const output = await quoteRedemption(client, snapshot, allocations[i]);
    const minimum = redemptionMinimum(output, legBps);
    const swap = eq(snapshot.outputToken, buyToken)
      ? undefined
      : await fetchSwap(first.account, snapshot.outputToken, buyToken, output, legBps, signal);
    legs.push({ snapshot, selection: allocations[i], output, minimum, swap });
  }
  return {
    chainId,
    account: first.account,
    diamond: first.diamond,
    buyToken,
    fetchedAt,
    deadline: first.timestamp + 120n,
    legs,
    expected: legs.reduce((sum, leg) => sum + (leg.swap?.buyAmount ?? leg.output), 0n),
    minimum: legs.reduce((sum, leg) => sum + (leg.swap?.minimum ?? leg.minimum), 0n),
  };
}

type FarmCall = { callData: Hex; clipboard: Hex };
type PipeCall = FarmCall & { target: Address };
const empty = Clipboard.encode([]);
const erc = (
  token: Address,
  functionName: "balanceOf" | "approve" | "transfer",
  args: any[],
  clipboard = empty,
): PipeCall => ({
  target: token,
  callData: encodeFunctionData({ abi: erc20Abi, functionName, args } as any),
  clipboard,
});
const pipe = (calls: PipeCall[]): FarmCall => ({
  callData: encodeFunctionData({ abi: routeABI, functionName: "advancedPipe", args: [calls, 0n] }),
  clipboard: empty,
});
function checkBalance(calls: PipeCall[], token: Address, minimum: bigint, zero = false) {
  const index = calls.length;
  calls.push(erc(token, "balanceOf", [PIPELINE_ADDRESS]));
  calls.push({
    target: JUNCTION_ADDRESS,
    callData: encodeFunctionData({ abi: routeABI, functionName: "gte", args: zero ? [0n, 0n] : [0n, minimum] }),
    clipboard: Clipboard.encodeSlot(index, 0, zero ? 1 : 0),
  });
  calls.push({
    target: JUNCTION_ADDRESS,
    callData: encodeFunctionData({ abi: routeABI, functionName: "check", args: [false] }),
    clipboard: Clipboard.encodeSlot(index + 1, 0, 0),
  });
}
function sweep(calls: PipeCall[], token: Address, account: Address) {
  const index = calls.length;
  calls.push(erc(token, "balanceOf", [PIPELINE_ADDRESS]));
  calls.push(erc(token, "transfer", [account, 0n], Clipboard.encodeSlot(index, 0, 1)));
}

export function assertRouteFresh(route: RedemptionRoute, now = Date.now()) {
  if (now < route.fetchedAt || now - route.fetchedAt >= ROUTE_LIFETIME_MS)
    throw new Error("Route expired. Refresh and review again.");
}

/** Actual redemption return amounts are copied into transfers: existing internal balances are never spent. */
export function buildRoute(route: RedemptionRoute): FarmCall[] {
  assertRouteFresh(route);
  if (!route.legs.length || route.minimum <= 0n) throw new Error("Invalid route");
  const farm: FarmCall[] = [];
  const cleanup: PipeCall[] = [];
  const assets = new Map<string, Address>();
  for (const token of [route.buyToken, ...route.legs.map((leg) => leg.snapshot.outputToken)])
    assets.set(token.toLowerCase(), token);
  // Pipeline is public. Clear donations first so neither swaps nor minimum checks include an old balance.
  for (const token of assets.values()) sweep(cleanup, token, route.account);
  farm.push(pipe(cleanup));
  for (const leg of route.legs) {
    const index = farm.length;
    farm.push({
      callData: encodeFunctionData({
        abi: autoConvertABI,
        functionName: redemptionWriteFunction(leg.snapshot.kind),
        args: [leg.snapshot.well, leg.selection.stems, leg.selection.amounts, leg.minimum, route.deadline, 1],
      }),
      clipboard: empty,
    });
    farm.push({
      callData: encodeFunctionData({
        abi: routeABI,
        functionName: "transferToken",
        args: [leg.snapshot.outputToken, PIPELINE_ADDRESS, 0n, 1, 0],
      }),
      clipboard: Clipboard.encodeSlot(index, 0, 2),
    });
    if (leg.swap) {
      const swap = leg.swap;
      const calls: PipeCall[] = [
        // A favorable reserve move can return more than the quoted sell amount.
        // Cleanup above makes this balance exactly this leg's proceeds; keep both
        // spending caps aligned with sellEntireBalance without granting an unlimited approval.
        erc(swap.sellToken, "balanceOf", [PIPELINE_ADDRESS]),
        erc(swap.sellToken, "approve", [ALLOWANCE_HOLDER, 0n]),
        erc(swap.sellToken, "approve", [ALLOWANCE_HOLDER, 0n], Clipboard.encodeSlot(0, 0, 1)),
        { target: ALLOWANCE_HOLDER, callData: swap.data, clipboard: Clipboard.encodeSlot(0, 0, 2) },
        erc(swap.sellToken, "approve", [ALLOWANCE_HOLDER, 0n]),
      ];
      // sellEntireBalance must consume the whole leg; otherwise revert instead of stranding a paired asset.
      checkBalance(calls, swap.sellToken, 0n, true);
      farm.push(pipe(calls));
    }
  }
  const settlement: PipeCall[] = [];
  checkBalance(settlement, route.buyToken, route.minimum);
  sweep(settlement, route.buyToken, route.account);
  farm.push(pipe(settlement));
  return farm;
}

export async function revalidateRoute(client: Client, route: RedemptionRoute) {
  assertRouteFresh(route);
  const first = route.legs[0].snapshot;
  const pools = await readRoutePools(client, {
    account: route.account,
    diamond: route.diamond,
    pinto: first.pinto,
    wells: route.legs.map((leg) => leg.snapshot.well),
    kind: first.kind,
  });
  if (pools.length !== route.legs.length) throw new Error("An exit pool is no longer enabled. Refresh the route.");
  const totals = new Map<bigint, bigint>();
  for (const leg of route.legs)
    leg.selection.stems.forEach((stem, i) => totals.set(stem, (totals.get(stem) ?? 0n) + leg.selection.amounts[i]));
  for (let i = 0; i < pools.length; i++) {
    const snapshot = pools[i].snapshot;
    if (snapshot.timestamp >= route.deadline || !eq(snapshot.outputToken, route.legs[i].snapshot.outputToken))
      throw new Error("Route expired or output changed. Refresh the route.");
    for (const [stem, amount] of totals) {
      const deposit = snapshot.deposits.find((d) => d.stem === stem);
      if (!deposit?.eligible || deposit.available < amount)
        throw new Error("Selected deposits changed. Refresh the route.");
    }
    if ((await quoteRedemption(client, snapshot, route.legs[i].selection)) < route.legs[i].minimum)
      throw new Error("Pool price moved beyond your minimum. Refresh the route.");
  }
  assertRouteFresh(route);
}

import assert from "node:assert/strict";
import {
  type Address,
  createClient,
  createWalletClient,
  custom,
  decodeFunctionData,
  encodeAbiParameters,
  toFunctionSelector,
} from "viem";
import { base } from "viem/chains";
import { test } from "vitest";
import { autoConvertABI } from "../../constants/abi/autoConvertABI";
import { guardedWalletConnector } from "../../utils/guardedWallet";
import {
  REDEMPTION_WARMUP_MESSAGE,
  type RedemptionDeposit,
  parseRedemptionAmount,
  quoteRedemption,
  readRedemptionSnapshot,
  redemptionMinimum,
  redemptionViews,
  redemptionWriteFunction,
  revalidateRedemption,
  selectRedemptionDeposits,
} from "../../utils/siloRedemption";

const account: Address = "0x0000000000000000000000000000000000000040";
const diamond: Address = "0x0000000000000000000000000000000000000041";
const pinto: Address = "0x0000000000000000000000000000000000000042";
const well: Address = "0x0000000000000000000000000000000000000043";
const paired: Address = "0x0000000000000000000000000000000000000044";
const request = { account, diamond, well, pinto, kind: "pinto" as const };

function mockChain(
  options: {
    legacy?: boolean;
    disabled?: boolean;
    rpcError?: boolean;
    now?: bigint;
    amount?: bigint;
    quote?: bigint;
    changedToken?: boolean;
    missingPairedSelector?: "quote" | "write";
    changedQuoteToken?: boolean;
    threshold?: bigint;
    meanScaled?: bigint;
    emaSeason?: number;
    grownAdjustment?: bigint;
  } = {},
) {
  const abi = [...autoConvertABI, ...redemptionViews];
  const calls: string[] = [];
  const client = createClient({
    transport: custom(
      {
        request: async ({ method, params }: any) => {
          if (method === "eth_getBlockByNumber")
            return { number: "0x64", timestamp: `0x${(options.now ?? 1000n).toString(16)}`, transactions: [] };
          assert.equal(method, "eth_call", "this helper never broadcasts");
          assert.equal(params[1], "0x64", "all reads use the same snapshot");
          const decoded = decodeFunctionData({ abi, data: params[0].data });
          const name = decoded.functionName;
          calls.push(name);
          if (options.rpcError) throw new Error("RPC unavailable");
          let output: any;
          switch (name) {
            case "facetAddress":
              output = [
                options.legacy ||
                (options.missingPairedSelector &&
                  decoded.args?.[0] ===
                    toFunctionSelector(
                      options.missingPairedSelector === "quote"
                        ? "getRedeemDepositsToPairedTokenOut(address,address,int96[],uint256[])"
                        : "redeemDepositsToPairedToken(address,int96[],uint256[],uint256,uint256,uint8)",
                    ))
                  ? "0x0000000000000000000000000000000000000000"
                  : diamond,
              ];
              break;
            case "getSiloRedemptionPolicy":
              output = [options.threshold ?? 24n, 200];
              break;
            case "isSiloRedemptionWell":
              output = [!options.disabled];
              break;
            case "tokens":
              output = [[pinto, options.changedToken ? diamond : paired]];
              break;
            case "getSiloRedemptionEmaState":
              output = [options.meanScaled ?? 1_000_000_000_000_000_000n, 24, 36, options.emaSeason ?? 200];
              break;
            case "grownStalkForDeposit":
              output = [(100n - (decoded.args![2] as bigint)) * 100n + (options.grownAdjustment ?? 0n)];
              break;
            case "getGerminatingStem":
              output = [99n];
              break;
            case "getTokenDepositsForAccount": {
              const token = decoded.args![1] as Address;
              const stems = [-7n, 76n, 77n, 99n];
              output = [
                {
                  token,
                  depositIds: stems.map((stem) => (BigInt(token) << 96n) | BigInt.asUintN(96, stem)),
                  tokenDeposits: stems.map(() => ({ amount: options.amount ?? 100n, bdv: 100n })),
                },
              ];
              break;
            }
            case "getSwapPintoDepositsOut":
            case "getRedeemDepositsToPairedTokenOut":
              output = [options.changedQuoteToken ? diamond : paired, options.quote ?? 900n];
              break;
            case "getRedeemDepositsToPintoOut":
              output = [options.quote ?? 900n];
              break;
            default:
              throw new Error(`Unexpected call: ${name}`);
          }
          const definition = abi.find((item) => item.type === "function" && item.name === name)! as any;
          return encodeAbiParameters(definition.outputs, output);
        },
      },
      { retryCount: 0 },
    ),
  });
  return { client, calls };
}

test("qualification checks signed stems, exact threshold and germination at one block", async () => {
  const { client } = mockChain();
  const snapshot = await readRedemptionSnapshot(client, request);
  assert.equal(snapshot.enabled, true);
  assert.equal(snapshot.outputToken, paired);
  assert.deepEqual(
    snapshot.deposits.map((d) => [d.stem, d.available, d.eligible]),
    [
      [-7n, 100n, true],
      [76n, 100n, true],
      [77n, 100n, false],
      [99n, 100n, false],
    ],
  );
  const selection = selectRedemptionDeposits(snapshot.deposits, 150n);
  assert.deepEqual(selection, { stems: [-7n, 76n], amounts: [50n, 100n], amount: 150n });
  assert.equal(await quoteRedemption(client, snapshot, selection), 900n);
  assert.throws(() => selectRedemptionDeposits(snapshot.deposits, 201n), /eligible/);
});

test("current Pinto and LP redemptions need no retired lock selector", async () => {
  const { client } = mockChain({ now: 1100n });
  assert.equal((await readRedemptionSnapshot(client, request)).deposits[0].available, 100n);
  const lp = mockChain();
  const snapshot = await readRedemptionSnapshot(lp.client, { ...request, kind: "lp" });
  assert.equal(snapshot.outputToken, pinto);
  assert.equal(snapshot.deposits[0].available, 100n);
  assert.ok(!lp.calls.includes("getAutoConvertOutputLock"));
  assert.equal(await quoteRedemption(lp.client, snapshot, selectRedemptionDeposits(snapshot.deposits, 150n)), 900n);
});

test("legacy/disabled deployments stay unavailable; RPC errors never masquerade as legacy", async () => {
  const legacy = mockChain({ legacy: true });
  assert.equal((await readRedemptionSnapshot(legacy.client, request)).supported, false);
  assert.deepEqual(legacy.calls, ["facetAddress"]);
  const disabled = mockChain({ disabled: true });
  assert.equal((await readRedemptionSnapshot(disabled.client, request)).enabled, false);
  assert.ok(!disabled.calls.includes("getTokenDepositsForAccount"));
  await assert.rejects(readRedemptionSnapshot(mockChain({ rpcError: true }).client, request), /RPC unavailable/);
});

test("qualified paired-token LP exits select LP crates, verify both selectors and quote the exact output", async () => {
  const { client, calls } = mockChain();
  const snapshot = await readRedemptionSnapshot(client, { ...request, kind: "lp-paired" });
  assert.equal(snapshot.outputToken, paired);
  assert.equal(snapshot.deposits[0].available, 100n);
  assert.ok(!calls.includes("getAutoConvertOutputLock"));
  const selection = selectRedemptionDeposits(snapshot.deposits, 150n);
  assert.equal(await quoteRedemption(client, snapshot, selection), 900n);
  assert.ok(calls.includes("getRedeemDepositsToPairedTokenOut"));
  assert.ok(!calls.includes("getRedeemDepositsToPintoOut"));
  assert.equal(redemptionWriteFunction(snapshot.kind), "redeemDepositsToPairedToken");
  assert.equal(redemptionWriteFunction("lp"), "redeemDepositsToPinto");
  assert.equal(redemptionWriteFunction("pinto"), "swapPintoDeposits");
  await assert.rejects(
    quoteRedemption(mockChain({ changedQuoteToken: true }).client, snapshot, selection),
    /Quote output token changed/,
  );
  for (const missingPairedSelector of ["quote", "write"] as const) {
    const old = mockChain({ missingPairedSelector });
    assert.equal((await readRedemptionSnapshot(old.client, { ...request, kind: "lp-paired" })).supported, false);
    assert.ok(!old.calls.includes("getTokenDepositsForAccount"));
    assert.equal((await readRedemptionSnapshot(old.client, { ...request, kind: "lp" })).supported, true);
  }
});

test("selection rejects dust BDV, unavailable deposits, duplicates and oversized batches", () => {
  const deposit: RedemptionDeposit = { stem: 0n, amount: 100n, bdv: 1n, available: 0n, eligible: false };
  assert.throws(() => selectRedemptionDeposits([deposit], 1n), /eligible/);
  assert.throws(() => selectRedemptionDeposits([deposit, deposit], 1n), /Duplicate/);
  const many = Array.from({ length: 33 }, (_, i) => ({
    ...deposit,
    stem: BigInt(i),
    amount: 1n,
    available: 1n,
    eligible: true,
  }));
  assert.throws(() => selectRedemptionDeposits(many, 33n), /32 deposits/);
  assert.equal(selectRedemptionDeposits(many, 32n).stems.length, 32);
});

test("amount parsing and minimum receipt never round an oversized input or accept zero protection", () => {
  assert.equal(parseRedemptionAmount("1.123456", 6), 1123456n);
  for (const invalid of ["1.1234567", "-1", "1e3", "NaN", ""]) assert.throws(() => parseRedemptionAmount(invalid, 6));
  assert.equal(redemptionMinimum(1000n, 50), 995n);
  for (const bps of [-1, 101, 0.5, NaN]) assert.throws(() => redemptionMinimum(1000n, bps));
  assert.throws(() => redemptionMinimum(1n, 50), /too small/);
});

test("fresh validation retains reviewed deposits, output token, minimum and deadline", async () => {
  const { client } = mockChain();
  const snapshot = await readRedemptionSnapshot(client, request);
  const selected = selectRedemptionDeposits(snapshot.deposits, 90n);
  assert.deepEqual(await revalidateRedemption(client, snapshot, selected, 895n), { selected, deadline: 2200n });
  await assert.rejects(
    revalidateRedemption(mockChain({ amount: 80n }).client, snapshot, selected, 895n),
    /eligible|changed/,
  );
  await assert.rejects(
    revalidateRedemption(mockChain({ quote: 890n }).client, snapshot, selected, 895n),
    /Price moved/,
  );
  await assert.rejects(
    revalidateRedemption(mockChain({ changedToken: true }).client, snapshot, selected, 895n),
    /Output token changed/,
  );
  const expired = { ...snapshot, timestamp: -201n };
  await assert.rejects(revalidateRedemption(client, expired, selected, 895n), /Quote expired/);
});

test("guarded wallet never requests a chain switch and rechecks at the send boundary", async () => {
  let current = true;
  let selectedAccount = account;
  let chain = "0x2105";
  let sent = 0;
  let providerArgs: unknown;
  const assertCurrent = () => {
    if (!current) throw new Error("cancelled");
  };
  const provider = {
    async request({ method }: { method: string }) {
      if (method === "eth_accounts") return [selectedAccount];
      if (method === "eth_chainId") return chain;
      if (method === "eth_sendTransaction") {
        ++sent;
        return "0x1234";
      }
      throw new Error(`unexpected ${method}`);
    },
  };
  const connector: any = {
    uid: "mock",
    getClient: () => {
      throw new Error("unguarded custom client");
    },
    getProvider: async (...args: unknown[]) => {
      providerArgs = args;
      return provider;
    },
    getAccounts: async () => [account],
    getChainId: async () => 8453,
  };
  const guarded = guardedWalletConnector(connector, { account, chainId: 8453 }, assertCurrent);
  assert.equal(guarded.getClient, undefined);
  const wallet: any = await guarded.getProvider({ chainId: 8453 });
  assert.deepEqual(providerArgs, [], "no chainId is passed to WalletConnect getProvider");
  const tx = { method: "eth_sendTransaction", params: [{ from: account, chainId: "0x2105", to: diamond, data: "0x" }] };
  assert.equal(await wallet.request(tx), "0x1234");
  assert.equal(sent, 1);
  await assert.rejects(wallet.request({ method: "wallet_switchEthereumChain" }), /context changes/);
  selectedAccount = paired;
  await assert.rejects(wallet.request(tx), /context changed/);
  selectedAccount = account;
  chain = "0x1";
  await assert.rejects(wallet.request(tx), /context changed/);
  chain = "0x2105";
  current = false;
  await assert.rejects(wallet.request(tx), /cancelled/);
  await assert.rejects(guarded.getProvider({ chainId: 8453 }), /cancelled/);
  assert.equal(sent, 1);
});

test("context invalidation during provider acquisition or pre-send reads aborts before a wallet request", async () => {
  for (const phase of ["provider", "chain"]) {
    let current = true;
    let sent = false;
    const assertCurrent = () => {
      if (!current) throw new Error("form was replaced");
    };
    const provider = {
      async request({ method }: { method: string }) {
        if (method === "eth_chainId") {
          if (phase === "chain") current = false;
          return "0x2105";
        }
        if (method === "eth_accounts") return [account];
        sent = true;
        return "0x1234";
      },
    };
    const connector: any = {
      getProvider: async () => {
        if (phase === "provider") current = false;
        return provider;
      },
    };
    const guarded = guardedWalletConnector(connector, { account, chainId: 8453 }, assertCurrent);
    if (phase === "provider") await assert.rejects(guarded.getProvider(), /form was replaced/);
    else {
      const wallet: any = await guarded.getProvider();
      await assert.rejects(
        wallet.request({ method: "eth_sendTransaction", params: [{ from: account }] }),
        /form was replaced/,
      );
    }
    assert.equal(sent, false);
  }
});

test("Viem wallet_sendTransaction fallback works but rechecks account and chain before forwarding", async () => {
  for (const change of ["none", "account", "chain"] as const) {
    let firstAttempt = false;
    let sent = 0;
    const provider = {
      async request({ method }: { method: string }) {
        if (method === "eth_chainId") return firstAttempt && change === "chain" ? "0x1" : "0x2105";
        if (method === "eth_accounts") return [firstAttempt && change === "account" ? paired : account];
        if (method === "eth_sendTransaction") {
          firstAttempt = true;
          throw Object.assign(new Error("Method not found"), { code: -32601 });
        }
        if (method === "wallet_sendTransaction") {
          ++sent;
          return `0x${"ab".repeat(32)}`;
        }
        throw new Error(`unexpected ${method}`);
      },
    };
    const connector = guardedWalletConnector(
      { getProvider: async () => provider } as any,
      { account, chainId: base.id },
      () => {},
    );
    const wallet = createWalletClient({
      account,
      chain: base,
      transport: custom((await connector.getProvider()) as any, { retryCount: 0 }),
    });
    const submission = wallet.sendTransaction({ to: diamond, value: 0n, gas: 21000n, gasPrice: 1n });
    if (change === "none") assert.equal(await submission, `0x${"ab".repeat(32)}`);
    else await assert.rejects(submission, /context changed/);
    assert.equal(firstAttempt, true);
    assert.equal(sent, change === "none" ? 1 : 0);
  }
});

test("exact grown adjustments override stem age and a Sunrise threshold change invalidates review", async () => {
  const original = await readRedemptionSnapshot(mockChain().client, request);
  assert.deepEqual(original.ema, {
    meanScaled: 1_000_000_000_000_000_000n,
    activeSeasons: 24,
    configuredSeasons: 36,
    lastSeason: 200,
  });
  const reduced = await readRedemptionSnapshot(mockChain({ grownAdjustment: -1n }).client, request);
  assert.equal(reduced.deposits[1].eligible, false, "integer division matches Solidity at the exact boundary");
  const increased = await readRedemptionSnapshot(mockChain({ grownAdjustment: 100n }).client, request);
  assert.equal(increased.deposits[2].eligible, true, "positive adjustment can qualify a younger stem");
  const selected = selectRedemptionDeposits(original.deposits, 90n);
  await assert.rejects(
    revalidateRedemption(mockChain({ threshold: 25n }).client, original, selected, 895n),
    /eligible|changed/,
  );
});

test("legacy deferred initialization stays closed across gauge-skipped Seasons, then opens from the live threshold", async () => {
  for (const emaSeason of [201, 202, 205]) {
    const chain = mockChain({ threshold: 0n, meanScaled: 0n, emaSeason });
    const waiting = await readRedemptionSnapshot(chain.client, request);
    assert.equal(waiting.warmingUp, true);
    assert.equal(waiting.enabled, false);
    assert.equal(waiting.deposits.length, 0);
    assert.equal(waiting.ema?.lastSeason, emaSeason);
    assert.equal(chain.calls.includes("grownStalkForDeposit"), false);
    await assert.rejects(
      quoteRedemption(chain.client, waiting, { stems: [-7n], amounts: [1n], amount: 1n }),
      (error: Error) => error.message === REDEMPTION_WARMUP_MESSAGE,
    );
  }
  const opened = await readRedemptionSnapshot(mockChain({ threshold: 24n, emaSeason: 206 }).client, request);
  assert.equal(opened.enabled, true);
  assert.equal(Boolean(opened.warmingUp), false);
  assert.equal(
    opened.deposits.some((deposit) => deposit.eligible),
    true,
  );
  const disabled = await readRedemptionSnapshot(
    mockChain({ disabled: true, threshold: 0n, meanScaled: 0n }).client,
    request,
  );
  assert.equal(disabled.warmingUp, false, "a disabled Well is not a warming-up Well");
});

test("current release is spendable immediately and stays open across gauge-skipped Seasons", async () => {
  for (const emaSeason of [200, 201, 202, 205]) {
    const chain = mockChain({ threshold: 24n, emaSeason });
    const snapshot = await readRedemptionSnapshot(chain.client, request);
    assert.equal(snapshot.enabled, true);
    assert.equal(Boolean(snapshot.warmingUp), false);
    assert.equal(snapshot.ema?.lastSeason, emaSeason);
    const selection = selectRedemptionDeposits(snapshot.deposits, 90n);
    assert.equal(selection.amount, 90n);
    assert.equal(await quoteRedemption(chain.client, snapshot, selection), 900n);
    assert.equal(chain.calls.includes("grownStalkForDeposit"), true);
  }
});

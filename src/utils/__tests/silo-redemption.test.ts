import { test } from "vitest";
import assert from "node:assert/strict";
import { createClient, createWalletClient, custom, decodeFunctionData, encodeAbiParameters, type Address } from "viem";
import { base } from "viem/chains";
import { autoConvertABI } from "../../constants/abi/autoConvertABI";
import { guardedWalletConnector } from "../../utils/guardedWallet";
import {
  parseRedemptionAmount,
  quoteRedemption,
  readRedemptionSnapshot,
  redemptionMinimum,
  redemptionViews,
  revalidateRedemption,
  selectRedemptionDeposits,
  type RedemptionDeposit,
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
              output = [options.legacy ? "0x0000000000000000000000000000000000000000" : diamond];
              break;
            case "getSiloRedemptionPolicy":
              output = [24n, well, 200];
              break;
            case "isSiloRedemptionWell":
              output = [!options.disabled];
              break;
            case "tokens":
              output = [[pinto, options.changedToken ? diamond : paired]];
              break;
            case "stemTipForToken":
              output = [100n];
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
            case "getAutoConvertOutputLock":
              output = [40n, 1100];
              break;
            case "getSwapPintoDepositsOut":
              output = [paired, options.quote ?? 900n];
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

test("qualification checks signed stems, exact threshold, germination and partial locks at one block", async () => {
  const { client } = mockChain();
  const snapshot = await readRedemptionSnapshot(client, request);
  assert.equal(snapshot.enabled, true);
  assert.equal(snapshot.outputToken, paired);
  assert.deepEqual(
    snapshot.deposits.map((d) => [d.stem, d.available, d.eligible]),
    [
      [-7n, 60n, true],
      [76n, 60n, true],
      [77n, 60n, false],
      [99n, 60n, false],
    ],
  );
  const selection = selectRedemptionDeposits(snapshot.deposits, 90n);
  assert.deepEqual(selection, { stems: [-7n, 76n], amounts: [30n, 60n], amount: 90n });
  assert.equal(await quoteRedemption(client, snapshot, selection), 900n);
  assert.throws(() => selectRedemptionDeposits(snapshot.deposits, 121n), /eligible/);
});

test("expired locks unlock at the exact block timestamp; LP redemption does not require Pinto lock reads", async () => {
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
  // Keep locks active in the reviewed/fresh snapshots so this tests only expiry.
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

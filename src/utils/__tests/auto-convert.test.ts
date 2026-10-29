import { test } from "vitest";
import assert from "node:assert/strict";
import {
  createClient,
  custom,
  decodeFunctionData,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbi,
  type Hex,
} from "viem";
import { Clipboard } from "../../classes/Clipboard";
import { TokenValue as TV } from "../../classes/TokenValue";
import { pickCrates, pickCratesMultiple, pickCratesAsCrates, depositWithdrawalPreview } from "../../utils/convert";
import { autoConvertABI } from "../../constants/abi/autoConvertABI";
import { depositAvailability, readDepositsWithLocks } from "../../utils/depositLocks";
import { depositFingerprint, reconcileDepositSelection } from "../../utils/depositSelection";
const account = "0x0000000000000000000000000000000000000040";
const token = "0x0000000000000000000000000000000000000041";
const diamond = "0x0000000000000000000000000000000000000042";
const recipient = "0x0000000000000000000000000000000000000043";
test("RPC failure is unavailable spending, not a fabricated Auto Convert lock", () => {
  assert.deepEqual(depositAvailability(100n, undefined, 10, true), { locked: 0n, available: 0n });
  const lock = { amount: 40n, unlockAt: 20 };
  assert.deepEqual(depositAvailability(100n, lock, 10, true), { locked: 40n, available: 0n });
  assert.deepEqual(depositAvailability(100n, lock, 10, false), { locked: 40n, available: 60n });
  assert.deepEqual(depositAvailability(100n, lock, 20, false), { locked: 0n, available: 100n });
  assert.deepEqual(depositAvailability(30n, lock, 10, false), { locked: 30n, available: 0n });
});
test("crate picker spends only unlocked fraction and prorates BDV/Stalk against original owned amount", () => {
  const crate: any = {
    amount: TV.fromHuman(100, 6),
    unlockedAmount: TV.fromHuman(40, 6),
    depositBdv: TV.fromHuman(200, 6),
    seeds: TV.fromHuman(400, 6),
    stem: TV.ZERO,
    stalk: {
      initial: TV.ZERO,
      grownSinceDeposit: TV.ZERO,
      base: TV.fromHuman(1000, 6),
      grown: TV.fromHuman(100, 6),
      total: TV.fromHuman(1100, 6),
    },
    isGerminating: false,
  };
  const result = pickCrates([crate], TV.fromHuman(40, 6));
  assert.equal(result.totalBDV.toHuman(), "80");
  assert.equal(result.totalStalk.toHuman(), "440");
  assert.throws(() => pickCrates([crate], TV.fromHuman(41, 6)), /Not enough/);
  assert.equal(pickCrates([{ ...crate, unlockedAmount: TV.ZERO }, crate], TV.fromHuman(40, 6)).crates.length, 1);
  assert.equal(
    depositWithdrawalPreview(TV.fromHuman(50, 6), [crate]),
    undefined,
    "Sow must not render-crash or partially withdraw a stale amount",
  );
  assert.equal(depositWithdrawalPreview(TV.fromHuman(40, 6), [crate])?.amount.toHuman(), "40");
  assert.equal(depositWithdrawalPreview(TV.ONE, [{ ...crate, unlockedAmount: TV.ZERO }]), undefined);
  assert.equal(depositWithdrawalPreview(TV.ONE, []), undefined);
});

test("multi-strategy picking never reuses locked or previously selected amounts", () => {
  const crate: any = {
    id: 1n,
    amount: TV.fromHuman(100, 6),
    unlockedAmount: TV.fromHuman(40, 6),
    depositBdv: TV.fromHuman(200, 6),
    currentBdv: TV.fromHuman(300, 6),
    seeds: TV.fromHuman(400, 6),
    stem: TV.ZERO,
    isGerminating: false,
    stalk: {
      initial: TV.fromHuman(50, 6),
      grownSinceDeposit: TV.fromHuman(30, 6),
      germinating: TV.ZERO,
      base: TV.fromHuman(1000, 6),
      grown: TV.fromHuman(100, 6),
      total: TV.fromHuman(1100, 6),
    },
  };
  const result = pickCratesMultiple([crate], "stem", "asc", [TV.fromHuman(20, 6), TV.fromHuman(20, 6)]);
  assert.equal(result[0].totalInitialStalk.add(result[1].totalInitialStalk).toHuman(), "20");
  assert.equal(result[0].totalGrownStalkSinceDeposit.add(result[1].totalGrownStalkSinceDeposit).toHuman(), "12");
  assert.equal(result[0].totalBDV.add(result[1].totalBDV).toHuman(), "80");
  assert.equal(crate.amount.toHuman(), "100", "selection must not mutate ownership");
  assert.throws(
    () => pickCratesMultiple([crate], "stem", "asc", [TV.fromHuman(20, 6), TV.fromHuman(21, 6)]),
    /Not enough/,
  );
  const partial = pickCratesAsCrates([crate], TV.fromHuman(40, 6));
  assert.equal(partial.deposits[0].depositBdv.toHuman(), "80");
  assert.equal(partial.deposits[0].currentBdv.toHuman(), "120");
  assert.equal(partial.stalk.total.toHuman(), "440");
  assert.throws(() => pickCratesAsCrates([crate], TV.fromHuman(41, 6)), /Not enough/);
});

test("lock reads support legacy deployments and fail closed on RPC errors", async () => {
  const views = parseAbi([
    "function facetAddress(bytes4) view returns(address)",
    "function getDepositsForAccount(address,address[]) view returns((address token,uint256[] depositIds,(uint128 amount,uint128 bdv)[] tokenDeposits)[])",
  ]);
  const id = (BigInt(token) << 96n) | BigInt.asUintN(96, -7n);
  for (const mode of ["legacy", "upgraded", "rpc-error"]) {
    let reads = 0;
    const client = createClient({
      transport: custom(
        {
          request: async ({ method, params }: any) => {
            if (method === "eth_getBlockByNumber") return { number: "0x64", timestamp: "0x100", transactions: [] };
            assert.equal(method, "eth_call");
            assert.equal(params[1], "0x64");
            const data = params[0].data;
            let view;
            try {
              view = decodeFunctionData({ abi: views, data });
            } catch {
              /* lock getter */
            }
            if (view?.functionName === "facetAddress")
              return encodeAbiParameters(
                [{ type: "address" }],
                [mode === "legacy" ? "0x0000000000000000000000000000000000000000" : diamond],
              );
            if (view?.functionName === "getDepositsForAccount") {
              assert.deepEqual(view.args, [account, [token, recipient]], "include dewhitelisted tokens explicitly");
              return encodeAbiParameters(views[1].outputs, [
                [
                  { token, depositIds: [id], tokenDeposits: [{ amount: 100n, bdv: 100n }] },
                  {
                    token: recipient,
                    depositIds: [BigInt(recipient) << 96n],
                    tokenDeposits: [{ amount: 7n, bdv: 9n }],
                  },
                ],
              ]);
            }
            reads++;
            const lock = decodeFunctionData({ abi: autoConvertABI, data });
            assert.deepEqual(lock.args, [account, -7n]);
            if (mode === "rpc-error") throw { code: -32000, message: "archive unavailable" };
            return encodeAbiParameters([{ type: "uint256" }, { type: "uint40" }], [40n, 999]);
          },
        },
        { retryCount: 0 },
      ),
    });
    if (mode === "rpc-error")
      await assert.rejects(
        readDepositsWithLocks(client, diamond, account, token, [token, recipient]),
        /archive unavailable/,
      );
    else {
      const result = await readDepositsWithLocks(client, diamond, account, token, [token, recipient]);
      assert.equal(result.deposits[0].tokenDeposits[0].amount, 100n, "ownership is never reduced by a lock");
      assert.equal(result.deposits[1].tokenDeposits[0].amount, 7n, "dewhitelisted deposits remain visible");
      assert.equal(result.supported, mode === "upgraded");
      assert.equal(reads, mode === "upgraded" ? 1 : 0);
      assert.equal(result.locks[id.toString()]?.amount ?? 0n, mode === "upgraded" ? 40n : 0n);
    }
  }
});

test("auto-conversion refresh clamps only selected crates and invalidates cached quote fingerprints", () => {
  const t: any = { address: token, decimals: 6 };
  const crate: any = {
    id: 1n,
    amount: TV.fromHuman(100, 6),
    unlockedAmount: TV.fromHuman(100, 6),
    depositBdv: TV.fromHuman(100, 6),
    seeds: TV.ONE,
    stalk: { total: TV.ONE },
    isGerminating: false,
  };
  const row = { token: t, amount: "100", deposits: [crate] };
  const reduced = { ...crate, amount: TV.fromHuman(70, 6), unlockedAmount: TV.fromHuman(60, 6) };
  const current: any = new Map([[t, { deposits: [reduced, { ...crate, id: 2n }] }]]);
  const result = reconcileDepositSelection([row], current);
  assert.equal(result.changed, true);
  assert.equal(result.selection[0].amount, "60");
  assert.deepEqual(
    result.selection[0].deposits.map((d) => d.id),
    [1n],
    "do not silently add new deposits",
  );
  assert.notEqual(depositFingerprint([crate]), depositFingerprint([reduced]));
  assert.equal(reconcileDepositSelection(result.selection, current).changed, false);
  const removed = reconcileDepositSelection([row], new Map());
  assert.deepEqual(removed.selection, [], "a consumed row cannot enter the next transfer step");
  const locked: any = new Map([[t, { deposits: [{ ...crate, unlockedAmount: TV.ZERO }] }]]);
  assert.deepEqual(reconcileDepositSelection([row], locked).selection, []);
  const zeroInput = reconcileDepositSelection([{ ...row, amount: "" }], new Map([[t, { deposits: [crate] }]]) as any);
  assert.equal(zeroInput.changed, false, "keep a selectable row while the user edits its amount");
});

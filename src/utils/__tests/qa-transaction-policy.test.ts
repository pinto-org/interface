import assert from "node:assert/strict";
import { test } from "vitest";
import { encodeFunctionData, erc20Abi } from "viem";
import { siloedPintoABI } from "../../constants/abi/siloedPintoABI";
import {
  assertQaTransaction,
  qaAccount,
  qaOperator,
  qaObserver,
  qaDiamond,
  qaSiloedPinto,
} from "../../../scripts/qa/transaction-policy";

test("local QA account switching never authorizes an unselected or arbitrary sender", () => {
  for (const account of [qaAccount, qaOperator, qaObserver]) {
    const tx = { from: account, to: qaDiamond, value: "0x0", chainId: "0x539" };
    assert.doesNotThrow(() => assertQaTransaction(tx, account));
    assert.throws(() => assertQaTransaction(tx, account === qaAccount ? qaOperator : qaAccount));
    assert.throws(() => assertQaTransaction({ ...tx, chainId: "0x2105" }, account));
    assert.throws(() => assertQaTransaction({ ...tx, value: "0x1" }, account));
  }
  assert.throws(() => assertQaTransaction({ from: qaDiamond, to: qaDiamond }, qaDiamond));
});

test("local QA wrapper permission is limited to bounded self-owned Silo wrap and unwrap", () => {
  const wrap = (receiver = qaOperator, amounts = [50_000n]) => encodeFunctionData({
    abi: siloedPintoABI, functionName: "depositFromSilo", args: [[1n], amounts, receiver, 0],
  });
  const check = (data: `0x${string}`) => assertQaTransaction({ from: qaOperator, to: qaSiloedPinto, data }, qaOperator);
  assert.doesNotThrow(() => check(wrap()));
  assert.throws(() => check(wrap(qaAccount)));
  assert.throws(() => check(wrap(qaOperator, [])));
  assert.throws(() => check(wrap(qaOperator, [0n])));
  assert.throws(() => check(wrap(qaOperator, [1_000_001n])));
  const redeem = (owner = qaOperator, shares = 10n ** 16n) => encodeFunctionData({
    abi: siloedPintoABI, functionName: "redeemToSilo", args: [shares, qaOperator, owner, 0],
  });
  assert.doesNotThrow(() => check(redeem()));
  assert.throws(() => check(redeem(qaAccount)));
  assert.throws(() => check(redeem(qaOperator, 10n ** 18n + 1n)));
  assert.throws(() => check(encodeFunctionData({ abi: erc20Abi, functionName: "transfer", args: [qaOperator, 1n] })));
  assert.throws(() => assertQaTransaction({ from: qaOperator, to: qaSiloedPinto, data: wrap(), chainId: "0x2105" }, qaOperator));
});

test("local QA only approves specific tokens to the Diamond; arbitrary sends remain blocked", () => {
  const token = "0xb170000aeefa790fa61d6e837d1035906839a3c8";
  const approval = encodeFunctionData({ abi: erc20Abi, functionName: "approve", args: [qaDiamond, 1n] });
  assert.doesNotThrow(() => assertQaTransaction({ from: qaOperator, to: token, data: approval }, qaOperator));
  assert.throws(() => assertQaTransaction({ from: qaOperator, to: qaAccount, data: approval }, qaOperator));
  assert.throws(() =>
    assertQaTransaction(
      {
        from: qaOperator,
        to: token,
        data: encodeFunctionData({ abi: erc20Abi, functionName: "transfer", args: [qaAccount, 1n] }),
      },
      qaOperator,
    ),
  );
});

test("local QA USDC buys only authorize Diamond approvals on the local selected account", () => {
  const token = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
  const tx = {
    from: qaAccount, to: token, chainId: "0x539", value: "0x0",
    data: encodeFunctionData({ abi: erc20Abi, functionName: "approve", args: [qaDiamond, 30_000n] }),
  };
  assert.doesNotThrow(() => assertQaTransaction(tx));
  assert.throws(() => assertQaTransaction({ ...tx, chainId: "0x2105" }));
  assert.throws(() => assertQaTransaction({ ...tx, from: qaOperator }));
  assert.throws(() => assertQaTransaction({ ...tx, value: "0x1" }));
  assert.throws(() => assertQaTransaction({ ...tx, data: encodeFunctionData({
    abi: erc20Abi, functionName: "approve", args: [qaOperator, 30_000n],
  }) }));
  assert.throws(() => assertQaTransaction({ ...tx, data: encodeFunctionData({
    abi: erc20Abi, functionName: "transfer", args: [qaAccount, 30_000n],
  }) }));
});

test("local QA wallet redemption is bounded, self-owned, and restricted to valid balance modes", () => {
  const encode = (shares = 10n ** 18n, receiver = qaOperator, owner = qaOperator, from = 0, to = 0) =>
    encodeFunctionData({ abi: siloedPintoABI, functionName: "redeemAdvanced", args: [shares, receiver, owner, from, to] });
  const check = (data: `0x${string}`) => assertQaTransaction({ from: qaOperator, to: qaSiloedPinto, data }, qaOperator);
  for (const from of [0, 1, 2, 3]) {
    for (const to of [0, 1]) assert.doesNotThrow(() => check(encode(1n, qaOperator, qaOperator, from, to)));
  }
  assert.doesNotThrow(() => check(encode()));
  assert.throws(() => check(encode(0n)));
  assert.throws(() => check(encode(10n ** 18n + 1n)));
  assert.throws(() => check(encode(1n, qaAccount)));
  assert.throws(() => check(encode(1n, qaOperator, qaAccount)));
  assert.throws(() => check(encode(1n, qaOperator, qaOperator, 4)));
  assert.throws(() => check(encode(1n, qaOperator, qaOperator, 0, 2)));
  assert.throws(() => assertQaTransaction({ from: qaOperator, to: qaSiloedPinto, data: encode(), value: "0x1" }, qaOperator));
  assert.throws(() => assertQaTransaction({ from: qaOperator, to: qaSiloedPinto, data: encode(), chainId: "0x2105" }, qaOperator));
});

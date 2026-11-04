import assert from "node:assert/strict";
import { type Address, encodeFunctionData, multicall3Abi, toFunctionSelector } from "viem";
import { test } from "vitest";
import { createQaReadControls } from "../../../scripts/qa/read-controls";
import { qaAccount, qaDiamond } from "../../../scripts/qa/transaction-policy";
import { autoConvertABI } from "../../constants/abi/autoConvertABI";

const read = { to: qaDiamond, data: toFunctionSelector("grownStalkForDeposit(address,address,int96)") };
const estimate = {
  to: qaDiamond,
  data: toFunctionSelector("swapPintoDeposits(address,int96[],uint256[],uint256,uint256,uint8)"),
};

test("QA failure is scoped to Diamond deposit/lock reads and restores without a synthetic result", async () => {
  const control = createQaReadControls();
  await control.beforeRequest("eth_call", [read]);
  control.setDepositFailure(true);
  for (const signature of [
    "grownStalkForDeposit(address,address,int96)",
    "getDepositsForAccount(address,address[])",
    "getTokenDepositsForAccount(address,address)",
  ]) {
    await assert.rejects(
      control.beforeRequest("eth_call", [{ ...read, data: toFunctionSelector(signature) }]),
      /intentionally failed/,
    );
  }
  assert.equal(control.state.failedReads, 3);
  await control.beforeRequest("eth_call", [{ ...read, to: qaAccount }]);
  await control.beforeRequest("eth_call", [estimate]);
  await control.beforeRequest("eth_sendTransaction", [read]);
  await control.beforeRequest("eth_getBlockByNumber", ["latest", false]);
  control.setDepositFailure(false);
  assert.equal(await control.beforeRequest("eth_call", [read]), undefined);
});

test("QA holds exactly one eligible exit estimate until explicit release, never a send", async () => {
  const control = createQaReadControls();
  control.armEstimateHold();
  await control.beforeRequest("eth_sendTransaction", [estimate]);
  await control.beforeRequest("eth_estimateGas", [{ ...estimate, to: qaAccount }]);
  await control.beforeRequest("eth_estimateGas", [read]);
  assert.equal(control.state.holdNextEstimate, true);
  let completed = false;
  const held = control.beforeRequest("eth_estimateGas", [estimate]).then(() => {
    completed = true;
  });
  await Promise.resolve();
  assert.equal(completed, false);
  assert.equal(control.state.estimatePending, true);
  assert.throws(() => control.armEstimateHold(), /Release/);
  control.releaseEstimate();
  await held;
  assert.equal(completed, true);
  assert.equal(control.state.estimatePending, false);
  await control.beforeRequest("eth_estimateGas", [estimate]);
  control.releaseEstimate();
});

test("QA detects the actual batched read path without failing unrelated aggregates", async () => {
  const control = createQaReadControls();
  control.setDepositFailure(true);
  const aggregate = (target: Address = qaDiamond, callData = read.data) => ({
    to: "0xcA11bde05977b3631167028862bE2a173976CA11",
    data: encodeFunctionData({
      abi: multicall3Abi,
      functionName: "aggregate3",
      args: [[{ target, callData, allowFailure: true }]],
    }),
  });
  await assert.rejects(control.beforeRequest("eth_call", [aggregate()]), /intentionally failed/);
  await control.beforeRequest("eth_call", [aggregate(qaAccount)]);
  await control.beforeRequest("eth_call", [aggregate(qaDiamond, estimate.data)]);
  await control.beforeRequest("eth_call", [{ ...aggregate(), data: "0x1234" }]);
  await control.beforeRequest("eth_sendTransaction", [aggregate()]);
  control.setDepositFailure(false);
  await control.beforeRequest("eth_call", [aggregate()]);
});

test.each(["redeemDepositsToPinto", "redeemDepositsToPairedToken"] as const)(
  "QA %s estimate hold uses the compiled function signature",
  async (functionName) => {
    const control = createQaReadControls();
    control.armEstimateHold();
    const held = control.beforeRequest("eth_estimateGas", [
      {
        to: qaDiamond,
        data: encodeFunctionData({
          abi: autoConvertABI,
          functionName,
          args: [qaAccount, [1n], [1n], 1n, 1n, 0],
        }),
      },
    ]);
    assert.equal(control.state.estimatePending, true);
    control.releaseEstimate();
    await held;
  },
);

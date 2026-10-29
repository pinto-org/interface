import { test } from "vitest";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { TokenValue as TV } from "../../classes/TokenValue";
import { depositTransferPreview, proportionalDepositValue } from "../../utils/depositTransferPreview";
import { sortAndPickCrates } from "../../utils/convert";

// Source guards supplement the real fork/browser check with unequal amount and
// historical BDV. They are not a substitute for rendered-component tests.
test("USD deposit labels use current value while PDV keeps historical credit", () => {
  const rows = readFileSync("src/components/DepositsTable.tsx", "utf8");
  assert.match(rows, /token\.isWhitelisted \? deposit\?\.currentBdv : deposit\?\.depositBdv/);
  assert.match(rows, /formatter\.pdv\(deposit\.depositBdv\)/);
  const farmer = readFileSync("src/state/useFarmerSilo.ts", "utf8");
  assert.match(farmer, /token\.isWhitelisted \? currentBDV : depositBDV/);
});

test("partial-transfer USD preview prorates current value, not selected historical BDV", () => {
  const preview = readFileSync("src/pages/transfer/DepositsList.tsx", "utf8");
  assert.match(preview, /if \(!totalTokenDeposit \|\| totalTokenDeposit\.amount\.lte\(0\)\) return null/);
  assert.match(
    preview,
    /currentBDV: proportionalDepositValue\(\s*totalTokenDeposit\.currentBDV,\s*transferAmount,\s*totalTokenDeposit\.amount,?\s*\)/,
  );
  assert.match(
    preview,
    /tokenDeposit\.token\.isWhitelisted\s*\? tokenDeposit\.deposit\.currentBDV\s*: tokenDeposit\.deposit\.depositBDV/,
  );
  assert.match(preview, /depositBDV: picked\.bdv/);
});

test("small LP transfers preserve full product precision before division", () => {
  const value = TV.fromHuman(100, 6);
  const total = TV.fromHuman("0.000001234", 18);
  const half = TV.fromHuman("0.000000617", 18);
  assert.equal(value.mul(half).div(total).reDecimal(6).toHuman(), "49.432739"); // regression reproduction
  assert.equal(proportionalDepositValue(value, half, total).toHuman(), "50");
  assert.equal(proportionalDepositValue(value, half.reDecimal(12), total).toHuman(), "50");
  assert.equal(proportionalDepositValue(value, total, total).toHuman(), "100");
  assert.equal(proportionalDepositValue(value, half, TV.ZERO).toHuman(), "0");
});

test("transfer preview matches calldata selection, excluding locked and unused deposit IDs", () => {
  const crate = (stem: number, available: number, credit: number): any => ({
    idHex: `0x${stem}`,
    stem: TV.fromHuman(stem, 0),
    amount: TV.fromHuman(100, 6),
    unlockedAmount: TV.fromHuman(available, 6),
    depositBdv: TV.fromHuman(credit, 6),
    seeds: TV.fromHuman(credit * 2, 6),
    isGerminating: false,
    stalk: {
      initial: TV.fromHuman(credit, 6),
      base: TV.fromHuman(credit, 6),
      grown: TV.ZERO,
      grownSinceDeposit: TV.ZERO,
      total: TV.fromHuman(credit, 6),
    },
  });
  const deposits = [crate(1, 100, 100), crate(3, 0, 500), crate(2, 40, 200)];
  const partial = depositTransferPreview(TV.fromHuman(20, 6), deposits)!;
  assert.deepEqual(partial.depositIds, ["0x2"]);
  assert.equal(partial.stalk.toHuman(), "40");
  assert.equal(partial.seeds.toHuman(), "80");
  assert.deepEqual(partial.crates, sortAndPickCrates("transfer", TV.fromHuman(20, 6), deposits).crates);
  const max = depositTransferPreview(TV.fromHuman(140, 6), deposits)!;
  assert.deepEqual(max.depositIds, ["0x2", "0x1"]);
  assert.equal(max.stalk.toHuman(), "180");
  assert.deepEqual(depositTransferPreview(TV.ZERO, deposits)!.depositIds, []);
  assert.equal(depositTransferPreview(TV.fromHuman(141, 6), deposits), undefined);
  assert.equal(depositTransferPreview(TV.ONE, []), undefined);
  const secondStep = readFileSync("src/pages/transfer/actions/deposits/StepTwo.tsx", "utf8");
  assert.match(secondStep, /<DepositsList transferData=\{transferData\}/);
  const finalStep = readFileSync("src/pages/transfer/actions/deposits/FinalStep.tsx", "utf8");
  assert.match(finalStep, /depositTransferPreview\(amount, data\.deposits\)\?\.depositIds/);
});

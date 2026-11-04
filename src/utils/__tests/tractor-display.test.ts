import { expect, it } from "vitest";
import { maxUint256 } from "viem";
import { TokenValue } from "@/classes/TokenValue";
import {
  convertUpOrderProgress,
  formatConvertSeedDifference,
  sowOrderProgress,
  tractorExecutionGasUSD,
} from "../tractorDisplay";

it.each([
  [0n, "Disabled"],
  [1n, "At least 0.000001 Seeds gained per PDV"],
  [-1n, "At most 0.000001 Seeds lost per PDV"],
  [1_000_000n, "At least 1 Seeds gained per PDV"],
])("shows the exact signed seed constraint %s", (raw, expected) => {
  expect(formatConvertSeedDifference(TokenValue.fromBigInt(raw, 6))).toBe(expected);
});

it("values execution gas using the human ETH price exactly once", () => {
  expect(tractorExecutionGasUSD(10_000_000n, 6_000_000n, TokenValue.fromHuman(2_500, 6))).toBe(0.15);
});
it("interprets completed Sow orders without allocating their deposits again", () => {
  expect(sowOrderProgress(10n, 0n)).toEqual({ complete: false, remaining: 10n });
  expect(sowOrderProgress(10n, 4n)).toEqual({ complete: false, remaining: 4n });
  expect(sowOrderProgress(10n, maxUint256)).toEqual({ complete: true, remaining: 0n });
});
it("interprets the Convert Up completed sentinel as zero remaining, not unlimited inventory", () => {
  expect(convertUpOrderProgress(10n, 0n, 0n)).toEqual({ complete: false, remaining: 10n });
  expect(convertUpOrderProgress(10n, 12n, 4n)).toEqual({ complete: false, remaining: 4n });
  expect(convertUpOrderProgress(10n, 12n, maxUint256)).toEqual({ complete: true, remaining: 0n });
});

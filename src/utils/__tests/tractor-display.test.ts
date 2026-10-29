import { expect, it } from "vitest";
import { maxUint256 } from "viem";
import { TokenValue } from "@/classes/TokenValue";
import { convertUpOrderProgress, sowOrderProgress, tractorExecutionGasUSD } from "../tractorDisplay";

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

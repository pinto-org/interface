import { MAIN_TOKEN, NATIVE_TOKEN, WETH_TOKEN } from "@/constants/tokens";
import { tokensEqual } from "@/utils/token";
import { base } from "viem/chains";
import { expect, test } from "vitest";

test("tokensEqual", () => {
  const main = MAIN_TOKEN[base.id];

  const eth = NATIVE_TOKEN[base.id];
  const weth = WETH_TOKEN[base.id];

  expect(tokensEqual(main, main)).toBe(true);
  expect(tokensEqual(main, { address: main.address, symbol: main.symbol })).toBe(true);

  expect(tokensEqual(main, eth)).toBe(false);
  expect(tokensEqual(eth, weth)).toBe(false);
  expect(tokensEqual(main, undefined)).toBe(false);
});

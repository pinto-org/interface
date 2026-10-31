import {
  getConvertQuoteFailureNotice,
  quoteAlternativeRoutes,
  reconcileRouteIndex,
} from "@/lib/siloConvert/quoteAlternativeRoutes";
import { describe, expect, it } from "vitest";

describe("complete alternative conversion routes", () => {
  it("selects a surviving route after the previously selected alternative disappears", () => {
    expect(reconcileRouteIndex(1, [0])).toBe(0);
    expect(reconcileRouteIndex(1, [0, 1])).toBe(1);
    expect(reconcileRouteIndex(undefined, [1, 0])).toBe(1);
    expect(reconcileRouteIndex(0, [])).toBeUndefined();
  });
  it.each(["quote", "simulate", "decode"])(
    "retains a direct route when an optional route fails to %s",
    async (stage) => {
      const result = await quoteAlternativeRoutes(["direct", "aggregator"], async (route) => {
        if (route === "aggregator") throw new Error(stage);
        return { route, calls: ["withdraw", "convert", "deposit"] };
      });
      expect(result).toEqual([{ route: "direct", calls: ["withdraw", "convert", "deposit"] }]);
    },
  );
  it("does not return partial results from a failed multi-strategy route", async () => {
    await expect(
      quoteAlternativeRoutes([1], async () => {
        await Promise.resolve("first strategy succeeds");
        throw new Error("second strategy failed");
      }),
    ).rejects.toThrow("second strategy failed");
  });
  it("fails closed if there is no executable route", async () => {
    await expect(quoteAlternativeRoutes([], async () => 1)).rejects.toThrow("No executable");
  });
  it("discards a successful result when the request is cancelled", async () => {
    const controller = new AbortController();
    await expect(
      quoteAlternativeRoutes(
        [1],
        async () => {
          controller.abort();
          return 1;
        },
        controller.signal,
      ),
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});

describe("convert quote failure notice", () => {
  const base = { quoteEnabled: true, isFetching: false, isError: false, hasZeroOutput: false, isDefaultConvert: false };
  it("explains a failed LP to LP quote instead of leaving the button silently disabled", () => {
    expect(getConvertQuoteFailureNotice({ ...base, isError: true })).toBe(
      "Unable to quote this Convert. Try increasing slippage.",
    );
    expect(getConvertQuoteFailureNotice({ ...base, isError: true, isDefaultConvert: true })).toContain(
      "lowering the amount",
    );
  });
  it("treats a quote with no output as a failure", () => {
    expect(getConvertQuoteFailureNotice({ ...base, hasZeroOutput: true })).toMatch(/^Unable to quote/);
  });
  it("stays hidden while quoting, when quoting is disabled, or when the quote succeeded", () => {
    expect(getConvertQuoteFailureNotice({ ...base, isError: true, isFetching: true })).toBeUndefined();
    expect(getConvertQuoteFailureNotice({ ...base, isError: true, quoteEnabled: false })).toBeUndefined();
    expect(getConvertQuoteFailureNotice(base)).toBeUndefined();
  });
});

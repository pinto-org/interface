import { expect, test, vi } from "vitest";
import { createGaugeHistoryMiddleware, readForkGaugeHistory } from "./gauge-history.mjs";

function fixture() {
  const block = (number) => ({ number, hash: `hash-${number}`, timestamp: number * 100n });
  return {
    request: vi.fn(async ({ method }) => { expect(method).toBe("web3_clientVersion"); return "anvil/test"; }),
    getChainId: vi.fn(async () => 1337),
    getBlock: vi.fn(async (options) => block(options?.blockNumber ?? 14n)),
    getLogs: vi.fn(async () => [{ blockNumber: 12n, blockHash: "hash-12" }]),
    readContract: vi.fn(async ({ functionName, blockNumber }) => {
      if (functionName === "season") return blockNumber < 12n ? 100 : 101;
      expect(functionName).toBe("getConvertStalkPerBdvBonusAndMaximumCapacity");
      return [blockNumber === 14n ? 0n : 1_000_000_000n, 50_000_000n];
    }),
  };
}
test("uses real block timestamps and values, preserving zero; no fabricated Seasons", async () => {
  const client = fixture();
  const history = await readForkGaugeHistory(client, 10);
  expect(history.source).toBe("local-fork-observations");
  expect(history.rows.map((r) => [r.season, r.createdAt, r.g2BonusStalkPerBdv, r.g2MaxConvertCapacity]))
    .toEqual([[100, "1000", "1000000000", "50000000"], [101, "1400", "0", "50000000"]]);
  expect(client.getLogs.mock.calls[0][0]).toMatchObject({ fromBlock: 11n, toBlock: 14n });
  expect(client.readContract.mock.calls.every(([args]) => typeof args.blockNumber === "bigint")).toBe(true);
});
test("at the initial block returns one observation without querying nonexistent future logs", async () => {
  const client = fixture();
  const history = await readForkGaugeHistory(client, 14);
  expect(history.rows).toHaveLength(1);
  expect(client.getLogs).not.toHaveBeenCalled();
});
test.each(["live-node", "wrong-chain", "before-start", "wide-window", "too-many", "log-reorg", "tip-reorg", "missing-read"])(
  "rejects %s instead of returning misleading or partial history", async (failure) => {
    const client = fixture();
    if (failure === "live-node") client.request.mockResolvedValue("geth");
    if (failure === "wrong-chain") client.getChainId.mockResolvedValue(8453);
    if (failure === "before-start") client.getBlock.mockResolvedValue({ number: 9n });
    if (failure === "wide-window") client.getBlock.mockResolvedValue({ number: 100_011n });
    if (failure === "too-many") client.getLogs.mockResolvedValue(new Array(401));
    if (failure === "log-reorg") client.getLogs.mockResolvedValue([{ blockNumber: 12n, blockHash: "changed" }]);
    if (failure === "tip-reorg") client.getBlock.mockImplementationOnce(async () => ({ number: 14n, hash: "changed" }));
    if (failure === "missing-read") client.readContract.mockRejectedValue(new Error("missing archive state"));
    await expect(readForkGaugeHistory(client, 10)).rejects.toThrow();
  },
);
test("middleware only owns its path and rejects writes without contacting RPC", () => {
  const middleware = createGaugeHistoryMiddleware({ rpc: "http://127.0.0.1:1", startBlock: 10 });
  const next = vi.fn(), res = { setHeader: vi.fn(), end: vi.fn() };
  middleware({ url: "/other", method: "GET" }, res, next);
  expect(next).toHaveBeenCalledOnce();
  middleware({ url: "/__qa/gauge-history", method: "POST" }, res, next);
  expect(res.statusCode).toBe(405);
  expect(res.end.mock.calls[0][0]).toContain("Read-only");
});

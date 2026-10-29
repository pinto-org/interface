import { describe, expect, it, vi } from "vitest";
import { keccak256 } from "viem";
import { readHistoricalHarvestable } from "./historical-market-read.mjs";

const code = "0x60016000";
const facet = `0x${"12".repeat(20)}`;
const missing = new Error(`missing bytecode for code hash ${keccak256(code)}`);
const fixture = () => ({
  request: vi.fn().mockResolvedValue("anvil/v1.7.1"), getChainId: vi.fn().mockResolvedValue(1337),
  readContract: vi.fn().mockRejectedValueOnce(missing).mockResolvedValueOnce(facet).mockResolvedValueOnce(42n),
  getCode: vi.fn().mockResolvedValue(code),
});

describe("QA historical market read", () => {
  it("normally uses an unmodified pinned read", async () => {
    const client = fixture(); client.readContract = vi.fn().mockResolvedValue(42n);
    expect(await readHistoricalHarvestable(client, 17n)).toBe(42n);
    expect(client.readContract.mock.calls[0][0]).toMatchObject({blockNumber: 17n, functionName: "harvestableIndex", args: [0n]});
    expect(client.getCode).not.toHaveBeenCalled();
  });
  it("only restores the exact missing code at the pinned selector's facet, preserving historical storage", async () => {
    const client = fixture();
    expect(await readHistoricalHarvestable(client, 17n)).toBe(42n);
    expect(client.readContract.mock.calls[1][0]).toMatchObject({blockNumber: 17n, functionName: "facetAddress"});
    expect(client.readContract.mock.calls[2][0]).toEqual({...client.readContract.mock.calls[0][0], stateOverride: [{address: facet, code}]});
    expect(client.request).toHaveBeenCalledExactlyOnceWith({method: "web3_clientVersion"});
  });
  it("fails rather than substitute different code, latest state, or a fabricated number", async () => {
    const client = fixture(); client.getCode.mockResolvedValue("0x6002");
    await expect(readHistoricalHarvestable(client, 17n)).rejects.toThrow("hash mismatch");
    expect(client.readContract).toHaveBeenCalledTimes(2);
    const rpcFailure = fixture(); rpcFailure.readContract = vi.fn().mockRejectedValue(new Error("RPC unavailable"));
    await expect(readHistoricalHarvestable(rpcFailure, 17n)).rejects.toThrow("RPC unavailable");
    expect(rpcFailure.getCode).not.toHaveBeenCalled();
  });
  it("does not apply the override to a live chain or swallow a failed retry", async () => {
    const live = fixture(); live.getChainId.mockResolvedValue(8453);
    await expect(readHistoricalHarvestable(live, 17n)).rejects.toThrow();
    expect(live.getCode).not.toHaveBeenCalled();
    const retry = fixture(); retry.readContract = vi.fn().mockRejectedValueOnce(missing).mockResolvedValueOnce(facet).mockRejectedValueOnce(new Error("still unavailable"));
    await expect(readHistoricalHarvestable(retry, 17n)).rejects.toThrow("still unavailable");
  });
});

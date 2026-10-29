import { describe, expect, it, vi } from "vitest";
import { type PublicClient, zeroAddress } from "viem";
import { assertTractorDeploymentReady, configuredTractorAddress } from "../tractorDeployment";

const diamond = "0x0000000000000000000000000000000000000001";
const blueprint = "0x0000000000000000000000000000000000000002";
const silo = "0x0000000000000000000000000000000000000003";
const tractor = "0x0000000000000000000000000000000000000004";
const deployment = { explicit: true, blueprint, silo, tractor } as const;

function fixture({ upgraded = true, wrongTarget = false, missingCode = false, rpcError = false } = {}) {
  return {
    getBlockNumber: vi.fn(async () => 123n),
    getCode: vi.fn(async ({ blockNumber }) => {
      expect(blockNumber).toBe(123n);
      return missingCode ? "0x" : "0x1234";
    }),
    readContract: vi.fn(async ({ address, functionName, blockNumber }) => {
      expect(blockNumber).toBe(123n);
      if (rpcError) throw new Error("RPC unavailable");
      if (functionName === "facetAddress") return upgraded ? diamond : zeroAddress;
      expect(address).toBe(blueprint); // No fabricated getters on private helper immutables.
      if (functionName === "beanstalk") return wrongTarget ? zeroAddress : diamond;
      if (functionName === "siloHelpers") return silo;
      if (functionName === "tractorHelpers") return tractor;
      throw new Error("unexpected read");
    }),
  } as unknown as PublicClient;
}

describe("new Tractor release configuration", () => {
  it("retains legacy support before the Diamond upgrade", async () => {
    await expect(
      assertTractorDeploymentReady(fixture({ upgraded: false }), diamond, { ...deployment, explicit: false }),
    ).resolves.toBeUndefined();
  });
  it("refuses unconfigured helpers on an upgraded Diamond", async () => {
    await expect(assertTractorDeploymentReady(fixture(), diamond, { ...deployment, explicit: false })).rejects.toThrow(
      "not configured",
    );
  });
  it("checks blueprint bindings and helper code at one block", async () => {
    await expect(assertTractorDeploymentReady(fixture(), diamond, deployment)).resolves.toBeUndefined();
  });
  it.each([{ wrongTarget: true }, { missingCode: true }, { rpcError: true }])(
    "fails closed on a bad release or unavailable RPC: %j",
    async (options) => {
      await expect(assertTractorDeploymentReady(fixture(options), diamond, deployment)).rejects.toThrow();
    },
  );
  it("rejects malformed or zero explicit addresses", () => {
    expect(configuredTractorAddress(undefined, tractor)).toBe(tractor);
    expect(() => configuredTractorAddress("bad", tractor)).toThrow();
    expect(() => configuredTractorAddress(zeroAddress, tractor)).toThrow();
  });
});

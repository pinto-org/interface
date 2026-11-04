import { type PublicClient, toFunctionSelector, zeroAddress } from "viem";
import { describe, expect, it, vi } from "vitest";
import { assertTractorDeploymentReady, configuredTractorAddress } from "../tractorDeployment";

const diamond = "0x0000000000000000000000000000000000000001";
const blueprint = "0x0000000000000000000000000000000000000002";
const silo = "0x0000000000000000000000000000000000000003";
const tractor = "0x0000000000000000000000000000000000000004";
const deployment = { explicit: true, blueprint, silo, tractor } as const;

function fixture({
  upgraded = true,
  wrongTarget = false,
  missingCode = false,
  rpcError = false,
  version = "1.1",
} = {}) {
  return {
    getBlockNumber: vi.fn(async () => 123n),
    getCode: vi.fn(async ({ blockNumber }) => {
      expect(blockNumber).toBe(123n);
      return missingCode ? "0x" : "0x1234";
    }),
    readContract: vi.fn(async ({ address, functionName, blockNumber, args }) => {
      expect(blockNumber).toBe(123n);
      if (rpcError) throw new Error("RPC unavailable");
      if (functionName === "facetAddress") {
        expect(args).toEqual([toFunctionSelector("getSiloRedemptionPolicy()")]);
        return upgraded ? diamond : zeroAddress;
      }
      expect(address).toBe(blueprint); // No fabricated getters on private helper immutables.
      if (functionName === "beanstalk") return wrongTarget ? zeroAddress : diamond;
      if (functionName === "siloHelpers") return silo;
      if (functionName === "tractorHelpers") return tractor;
      if (functionName === "version") return version;
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
  it.each([true, false])(
    "requires explicit Convert Up configuration regardless of Diamond upgrade (%s)",
    async (upgraded) => {
      await expect(
        assertTractorDeploymentReady(fixture({ upgraded }), diamond, {
          ...deployment,
          explicit: false,
          requiredVersion: "1.1",
        }),
      ).rejects.toThrow("not configured");
    },
  );
  it.each([true, false])(
    "rejects the legacy Convert Up version regardless of Diamond upgrade (%s)",
    async (upgraded) => {
      await expect(
        assertTractorDeploymentReady(fixture({ upgraded, version: "1.0" }), diamond, {
          ...deployment,
          requiredVersion: "1.1",
        }),
      ).rejects.toThrow("version 1.1");
    },
  );
  it("accepts the configured corrected blueprint without a retired Diamond selector", async () => {
    const client = fixture({ upgraded: false });
    await expect(
      assertTractorDeploymentReady(client, diamond, { ...deployment, requiredVersion: "1.1" }),
    ).resolves.toBeUndefined();
    expect(client.readContract).not.toHaveBeenCalledWith(expect.objectContaining({ functionName: "facetAddress" }));
    expect(client.readContract).toHaveBeenCalledWith(
      expect.objectContaining({ address: blueprint, functionName: "version", blockNumber: 123n }),
    );
  });
});

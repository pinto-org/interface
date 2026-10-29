import { afterEach, describe, expect, it, vi } from "vitest";
import { keccak256, zeroAddress, type Address, type Hex } from "viem";
import { assertStable2Runtime, configuredStable2Deployment } from "../stable2Deployment";

const address: Address = "0x0000000000000000000000000000000000000011";
const reserved: Address = "0x0000000000000000000000000000000000000022";
const code: Hex = "0x60016000";
const hash = keccak256(code);
const configure = (a?: string, h?: string) => configuredStable2Deployment(a, h, [reserved]);

afterEach(() => vi.unstubAllEnvs());

describe("explicit PintoStable2 release identity", () => {
  it("keeps the existing release when both values are absent or empty", () => {
    expect(configure()).toBeUndefined();
    expect(configure("", "")).toBeUndefined();
  });
  it.each([
    [address, undefined],
    [undefined, hash],
    [address, ""],
    ["", hash],
    [zeroAddress, hash],
    [reserved, hash],
    ["bad", hash],
    [` ${address}`, hash],
    [address, "0x1234"],
    [address, `0x${"0".repeat(64)}`],
    [address, `0x${"g".repeat(64)}`],
  ])("rejects incomplete or invalid configuration: %s / %s", (a, h) => {
    expect(() => configure(a, h)).toThrow();
  });
  it("normalizes a valid public manifest identity and verifies its exact runtime", () => {
    const deployment = configure(address, `0x${hash.slice(2).toUpperCase()}`)!;
    expect(deployment).toEqual({ address, runtimeHash: hash });
    expect(() => assertStable2Runtime(code, deployment)).not.toThrow();
  });
  it.each([undefined, "0x", "0x60026000"] as const)("rejects missing or different deployed code: %s", (runtime) => {
    expect(() => assertStable2Runtime(runtime, configure(address, hash)!)).toThrow("runtime does not match");
  });
  it("wires public build variables without replacing legacy or CP2 identities", async () => {
    vi.stubEnv("VITE_PINTO_STABLE2_ADDRESS", address);
    vi.stubEnv("VITE_PINTO_STABLE2_RUNTIME_HASH", hash);
    vi.resetModules();
    const { PINTO_STABLE2_DEPLOYMENT, WELL_FUNCTION_ADDRESSES } = await import("@/constants/address");
    expect(PINTO_STABLE2_DEPLOYMENT).toEqual({ address, runtimeHash: hash });
    expect(WELL_FUNCTION_ADDRESSES[8453]).toEqual({
      stable2: "0xBA51055a97b40d7f41f3F64b57469b5D45B67c87",
      cp2: "0xBA510C289fD067EBbA41335afa11F0591940d6fe",
    });
  });
});

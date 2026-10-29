import { beforeEach, describe, expect, it, vi } from "vitest";
import { type Address, type Hex, keccak256 } from "viem";
import { type Config } from "wagmi";
import type { Stable2Deployment } from "../stable2Deployment";

const mocks = vi.hoisted(() => ({
  multicall: vi.fn(),
  getBytecode: vi.fn(),
  getBlockNumber: vi.fn(),
  deployment: undefined as Stable2Deployment | undefined,
}));
const legacy = "0xBA51055a97b40d7f41f3F64b57469b5D45B67c87";
const cp2 = "0xBA510C289fD067EBbA41335afa11F0591940d6fe";
const replacement: Address = "0x0000000000000000000000000000000000000011";
const unknown: Address = "0x0000000000000000000000000000000000000012";
const well: Address = "0x0000000000000000000000000000000000000033";
const code: Hex = "0x60016000";
vi.mock("@wagmi/core", () => ({
  multicall: mocks.multicall,
  getBytecode: mocks.getBytecode,
  getBlockNumber: mocks.getBlockNumber,
}));
vi.mock("@/constants/address", () => ({
  get PINTO_STABLE2_DEPLOYMENT() {
    return mocks.deployment;
  },
  WELL_FUNCTION_ADDRESSES: {
    8453: {
      stable2: "0xBA51055a97b40d7f41f3F64b57469b5D45B67c87",
      cp2: "0xBA510C289fD067EBbA41335afa11F0591940d6fe",
    },
  },
}));
vi.mock("@/utils/chain", () => ({ resolveChainId: (id: number) => ([1337, 41337].includes(id) ? 8453 : id) }));
vi.mock("@/utils/token", () => ({ getTokenIndex: (address: string) => address.toLowerCase() }));
import { ExchangeWell } from "@/lib/well/ExchangeWell";

const config = (chainId = 8453) => ({ state: { chainId } }) as Config;
const wellResult = (target: Address) => [{ status: "success", result: [[], { target, data: "0x" }, [], "0x", well] }];
const configure = () => {
  mocks.deployment = { address: replacement, runtimeHash: keccak256(code) };
};

beforeEach(() => {
  vi.resetAllMocks();
  mocks.deployment = undefined;
  mocks.getBlockNumber.mockResolvedValue(123n);
  mocks.getBytecode.mockResolvedValue(code);
  mocks.multicall.mockResolvedValue(wellResult(legacy));
});

describe("Well loader with explicit replacement Stable2", () => {
  it.each([
    [legacy, "stable2"],
    [cp2, "cp2"],
  ] as const)("preserves the unconfigured %s route", async (target, type) => {
    mocks.multicall.mockResolvedValue(wellResult(target));
    expect((await ExchangeWell.loadWells([well], config()))[well].wellFunctionType).toBe(type);
    expect(mocks.getBytecode).not.toHaveBeenCalled();
    expect(mocks.getBlockNumber).not.toHaveBeenCalled();
  });
  it.each([8453, 1337, 41337])("verifies code and metadata at the same block on chain %s", async (chainId) => {
    configure();
    mocks.multicall.mockResolvedValue(wellResult(replacement));
    const cfg = config(chainId);
    expect((await ExchangeWell.loadWells([well], cfg))[well].wellFunctionType).toBe("stable2");
    expect(mocks.getBlockNumber).toHaveBeenCalledWith(cfg, { chainId, cacheTime: 0 });
    expect(mocks.getBytecode).toHaveBeenCalledWith(cfg, { address: replacement, chainId, blockNumber: 123n });
    expect(mocks.multicall).toHaveBeenCalledWith(cfg, expect.objectContaining({ chainId, blockNumber: 123n }));
  });
  it.each([undefined, "0x", "0x60026000"])("fails closed when replacement runtime is %s", async (runtime) => {
    configure();
    mocks.getBytecode.mockResolvedValue(runtime);
    mocks.multicall.mockResolvedValue(wellResult(replacement));
    await expect(ExchangeWell.loadWells([well], config())).rejects.toThrow("runtime does not match");
  });
  it("does not hide an unavailable runtime read", async () => {
    configure();
    mocks.getBytecode.mockRejectedValue(new Error("RPC unavailable"));
    await expect(ExchangeWell.loadWells([well], config())).rejects.toThrow("RPC unavailable");
  });
  it("rejects replacement code until the release is explicitly configured", async () => {
    mocks.multicall.mockResolvedValue(wellResult(replacement));
    await expect(ExchangeWell.loadWells([well], config())).rejects.toThrow("Unknown well function");
  });
  it("does not accept unrelated addresses even if the configured release is valid", async () => {
    configure();
    mocks.multicall.mockResolvedValue(wellResult(unknown));
    await expect(ExchangeWell.loadWells([well], config())).rejects.toThrow("Unknown well function");
  });
  it("does not apply a Base release to an unsupported chain", async () => {
    configure();
    mocks.multicall.mockResolvedValue(wellResult(replacement));
    await expect(ExchangeWell.loadWells([well], config(1))).rejects.toThrow("Unknown well function");
    expect(mocks.getBytecode).not.toHaveBeenCalled();
  });
  it("retains the captured chain if the wallet changes while awaiting the block", async () => {
    configure();
    const cfg = config(1337);
    mocks.getBlockNumber.mockImplementation(async () => {
      cfg.state.chainId = 1;
      return 123n;
    });
    mocks.multicall.mockResolvedValue(wellResult(replacement));
    expect((await ExchangeWell.loadWells([well], cfg))[well].wellFunctionType).toBe("stable2");
    expect(mocks.getBytecode).toHaveBeenCalledWith(cfg, expect.objectContaining({ chainId: 1337, blockNumber: 123n }));
    expect(mocks.multicall).toHaveBeenCalledWith(cfg, expect.objectContaining({ chainId: 1337, blockNumber: 123n }));
  });
  it("does not read anything for an empty Well list", async () => {
    configure();
    expect(await ExchangeWell.loadWells([], config())).toEqual({});
    expect(mocks.multicall).not.toHaveBeenCalled();
    expect(mocks.getBytecode).not.toHaveBeenCalled();
    expect(mocks.getBlockNumber).not.toHaveBeenCalled();
  });
});

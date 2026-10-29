import { expect, it, vi } from "vitest";
import { encodeFunctionData, maxUint256, zeroAddress } from "viem";
import { diamondABI } from "@/constants/abi/diamondABI";
import { loadConvertUpOrderbookData } from "@/lib/Tractor/convertUp/tractor-convert-up";
import * as requisitions from "@/lib/Tractor/requisitions/tractor-requisition";
import * as actions from "viem/actions";

vi.mock("viem/actions", async (importOriginal) => ({
  ...(await importOriginal<typeof import("viem/actions")>()),
  multicall: vi.fn(),
}));

it("one unreadable signed target cannot discard healthy historical Convert Up orders", async () => {
  const targets = [
    "0x0000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000002",
    "0x0000000000000000000000000000000000000003",
  ] as const;
  const orders = targets.map((target, index) => {
    const pipe = encodeFunctionData({
      abi: diamondABI,
      functionName: "advancedPipe",
      args: [[{ target, callData: "0xdeadbeef", clipboard: "0x0000" }], 0n],
    });
    const data = encodeFunctionData({
      abi: diamondABI,
      functionName: "advancedFarm",
      args: [[{ callData: pipe, clipboard: "0x" }]],
    });
    return {
      requisition: {
        blueprintHash: `0x${String(index + 1).padStart(64, "0")}`,
        blueprint: { data, publisher: zeroAddress },
      },
    };
  });
  const published = vi
    .spyOn(requisitions, "loadPublishedRequisitions")
    .mockResolvedValue({ convertUpBlueprint: orders } as any);
  const mc = vi.mocked(actions.multicall).mockResolvedValue([
    { status: "failure", error: new Error("EOA has no orderInfo") },
    { status: "success", result: [12n, 4_000_000n] },
    { status: "success", result: [12n, maxUint256] },
  ] as any);
  const client = {
    chain: { id: 8453 },
    getChainId: async () => 8453,
    readContract: vi.fn(async ({ functionName }) =>
      functionName === "price" ? { price: 900_000n } : [100n, 100_000_000n],
    ),
  };
  try {
    const result = await loadConvertUpOrderbookData(undefined, zeroAddress, client as any, {
      number: 50_000_000n,
      timestamp: 1000n,
    });
    expect(mc.mock.calls[0][1].contracts.map((call: any) => call.address)).toEqual(targets);
    expect(result.map((entry) => entry.requisition.blueprintHash)).toEqual([orders[1].requisition.blueprintHash]);
    expect(result[0].orderInfo.bdvLeftToConvert.toHuman()).toBe("4");
  } finally {
    published.mockRestore();
    mc.mockRestore();
  }
});

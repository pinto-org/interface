import type { RedemptionSnapshot } from "@/utils/siloRedemption";
import { readRedemptionSnapshot } from "@/utils/siloRedemption";
import type { Client } from "viem";
import { getBlock, readContract } from "viem/actions";
import { beforeEach, expect, test, vi } from "vitest";
import { readRoutePoolState, readRoutePools } from "./route";

vi.mock("viem/actions", () => ({ getBlock: vi.fn(), readContract: vi.fn() }));
vi.mock("@/utils/siloRedemption", async (original) => ({
  ...(await original<typeof import("@/utils/siloRedemption")>()),
  readRedemptionSnapshot: vi.fn(),
}));
const address = (n: number) => `0x${n.toString(16).padStart(40, "0")}` as `0x${string}`;
const request = {
  account: address(1),
  diamond: address(2),
  pinto: address(3),
  wells: [address(4)],
  kind: "lp" as const,
};
const client = {} as Client;
const snapshot: RedemptionSnapshot = {
  ...request,
  well: address(4),
  blockNumber: 100n,
  timestamp: 200n,
  supported: true,
  enabled: false,
  warmingUp: true,
  threshold: 0n,
  outputToken: address(3),
  deposits: [],
};
beforeEach(() => {
  vi.mocked(getBlock).mockResolvedValue({ number: 100n } as never);
  vi.mocked(readRedemptionSnapshot).mockReset().mockResolvedValue(snapshot);
  vi.mocked(readContract)
    .mockReset()
    .mockResolvedValue([100n, 200n] as never);
});
test("warm-up carries no spendable pool and never reads liquidity", async () => {
  expect(await readRoutePoolState(client, request)).toEqual({ pools: [], warmingUp: true });
  expect(await readRoutePools(client, request)).toEqual([]);
  expect(readContract).not.toHaveBeenCalled();
  expect(readRedemptionSnapshot).toHaveBeenCalledWith(client, expect.objectContaining({ well: address(4) }), 100n);
});
test("a later threshold exposes only ready pools and their actual liquidity", async () => {
  const ready = { ...snapshot, enabled: true, warmingUp: false, threshold: 72000n };
  vi.mocked(readRedemptionSnapshot).mockResolvedValue(ready);
  expect(await readRoutePoolState(client, request)).toEqual({
    pools: [{ snapshot: ready, weight: 100n }],
    warmingUp: false,
  });
  expect(readContract).toHaveBeenCalledWith(
    client,
    expect.objectContaining({ address: address(4), blockNumber: 100n }),
  );
});
test("unsupported and disabled pools are distinct from warm-up; read failures still reject", async () => {
  vi.mocked(readRedemptionSnapshot).mockResolvedValue({ ...snapshot, warmingUp: false });
  expect(await readRoutePoolState(client, request)).toEqual({ pools: [], warmingUp: false });
  vi.mocked(readRedemptionSnapshot).mockRejectedValue(new Error("RPC unavailable"));
  await expect(readRoutePoolState(client, request)).rejects.toThrow("RPC unavailable");
  expect(readContract).not.toHaveBeenCalled();
});

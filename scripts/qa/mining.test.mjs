import { expect, test, vi } from "vitest";
import { configureQaMining } from "./fixture-config.mjs";
test("mining is opt-in and sends seconds rather than milliseconds", async () => {
  const rpc = vi.fn().mockResolvedValue({ timestamp: "0x384" });
  await configureQaMining(rpc, undefined, 1000);
  expect(rpc).not.toHaveBeenCalled();
  await configureQaMining(rpc, "2", 1000);
  expect(rpc.mock.calls).toEqual([
    ["eth_getBlockByNumber", ["latest", false]],
    ["evm_setNextBlockTimestamp", [1000]],
    ["evm_mine", []],
    ["evm_setIntervalMining", [2]],
  ]);
});
test("rejects millisecond values before mutating the fork", async () => {
  const rpc = vi.fn();
  await expect(configureQaMining(rpc, "2000", 1000)).rejects.toThrow("1-10 seconds");
  expect(rpc).not.toHaveBeenCalled();
});
test("never moves a future-season fixture backward to use live quotes", async () => {
  const rpc = vi.fn().mockResolvedValue({ timestamp: "0x7d0" });
  await expect(configureQaMining(rpc, "2", 1000)).rejects.toThrow("present-time fork");
  expect(rpc).toHaveBeenCalledTimes(1);
});

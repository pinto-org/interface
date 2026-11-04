// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider, onlineManager } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import useReferralRewardPreview from "@/hooks/tractor/useReferralRewardPreview";
import ReferralCodeStatus from "@/components/referral/ReferralCodeStatus";
import { encodeReferralAddress } from "@/utils/referral";

const state = vi.hoisted(() => ({
  account: "0x0000000000000000000000000000000000000001",
  chainId: 1337,
  read: vi.fn(),
}));
vi.mock("wagmi", () => ({
  useAccount: () => ({ address: state.account, chainId: state.chainId }),
  useChainId: () => state.chainId,
  usePublicClient: () => ({ chain: { id: 1337 } }),
}));
vi.mock("@/hooks/pinto/useProtocolAddress", () => ({ useProtocolAddress: () => "diamond" }));
vi.mock("@/utils/referralPreview", async (original) => ({
  ...(await original<typeof import("@/utils/referralPreview")>()),
  readReferralRewards: (...args: unknown[]) => state.read(...args),
}));
const reward = { eligible: true, refereePercentage: 50_000n, remainingPods: 100_000_000n, blockNumber: 1n };
const first = encodeReferralAddress("0x0000000000000000000000000000000000000002");
const second = encodeReferralAddress("0x0000000000000000000000000000000000000003");
let root: Root, container: HTMLDivElement, client: QueryClient;
function Harness({ code = first }) {
  const preview = useReferralRewardPreview(code, 1_000_000n, 48_370_000n);
  return (
    <>
      <output>{String(preview.bonusPods)}</output>
      <ReferralCodeStatus code={code} />
    </>
  );
}
const render = (code = first) =>
  act(() =>
    root.render(
      <QueryClientProvider client={client}>
        <Harness code={code} />
      </QueryClientProvider>,
    ),
  );
const bonus = () => container.querySelector("output")?.textContent;
async function settle() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 15));
  });
}
beforeEach(() => {
  onlineManager.setOnline(true);
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  state.account = "0x0000000000000000000000000000000000000001";
  state.chainId = 1337;
  state.read.mockReset().mockResolvedValue(reward);
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  client.clear();
  onlineManager.setOnline(true);
  container.remove();
});

test("only a verified eligible referrer shows an estimated bonus", async () => {
  render();
  expect(bonus()).toBe("0");
  expect(container.textContent).toContain("Checking referral");
  await settle();
  expect(bonus()).toBe("2418500");
  expect(container.textContent).toContain("may change before execution");
});
test.each([
  [{ ...reward, eligible: false }, "not eligible"],
  [{ ...reward, remainingPods: 0n }, "exhausted"],
  [{ ...reward, refereePercentage: 0n }, "disabled"],
])("valid code with unavailable rewards shows no bonus: %s", async (data, message) => {
  state.read.mockResolvedValue(data);
  render();
  await settle();
  expect(bonus()).toBe("0");
  expect(container.textContent).toContain(message);
});
test("partial pool caps the displayed bonus", async () => {
  state.read.mockResolvedValue({ ...reward, remainingPods: 7n });
  render();
  await settle();
  expect(bonus()).toBe("7");
});
test("a failed refresh discards cached successful rewards", async () => {
  render();
  await settle();
  expect(bonus()).toBe("2418500");
  state.read.mockRejectedValue(new Error("RPC unavailable"));
  await act(async () => {
    await client.refetchQueries();
  });
  await settle();
  expect(bonus()).toBe("0");
  expect(container.textContent).toContain("unavailable");
});
test("an offline paused refresh cannot retain a cached bonus", async () => {
  render();
  await settle();
  expect(bonus()).toBe("2418500");
  await act(async () => {
    onlineManager.setOnline(false);
    await client.refetchQueries();
  });
  await settle();
  expect(client.getQueryCache().getAll()[0].state.fetchStatus).toBe("paused");
  expect(bonus()).toBe("0");
  expect(container.textContent).toContain("unavailable");
});
test("changing code hides prior success while a new request is pending or fails", async () => {
  render();
  await settle();
  expect(bonus()).toBe("2418500");
  let reject!: (error: Error) => void;
  state.read.mockImplementationOnce(
    () =>
      new Promise((_, no) => {
        reject = no;
      }),
  );
  render(second);
  expect(bonus()).toBe("0");
  await settle();
  await act(async () => {
    reject(new Error("missing"));
  });
  await settle();
  expect(bonus()).toBe("0");
});
test("invalid, self, disconnected and mismatched-chain contexts cannot use cached rewards", async () => {
  render();
  await settle();
  expect(bonus()).toBe("2418500");
  render("invalid");
  expect(bonus()).toBe("0");
  expect(container.textContent).toContain("Invalid");
  render(encodeReferralAddress(state.account as `0x${string}`));
  expect(bonus()).toBe("0");
  expect(container.textContent).toContain("own referral");
  state.chainId = 1338;
  render();
  expect(bonus()).toBe("0");
  state.chainId = 1337;
  state.account = "";
  render();
  expect(bonus()).toBe("0");
});
test("late responses for another account cannot approve the current account", async () => {
  let resolveOld!: (value: typeof reward) => void;
  state.read.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolveOld = resolve;
      }),
  );
  render();
  await settle();
  state.account = "0x0000000000000000000000000000000000000004";
  state.read.mockResolvedValue({ ...reward, eligible: false });
  render();
  await settle();
  await act(async () => {
    resolveOld(reward);
  });
  await settle();
  expect(bonus()).toBe("0");
  expect(container.textContent).toContain("not eligible");
});

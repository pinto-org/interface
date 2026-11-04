// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { ExecuteOrdersTab } from "@/components/Tractor/ExecuteOrdersTab";
import type { UseTransactionParams } from "@/hooks/useTransaction";
import { diamondABI } from "@/constants/abi/diamondABI";
import { encodeAbiParameters, encodeEventTopics } from "viem";

const fixture = vi.hoisted(() => ({
  simulate: vi.fn(),
  estimate: vi.fn(),
  write: vi.fn(),
  refresh: vi.fn(),
  options: {} as UseTransactionParams,
  chainId: 1337,
}));
vi.mock("wagmi", () => ({
  useAccount: () => ({ address: "0x0000000000000000000000000000000000000001" }),
  useChainId: () => fixture.chainId,
  usePublicClient: () => ({ simulateContract: fixture.simulate, estimateContractGas: fixture.estimate }),
}));
vi.mock("@tanstack/react-query", () => ({ useQueryClient: () => ({}) }));
vi.mock("@/hooks/useTransaction", () => ({
  default: (options: UseTransactionParams) => {
    fixture.options = options;
    return { writeWithEstimateGas: fixture.write, submitting: false, setSubmitting: () => {} };
  },
}));
vi.mock("@/utils/tractorQueryRefresh", () => ({
  refreshAfterTractorExecution: (...args: unknown[]) => fixture.refresh(...args),
}));
vi.mock("@/hooks/pinto/useProtocolAddress", () => ({
  useProtocolAddress: () => "0x0000000000000000000000000000000000000002",
}));
vi.mock("@/hooks/useGasPrice", () => ({ useGasPrice: () => ({ data: 1n }) }));
vi.mock("@/hooks/display/useDelayedLoading", () => ({ default: () => ({ loading: false, setLoading: () => {} }) }));
vi.mock("@/lib/Tractor", () => ({ prepareRequisitionForTxn: (value: unknown) => value }));
vi.mock("@/components/TooltipSimple", () => ({ default: ({ children }: any) => children }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
const order = {
  requisition: {
    blueprintHash: `0x${"11".repeat(32)}`,
    blueprint: {
      publisher: "0x0000000000000000000000000000000000000001",
      data: "0x",
      operatorPasteInstrs: [],
      maxNonce: 1n,
      startTime: 0n,
      endTime: 0n,
    },
    signature: "0x",
  },
} as any;
const orders = [order];
let root: Root, container: HTMLDivElement;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  fixture.simulate.mockReset().mockResolvedValue({});
  fixture.estimate.mockReset().mockResolvedValue(100_000n);
  fixture.write.mockReset().mockResolvedValue(`0x${"aa".repeat(32)}`);
  fixture.refresh.mockReset();
  fixture.chainId = 1337;
  vi.spyOn(console, "error").mockImplementation(() => {});
  container = document.createElement("div");
  root = createRoot(container);
  act(() => root.render(<ExecuteOrdersTab orders={orders} isLoading={false} columns={[]} />));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});
const rowButton = () => container.querySelector("tbody button") as HTMLButtonElement;
const click = async () => {
  await act(async () => {
    rowButton().click();
  });
};
test.each(["User rejected the request", "execution reverted", "RPC unavailable"])(
  "%s clears the old preview and leaves a working individual retry",
  async (message) => {
    await click();
    expect(rowButton().textContent).toBe("Execute");
    expect(fixture.simulate.mock.calls[0][0].account).toBe("0x0000000000000000000000000000000000000001");
    fixture.write.mockRejectedValue(new Error(message));
    await click();
    expect(rowButton().textContent).toBe("Resimulate");
    expect(rowButton().disabled).toBe(false);
    expect(container.textContent).not.toContain("Est. Gas:");
    await click();
    expect(fixture.simulate).toHaveBeenCalledTimes(2);
    expect(rowButton().textContent).toBe("Execute");
  },
);
test("an initial simulation failure can be retried without remounting or Simulate All", async () => {
  fixture.simulate.mockRejectedValueOnce(new Error("RPC unavailable"));
  await click();
  expect(rowButton().textContent).toBe("Resimulate");
  expect(rowButton().disabled).toBe(false);
  await click();
  expect(rowButton().textContent).toBe("Execute");
  expect(fixture.write).not.toHaveBeenCalled();
});

const executionLog = {
  address: "0x0000000000000000000000000000000000000002",
  topics: encodeEventTopics({
    abi: diamondABI,
    eventName: "Tractor",
    args: {
      operator: "0x0000000000000000000000000000000000000001",
      publisher: "0x0000000000000000000000000000000000000001",
      blueprintHash: order.requisition.blueprintHash,
    },
  }),
  data: encodeAbiParameters([{ type: "uint256" }, { type: "uint256" }], [0n, 1n]),
};
const receipt = { transactionHash: `0x${"aa".repeat(32)}`, status: "success", logs: [executionLog] } as any;
const deliverReceipt = (value = receipt) => {
  try {
    fixture.options.validateReceipt?.(value);
  } catch (error) {
    fixture.options.onError?.(error);
    return;
  }
  fixture.options.successCallback?.(value);
};
const confirm = () => act(() => deliverReceipt());
test("a returned transaction hash stays pending; only its receipt marks the blueprint Executed", async () => {
  await click();
  await click();
  expect(rowButton().textContent).toBe("Executing...");
  expect(rowButton().disabled).toBe(true);
  expect(fixture.refresh).not.toHaveBeenCalled();
  confirm();
  expect(rowButton().textContent).toBe("Executed");
  expect(rowButton().disabled).toBe(true);
  expect(fixture.refresh).toHaveBeenCalledOnce();
  expect(container.textContent).not.toContain("Est. Gas:");
});
test("an immediate receipt before write resolves is attributed to the correct order", async () => {
  fixture.write.mockImplementation(async () => {
    deliverReceipt();
    return receipt.transactionHash;
  });
  await click();
  await click();
  expect(rowButton().textContent).toBe("Executed");
  expect(fixture.refresh).toHaveBeenCalledOnce();
});
test.each(["cancellation", "wrong Diamond", "wrong blueprint"])(
  "%s receipt does not mark the order executed",
  async (kind) => {
    await click();
    await click();
    const log = { ...executionLog, topics: [...executionLog.topics] };
    if (kind === "wrong Diamond") log.address = "0x0000000000000000000000000000000000000003";
    if (kind === "wrong blueprint") log.topics[3] = `0x${"22".repeat(32)}`;
    act(() => deliverReceipt({ ...receipt, logs: kind === "cancellation" ? [] : [log] }));
    expect(rowButton().textContent).toBe("Resimulate");
    expect(rowButton().disabled).toBe(false);
    expect(fixture.refresh).not.toHaveBeenCalled();
  },
);
test("confirmation keeps the captured chain after a wallet network switch", async () => {
  await click();
  await click();
  fixture.chainId = 1338;
  act(() => root.render(<ExecuteOrdersTab orders={orders} isLoading={false} columns={[]} />));
  expect(fixture.options.confirmationChainId).toBe(1337);
  confirm();
  expect(rowButton().textContent).toBe("Executed");
  expect(fixture.refresh.mock.calls[0][1]).toBe(1337);
});
test("a wallet switch while the write is pending cannot retarget the submission chain", async () => {
  let release!: (hash: string) => void;
  fixture.write.mockImplementation(
    () =>
      new Promise<string>((resolve) => {
        release = resolve;
      }),
  );
  await click();
  act(() => rowButton().click());
  fixture.chainId = 1338;
  act(() => root.render(<ExecuteOrdersTab orders={orders} isLoading={false} columns={[]} />));
  expect(fixture.write.mock.calls[0][0].chainId).toBe(1337);
  expect(fixture.options.confirmationChainId).toBe(1337);
  expect(rowButton().disabled).toBe(true);
  await act(async () => release(receipt.transactionHash));
  confirm();
  expect(rowButton().textContent).toBe("Executed");
});
test("a confirmation failure remains retryable and never marks the order executed", async () => {
  await click();
  await click();
  act(() => {
    fixture.options.onError?.(new Error("Transaction reverted on-chain"));
  });
  expect(rowButton().textContent).toBe("Resimulate");
  expect(rowButton().disabled).toBe(false);
  expect(fixture.refresh).not.toHaveBeenCalled();
  await click();
  expect(rowButton().textContent).toBe("Execute");
});
test("one execution invalidates sibling previews without disabling individual resimulation", async () => {
  const second = { requisition: { ...order.requisition, blueprintHash: `0x${"22".repeat(32)}` } };
  const rows = () => [...container.querySelectorAll("tbody button")] as HTMLButtonElement[];
  const clickRow = (index: number) =>
    act(async () => {
      rows()[index].click();
    });
  act(() => root.render(<ExecuteOrdersTab orders={[order, second]} isLoading={false} columns={[]} />));
  await clickRow(0);
  await clickRow(1);
  expect(rows().map((row) => row.textContent)).toEqual(["Execute", "Execute"]);
  await clickRow(0);
  expect(rows().every((row) => row.disabled)).toBe(true);
  expect(container.textContent).not.toContain("Est. Gas:");
  confirm();
  expect(rows()[0].textContent).toBe("Executed");
  expect(rows()[1].disabled).toBe(false);
  await clickRow(1);
  expect(rows()[1].textContent).toBe("Execute");
  expect(fixture.simulate).toHaveBeenCalledTimes(3);
  expect(fixture.write).toHaveBeenCalledOnce();
});
test("an explicit new simulation pass retries a previously executed recurring order", async () => {
  await click();
  await click();
  confirm();
  const all = [...container.querySelectorAll("button")].find(
    (button) => button.textContent === "Simulate all transactions",
  )!;
  fixture.simulate.mockRejectedValueOnce(new Error("Blueprint already executed this season"));
  await act(async () => {
    all.click();
  });
  expect(rowButton().textContent).toBe("Resimulate");
  expect(rowButton().disabled).toBe(false);
  expect(container.textContent).not.toContain("Est. Gas:");
  await click();
  expect(rowButton().textContent).toBe("Execute");
});

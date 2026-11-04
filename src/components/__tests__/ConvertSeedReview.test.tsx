// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { FormProvider, useForm } from "react-hook-form";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { TokenValue as TV } from "@/classes/TokenValue";
import { ConvertUpFormAdvancedParametersSummary } from "@/components/Tractor/ConvertUp/ConvertUpSharedComponents";
import ModifyReview from "@/components/Tractor/ConvertUp/ConvertUpModifyOrderReviewDialog";
import { defaultConvertOrderUpValues, useConvertUpV0State } from "@/components/Tractor/form/schema/convertUp.schema";

vi.mock("@/components/TooltipSimple", () => ({ default: () => null }));
vi.mock("@/hooks/pinto/useTokenMap", () => ({ useTokenMap: () => ({}) }));
vi.mock("@/hooks/pinto/useProtocolAddress", () => ({
  useProtocolAddress: () => "0x0000000000000000000000000000000000000001",
}));
vi.mock("@/hooks/useTransaction", () => ({ default: () => ({ submitting: false }) }));
vi.mock("@/hooks/tractor/useSignTractorBlueprint", () => ({ default: () => ({ isSigning: false }) }));
vi.mock("@/state/tractor/useTractorConvertUpOrders", () => ({
  useTractorConvertUpOrderbook: () => ({ refetch: vi.fn() }),
}));
vi.mock("@/lib/Tractor/blueprint", () => ({ useGetBlueprintHash: () => ({}) }));
vi.mock("@tanstack/react-query", () => ({ useQueryClient: () => ({}) }));
const qaClient = vi.hoisted(() => ({ getBlock: vi.fn().mockResolvedValue({ number: 1n, timestamp: 1n }) }));
vi.mock("wagmi", () => ({
  useAccount: () => ({ address: "0x0000000000000000000000000000000000000001" }),
  useChainId: () => 1337,
  usePublicClient: () => qaClient,
}));
vi.mock("@/lib/Tractor", async (importOriginal) => ({
  ...(await importOriginal<any>()),
  TRACTOR_TOKEN_STRATEGY_TYPES: ["LOWEST_SEEDS", "LOWEST_PRICE", "SPECIFIC_TOKEN", "MULTI_TOKENS"],
  LOW_STALK_DEPOSIT_MODES_TO_LABELS: { 2: "Use Last" },
  LowStalkDepositsMode: { USE: 0, OMIT: 1, USE_LAST: 2 },
  prepareRequisitionForTxn: vi.fn(),
  createBlueprintFromBlock: () => ({}),
  createConvertUpTractorData: async (args: any) => ({
    data: "0x",
    operatorPasteInstrs: [],
    struct: {
      convertUpParams: {
        sourceTokenIndices: [1],
        seedDifference: args.seedDifference.toBigInt(),
        slippageRatio: args.slippageRatio.toBigInt(),
      },
      opParams: { operatorTipAmount: 200000n },
    },
  }),
}));
vi.mock("@/components/Tractor/form/fields/ConvertUpOrderV0Fields", () => ({ CONVERT_UP_TOOLTIP_COPY: {} }));
vi.mock("@/components/Tractor/form/fields/sharedFields", async (importOriginal) => ({
  ...(await importOriginal<any>()),
  TractorFormButtonsRow: () => null,
  SELECT_TIME_SCALES: ["SECONDS", "MINUTES", "HOURS", "DAYS"],
}));
vi.mock("@/components/ui/Dialog", () => {
  const Wrapper = ({ children }: any) => <div>{children}</div>;
  return Object.fromEntries(
    [
      "Dialog",
      "DialogContent",
      "DialogDescription",
      "DialogHeader",
      "DialogOverlay",
      "DialogPortal",
      "DialogTitle",
    ].map((name) => [name, Wrapper]),
  );
});

let preparedState: ReturnType<typeof useConvertUpV0State>;
function Preparation() {
  preparedState = useConvertUpV0State();
  return null;
}
test.each([
  [false, "-2", "0"],
  [true, "-2", "-2"],
  [true, "0.000001", "0.000001"],
] as const)(
  "review data is derived from the encoded seed constraint (enabled=%s, input=%s)",
  async (enabled, input, expected) => {
    act(() => root.render(<Preparation />));
    const form = {
      getValues: () => ({
        ...defaultConvertOrderUpValues,
        seedDifferenceCheck: enabled,
        seedDifference: input,
      }),
    };
    const failed = vi.fn();
    await act(async () => {
      await preparedState.handleCreateBlueprint(form as any, 0.2, "Normal", undefined, { onFailure: failed });
    });
    expect(failed).not.toHaveBeenCalled();
    expect(preparedState.orderData?.seedDifference).toBe(expected);
    expect(preparedState.orderData?.slippageRatio).toBe("0.1");
  },
);
vi.mock("@/components/ui/Accordion", () => {
  const Wrapper = ({ children }: any) => <div>{children}</div>;
  return Object.fromEntries(
    ["Accordion", "AccordionContent", "AccordionItem", "AccordionTrigger"].map((name) => [name, Wrapper]),
  );
});

let container: HTMLDivElement, root: Root;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function Summary({ enabled, value }: { enabled: boolean; value: string }) {
  const form = useForm({
    values: { ...defaultConvertOrderUpValues, seedDifferenceCheck: enabled, seedDifference: value },
  });
  return (
    <FormProvider {...form}>
      <ConvertUpFormAdvancedParametersSummary toggleEdit={() => {}} />
    </FormProvider>
  );
}
test.each(["1000", "-2", "0.000001"])(
  "unchecked creation review cannot claim a retained %s seed restriction",
  (value) => {
    act(() => root.render(<Summary enabled={false} value={value} />));
    expect(container.textContent).toContain("Seed difference checkDisabled");
    expect(container.textContent).not.toContain("Seeds gained per PDV");
    expect(container.textContent).not.toContain("Seeds lost per PDV");
  },
);
test.each([
  ["0.000001", "At least 0.000001 Seeds gained per PDV"],
  ["-2", "At most 2 Seeds lost per PDV"],
  ["0", "Disabled"],
])("checked creation review represents %s exactly", (value, text) => {
  act(() => root.render(<Summary enabled value={value} />));
  expect(container.textContent).toContain(text);
});

test.each([
  ["0.000001", "0", "Disabled", true, "0.1"],
  ["0", "-2", "At most 2 Seeds lost per PDV", true, "0.1"],
  ["1", "2", "At least 2 Seeds gained per PDV", true, "0.1"],
  ["0", "0", "Disabled", false, "0.1"],
  ["0", "0", "Disabled", true, "0.2"],
] as const)(
  "seed modification %s → %s is reviewed without phantom slippage edits",
  (previous, current, expected, changed, slippage) => {
    const fields = [
      "totalBeanAmountToConvert",
      "minBeansConvertPerExecution",
      "maxBeansConvertPerExecution",
      "minTimeBetweenConverts",
      "minConvertBonusCapacity",
      "maxGrownStalkPerBdv",
      "grownStalkPerBdvBonusBid",
      "maxPriceToConvertUp",
      "minPriceToConvertUp",
      "maxGrownStalkPerBdvPenalty",
      "slippageRatio",
    ];
    const params = Object.fromEntries(fields.map((key) => [key, TV.fromHuman("1", 6)]));
    const values = Object.fromEntries(fields.map((key) => [key, "1"]));
    params.slippageRatio = TV.fromHuman("0.001", 18);
    values.slippageRatio = slippage;
    const existingOrder = {
      decodedData: {
        convertUpParams: {
          ...params,
          seedDifference: TV.fromHuman(previous, 6),
          lowStalkDeposits: 2,
          sourceTokenIndices: [1],
        },
        opParams: { operatorTipAmount: TV.fromHuman("0.2", 6) },
      },
    };
    const orderData = {
      ...values,
      seedDifference: current,
      lowStalkDeposits: 2,
      sourceTokenIndices: [1],
      operatorTip: "0.2",
    };
    act(() =>
      root.render(
        <ModifyReview
          open
          onOpenChange={() => {}}
          existingOrder={existingOrder as any}
          orderData={orderData as any}
          blueprint={{} as any}
          encodedData="0x"
          operatorPasteInstrs={[]}
          getStrategyProps={{ getTokenStrategy: () => ({ type: "LOWEST_SEEDS" }) } as any}
        />,
      ),
    );
    if (changed) {
      expect(container.textContent).toContain("Seed difference check");
      expect(container.textContent).toContain(expected);
      expect(container.textContent).toContain("Slippage Tolerance0.1%");
      expect(container.textContent).toContain(`${slippage}%`);
      expect(container.textContent).not.toContain("No changes");
    } else expect(container.textContent).toContain("No changes");
    const sign = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Sign New Order",
    );
    expect(sign?.disabled).toBe(!changed);
  },
);

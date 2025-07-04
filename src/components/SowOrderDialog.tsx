import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { WarningIcon } from "@/components/Icons";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
import TokenSelectionDialog from "@/components/Tractor/TokenSelectionDialog";
import TractorOrderFormFields from "@/components/Tractor/TractorOrderFormFields";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTractorOrderCalculations } from "@/hooks/useTractorOrderCalculations";
import { useTractorOrderForm } from "@/hooks/useTractorOrderForm";
import { createBlueprint } from "@/lib/Tractor/blueprint";
import { Blueprint } from "@/lib/Tractor/types";
import { createSowTractorData } from "@/lib/Tractor/utils";
import { needsCombining } from "@/lib/claim/depositUtils";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePodLine, useTemperature } from "@/state/useFieldData";
import { formatter } from "@/utils/format";
import { DepositData } from "@/utils/types";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient } from "wagmi";
import { Col, Row } from "./Container";
import TooltipSimple from "./TooltipSimple";
import { Button } from "./ui/Button";

interface SowOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderPublished?: () => void;
}

// 0.000001 is the min for PINTO input & temperature
const minInput = TokenValue.fromHuman(0.000001, 6);

/*
  100 -> pinto
  200 -> weth
 */

export default function SowOrderDialog({ open, onOpenChange, onOrderPublished }: SowOrderDialogProps) {
  const podLine = usePodLine();
  const currentTemperature = useTemperature();
  const farmerSilo = useFarmerSilo();
  const farmerDeposits = farmerSilo.deposits;
  const { address } = useAccount();
  const { data: averageTipValue = 1 } = useTractorOperatorAverageTipPaid();

  // Use shared form hook
  const { formState, handlers, validation, temperatureInputRef } = useTractorOrderForm({
    averageTipValue,
  });

  // Use shared calculations hook
  const { calculations, cleanedValues, tokenWithHighestValue, whitelistedTokens, priceData, swapResults } =
    useTractorOrderCalculations({
      formState,
      podLine,
    });

  // Pod line calculations are now handled by the shared calculations hook

  // Function to check if deposits are sorted from low stem to high stem
  const areDepositsSorted = (deposits: DepositData[]): boolean => {
    if (!deposits || deposits.length <= 1) {
      return true;
    }

    for (let i = 1; i < deposits.length; i++) {
      const currentStem = deposits[i].stem.toBigInt();
      const previousStem = deposits[i - 1].stem.toBigInt();

      if (currentStem <= previousStem) {
        return false;
      }
    }

    return true;
  };

  // Check if all tokens have sorted deposits
  const allTokensSorted = useMemo(() => {
    if (!farmerDeposits || farmerDeposits.size === 0) {
      return true;
    }

    return Array.from(farmerDeposits.entries()).every(([token, depositData]) => {
      return areDepositsSorted(depositData.deposits || []);
    });
  }, [farmerDeposits]);

  // Determine if deposits need to be optimized (either combined or sorted)
  const needsOptimization = useMemo(() => {
    if (!farmerDeposits || farmerDeposits.size === 0) return false;

    const needsCombiningResult = needsCombining(farmerDeposits);
    const needsSortingResult = !allTokensSorted;
    const finalResult = needsCombiningResult || needsSortingResult;

    return finalResult;
  }, [farmerDeposits, allTokensSorted]);

  const [formStep, setFormStep] = useState(1);

  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [encodedData, setEncodedData] = useState<`0x${string}` | null>(null);
  const [operatorPasteInstructions, setOperatorPasteInstructions] = useState<`0x${string}`[] | null>(null);
  const [depositOptimizationCalls, setDepositOptimizationCalls] = useState<`0x${string}`[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  // Token selection dialog state is managed by the shared hook
  // Active tip button state is managed by the shared hook

  const publicClient = usePublicClient();
  const protocolAddress = useProtocolAddress();

  // Calculations and token strategy are now handled by shared hooks

  // Add state for the review dialog
  const [showReview, setShowReview] = useState(false);

  // Operator tip management is now handled by the shared form hook

  // Form validation and handlers are now managed by the shared hook

  // New function to handle combine and sort all deposits

  // Update handleNext to use shared form state
  const handleNext = async () => {
    // First step just moves to the next form view if validation passes
    if (formStep === 1) {
      if (validation.areRequiredFieldsFilled() && !formState.error) {
        setFormStep(2);
      }
      return;
    }

    // Second step (operator tip) submits the form
    try {
      console.time("handleNext total");
      setIsLoading(true);

      if (!publicClient) {
        toast.error("No public client available");
        setIsLoading(false);
        return;
      }

      const { data, operatorPasteInstrs, rawCall, depositOptimizationCalls } = await createSowTractorData({
        totalAmountToSow: formState.totalAmount || "0",
        temperature: formState.temperature || "0",
        minAmountPerSeason: formState.minSoil || "0",
        maxAmountToSowPerSeason: formState.maxPerSeason || "0",
        maxPodlineLength: formState.podLineLength || formatter.number(podLine).replace(/,/g, ""),
        maxGrownStalkPerBdv: "10000000000000000", // default of 100 grown stalk per bdv, which would take about 21 years at 4 seeds. TODO: add input for this in the future
        runBlocksAfterSunrise: formState.morningAuction ? "0" : "300",
        operatorTip: formState.operatorTip || "0",
        whitelistedOperators: [],
        tokenStrategy: formState.selectedTokenStrategy,
        publicClient,
        farmerDeposits: farmerDeposits,
        userAddress: address,
        protocolAddress: protocolAddress,
      });

      console.debug("createSowTractorData, data:", data);
      console.debug("rawCall:", rawCall);

      if (!address) {
        toast.error("Please connect your wallet");
        setIsLoading(false);
        return;
      }

      console.time("createBlueprint");
      // Calculate uint256 max (2^256 - 1)
      const UINT256_MAX = BigInt(2) ** BigInt(256) - BigInt(1);

      const newBlueprint = createBlueprint({
        publisher: address,
        data,
        operatorPasteInstrs,
        maxNonce: UINT256_MAX,
      });
      console.timeEnd("createBlueprint");

      // Set state immediately
      setBlueprint(newBlueprint);
      setEncodedData(rawCall);
      setOperatorPasteInstructions(operatorPasteInstrs);
      setDepositOptimizationCalls(depositOptimizationCalls);
      setShowReview(true);
      setIsLoading(false);

      console.timeEnd("handleNext total");
    } catch (e) {
      console.error("Error creating sow tractor data:", e);
      toast.error("Failed to create order");
      setIsLoading(false);
    }
  };

  // Add handle back function
  const handleBack = () => {
    if (formStep === 2) {
      setFormStep(1);
    } else {
      onOpenChange(false);
    }
  };

  // All token display and calculation functions are now handled by the shared hooks

  // All calculation functions are now handled by the shared hooks

  // All handlers and validation functions are now managed by the shared hook

  // Operator tip handlers are now managed by the shared hook

  if (!open) return null;

  return (
    <>
      <Col className="h-auto w-full">
        <div>
          <div className="flex flex-col gap-6">
            {/* Form Fields */}
            <div className="flex flex-col gap-6">
              {formStep === 1 ? (
                // Step 1 - Main Form
                <>
                  {/* Title and separator */}
                  <div className="flex flex-col gap-2">
                    <div className="pinto-body font-medium text-pinto-secondary mb-4">
                      🚜 Specify Conditions for automated Sowing
                    </div>
                    <div className="h-[1px] w-full bg-pinto-gray-2" />
                  </div>

                  {/* Use shared form fields component */}
                  <TractorOrderFormFields
                    formState={formState}
                    handlers={handlers}
                    validation={validation}
                    calculations={calculations}
                    currentTemperature={currentTemperature.scaled || currentTemperature}
                    podLine={podLine}
                    temperatureInputRef={temperatureInputRef}
                  />
                </>
              ) : (
                // Step 2 - Operator Tip
                <Col className="gap-6">
                  <Col>
                    {/* Title and separator for Step 2 */}
                    <div className="flex flex-col gap-2">
                      <div className="pinto-body font-medium text-pinto-secondary mb-4">🚜 Tip per Execution</div>
                      <div className="h-[1px] w-full bg-pinto-gray-2 mb-6" />
                    </div>
                    <div className="pinto-sm-light text-pinto-light gap-2 mb-4">I'm willing to pay someone</div>
                    <div className="flex rounded-lg border border-pinto-gray-2 gap-2 mb-2">
                      <input
                        className="h-12 px-3 py-1.5 flex-1 rounded-l-lg focus:outline-none text-base font-light"
                        placeholder="0.00"
                        value={formState.operatorTip}
                        onChange={handlers.handleOperatorTipChange}
                        type="text"
                      />
                      <div className="flex items-center gap-2 px-4 rounded-r-lg font-semibold bg-white">
                        <img src={pintoIcon} alt="PINTO" className="w-6 h-6" />
                        <span className="text-base font-normal">PINTO</span>
                      </div>
                    </div>

                    <div className="flex justify-between gap-2 mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.inputs} ${
                          formState.activeTipButton === "low"
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        }`}
                        onClick={() => handlers.handleTipButtonClick("low")}
                      >
                        Low
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.inputs} ${
                          formState.activeTipButton === "average"
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        }`}
                        onClick={() => handlers.handleTipButtonClick("average")}
                      >
                        Average
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.inputs} ${
                          formState.activeTipButton === "high"
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        }`}
                        onClick={() => handlers.handleTipButtonClick("high")}
                      >
                        High
                      </Button>
                    </div>

                    <div className="text-[#9C9C9C] text-base font-light mb-32">
                      each time they Sow part of my Tractor Order.
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <div className="text-[#9C9C9C] text-base font-light">Estimated total number of executions</div>
                        <div className="text-black text-base font-light">
                          {calculations.calculateEstimatedExecutions()}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-[#9C9C9C] text-base font-light">Estimated total tip</div>
                        <div className="flex items-center text-black text-base font-light">
                          {calculations.calculateEstimatedTotalTip()}
                          <img src={pintoIcon} alt="PINTO" className="w-5 h-5 mx-1" />
                          PINTO
                        </div>
                      </div>
                    </div>
                  </Col>
                </Col>
              )}

              {/* Error message box */}
              {formState.error && formStep === 1 && (
                <div className="w-full p-3 bg-red-50 rounded-lg mb-1 flex items-center gap-3">
                  <WarningIcon color="#DC2626" width={24} height={24} />
                  <span className="text-red-600 font-medium">
                    {formState.error === "Min per Season must be less than or equal to Max per Season"
                      ? "Minimum per Season must be less than Maximum per Season"
                      : formState.error}
                  </span>
                </div>
              )}

              <Row className="gap-6">
                <Button
                  variant="outline"
                  size="xlargest"
                  rounded="full"
                  className="flex-1 text-[#404040] bg-[#F8F8F8]"
                  onClick={handleBack}
                >
                  ← Back
                </Button>
                <TooltipSimple
                  content={
                    formStep === 1 && (!validation.areRequiredFieldsFilled() || !!formState.error) ? (
                      <div className="p-1">
                        <div className="font-medium mb-1">Please fill in the following fields:</div>
                        <ul className="list-disc pl-4 text-sm">
                          {validation.getMissingFields().map((field) => (
                            <li key={field}>{field}</li>
                          ))}
                          {formState.error && <li className="text-red-500 mt-1">{formState.error}</li>}
                        </ul>
                      </div>
                    ) : null
                  }
                  side="top"
                  align="center"
                  // Only show tooltip when there are missing fields or errors
                  disabled={!(formStep === 1 && (!validation.areRequiredFieldsFilled() || !!formState.error))}
                >
                  <div className="flex-1">
                    <Button
                      size="xlargest"
                      rounded="full"
                      className={`w-full ${
                        (formStep === 1 && (!validation.areRequiredFieldsFilled() || !!formState.error)) || isLoading
                          ? "bg-pinto-gray-2 text-[#9C9C9C]"
                          : "bg-[#387F5C] text-white"
                      }`}
                      disabled={
                        (formStep === 1 && (!validation.areRequiredFieldsFilled() || !!formState.error)) || isLoading
                      }
                      onClick={handleNext}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                        </div>
                      ) : formStep === 1 ? (
                        "Next"
                      ) : (
                        "Review"
                      )}
                    </Button>
                  </div>
                </TooltipSimple>
              </Row>
            </div>
          </div>
        </div>
      </Col>

      {/* Use shared token selection dialog */}
      <TokenSelectionDialog
        open={formState.showTokenSelectionDialog}
        onOpenChange={handlers.setShowTokenSelectionDialog}
        selectedTokenStrategy={formState.selectedTokenStrategy}
        onTokenStrategyChange={handlers.setSelectedTokenStrategy}
      />

      {showReview && encodedData && operatorPasteInstructions && blueprint && (
        <ReviewTractorOrderDialog
          open={showReview}
          onOpenChange={setShowReview}
          onSuccess={() => onOpenChange(false)}
          onOrderPublished={onOrderPublished}
          orderData={{
            totalAmount: formState.totalAmount,
            temperature: formState.temperature,
            podLineLength: formState.podLineLength,
            minSoil: formState.minSoil,
            operatorTip: formState.operatorTip,
            tokenStrategy: formState.selectedTokenStrategy.type,
            tokenSymbol:
              formState.selectedTokenStrategy.type === "SPECIFIC_TOKEN"
                ? whitelistedTokens.find(
                    (t) =>
                      t.address ===
                      (formState.selectedTokenStrategy as { type: "SPECIFIC_TOKEN"; address: string }).address,
                  )?.symbol
                : undefined,
            morningAuction: formState.morningAuction,
          }}
          encodedData={encodedData}
          operatorPasteInstrs={operatorPasteInstructions}
          blueprint={blueprint}
          includesDepositOptimization={needsOptimization}
          depositOptimizationCalls={depositOptimizationCalls}
        />
      )}
    </>
  );
}

export const AnimateSowOrderDialog = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
          style={{ transformOrigin: "50% 70%" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const styles = {
  inputs:
    "rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] pinto-sm whitespace-nowrap flex-1",
} as const;

//
const inputIds = {
  totalAmount: "total-amount-input",
  minPerSeason: "min-per-season-input",
  maxPerSeason: "max-per-season-input",
  fundOrder: "fund-order-select",
  temperature: "temperature-input",
  podLineLength: "pod-line-length-input",
  morningAuction: "morning-auction-input",
  operatorTip: "operator-tip-input",
} as const;

// ────────────────────────────────────────────────────────────────────────────────

const nonAmounts = new Set<string>([".", ""]);

const cleanAmount = (value: string) => value.replace(/[^0-9.]/g, "");

export interface SanitizedNumericStrInput {
  str: string;
  strValue: string;
  tv: TokenValue;
  nonAmount: boolean;
}

const sanitizedNonAmount: SanitizedNumericStrInput = {
  str: "",
  strValue: "0",
  tv: TokenValue.ZERO,
  nonAmount: true,
} as const;

export const isValidNumericInputValue = (value: string) => !nonAmounts.has(value);

/**
 * Sanitize the user input
 */
export const sanitizeNumericInputValue = (value: string, valueDecimals: number): SanitizedNumericStrInput => {
  const obj = {
    ...sanitizedNonAmount,
    str: value,
    tv: TokenValue.fromHuman("0", valueDecimals),
  };

  // Early return for special cases
  if (nonAmounts.has(value)) {
    return obj;
  }

  // remove all non-numeric characters
  const cleaned = cleanAmount(value);
  if (!cleaned) {
    return obj;
  }

  // treat all values after the first decimal point as decimal place.
  const [pre, ...post] = cleaned.split(".");
  const decimals = post.join("");

  const endsWithDot = cleaned.endsWith(".") && !post.length;
  const startsWithDot = cleaned.startsWith(".") && !pre.length;

  const mayDot = !!post.length || endsWithDot ? "." : "";
  const back = decimals.slice(0, valueDecimals);

  if (startsWithDot) {
    obj.str = `.${back}`;
    obj.strValue = `0.${back}`;
  } else if (endsWithDot) {
    obj.str = `${pre}.`;
    obj.strValue = `${pre}.0`;
  } else {
    obj.strValue = `${pre}${mayDot}${back}`;
    obj.str = obj.strValue;
  }

  obj.tv = TokenValue.fromHuman(obj.strValue, valueDecimals);
  obj.nonAmount = false;

  return obj;
};

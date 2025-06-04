import { mockAddressAtom } from "@/Web3Provider";
import arrowDown from "@/assets/misc/ChevronDown.svg";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TV, TokenValue } from "@/classes/TokenValue";
import { InfoOutlinedIcon, WarningIcon } from "@/components/Icons";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import IconImage from "@/components/ui/IconImage";
import { diamondABI as beanstalkAbi } from "@/constants/abi/diamondABI";
import { MAIN_TOKEN, PINTO } from "@/constants/tokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useSwapMany } from "@/hooks/swap/useSwap";
import { useClaimRewards } from "@/hooks/useClaimRewards";
import useTransaction from "@/hooks/useTransaction";
import { createBlueprint } from "@/lib/Tractor/blueprint";
import { Blueprint, SowOrderTokenStrategy } from "@/lib/Tractor/types";
import { createSowTractorData } from "@/lib/Tractor/utils";
import { generateBatchSortDepositsCallData, needsCombining } from "@/lib/claim/depositUtils";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePodLine, useTemperature } from "@/state/useFieldData";
import { usePriceData } from "@/state/usePriceData";
import useTokenData, { useWhitelistedTokens } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { isValidAddress, stringEq } from "@/utils/string";
import { DepositData } from "@/utils/types";
import { arrayify, cn, isLocalhost } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";

import { useChainConstant } from "@/utils/chain";
import { MayArray } from "@/utils/types.generic";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { z } from "zod";
import { Col, Row } from "./Container";
import TooltipSimple from "./TooltipSimple";
import { Button } from "./ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "./ui/Dialog";
import { Input, isValidInputValue, sanitizeInputValue } from "./ui/Input";
import { Separator } from "./ui/Separator";

interface SowOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderPublished?: () => void;
}

// Form Schema

const FormKeys = {
  totalAmount: "totalAmount",
  minSoil: "minSoil",
  maxPerSeason: "maxPerSeason",
  fundOrder: "fundOrder",
  temperature: "temperature",
  podLineLength: "podLineLength",
  morningAuction: "morningAuction",
  operatorTip: "operatorTip",
  tokenStrategy: "tokenStrategy",
  tokenAddress: "tokenAddress",
} as const;

//
const inputIds: Record<keyof typeof FormKeys, string> = {
  totalAmount: "total-amount-input",
  minSoil: "min-per-season-input",
  maxPerSeason: "max-per-season-input",
  fundOrder: "fund-order-select",
  temperature: "temperature-input",
  podLineLength: "pod-line-length-input",
  morningAuction: "morning-auction-input",
  operatorTip: "operator-tip-input",
  tokenStrategy: "token-strategy-select",
  tokenAddress: "token-address-input",
} as const;

const errorMessages = {
  maxGTTotal: "Maximum per Season cannot exceed the total amount to Sow",
  minGTMax: "Min per Season must be less than Max per Season",
  minGT0: "Minimum per Season must be greater than 0",
  maxGT0: "Maximum per Season must be greater than 0",
  tempGT0: "Temperature must be greater than 0",
};

const schema = z
  .object({
    totalAmount: z.string().min(1, { message: "Total Amount is required" }),
    minSoil: z.string().min(1, { message: "Min per Season is required" }),
    maxPerSeason: z.string().min(1, { message: "Max per Season is required" }),
    temperature: z.string().min(1, { message: "Temperature is required" }),
    podLineLength: z.string().min(1, { message: "Pod Line Length is required" }),
    fundOrder: z.string().min(1, { message: "Fund Order is required" }),
    morningAuction: z.boolean(),
    operatorTip: z.string().min(1, { message: "Operator Tip is required" }),
    tokenStrategy: z.enum(["LOWEST_SEEDS", "LOWEST_PRICE", "SPECIFIC_TOKEN"]),
    tokenAddress: z.string().optional(),
  })
  .refine(
    ({ temperature }) => {
      const temp = sanitizeInputValue(temperature, 6);
      return temp.tv?.gt(0) ?? false;
    },
    {
      message: errorMessages.tempGT0,
      path: [FormKeys.temperature],
    },
  )
  .superRefine(
    // minSoil must be lt maxPerSeason
    ({ minSoil, maxPerSeason, totalAmount }, ctx) => {
      const max = sanitizeInputValue(maxPerSeason, 6);
      const min = sanitizeInputValue(minSoil, 6);
      const total = sanitizeInputValue(totalAmount, 6);

      if (max.tv && max.tv.lte(0)) {
        ctx.addIssue({
          path: [FormKeys.maxPerSeason],
          message: errorMessages.maxGT0,
          code: z.ZodIssueCode.custom,
        });
      }

      if (min.tv && min.tv.lte(0)) {
        ctx.addIssue({
          path: [FormKeys.minSoil],
          message: errorMessages.minGT0,
          code: z.ZodIssueCode.custom,
        });
      }

      if (max.tv && total.tv && max.tv.gt(total.tv)) {
        ctx.addIssue({
          path: [FormKeys.maxPerSeason],
          message: errorMessages.maxGTTotal,
          code: z.ZodIssueCode.custom,
        });
        ctx.addIssue({
          path: [FormKeys.totalAmount],
          message: errorMessages.maxGTTotal,
          code: z.ZodIssueCode.custom,
        });
      }

      if (min.tv && max.tv && min.tv.gt(max.tv)) {
        ctx.addIssue({
          path: [FormKeys.minSoil],
          message: errorMessages.minGTMax,
          code: z.ZodIssueCode.custom,
        });
        ctx.addIssue({
          path: [FormKeys.maxPerSeason],
          message: errorMessages.minGTMax,
          code: z.ZodIssueCode.custom,
        });
      }
    },
  );

type FormSchema = z.infer<typeof schema>;

const defaultFormValues: FormSchema = {
  totalAmount: "",
  minSoil: "",
  maxPerSeason: "",
  temperature: "",
  podLineLength: "",
  fundOrder: "",
  morningAuction: false,
  tokenStrategy: "LOWEST_SEEDS",
  tokenAddress: undefined,
  operatorTip: "1",
};

export default function SowOrderDialog({ open, onOpenChange, onOrderPublished }: SowOrderDialogProps) {
  const currentTemperature = useTemperature();
  const podLine = usePodLine();

  const farmerSilo = useFarmerSilo();
  const farmerDeposits = farmerSilo.deposits;
  const { whitelistedTokens, mainToken } = useTokenData();
  const priceData = usePriceData();

  const [operatorTip, setOperatorTip] = useState("1");
  const { address } = useAccount();

  const form = useForm<FormSchema>({
    values: { ...defaultFormValues },
    defaultValues: { ...defaultFormValues },
    resolver: zodResolver(schema),
    // mode: "onBlur",
  });

  // Create a comprehensive validation function that handles all validation cases

  const { unsortedTokensInfo, tokensThatNeedCombining, needsOptimization } = useSowOrderDialogData(farmerDeposits);

  const [formStep, setFormStep] = useState(() => {
    // If deposits need combining OR are not sorted, start at step 0, otherwise normal flow
    return needsOptimization ? 0 : 1;
  });

  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [encodedData, setEncodedData] = useState<`0x${string}` | null>(null);
  const [operatorPasteInstructions, setOperatorPasteInstructions] = useState<`0x${string}`[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTokenSelectionDialog, setShowTokenSelectionDialog] = useState(false);
  const [activeTipButton, setActiveTipButton] = useState<"down5" | "down1" | "average" | "up1" | "up5" | null>(
    "average",
  );

  // Add these new declarations for combine and sort functionality
  const [sortingAllTokens, setSortingAllTokens] = useState(false);
  const publicClient = usePublicClient();
  const protocolAddress = useProtocolAddress();
  const queryClient = useQueryClient();
  const [mockAddress] = useAtom(mockAddressAtom);
  const isLocal = isLocalhost();
  const { writeWithEstimateGas, isConfirming, submitting, setSubmitting } = useTransaction({
    successMessage: "Combine & Sort successful",
    errorMessage: "Combine & Sort failed",
    successCallback: () => {
      queryClient.invalidateQueries();
      // If combining is successful, advance to the next step
      setFormStep(1);
    },
  });

  // Claim rewards necessary if deposits have not been combined
  const { submitClaimRewards, isSubmitting: isClaimSubmitting } = useClaimRewards();

  // Recheck the need for optimization whenever deposits change
  useEffect(() => {
    // Only auto-update if we're on step 0
    if (formStep === 0) {
      // If no longer needs optimization, advance to step 1
      if (!needsOptimization) {
        setFormStep(1);
      }
    }
  }, [needsOptimization, formStep]);

  // Get LP tokens
  const lpTokens = useMemo(() => whitelistedTokens.filter((t) => t.isLP), [whitelistedTokens]);

  const swapArgs = useMemo(() => {
    return lpTokens.map((token) => {
      const amount = farmerDeposits.get(token)?.amount || TokenValue.ZERO;
      return {
        tokenIn: token,
        tokenOut: mainToken,
        amountIn: amount,
        slippage: 0.5,
        disabled: amount.eq(0), // Only enable if there's an amount to swap
      };
    });
  }, [mainToken, farmerDeposits, lpTokens]);

  // Create swap hooks for each LP token
  const swapQuotes = useSwapMany({
    args: swapArgs,
  });

  // Combine the results into a map
  const swapResults = useMemo(() => {
    const results = new Map<string, TokenValue>();
    lpTokens.forEach((token, i) => {
      const buyAmount = swapQuotes[i]?.data?.buyAmount;
      if (buyAmount) {
        results.set(token.address, buyAmount);
      }
    });
    return results;
  }, [lpTokens, swapQuotes]);

  const tokenWithHighestValue = useTokenWithHighestValue({
    farmerDeposits,
    price: priceData.price,
    swapResults,
  });

  const [didInitStrategy, setDidInitStrategy] = useState(false);
  useEffect(() => {
    if (didInitStrategy) return;
    setDidInitStrategy(true);

    form.setValue(FormKeys.tokenStrategy, tokenWithHighestValue.type, { shouldValidate: false });
    if (tokenWithHighestValue.type === "SPECIFIC_TOKEN") {
      form.setValue(FormKeys.tokenAddress, tokenWithHighestValue.address, { shouldValidate: false });
    }
  }, [didInitStrategy, tokenWithHighestValue, form.setValue]);

  // Add state for the review dialog
  const [showReview, setShowReview] = useState(false);

  // Load average tip value on component mount
  const [didInitOperatorTip, setDidInitOperatorTip] = useState(false);
  const { data: averageTipValue = 1 } = useTractorOperatorAverageTipPaid();

  // Only set the initial operator tip to the average tip value
  useEffect(() => {
    if (!didInitOperatorTip) {
      // Only set the initial operator tip to the average tip value
      setOperatorTip(averageTipValue.toFixed(2));
      setDidInitOperatorTip(true);
    }
  }, [averageTipValue, didInitOperatorTip]);

  // Update operatorTip if averageTipValue changes and the active button is "average"
  useEffect(() => {
    if (activeTipButton === "average") {
      setOperatorTip(averageTipValue.toFixed(2));
    }
  }, [averageTipValue, activeTipButton]);

  // Add this function to check if all required fields are filled
  const areRequiredFieldsFilled = () => {
    return (
      // temperature !== "" &&
      // temperature !== undefined &&
      // temperature !== null &&
      // minSoil !== "" &&
      // minSoil !== undefined &&
      // minSoil !== null &&
      // maxPerSeason !== "" &&
      // maxPerSeason !== undefined &&
      // maxPerSeason !== null &&
      // totalAmount !== "" &&
      // totalAmount !== undefined &&
      // totalAmount !== null
      // isPodLineLengthValid()
      true
    );
  };

  // New function to handle combine and sort all deposits
  const handleCombineAndSortAll = async () => {
    if (!address || !publicClient || !protocolAddress || !farmerDeposits) return;

    const effectiveAddress = isLocal && isValidAddress(mockAddress) ? mockAddress : address;
    console.debug("Combine & Sort All - Using address:", effectiveAddress);

    setSortingAllTokens(true);
    setSubmitting(true);

    try {
      toast.info("Preparing to combine and sort all deposits...");

      console.debug(`Processing ${farmerDeposits.size} tokens for sorting`);

      // Use the utility function to generate batch sort deposits call data
      const callData = await generateBatchSortDepositsCallData(
        effectiveAddress as `0x${string}`,
        farmerDeposits,
        publicClient,
        protocolAddress,
      );

      if (!callData || callData.length === 0) {
        toast.warning("No sort deposit calls were generated");
        return;
      }

      // Output raw calldata for simulator debugging
      const rawCalldata = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "farm",
        args: [callData],
      });

      console.debug(`=== Raw Farm Calldata for All Tokens ===`);
      console.debug(rawCalldata);
      console.debug(`Number of calls: ${callData.length}`);
      console.debug("======================================");

      toast.info(`Executing ${callData.length} operations for all tokens (combines + sort updates)...`);

      // Execute the farm transaction using writeWithEstimateGas with higher gas limit
      // const simulateFirst = await publicClient
      //   .simulateContract({
      //     address: protocolAddress,
      //     abi: beanstalkAbi,
      //     functionName: "farm",
      //     args: [callData],
      //     account: effectiveAddress,
      //   })
      //   .catch((e) => {
      //     console.debug("Simulation failed:", e);
      //     return { error: e };
      //   });

      // if ("error" in simulateFirst) {
      //   // console.error("Transaction would fail in simulation, not submitting");
      //   toast.error("Transaction would fail: " + (simulateFirst.error as any)?.shortMessage || "unknown error");
      //   setSubmitting(false);
      //   setSortingAllTokens(false);
      //   return;
      // }

      // Execute with higher gas limit to prevent running out of gas
      await writeWithEstimateGas({
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "farm",
        args: [callData],
      });
    } catch (error) {
      console.error("Error processing all tokens:", error);

      // Extract error details for debugging
      const errorObj = error as any;

      if (errorObj.cause) console.debug("Error cause:", errorObj.cause);
      if (errorObj.details) console.debug("Error details:", errorObj.details);
      if (errorObj.data) console.debug("Error data:", errorObj.data);
      if (errorObj.reason) console.debug("Error reason:", errorObj.reason);
      if (errorObj.shortMessage) console.debug("Short message:", errorObj.shortMessage);

      // Display toast with specific error information
      const errorMessage =
        errorObj.shortMessage || errorObj.reason || errorObj.cause?.message || (error as Error).message;

      toast.error(`Failed to process all tokens: ${errorMessage}`);

      setSubmitting(false);
      setSortingAllTokens(false);
    }
  };

  // Update handleNext to remove formSubmitAttempted
  const handleNext = async () => {
    // Step 0 does nothing on Next since we handle the claim button separately
    if (formStep === 0) {
      return;
    }
    // First step just moves to the next form view if validation passes
    if (formStep === 1) {
      // if (areRequiredFieldsFilled() && !error) {
      if (areRequiredFieldsFilled()) {
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

      const {
        tokenStrategy,
        tokenAddress,
        temperature,
        minSoil,
        maxPerSeason,
        totalAmount,
        podLineLength,
        morningAuction,
      } = form.getValues();

      const strategy: SowOrderTokenStrategy =
        tokenStrategy === "SPECIFIC_TOKEN"
          ? {
              type: tokenStrategy,
              address: tokenAddress as `0x${string}`,
            }
          : { type: tokenStrategy };

      const { data, operatorPasteInstrs, rawCall } = await createSowTractorData({
        totalAmountToSow: totalAmount || "0",
        temperature: temperature || "0",
        minAmountPerSeason: minSoil || "0",
        maxAmountToSowPerSeason: maxPerSeason || "0",
        maxPodlineLength: podLineLength || formatter.number(podLine).replace(/,/g, ""),
        maxGrownStalkPerBdv: "10000000000000000", // default of 100 grown stalk per bdv, which would take about 21 years at 4 seeds. TODO: add input for this in the future
        runBlocksAfterSunrise: morningAuction ? "0" : "300",
        operatorTip: operatorTip || "0",
        whitelistedOperators: [],
        tokenStrategy: strategy,
        publicClient,
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
      setShowReview(true);
      setIsLoading(false);

      console.timeEnd("handleNext total");
    } catch (e) {
      console.error("Error creating sow tractor data:", e);
      toast.error("Failed to create order");
      setIsLoading(false);
    }
  };

  // Handle claim button click in step 0
  const handleClaim = async () => {
    try {
      await submitClaimRewards();
      // We don't need to manually advance to the next step
      // The useEffect will detect the change in needsDepositCombining
      // and automatically advance when appropriate
    } catch (e) {
      console.error("Failed to claim rewards:", e);
      toast.error("Failed to claim rewards");
    }
  };

  // Add handle back function
  const handleBack = () => {
    if (formStep === 2) {
      setFormStep(1);
    } else if (formStep === 1) {
      // Can't go back from step 1 to step 0 as step 0 is conditional
      onOpenChange(false);
    } else {
      onOpenChange(false);
    }
  };

  // Helper function to calculate tip values for different percentages
  const getTipValue = (type: "down5" | "down1" | "average" | "up1" | "up5") => {
    const baseValue = averageTipValue;
    switch (type) {
      case "down5":
        return (baseValue * 0.95).toFixed(2);
      case "down1":
        return (baseValue * 0.99).toFixed(2);
      case "average":
        return baseValue.toFixed(2);
      case "up1":
        return (baseValue * 1.01).toFixed(2);
      case "up5":
        return (baseValue * 1.05).toFixed(2);
    }
  };

  // Helper function to check which button should be active based on current tip value
  const checkActiveTipButton = (tipValue: string) => {
    const normalizedTip = parseFloat(tipValue).toFixed(2);
    if (normalizedTip === getTipValue("down5")) return "down5";
    if (normalizedTip === getTipValue("down1")) return "down1";
    if (normalizedTip === averageTipValue.toFixed(2)) return "average";
    if (normalizedTip === getTipValue("up1")) return "up1";
    if (normalizedTip === getTipValue("up5")) return "up5";
    return null;
  };

  // Handler for tip button clicks
  const handleTipButtonClick = (type: "down5" | "down1" | "average" | "up1" | "up5") => {
    setActiveTipButton(type);
    const newValue = getTipValue(type);
    setOperatorTip(newValue);
  };

  // Calculate the estimated number of executions
  const calculateEstimatedExecutions = () => {
    // If any of the required values are missing, return a default
    if (!form.getValues(FormKeys.totalAmount) || !form.getValues(FormKeys.maxPerSeason)) {
      return "~0";
    }

    try {
      // Remove commas and convert to numbers
      const totalClean = form.getValues(FormKeys.totalAmount).replace(/,/g, "");
      const minClean = form.getValues(FormKeys.minSoil).replace(/,/g, "");
      const maxClean = form.getValues(FormKeys.maxPerSeason).replace(/,/g, "");

      // Convert to TokenValue for precision math
      const total = TokenValue.fromHuman(totalClean, PINTO.decimals);
      const min = TokenValue.fromHuman(minClean, PINTO.decimals);
      const max = TokenValue.fromHuman(maxClean, PINTO.decimals);

      // Check for zero values to avoid division by zero
      if (total.eq(0) || max.eq(0)) {
        return "~0";
      }

      // If min is zero, upper bound is infinity
      if (min.eq(0)) {
        // Calculate only the lower bound
        let lowerBound = Math.floor(total.div(max).toNumber());
        lowerBound = Math.max(1, lowerBound);
        return `~${lowerBound}-∞`;
      }

      // Calculate both bounds
      let lowerBound = Math.floor(total.div(max).toNumber());
      let upperBound = Math.ceil(total.div(min).toNumber());

      // Handle edge cases and ensure sensible values
      lowerBound = Math.max(1, lowerBound);
      upperBound = Math.max(lowerBound, upperBound);

      // Format the result
      if (lowerBound === upperBound) {
        return `~${lowerBound}`;
      } else {
        return `~${lowerBound}-${upperBound}`;
      }
    } catch (e) {
      console.error("Error calculating executions:", e);
      return "~0";
    }
  };

  // Also add a function to calculate the estimated total tip
  const calculateEstimatedTotalTip = () => {
    if (!operatorTip || !form.getValues(FormKeys.totalAmount) || !form.getValues(FormKeys.maxPerSeason)) {
      return "~0";
    }

    try {
      // Remove commas and convert to numbers
      const totalClean = form.getValues(FormKeys.totalAmount).replace(/,/g, "");
      const minClean = form.getValues(FormKeys.minSoil).replace(/,/g, "");
      const maxClean = form.getValues(FormKeys.maxPerSeason).replace(/,/g, "");

      // Convert to TokenValue for precision math
      const total = TokenValue.fromHuman(totalClean, PINTO.decimals);
      const min = TokenValue.fromHuman(minClean, PINTO.decimals);
      const max = TokenValue.fromHuman(maxClean, PINTO.decimals);

      // Parse the operator tip
      const tipValue = parseFloat(operatorTip);

      // Check for zero values
      if (total.eq(0) || max.eq(0) || Number.isNaN(tipValue)) {
        return "~0";
      }

      // Calculate lower bound (based on max per season)
      let lowerBound = Math.floor(total.div(max).toNumber());
      lowerBound = Math.max(1, lowerBound);
      const lowerTip = lowerBound * tipValue;

      // If min is zero, upper bound is infinity
      if (min.eq(0)) {
        return `~${lowerTip.toFixed(2)}-∞`;
      }

      // Calculate upper bound
      let upperBound = Math.ceil(total.div(min).toNumber());
      upperBound = Math.max(lowerBound, upperBound);
      const upperTip = upperBound * tipValue;

      // Format the result
      if (lowerTip === upperTip) {
        return `~${lowerTip.toFixed(2)}`;
      } else {
        return `~${lowerTip.toFixed(2)}-${upperTip.toFixed(2)}`;
      }
    } catch (e) {
      console.error("Error calculating total tip:", e);
      return "~0";
    }
  };

  // Add this function to check which fields are missing
  const getMissingFields = (
    temperature: string,
    minSoil: string,
    maxPerSeason: string,
    totalAmount: string,
    isPodLineLengthValidFn: () => boolean,
  ) => {
    const missingFields: string[] = [];

    // if (!temperature || temperature === "") {
    //   missingFields.push("Temperature");
    // }
    // if (!minSoil || minSoil === "") {
    //   missingFields.push("Min Soil per Season");
    // }
    // if (!maxPerSeason || maxPerSeason === "") {
    //   missingFields.push("Max per Season");
    // }
    // if (!totalAmount || totalAmount === "") {
    //   missingFields.push("Total Amount");
    // }
    // if (!isPodLineLengthValidFn()) {
    //   missingFields.push("Pod Line Length");
    // }

    return missingFields;
  };

  // Add handler for operator tip input changes
  const handleOperatorTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.,]/g, "");
    setOperatorTip(newValue);

    // Check if the new value matches any of our buttons
    const activeButton = checkActiveTipButton(newValue);
    setActiveTipButton(activeButton);
  };

  if (!open) return null;

  return (
    <FormProvider {...form}>
      <Form
        className="w-full"
        onSubmit={() => {
          console.log("form submitted");
        }}
      >
        <Col className="h-auto w-full">
          <div>
            <div className="flex flex-col gap-6">
              {/* Form Fields */}
              <div className="flex flex-col gap-6">
                {formStep === 0 ? (
                  // Step 0 - Deposits need combining or sorting
                  <div className="flex flex-col gap-4 py-2 min-h-[320px]">
                    <div className="flex items-center justify-center">
                      <WarningIcon color="#DC2626" width={40} height={40} />
                    </div>
                    <h3 className="text-center pinto-h3 mt-4 mb-2">Fragmented Silo Deposits</h3>
                    <p className="text-center pinto-body text-gray-700 mb-2">
                      Pinto does not combine and sort deposits by default, due to gas costs. A one-time claim and
                      combine will optimize your deposits and allow you to create Tractor orders.
                    </p>

                    {/* Display tokens needing optimization */}
                    <div className="mt-2 p-3 bg-gray-50 rounded-md max-h-[180px] overflow-y-auto">
                      {unsortedTokensInfo.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-pinto-warning-orange mb-2">
                            Tokens with unsorted deposits:
                          </p>
                          <ul className="text-xs text-gray-600 ml-4 list-disc">
                            {unsortedTokensInfo.map(({ token, depositCount }) => (
                              <li key={token.address} className="mb-1">
                                <span className="font-medium">{token.symbol}</span>: {depositCount} deposits
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {tokensThatNeedCombining.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-pinto-warning-orange mb-2">
                            Tokens with too many deposits:
                          </p>
                          <ul className="text-xs text-gray-600 ml-4 list-disc">
                            {tokensThatNeedCombining.map(({ token, depositCount }) => (
                              <li key={token.address} className="mb-1">
                                <span className="font-medium">{token.symbol}</span>: {depositCount} deposits
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* The Claim & Combine button has been moved to the footer (replacing the Next button) */}
                  </div>
                ) : formStep === 1 ? (
                  // Step 1 - Main Form
                  <Col className="gap-6 pinto-sm-light text-pinto-light">
                    {/* Title and separator */}
                    <div className="flex flex-col gap-2">
                      <div className="pinto-body font-medium text-pinto-secondary mb-4">
                        🚜 Specify Conditions for automated Sowing
                      </div>
                      <div className="h-[1px] w-full bg-pinto-gray-2" />
                    </div>
                    {/**
                     * Total Amount
                     * */}
                    <InputFieldWithKey
                      fieldKey={FormKeys.totalAmount}
                      decimals={PINTO.decimals}
                      inputLabel="I want to Sow up to"
                      inputAdornment={<MainTokenIconSymbol />}
                    />
                    {/**
                     * MinSoil + Max per Season
                     */}
                    <Row className="gap-4">
                      <InputFieldWithKey
                        fieldKey={FormKeys.minSoil}
                        decimals={PINTO.decimals}
                        inputLabel="Min per Season"
                        inputAdornment={<MainTokenIconSymbol />}
                      />
                      <InputFieldWithKey
                        fieldKey={FormKeys.maxPerSeason}
                        decimals={PINTO.decimals}
                        inputLabel="Max per Season"
                        inputAdornment={<MainTokenIconSymbol />}
                      />
                    </Row>
                    {/**
                     * Fund order using
                     */}
                    <FundOrderUsingTrigger setOpen={setShowTokenSelectionDialog} />
                    {/**
                     * Temperature
                     */}
                    <InputFieldWithKey
                      containerClassName="w-[9.5rem]"
                      fieldKey={FormKeys.temperature}
                      decimals={6}
                      inputLabel="Execute when Temperature is at least"
                      inputAdornment={<div className="text-pinto-primary pinto-body pl-1">%</div>}
                      row
                    />
                    {/**
                     * Podline Length
                     */}
                    <Col className="flex flex-col gap-2">
                      <InputFieldWithKey
                        fieldKey={FormKeys.podLineLength}
                        decimals={6}
                        placeholder={formatter.number(podLine)}
                        inputLabel="Execute when the length of the Pod Line is at most"
                      />
                      <PodLineLengthPresetSelection />
                    </Col>
                    {/**
                     * Execute during the Morning Auction
                     */}
                    <MorningAuctionSelection />
                  </Col>
                ) : (
                  // ------------------------------
                  // Step 2 - Operator Tip
                  // ------------------------------
                  <Col className="gap-6">
                    <Col>
                      {/* Title and separator for Step 2 */}
                      <Col className="gap-2">
                        <div className="pinto-body font-medium text-pinto-secondary mb-4">🚜 Tip per Execution</div>
                        <div className="h-[1px] w-full bg-pinto-gray-2 mb-6" />
                      </Col>
                      <div className="pinto-sm-light text-pinto-light gap-2 mb-4">I'm willing to pay someone</div>
                      <div className="flex rounded-lg border border-pinto-gray-2 gap-2 mb-2">
                        <input
                          className="h-12 px-3 py-1.5 flex-1 rounded-l-lg focus:outline-none text-base font-light"
                          placeholder="0.00"
                          value={operatorTip}
                          onChange={handleOperatorTipChange}
                          type="text"
                        />
                        <div className="flex items-center gap-2 px-4 rounded-r-lg font-semibold bg-white">
                          <img src={pintoIcon} alt="PINTO" className="w-6 h-6" />
                          <span className="text-base font-normal">PINTO</span>
                        </div>
                      </div>
                      {/**
                       * Operator Tip Presets
                       */}
                      <div className="flex justify-between gap-2 mb-2">
                        {OPERATOR_TIP_OPTIONS.map((option) => (
                          <SelectionButton
                            key={`operator-tip-preset-${option.value}`}
                            isActive={stringEq(activeTipButton, option.value)}
                            onClick={() => handleTipButtonClick(option.value)}
                          >
                            {option.label}
                          </SelectionButton>
                        ))}
                      </div>
                      <div className="text-[#9C9C9C] text-base font-light mb-32">
                        each time they Sow part of my Tractor Order.
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <div className="text-[#9C9C9C] text-base font-light">
                            Estimated total number of executions
                          </div>
                          <div className="text-black text-base font-light">{calculateEstimatedExecutions()}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-[#9C9C9C] text-base font-light">Estimated total tip</div>
                          <div className="flex items-center text-black text-base font-light">
                            {calculateEstimatedTotalTip()}
                            <img src={pintoIcon} alt="PINTO" className="w-5 h-5 mx-1" />
                            PINTO
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Col>
                )}

                {/**
                 * Error message boxes
                 */}
                <FormErrors />

                {/**
                 * Form Buttons
                 */}
                <Row className="gap-6">
                  <Button
                    variant="outline"
                    size="xlargest"
                    rounded="full"
                    className="flex-1 text-[#404040] bg-[#F8F8F8]"
                    onClick={(e) => {
                      // prevent default form submission
                      e.preventDefault();
                      handleBack();
                    }}
                  >
                    ← Back
                  </Button>
                  {formStep === 0 ? (
                    <SmartSubmitButton
                      size="xlargest"
                      rounded="full"
                      variant="gradient"
                      submitFunction={handleCombineAndSortAll}
                      disabled={sortingAllTokens || submitting}
                      submitButtonText={sortingAllTokens || submitting ? "Optimizing..." : "Combine & Sort"}
                      className="flex-1 rounded-full text-2xl font-medium"
                    />
                  ) : (
                    <TooltipSimple
                      content={
                        formStep === 1 && !areRequiredFieldsFilled() ? (
                          // formStep === 1 && (!areRequiredFieldsFilled() || !!error) ? (
                          <div className="p-1">
                            <div className="font-medium mb-1">Please fill in the following fields:</div>
                            <ul className="list-disc pl-4 text-sm">
                              {getMissingFields(
                                "",
                                "",
                                "",
                                "",
                                () => true,
                                // isPodLineLengthValid,
                              ).map((field) => (
                                <li key={field}>{field}</li>
                              ))}
                              {/* {error && <li className="text-red-500 mt-1">{error}</li>} */}
                            </ul>
                          </div>
                        ) : null
                      }
                      side="top"
                      align="center"
                      // Only show tooltip when there are missing fields or errors
                      disabled={!(formStep === 1 && !areRequiredFieldsFilled())}
                      // disabled={!(formStep === 1 && (!areRequiredFieldsFilled() || !!error))}
                    >
                      <div className="flex-1">
                        <Button
                          size="xlargest"
                          rounded="full"
                          className={`w-full ${
                            // (formStep === 1 && (!areRequiredFieldsFilled() || !!error)) || isLoading
                            (formStep === 1 && !areRequiredFieldsFilled()) || isLoading
                              ? "bg-pinto-gray-2 text-[#9C9C9C]"
                              : "bg-[#387F5C] text-white"
                          }`}
                          // disabled={(formStep === 1 && (!areRequiredFieldsFilled() || !!error)) || isLoading}
                          disabled={(formStep === 1 && !areRequiredFieldsFilled()) || isLoading}
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
                  )}
                </Row>
              </div>
            </div>
          </div>
        </Col>
        {/**
         * Token Selection Dialog
         */}
        <TokenStrategyDialog
          open={showTokenSelectionDialog}
          onOpenChange={setShowTokenSelectionDialog}
          priceData={priceData}
          farmerDeposits={farmerDeposits}
          swapResults={swapResults}
        />
        {/**
         * Review Tractor Order Dialog
         */}
        {showReview && encodedData && operatorPasteInstructions && blueprint && (
          <ReviewTractorOrderDialog
            open={showReview}
            onOpenChange={setShowReview}
            onSuccess={() => onOpenChange(false)}
            onOrderPublished={onOrderPublished}
            orderData={{
              totalAmount: form.getValues(FormKeys.totalAmount),
              temperature: form.getValues(FormKeys.temperature),
              podLineLength: form.getValues(FormKeys.podLineLength),
              minSoil: form.getValues(FormKeys.minSoil),
              operatorTip,
              tokenStrategy: form.getValues(FormKeys.tokenStrategy),
              tokenSymbol:
                form.getValues(FormKeys.tokenStrategy) === "SPECIFIC_TOKEN"
                  ? whitelistedTokens.find((t) => t.address === form.getValues(FormKeys.tokenAddress))?.symbol
                  : undefined,
              morningAuction: form.getValues(FormKeys.morningAuction),
            }}
            encodedData={encodedData}
            operatorPasteInstrs={operatorPasteInstructions}
            blueprint={blueprint}
          />
        )}
      </Form>
    </FormProvider>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Form Field Components
// ────────────────────────────────────────────────────────────────────────────────

const InputFieldWithKey = ({
  fieldKey,
  decimals,
  inputLabel,
  inputAdornment,
  placeholder = "0.00",
  containerClassName,
  row = false,
}: {
  // form field key
  fieldKey: keyof typeof FormKeys;
  // decimals for the field
  decimals: number;
  // label for the field
  inputLabel: string;
  // adornment for the field
  inputAdornment?: JSX.Element;
  // field key in which to validate w/ the current field (e.g. minSoil is paired with maxPerSeason)
  pairFieldKeys?: MayArray<keyof typeof FormKeys>;
  // placeholder for the field
  placeholder?: string;
  //
  containerClassName?: string;
  // row or column
  row?: boolean;
}) => {
  const {
    register,
    setValue,
    getValues,
    trigger,
    formState: {
      errors: { [fieldKey]: fieldError },
    },
  } = useFormContext();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = sanitizeInputValue(e.target.value, decimals);
    setValue(fieldKey, cleaned.str);
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const amt = sanitizeInputValue(val, decimals);

    setValue(fieldKey, amt.str);
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const fieldValue = e.target?.value || "";
    const amt = sanitizeInputValue(fieldValue, decimals);
    if (amt.nonAmount) return;

    setValue(
      fieldKey,
      formatter.number(amt.tv, {
        minDecimals: 0,
        maxDecimals: decimals,
      }),
    );
    trigger(fieldKey);

    const pairFieldKeys = FieldKeyToPairFieldKeys[fieldKey] ?? "";

    if (!pairFieldKeys) return;

    arrayify(pairFieldKeys).forEach((pairFieldKey) => {
      if (isValidInputValue(getValues(pairFieldKey))) {
        trigger(pairFieldKey);
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-2", row && "flex-row items-center justify-between")}>
      <label
        htmlFor={inputIds[fieldKey]}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {inputLabel}
      </label>
      <Input
        containerClassName={containerClassName}
        id={inputIds[fieldKey]}
        error={!!fieldError}
        placeholder={placeholder}
        {...register(fieldKey, {
          required: true,
          onChange: handleOnChange,
          onBlur: handleOnBlur,
        })}
        type="text"
        onFocus={onFocus}
        endIcon={inputAdornment}
      />
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// Pod Line Length Preset Selection
// ────────────────────────────────────────────────────────────────────────────────

const PodLineLengthPresetSelection = () => {
  const podLine = usePodLine();

  const { control, setValue, getValues } = useFormContext();

  const value = useWatch({ control, name: FormKeys.podLineLength });

  const calculatePodLineValue = useCallback(
    (increment: number) => {
      const increase = podLine.mul(increment).div(100);
      return podLine.add(increase);
    },
    [podLine],
  );

  const sanitized = sanitizeInputValue(value, 6);

  const presetValues = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(PODLINE_PCT_OPTIONS).map(([_, value]) => {
          return [value.value, calculatePodLineValue(value.value)] as const;
        }),
      ),
    [podLine, calculatePodLineValue],
  );

  const handlePodLineSelect = (increment: number) => {
    const calculated = calculatePodLineValue(increment);

    const val = presetValues[increment];
    const sanitized = sanitizeInputValue(getValues(FormKeys.podLineLength), 6);
    const isSelected = val?.eq(sanitized?.tv || TokenValue.ZERO) ?? false;

    if (isSelected) {
      setValue(FormKeys.podLineLength, "");
      return;
    }

    if (increment === 0) {
      setValue(FormKeys.podLineLength, formatter.number(podLine, { minDecimals: 0, maxDecimals: 6 }));
    } else {
      setValue(FormKeys.podLineLength, formatter.number(calculated, { minDecimals: 0, maxDecimals: 6 }));
    }
  };

  const initialized = podLine.gt(0);

  return (
    <div className="flex justify-between gap-2 mt-1 w-full">
      {PODLINE_PCT_OPTIONS.map((option, i) => {
        const isActive =
          initialized && sanitized.tv ? sanitized.tv?.eq(presetValues[option.value] || TokenValue.ZERO) : false;
        return (
          <SelectionButton
            key={`podline-pct-option-${option.value}-${i.toString()}`}
            isActive={isActive}
            onClick={() => handlePodLineSelect(option.value)}
          >
            {option.label}
          </SelectionButton>
        );
      })}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// Morning Auction Preset Selection
// ────────────────────────────────────────────────────────────────────────────────

const morningAuctionOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
] as const;

const MorningAuctionSelection = () => {
  const { control, setValue } = useFormContext();

  const value = useWatch({ control, name: FormKeys.morningAuction });

  return (
    <Col className="gap-2">
      <label htmlFor={inputIds.morningAuction}>Execute during the Morning Auction</label>
      <div className="flex justify-between gap-2 w-full">
        {morningAuctionOptions.map((option) => (
          <SelectionButton
            key={`morning-auction-option-${option.value}`}
            isActive={value === option.value}
            onClick={() => {
              setValue(FormKeys.morningAuction, option.value);
            }}
          >
            {option.label}
          </SelectionButton>
        ))}
      </div>
    </Col>
  );
};

const FundOrderUsingTrigger = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { control } = useFormContext();
  const whitelistedTokens = useWhitelistedTokens();

  const strategy = useWatch({ control, name: FormKeys.tokenStrategy });
  const address = useWatch({ control, name: FormKeys.tokenAddress });

  // Add a function to get the selected token display text
  const getSelectedTokenDisplay = () => {
    if (strategy === "LOWEST_SEEDS") {
      return "Token with Least Seeds";
    } else if (strategy === "LOWEST_PRICE") {
      return "Token with Best Price";
    } else if (strategy === "SPECIFIC_TOKEN") {
      const token = whitelistedTokens.find((t) => t.address === address);
      return token?.symbol || "Select Token";
    }
    return "Select Deposited Silo Token";
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>Fund order using</div>
        <Button
          variant="outline-gray-shadow"
          size="xl"
          rounded="full"
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <div className="flex items-center gap-2">
            {strategy === "SPECIFIC_TOKEN" && (
              <IconImage
                src={whitelistedTokens.find((t) => t.address === address)?.logoURI || ""}
                alt="token"
                size={6}
                className="rounded-full"
              />
            )}
            <div className="pinto-body-light">{getSelectedTokenDisplay()}</div>
            <IconImage src={arrowDown} size={3} alt="open token select dialog" />
          </div>
        </Button>
      </div>
    </div>
  );
};

const FormErrors = () => {
  const {
    formState: { errors },
  } = useFormContext<FormSchema>();

  const allErrs = [
    ...new Set(
      Object.values(errors)
        .map((err) => err.message)
        .filter(Boolean) as string[],
    ),
  ];

  if (!allErrs.length) {
    return null;
  }

  return (
    <Col className="gap-2">
      {allErrs.map((eMessage) => (
        <div
          key={`sow-dialog-error-${eMessage}`}
          className="w-full p-3 bg-red-50 rounded-lg mb-1 flex items-center gap-3"
        >
          <WarningIcon color="#DC2626" width={24} height={24} />
          <span className="text-red-600 font-medium">{eMessage}</span>
        </div>
      ))}
    </Col>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// Dialog Components
// ────────────────────────────────────────────────────────────────────────────────

const TokenStrategyDialog = ({
  open,
  onOpenChange,
  priceData,
  farmerDeposits,
  swapResults,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceData: ReturnType<typeof usePriceData>;
  farmerDeposits: ReturnType<typeof useFarmerSilo>["deposits"];
  swapResults: Map<string, TokenValue>;
}) => {
  const whitelistedTokens = useWhitelistedTokens();

  const { setValue } = useFormContext<FormSchema>();

  const tokenStrategy = useWatch({ name: FormKeys.tokenStrategy });

  const tokenAddress = useWatch({ name: FormKeys.tokenAddress });

  const handleSetTokenStrategy = (strategy: SowOrderTokenStrategy["type"], address?: `0x${string}`) => {
    if (strategy === "SPECIFIC_TOKEN" && !address) {
      throw new Error("Token address is required for SPECIFIC_TOKEN strategy");
    }

    setValue(FormKeys.tokenStrategy, strategy);
    if (address) {
      setValue(FormKeys.tokenAddress, address);
    }

    onOpenChange(false);
  };

  if (!open) {
    return null;
  }

  return (
    // Token Selection Dialog
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 backdrop-blur-sm bg-black/30" />
        <DialogContent
          className="sm:max-w-[700px] mx-auto p-0 bg-white rounded-2xl border border-pinto-gray-2"
          style={{ padding: 0, gap: 0 }}
        >
          <div className="p-3">
            <DialogHeader className="mb-6 -mt-1">
              <DialogTitle className="font-medium mb-1 text-[1.25rem] tracking-normal">
                Select Token from Silo Deposits
              </DialogTitle>
              <DialogDescription className="text-gray-500 pb-1">
                Tractor allows you to fund Orders for Soil using Deposits
              </DialogDescription>
              <Separator />
            </DialogHeader>
            {/* Dynamic funding source options */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="text-gray-500">Dynamic funding source</div>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="flex items-center px-6 py-4 gap-2 rounded-[36px] cursor-pointer bg-[#F8F8F8] border border-pinto-gray-2"
                  onClick={() => handleSetTokenStrategy("LOWEST_PRICE")}
                >
                  <div
                    className={`w-10 h-10 rounded-full ${
                      tokenStrategy === "LOWEST_PRICE"
                        ? "bg-[#D8F1E2] border border-dashed border-[#387F5C]"
                        : "border border-pinto-gray-2"
                    }`}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-normal leading-[110%] text-black">Token with Best Price</span>
                    <span className="text-base font-normal leading-[110%] text-[#9C9C9C]">at time of execution</span>
                  </div>
                </div>
                <div
                  className="flex items-center px-6 py-4 gap-2 rounded-[36px] cursor-pointer bg-[#F8F8F8] border border-pinto-gray-2"
                  onClick={() => handleSetTokenStrategy("LOWEST_SEEDS")}
                >
                  <div
                    className={`w-10 h-10 rounded-full ${
                      tokenStrategy === "LOWEST_SEEDS"
                        ? "bg-[#D8F1E2] border border-dashed border-[#387F5C]"
                        : "border border-pinto-gray-2"
                    }`}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-normal leading-[110%] text-black">Token with Least Seeds</span>
                    <span className="text-base font-normal leading-[110%] text-[#9C9C9C]">at time of execution</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deposited Tokens */}
            <div className="flex flex-col gap-2">
              <div className="text-gray-500">Deposited Tokens</div>
              <div className="flex flex-col space-y-1 bg-white rounded-xl">
                {whitelistedTokens.map((token) => {
                  const deposit = farmerDeposits.get(token);
                  const amount = deposit?.amount || TokenValue.ZERO;

                  // Calculate dollar value - use price for PINTO, swap results for LP tokens
                  const pintoAmount =
                    token.symbol === "PINTO"
                      ? amount.mul(priceData.price)
                      : swapResults.get(token.address) || TokenValue.ZERO;

                  const isSelected = tokenStrategy === "SPECIFIC_TOKEN" && tokenAddress === token.address;

                  return (
                    <div
                      key={`sow-order-token-strategy-${token.address}`}
                      className={`flex items-center justify-between py-4 cursor-pointer rounded-lg ${
                        isSelected ? "bg-green-50" : "bg-white"
                      }`}
                      onClick={() => {
                        handleSetTokenStrategy("SPECIFIC_TOKEN", token.address as `0x${string}`);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <IconImage src={token.logoURI} alt={token.symbol} size={12} className="rounded-full" />
                        <div className="flex flex-col">
                          <div className="font-medium text-lg mb-1">{token.symbol}</div>
                          <div className="flex items-center text-xs text-gray-500 gap-1">
                            <IconImage src={stalkIcon} size={3} alt="Stalk" />{" "}
                            {formatter.number(deposit?.stalk?.total || 0)} Stalk
                            <IconImage src={seedIcon} size={3} alt="Seeds" className="ml-1" />{" "}
                            {formatter.number(deposit?.seeds || 0)} Seeds
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-right text-xl font-medium">
                          {amount.toNumber() > 0 && amount.toNumber() < 0.01
                            ? formatter.number(amount, { minDecimals: 4, maxDecimals: 8 })
                            : formatter.number(amount)}
                        </div>
                        <div className="text-right text-gray-500 text-sm">
                          ${formatter.number(pintoAmount, { minDecimals: 2, maxDecimals: 2 })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                <InfoOutlinedIcon width={14} height={14} />
                Deposits with the least Grown Stalk will always be used first
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// Shared Components
// ────────────────────────────────────────────────────────────────────────────────

const MainTokenIconSymbol = () => {
  const mainToken = useChainConstant(MAIN_TOKEN);

  return (
    <div className="flex items-center gap-2">
      <img src={mainToken.logoURI} alt={mainToken.symbol} className="w-6 h-6" />
      <span className="text-black">{mainToken.symbol}</span>
    </div>
  );
};

const SelectionButton = ({
  isActive,
  onClick,
  children,
}: { isActive: boolean; onClick: () => void; children: React.ReactNode }) => {
  return (
    <Button
      variant="outline-select"
      size="sm"
      rounded="full"
      selected={isActive}
      className="px-4 py-2 pinto-sm h-[2rem] sm:h-[2.25rem] flex-1"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </Button>
  );
};

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

// ────────────────────────────────────────────────────────────────────────────────
// Sow Order Dialog Hooks and Functions
// ────────────────────────────────────────────────────────────────────────────────

// Function to check if deposits are sorted from low stem to high stem
const getAreDepositsSorted = (deposits: DepositData[]): boolean => {
  if (!deposits || deposits.length <= 1) return true;

  for (let i = 1; i < deposits.length; i++) {
    const currentStem = deposits[i].stem.toBigInt();
    const previousStem = deposits[i - 1].stem.toBigInt();

    if (currentStem <= previousStem) {
      return false;
    }
  }

  return true;
};

const useSowOrderDialogData = (farmerDeposits: ReturnType<typeof useFarmerSilo>["deposits"]) => {
  // Check if all tokens have sorted deposits
  const allTokensSorted = useMemo(() => {
    if (!farmerDeposits || farmerDeposits.size === 0) return true;

    return Array.from(farmerDeposits.entries()).every(([_, depositData]) =>
      getAreDepositsSorted(depositData.deposits || []),
    );
  }, [farmerDeposits]);

  // Get a list of unsorted tokens and their deposit counts
  const unsortedTokensInfo = useMemo(() => {
    if (!farmerDeposits || farmerDeposits.size === 0) return [];

    return Array.from(farmerDeposits.entries())
      .filter(
        ([_, depositData]) => !getAreDepositsSorted(depositData.deposits || []) && depositData.deposits.length > 1,
      )
      .map(([token, depositData]) => ({
        token,
        depositCount: depositData.deposits.length,
      }));
  }, [farmerDeposits]);

  // Get a list of tokens that need combining
  const tokensThatNeedCombining = useMemo(() => {
    if (!farmerDeposits || farmerDeposits.size === 0) return [];

    return Array.from(farmerDeposits.entries())
      .filter(([_, depositData]) => depositData.deposits.length >= 25) // MIN_DEPOSITS_FOR_COMBINING
      .map(([token, depositData]) => ({
        token,
        depositCount: depositData.deposits.length,
      }));
  }, [farmerDeposits]);

  // Determine if deposits need to be optimized (either combined or sorted)
  const needsOptimization = useMemo(() => {
    return needsCombining(farmerDeposits) || !allTokensSorted;
  }, [farmerDeposits, allTokensSorted]);

  return {
    unsortedTokensInfo,
    tokensThatNeedCombining,
    needsOptimization,
  };
};

const useTokenWithHighestValue = ({
  farmerDeposits,
  price,
  swapResults,
}: {
  farmerDeposits: ReturnType<typeof useFarmerSilo>["deposits"];
  price: ReturnType<typeof usePriceData>["price"];
  swapResults: Map<string, TokenValue>;
}) => {
  const whitelistedTokens = useWhitelistedTokens();

  // Calculate the token with the highest dollar value
  const tokenWithHighestValue = useMemo(() => {
    let highestValue = TokenValue.ZERO;
    let tokenWithHighestValue: string | null = null;
    let tokenType: "SPECIFIC_TOKEN" | "LOWEST_SEEDS" = "LOWEST_SEEDS";

    // Check PINTO token first
    const pintoToken = whitelistedTokens.find((t) => t.symbol === "PINTO");
    if (pintoToken) {
      const pintoDeposit = farmerDeposits.get(pintoToken);
      if (pintoDeposit?.amount) {
        const pintoDollarValue = pintoDeposit.amount.mul(price);
        if (pintoDollarValue.gt(highestValue)) {
          highestValue = pintoDollarValue;
          tokenWithHighestValue = pintoToken.address;
          tokenType = "SPECIFIC_TOKEN";
        }
      }
    }

    // Check all LP tokens
    whitelistedTokens.forEach((token) => {
      if (token.isLP) {
        const lpDollarValue = swapResults.get(token.address);
        if (lpDollarValue && lpDollarValue.gt(highestValue)) {
          highestValue = lpDollarValue;
          tokenWithHighestValue = token.address;
          tokenType = "SPECIFIC_TOKEN";
        }
      }
    });

    // If no token has value, default to LOWEST_SEEDS
    if (!tokenWithHighestValue) {
      return { type: "LOWEST_SEEDS" } as SowOrderTokenStrategy;
    }

    // Return the token with highest value
    return {
      type: tokenType,
      address: tokenWithHighestValue as `0x${string}`,
    } as SowOrderTokenStrategy;
  }, [farmerDeposits, whitelistedTokens, price, swapResults]);

  return tokenWithHighestValue;
};

// ────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────────────────────────────────────

const PODLINE_PCT_OPTIONS = [
  { label: "5% ↑", value: 5 },
  { label: "10% ↑", value: 10 },
  { label: "25% ↑", value: 25 },
  { label: "50% ↑", value: 50 },
  { label: "100% ↑", value: 100 },
] as const;

const OPERATOR_TIP_OPTIONS = [
  { value: "down5", label: "5% ↓" },
  { value: "down1", label: "1% ↓" },
  { value: "average", label: "Average" },
  { value: "up1", label: "1% ↑" },
  { value: "up5", label: "5% ↑" },
] as const;

const FieldKeyToPairFieldKeys: Partial<Record<keyof typeof FormKeys, Array<keyof typeof FormKeys>>> = {
  [FormKeys.minSoil]: [FormKeys.maxPerSeason],
  [FormKeys.maxPerSeason]: [FormKeys.totalAmount, FormKeys.minSoil],
  [FormKeys.totalAmount]: [FormKeys.maxPerSeason],
  [FormKeys.tokenStrategy]: [FormKeys.tokenAddress],
} as const;

// // Add a function to get the dollar value for the selected strategy
// const getSelectedTokenDollarValue = () => {
//   if (selectedTokenStrategy.type === "SPECIFIC_TOKEN" && selectedTokenStrategy.address) {
//     const token = whitelistedTokens.find((t) => t.address === selectedTokenStrategy.address);

//     // If it's PINTO token, use its direct value multiplied by price
//     if (token?.symbol === "PINTO") {
//       const pintoDeposit = farmerDeposits.get(token);
//       return pintoDeposit?.amount ? pintoDeposit.amount.mul(priceData.price) : TokenValue.ZERO;
//     }

//     return swapResults.get(selectedTokenStrategy.address) || TokenValue.ZERO;
//   } else if (selectedTokenStrategy.type === "LOWEST_PRICE" || selectedTokenStrategy.type === "LOWEST_SEEDS") {
//     // Sum all token dollar values
//     let totalValue = TokenValue.ZERO;

//     // Include PINTO tokens in the calculation
//     const pintoToken = whitelistedTokens.find((t) => t.symbol === "PINTO");
//     if (pintoToken) {
//       const pintoDeposit = farmerDeposits.get(pintoToken);
//       if (pintoDeposit?.amount) {
//         totalValue = totalValue.add(pintoDeposit.amount.mul(priceData.price));
//       }
//     }

//     // Add all LP token values
//     swapResults.forEach((value) => {
//       totalValue = totalValue.add(value);
//     });

//     return totalValue;
//   }
//   return TokenValue.ZERO;
// };

// const validateAllInputs = (
//   minSoilAmount: string,
//   maxSeasonAmount: string,
//   totalSowAmount: string,
//   podLineLengthValue: string,
//   temperatureValue: string,
// ) => {
//   // Skip validation if required fields are empty
//   if (!minSoilAmount && !maxSeasonAmount && !totalSowAmount && !podLineLengthValue && !temperatureValue) {
//     setError(null);
//     return;
//   }

//   try {
//     // Validate min, max, and total amounts if available
//     if (minSoilAmount && maxSeasonAmount) {
//       const minClean = minSoilAmount.replace(/,/g, "");
//       const maxClean = maxSeasonAmount.replace(/,/g, "");

//       const min = TokenValue.fromHuman(minClean, PINTO.decimals);
//       const max = TokenValue.fromHuman(maxClean, PINTO.decimals);

//       if (min.gt(max)) {
//         setError("Min per Season must be less than or equal to Max per Season");
//         return;
//       }
//     }

//     if (minSoilAmount && totalSowAmount) {
//       const minClean = minSoilAmount.replace(/,/g, "");
//       const totalClean = totalSowAmount.replace(/,/g, "");

//       const min = TokenValue.fromHuman(minClean, PINTO.decimals);
//       const total = TokenValue.fromHuman(totalClean, PINTO.decimals);

//       if (min.gt(total)) {
//         setError("Min per Season cannot exceed the total amount to Sow");
//         return;
//       }
//     }

//     if (maxSeasonAmount && totalSowAmount) {
//       const maxClean = maxSeasonAmount.replace(/,/g, "");
//       const totalClean = totalSowAmount.replace(/,/g, "");

//       const max = TokenValue.fromHuman(maxClean, PINTO.decimals);
//       const total = TokenValue.fromHuman(totalClean, PINTO.decimals);

//       if (max.gt(total)) {
//         setError("Max per Season cannot exceed the total amount to Sow");
//         return;
//       }
//     }

//     // Validate pod line length if provided
//     if (podLineLengthValue) {
//       try {
//         const inputLength = parseFloat(podLineLengthValue.replace(/,/g, ""));
//         if (Number.isNaN(inputLength)) {
//           setError("Pod Line Length must be a valid number");
//           return;
//         }
//       } catch (e) {
//         setError("Invalid Pod Line Length");
//         return;
//       }
//     }

//     // Validate temperature if provided
//     if (temperatureValue) {
//       try {
//         const tempValue = parseFloat(temperatureValue.replace(/[%,]/g, ""));
//         if (Number.isNaN(tempValue)) {
//           setError("Temperature must be a valid number");
//           return;
//         }
//       } catch (e) {
//         setError("Invalid Temperature");
//         return;
//       }
//     }

//     // If we made it here, no errors were found
//     setError(null);
//   } catch (e) {
//     console.error("Validation error:", e);
//     setError("Invalid number format");
//   }
// };

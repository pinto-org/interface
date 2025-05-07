import { mockAddressAtom } from "@/Web3Provider";
import arrowDown from "@/assets/misc/ChevronDown.svg";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { InfoOutlinedIcon, WarningIcon } from "@/components/Icons";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import IconImage from "@/components/ui/IconImage";
import { diamondABI as beanstalkAbi } from "@/constants/abi/diamondABI";
import { PINTO } from "@/constants/tokens";
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
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { isValidAddress } from "@/utils/string";
import { DepositData } from "@/utils/types";
import { isLocalhost } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
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
import { Input } from "./ui/Input";
import { Separator } from "./ui/Separator";

interface SowOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderPublished?: () => void;
}

// 0.000001 is the min for PINTO input & temperature
const minInput = TokenValue.fromHuman(0.000001, 6);

export default function SowOrderDialog({ open, onOpenChange, onOrderPublished }: SowOrderDialogProps) {
  const podLine = usePodLine();
  const currentTemperature = useTemperature();
  const [podLineLength, setPodLineLength] = useState("");
  const [rawPodLineLength, setRawPodLineLength] = useState(""); // Track raw input
  const podLineLengthTimeoutRef = useRef<NodeJS.Timeout | null>(null); // For debounce
  const farmerSilo = useFarmerSilo();
  const farmerDeposits = farmerSilo.deposits;
  const { whitelistedTokens, mainToken } = useTokenData();
  const priceData = usePriceData();
  const [minSoil, setMinSoil] = useState("");
  const [maxPerSeason, setMaxPerSeason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState("");
  const [temperature, setTemperature] = useState("");
  const [displayTemperature, setDisplayTemperature] = useState("");
  const [morningAuction, setMorningAuction] = useState(false);
  const [operatorTip, setOperatorTip] = useState("1");
  const { address } = useAccount();
  const [loading, setLoading] = useState<string | null>(null);

  const handleClampAndToValidInput = (input: string, prevValue?: string) => {
    const parsed = input.replace(/[^0-9.,]/g, "");

    const split = parsed.split(".");
    // prevent multiple decimals of If input has gt 6 decimal places, prevent input
    if (split.length > 2 || (split.length === 2 && split[1].length > 6)) return prevValue;

    const newAmount = TokenValue.fromHuman(parsed || "0", 6);
    // if 0-ish amount, return the parsed value
    if (newAmount.eq(0)) return parsed;
    // if the amount is less than the min input, return the min input
    if (minInput.gt(newAmount)) {
      return minInput.toHuman();
    }

    // return the parsed value
    return parsed;
  };

  // Create a comprehensive validation function that handles all validation cases
  const validateAllInputs = (
    minSoilAmount: string,
    maxSeasonAmount: string,
    totalSowAmount: string,
    podLineLengthValue: string,
    temperatureValue: string,
  ) => {
    // Skip validation if required fields are empty
    if (!minSoilAmount && !maxSeasonAmount && !totalSowAmount && !podLineLengthValue && !temperatureValue) {
      setError(null);
      return;
    }

    try {
      // Validate min, max, and total amounts if available
      if (minSoilAmount && maxSeasonAmount) {
        const minClean = minSoilAmount.replace(/,/g, "");
        const maxClean = maxSeasonAmount.replace(/,/g, "");

        const min = TokenValue.fromHuman(minClean, PINTO.decimals);
        const max = TokenValue.fromHuman(maxClean, PINTO.decimals);

        if (min.gt(max)) {
          setError("Min per Season must be less than or equal to Max per Season");
          return;
        }
      }

      if (minSoilAmount && totalSowAmount) {
        const minClean = minSoilAmount.replace(/,/g, "");
        const totalClean = totalSowAmount.replace(/,/g, "");

        const min = TokenValue.fromHuman(minClean, PINTO.decimals);
        const total = TokenValue.fromHuman(totalClean, PINTO.decimals);

        if (min.gt(total)) {
          setError("Min per Season cannot exceed the total amount to Sow");
          return;
        }
      }

      if (maxSeasonAmount && totalSowAmount) {
        const maxClean = maxSeasonAmount.replace(/,/g, "");
        const totalClean = totalSowAmount.replace(/,/g, "");

        const max = TokenValue.fromHuman(maxClean, PINTO.decimals);
        const total = TokenValue.fromHuman(totalClean, PINTO.decimals);

        if (max.gt(total)) {
          setError("Max per Season cannot exceed the total amount to Sow");
          return;
        }
      }

      // Validate pod line length if provided
      if (podLineLengthValue) {
        try {
          const inputLength = parseFloat(podLineLengthValue.replace(/,/g, ""));
          if (Number.isNaN(inputLength)) {
            setError("Pod Line Length must be a valid number");
            return;
          }
        } catch (e) {
          setError("Invalid Pod Line Length");
          return;
        }
      }

      // Validate temperature if provided
      if (temperatureValue) {
        try {
          const tempValue = parseFloat(temperatureValue.replace(/[%,]/g, ""));
          if (Number.isNaN(tempValue)) {
            setError("Temperature must be a valid number");
            return;
          }
        } catch (e) {
          setError("Invalid Temperature");
          return;
        }
      }

      // If we made it here, no errors were found
      setError(null);
    } catch (e) {
      console.error("Validation error:", e);
      setError("Invalid number format");
    }
  };

  // Update the handleSetMinSoil function to use the new validation
  const handleSetMinSoil = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedAmount = handleClampAndToValidInput(e.target.value);
    if (validatedAmount !== undefined) {
      setMinSoil(validatedAmount);
      validateAllInputs(validatedAmount, maxPerSeason, totalAmount, podLineLength, temperature);
    }
  };

  // Update the handleSetMaxPerSeason function to use the new validation
  const handleSetMaxPerSeason = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedAmount = handleClampAndToValidInput(e.target.value);
    if (validatedAmount !== undefined) {
      setMaxPerSeason(validatedAmount);
      validateAllInputs(minSoil, validatedAmount, totalAmount, podLineLength, temperature);
    }
  };

  // Update the handleSetTotalAmount function to use the new validation
  const handleSetTotalAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedAmount = handleClampAndToValidInput(e.target.value);
    if (validatedAmount !== undefined) {
      setTotalAmount(validatedAmount);
      validateAllInputs(minSoil, maxPerSeason, validatedAmount, podLineLength, temperature);
    }
  };

  // Validate whenever any of the values changes
  useEffect(() => {
    validateAllInputs(minSoil, maxPerSeason, totalAmount, podLineLength, temperature);
  }, [minSoil, maxPerSeason, totalAmount, podLineLength, temperature]);

  // Set initial pod line length to current + 100% when component mounts
  // useEffect(() => {
  //   const increase = podLine.mul(100).div(100); // Calculate 100% increase
  //   const newValue = podLine.add(increase);
  //   const formattedValue = formatter.number(newValue);
  //   setPodLineLength(formattedValue);
  //   setRawPodLineLength(formattedValue.replace(/,/g, ""));
  // }, [podLine]); // Only run when podLine changes

  // Add a function to calculate what the value would be for a given percentage
  const calculatePodLineValue = (increment: number) => {
    const increase = podLine.mul(increment).div(100);
    const newValue = podLine.add(increase);
    return formatter.number(newValue);
  };

  // Add a function to check if a button should be highlighted
  const isButtonActive = (increment: number) => {
    return podLineLength === calculatePodLineValue(increment);
  };

  // Function to check if deposits are sorted from low stem to high stem
  const areDepositsSorted = (deposits: DepositData[]): boolean => {
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

  // Check if all tokens have sorted deposits
  const allTokensSorted = useMemo(() => {
    if (!farmerDeposits || farmerDeposits.size === 0) return true;

    return Array.from(farmerDeposits.entries()).every(([_, depositData]) =>
      areDepositsSorted(depositData.deposits || []),
    );
  }, [farmerDeposits]);

  // Get a list of unsorted tokens and their deposit counts
  const unsortedTokensInfo = useMemo(() => {
    if (!farmerDeposits || farmerDeposits.size === 0) return [];

    return Array.from(farmerDeposits.entries())
      .filter(([_, depositData]) => !areDepositsSorted(depositData.deposits || []) && depositData.deposits.length > 1)
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
  const temperatureInputRef = useRef<HTMLInputElement>(null);

  // Add these new declarations for combine and sort functionality
  const [sortingAllTokens, setSortingAllTokens] = useState(false);
  const publicClient = usePublicClient();
  const protocolAddress = useProtocolAddress();
  const queryClient = useQueryClient();
  const { data: walletClient } = useWalletClient();
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
        const pintoDollarValue = pintoDeposit.amount.mul(priceData.price);
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
  }, [farmerDeposits, whitelistedTokens, priceData.price, swapResults]);

  // Update the default token strategy
  const [selectedTokenStrategy, setSelectedTokenStrategy] = useState<SowOrderTokenStrategy>(tokenWithHighestValue);

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

  // Function to format number with commas
  const formatNumberWithCommas = (value: string) => {
    // Remove any existing commas
    const cleanValue = value.replace(/,/g, "");
    // Format with commas but preserve decimal portion
    const parts = cleanValue.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  // Handle debounced formatting for pod line length
  useEffect(() => {
    if (rawPodLineLength) {
      // Clear existing timeout
      if (podLineLengthTimeoutRef.current) {
        clearTimeout(podLineLengthTimeoutRef.current);
      }

      // Set new timeout
      podLineLengthTimeoutRef.current = setTimeout(() => {
        setPodLineLength(formatNumberWithCommas(rawPodLineLength));
      }, 500); // 500ms debounce
    }

    // Cleanup timeout on unmount
    return () => {
      if (podLineLengthTimeoutRef.current) {
        clearTimeout(podLineLengthTimeoutRef.current);
      }
    };
  }, [rawPodLineLength]);

  const handlePodLineSelect = (increment: number) => {
    // If the button is already active (same value), clear the input
    if (isButtonActive(increment)) {
      setPodLineLength("");
      setRawPodLineLength("");
      validateAllInputs(minSoil, maxPerSeason, totalAmount, "", temperature);
      return;
    }

    // Otherwise, set to the calculated value
    if (increment === 0) {
      // Set to current pod line length in human readable format
      const formattedValue = formatter.number(podLine);
      setPodLineLength(formattedValue);
      setRawPodLineLength(formattedValue.replace(/,/g, ""));
      validateAllInputs(minSoil, maxPerSeason, totalAmount, formattedValue, temperature);
    } else {
      // Calculate new value with percentage increase
      const increase = podLine.mul(increment).div(100);
      const newValue = podLine.add(increase);
      const formattedValue = formatter.number(newValue);
      setPodLineLength(formattedValue);
      setRawPodLineLength(formattedValue.replace(/,/g, ""));
      validateAllInputs(minSoil, maxPerSeason, totalAmount, formattedValue, temperature);
    }
  };

  // Add handling for pasting into the pod line length input
  const handlePodLineLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = handleClampAndToValidInput(e.target.value, podLineLength) ?? "";

    // Store raw input and update displayed value
    setRawPodLineLength(cleanValue);
    setPodLineLength(cleanValue);

    // Run validation
    validateAllInputs(minSoil, maxPerSeason, totalAmount, cleanValue, temperature);
  };

  // Add a function to check if the pod line length is valid
  const isPodLineLengthValid = () => {
    try {
      // Empty is not valid, we require a value
      if (!podLineLength) return false;

      // Remove commas and convert to a number
      const inputLength = parseFloat(podLineLength.replace(/,/g, ""));
      return !Number.isNaN(inputLength);
    } catch (e) {
      return false;
    }
  };

  // Add this function to check if all required fields are filled
  const areRequiredFieldsFilled = () => {
    return (
      temperature !== "" &&
      temperature !== undefined &&
      temperature !== null &&
      minSoil !== "" &&
      minSoil !== undefined &&
      minSoil !== null &&
      maxPerSeason !== "" &&
      maxPerSeason !== undefined &&
      maxPerSeason !== null &&
      totalAmount !== "" &&
      totalAmount !== undefined &&
      totalAmount !== null &&
      isPodLineLengthValid()
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
      if (areRequiredFieldsFilled() && !error) {
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
        tokenStrategy: selectedTokenStrategy,
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

  // Add a function to get the selected token display text
  const getSelectedTokenDisplay = () => {
    if (selectedTokenStrategy.type === "LOWEST_SEEDS") {
      return "Token with Least Seeds";
    } else if (selectedTokenStrategy.type === "LOWEST_PRICE") {
      return "Token with Best Price";
    } else if (selectedTokenStrategy.type === "SPECIFIC_TOKEN") {
      const token = whitelistedTokens.find((t) => t.address === selectedTokenStrategy.address);
      return token?.symbol || "Select Token";
    }
    return "Select Deposited Silo Token";
  };

  // Add a function to get the dollar value for the selected strategy
  const getSelectedTokenDollarValue = () => {
    if (selectedTokenStrategy.type === "SPECIFIC_TOKEN" && selectedTokenStrategy.address) {
      const token = whitelistedTokens.find((t) => t.address === selectedTokenStrategy.address);

      // If it's PINTO token, use its direct value multiplied by price
      if (token?.symbol === "PINTO") {
        const pintoDeposit = farmerDeposits.get(token);
        return pintoDeposit?.amount ? pintoDeposit.amount.mul(priceData.price) : TokenValue.ZERO;
      }

      return swapResults.get(selectedTokenStrategy.address) || TokenValue.ZERO;
    } else if (selectedTokenStrategy.type === "LOWEST_PRICE" || selectedTokenStrategy.type === "LOWEST_SEEDS") {
      // Sum all token dollar values
      let totalValue = TokenValue.ZERO;

      // Include PINTO tokens in the calculation
      const pintoToken = whitelistedTokens.find((t) => t.symbol === "PINTO");
      if (pintoToken) {
        const pintoDeposit = farmerDeposits.get(pintoToken);
        if (pintoDeposit?.amount) {
          totalValue = totalValue.add(pintoDeposit.amount.mul(priceData.price));
        }
      }

      // Add all LP token values
      swapResults.forEach((value) => {
        totalValue = totalValue.add(value);
      });

      return totalValue;
    }
    return TokenValue.ZERO;
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
    if (!totalAmount || !maxPerSeason) {
      return "~0";
    }

    try {
      // Remove commas and convert to numbers
      const totalClean = totalAmount.replace(/,/g, "");
      const minClean = minSoil ? minSoil.replace(/,/g, "") : "0";
      const maxClean = maxPerSeason.replace(/,/g, "");

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
    if (!operatorTip || !totalAmount || !maxPerSeason) {
      return "~0";
    }

    try {
      // Remove commas and convert to numbers
      const totalClean = totalAmount.replace(/,/g, "");
      const minClean = minSoil ? minSoil.replace(/,/g, "") : "0";
      const maxClean = maxPerSeason.replace(/,/g, "");

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

  // Function to handle temperature input and ensure it displays with %
  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the cursor position before making changes
    const cursorPosition = e.target.selectionStart || 0;
    const value = e.target.value;
    const hadPercentSign = value.includes("%");

    // Check if user is deleting the % sign
    if (value.endsWith("%") && cursorPosition === value.length) {
      // If cursor is at the end (after %), move it back one position
      setTimeout(() => {
        if (temperatureInputRef.current) {
          temperatureInputRef.current.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        }
      }, 0);
      return;
    }

    // Remove % and any non-numeric characters except decimal
    const cleanValue = handleClampAndToValidInput(value, temperature) ?? "";
    cleanValue && setTemperature(cleanValue); // Store clean value without %
    validateAllInputs(minSoil, maxPerSeason, totalAmount, podLineLength, cleanValue);

    // Add % for display
    const newDisplayValue = `${cleanValue}%`;
    setDisplayTemperature(newDisplayValue);

    // Calculate where the cursor should be
    let newPosition = cursorPosition;

    // If we're deleting a character (current value is shorter than previous + adjustment for % sign)
    if (cleanValue.length < temperature.length) {
      newPosition = cursorPosition;
    } else if (!hadPercentSign && cleanValue.length > 0) {
      // If we didn't have a % sign before but now we do, adjust accordingly
      newPosition = cursorPosition;
    }

    // Ensure cursor position is clamped to a valid range and before %
    newPosition = Math.min(newPosition, cleanValue.length);

    // Set cursor position with a timeout to ensure it happens after React's rendering
    setTimeout(() => {
      if (temperatureInputRef.current) {
        temperatureInputRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  // Function to handle temperature input blur
  const handleTemperatureBlur = () => {
    if (temperature) {
      setDisplayTemperature(`${temperature}%`);
    }
  };

  // Function to handle temperature input focus
  const handleTemperatureFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // If cursor is at the end, move it before the % sign
    if (e.target.value.endsWith("%")) {
      setTimeout(() => {
        if (temperatureInputRef.current) {
          const pos = e.target.value.length - 1;
          temperatureInputRef.current.setSelectionRange(pos, pos);
        }
      }, 0);
    }
  };

  // Function to handle temperature input keydown
  const handleTemperatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const cursorPosition = e.currentTarget.selectionStart || 0;
    const value = e.currentTarget.value;

    // If backspace is pressed and cursor is after the last number (right before or at %)
    if (e.key === "Backspace" && cursorPosition >= value.length - 1) {
      const newValue = temperature.slice(0, -1);
      setTemperature(newValue);
      setDisplayTemperature(newValue ? `${newValue}%` : "");

      // Position cursor at the end of the number portion
      setTimeout(() => {
        if (temperatureInputRef.current) {
          temperatureInputRef.current.setSelectionRange(newValue.length, newValue.length);
        }
      }, 0);

      e.preventDefault();
    }
    // If delete key is pressed and cursor is right before %
    else if (e.key === "Delete" && cursorPosition === value.length - 1) {
      e.preventDefault();
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

    if (!temperature || temperature === "") {
      missingFields.push("Temperature");
    }
    if (!minSoil || minSoil === "") {
      missingFields.push("Min Soil per Season");
    }
    if (!maxPerSeason || maxPerSeason === "") {
      missingFields.push("Max per Season");
    }
    if (!totalAmount || totalAmount === "") {
      missingFields.push("Total Amount");
    }
    if (!isPodLineLengthValidFn()) {
      missingFields.push("Pod Line Length");
    }

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
    <>
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
                    Pinto does not combine and sort deposits by default, due to gas costs. A one-time claim and combine
                    will optimize your deposits and allow you to create Tractor orders.
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

                  {/* I want to Sow up to */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor={inputIds.totalAmount}>I want to Sow up to</label>
                    <div className="flex rounded-lg overflow-hidden border border-pinto-gray-2 group focus-within:border-[#2F8957]">
                      <div className="flex-1">
                        <Input
                          id={inputIds.totalAmount}
                          className="h-12 px-3 py-1.5 border-0 rounded-l-lg flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="0.00"
                          value={totalAmount}
                          onChange={handleSetTotalAmount}
                          type="text"
                        />
                      </div>
                      <div className="flex items-center gap-2 px-4 bg-white">
                        <img src={pintoIcon} alt="PINTO" className="w-6 h-6" />
                        <span className="text-black">PINTO</span>
                      </div>
                    </div>
                  </div>

                  {/* Min and Max per Season - combined in a single row */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                      {/* Min per Season */}
                      <div className="flex flex-col gap-2 flex-1">
                        <label htmlFor={inputIds.minPerSeason}>Min per Season</label>
                        <div
                          className={`flex rounded-lg overflow-hidden border ${error ? "border-red-500" : "border-pinto-gray-2"} group focus-within:${error ? "border-red-500" : "border-[#2F8957]"}`}
                        >
                          <div className="flex-1">
                            <Input
                              id={inputIds.minPerSeason}
                              className="h-12 px-3 py-1.5 border-0 rounded-l-lg flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="0.00"
                              value={minSoil}
                              onChange={handleSetMinSoil}
                              type="text"
                            />
                          </div>
                          <div className="flex items-center gap-2 px-4 bg-white">
                            <img src={pintoIcon} alt="PINTO" className="w-6 h-6" />
                            <span className="text-black">PINTO</span>
                          </div>
                        </div>
                      </div>

                      {/* Max per Season */}
                      <div className="flex flex-col gap-2 flex-1">
                        <label htmlFor={inputIds.maxPerSeason}>Max per Season</label>
                        <div
                          className={`flex rounded-lg overflow-hidden border ${error ? "border-red-500" : "border-pinto-gray-2"} group focus-within:${error ? "border-red-500" : "border-[#2F8957]"}`}
                        >
                          <div className="flex-1">
                            <Input
                              id={inputIds.maxPerSeason}
                              className="h-12 px-3 py-1.5 border-0 rounded-l-lg flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="0.00"
                              value={maxPerSeason}
                              onChange={handleSetMaxPerSeason}
                              type="text"
                            />
                          </div>
                          <div className="flex items-center gap-2 px-4 bg-white">
                            <img src={pintoIcon} alt="PINTO" className="w-6 h-6" />
                            <span className="text-black">PINTO</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fund order using */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div>Fund order using</div>
                      <Button
                        variant="outline-gray-shadow"
                        size="xl"
                        rounded="full"
                        onClick={() => setShowTokenSelectionDialog(true)}
                      >
                        <div className="flex items-center gap-2">
                          {selectedTokenStrategy.type === "SPECIFIC_TOKEN" && (
                            <IconImage
                              src={
                                whitelistedTokens.find((t) => t.address === selectedTokenStrategy.address)?.logoURI ||
                                ""
                              }
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

                  {/* Execute when Temperature is at least */}
                  <div className="flex flex-row items-center justify-between gap-4">
                    <label htmlFor={inputIds.temperature}>Execute when Temperature is at least</label>
                    <Input
                      id={inputIds.temperature}
                      className="h-12 px-3 py-1.5 border border-pinto-gray-2 rounded-lg w-[140px]"
                      placeholder={`${Math.max(10, Math.floor(currentTemperature.scaled?.toNumber() || 0) + 1)}%`}
                      value={displayTemperature}
                      onChange={handleTemperatureChange}
                      onBlur={handleTemperatureBlur}
                      onFocus={handleTemperatureFocus}
                      onKeyDown={handleTemperatureKeyDown}
                      ref={temperatureInputRef}
                      type="text"
                    />
                  </div>

                  {/* Execute when the length of the Pod Line is at most */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor={inputIds.podLineLength}>Execute when the length of the Pod Line is at most</label>
                    <Input
                      id={inputIds.podLineLength}
                      className="h-12 px-3 py-1.5 border border-pinto-gray-2 rounded-lg"
                      placeholder={formatter.number(podLine)}
                      value={podLineLength}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/[^0-9.,]/g, "");

                        // Set raw value immediately to enable pasting
                        setRawPodLineLength(cleanValue);

                        // Set formatted value and validate
                        if (cleanValue) {
                          setPodLineLength(cleanValue);
                          validateAllInputs(minSoil, maxPerSeason, totalAmount, cleanValue, temperature);
                        } else {
                          setPodLineLength("");
                          validateAllInputs(minSoil, maxPerSeason, totalAmount, "", temperature);
                        }
                      }}
                    />

                    <div className="flex justify-between gap-2 mt-1 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] pinto-sm whitespace-nowrap ${
                          isButtonActive(5)
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        } flex-1`}
                        onClick={() => handlePodLineSelect(5)}
                      >
                        5% ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] pinto-sm whitespace-nowrap ${
                          isButtonActive(10)
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        } flex-1`}
                        onClick={() => handlePodLineSelect(10)}
                      >
                        10% ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] pinto-sm whitespace-nowrap ${
                          isButtonActive(25)
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        } flex-1`}
                        onClick={() => handlePodLineSelect(25)}
                      >
                        25% ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] pinto-sm whitespace-nowrap ${
                          isButtonActive(50)
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        } flex-1`}
                        onClick={() => handlePodLineSelect(50)}
                      >
                        50% ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] pinto-sm whitespace-nowrap ${
                          isButtonActive(100)
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        } flex-1`}
                        onClick={() => handlePodLineSelect(100)}
                      >
                        100% ↑
                      </Button>
                    </div>
                  </div>

                  {/* Execute during the Morning Auction */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor={inputIds.morningAuction}>Execute during the Morning Auction</label>
                    <div className="flex justify-between gap-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] pinto-sm whitespace-nowrap ${
                          morningAuction
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        } flex-1`}
                        onClick={() => setMorningAuction(true)}
                      >
                        Yes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] text-[1rem] pinto-sm whitespace-nowrap ${
                          !morningAuction
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        } flex-1`}
                        onClick={() => setMorningAuction(false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </Col>
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
                        value={operatorTip}
                        onChange={handleOperatorTipChange}
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
                          activeTipButton === "down5"
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        }`}
                        onClick={() => handleTipButtonClick("down5")}
                      >
                        5% ↓
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.inputs} ${
                          activeTipButton === "down1"
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        }`}
                        onClick={() => handleTipButtonClick("down1")}
                      >
                        1% ↓
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.inputs} ${
                          activeTipButton === "average"
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        }`}
                        onClick={() => handleTipButtonClick("average")}
                      >
                        Average
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.inputs} ${
                          activeTipButton === "up1"
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        }`}
                        onClick={() => handleTipButtonClick("up1")}
                      >
                        1% ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.inputs} ${
                          activeTipButton === "up5"
                            ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C] hover:bg-[#D8F1E2] hover:text-[#387F5C] hover:border-[#387F5C]"
                            : "bg-white border-pinto-gray-2 text-pinto-gray-4 hover:bg-pinto-green-1/50 hover:border-pinto-green-2/50"
                        }`}
                        onClick={() => handleTipButtonClick("up5")}
                      >
                        5% ↑
                      </Button>
                    </div>

                    <div className="text-[#9C9C9C] text-base font-light mb-32">
                      each time they Sow part of my Tractor Order.
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <div className="text-[#9C9C9C] text-base font-light">Estimated total number of executions</div>
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

              {/* Error message box */}
              {error && formStep === 1 && (
                <div className="w-full p-3 bg-red-50 rounded-lg mb-1 flex items-center gap-3">
                  <WarningIcon color="#DC2626" width={24} height={24} />
                  <span className="text-red-600 font-medium">
                    {error === "Min per Season must be less than or equal to Max per Season"
                      ? "Minimum per Season must be less than Maximum per Season"
                      : error}
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
                      formStep === 1 && (!areRequiredFieldsFilled() || !!error) ? (
                        <div className="p-1">
                          <div className="font-medium mb-1">Please fill in the following fields:</div>
                          <ul className="list-disc pl-4 text-sm">
                            {getMissingFields(
                              temperature,
                              minSoil,
                              maxPerSeason,
                              totalAmount,
                              isPodLineLengthValid,
                            ).map((field) => (
                              <li key={field}>{field}</li>
                            ))}
                            {error && <li className="text-red-500 mt-1">{error}</li>}
                          </ul>
                        </div>
                      ) : null
                    }
                    side="top"
                    align="center"
                    // Only show tooltip when there are missing fields or errors
                    disabled={!(formStep === 1 && (!areRequiredFieldsFilled() || !!error))}
                  >
                    <div className="flex-1">
                      <Button
                        size="xlargest"
                        rounded="full"
                        className={`w-full ${
                          (formStep === 1 && (!areRequiredFieldsFilled() || !!error)) || isLoading
                            ? "bg-pinto-gray-2 text-[#9C9C9C]"
                            : "bg-[#387F5C] text-white"
                        }`}
                        disabled={(formStep === 1 && (!areRequiredFieldsFilled() || !!error)) || isLoading}
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

      {/* Token Selection Dialog */}
      <Dialog open={showTokenSelectionDialog} onOpenChange={setShowTokenSelectionDialog}>
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
                    className={`flex items-center px-6 py-4 gap-2 rounded-[36px] cursor-pointer ${
                      selectedTokenStrategy.type === "LOWEST_PRICE"
                        ? "bg-[#F8F8F8] border border-pinto-gray-2"
                        : "bg-[#F8F8F8] border border-pinto-gray-2"
                    }`}
                    onClick={() => {
                      setSelectedTokenStrategy({ type: "LOWEST_PRICE" });
                      setShowTokenSelectionDialog(false);
                    }}
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${
                        selectedTokenStrategy.type === "LOWEST_PRICE"
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
                    className={`flex items-center px-6 py-4 gap-2 rounded-[36px] cursor-pointer ${
                      selectedTokenStrategy.type === "LOWEST_SEEDS"
                        ? "bg-[#F8F8F8] border border-pinto-gray-2"
                        : "bg-[#F8F8F8] border border-pinto-gray-2"
                    }`}
                    onClick={() => {
                      setSelectedTokenStrategy({ type: "LOWEST_SEEDS" });
                      setShowTokenSelectionDialog(false);
                    }}
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${
                        selectedTokenStrategy.type === "LOWEST_SEEDS"
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

                    const isSelected =
                      selectedTokenStrategy.type === "SPECIFIC_TOKEN" &&
                      selectedTokenStrategy.address === token.address;

                    return (
                      <div
                        key={token.address}
                        className={`flex items-center justify-between py-4 cursor-pointer rounded-lg ${
                          isSelected ? "bg-green-50" : "bg-white"
                        }`}
                        onClick={() => {
                          setSelectedTokenStrategy({
                            type: "SPECIFIC_TOKEN",
                            address: token.address as `0x${string}`,
                          });
                          setShowTokenSelectionDialog(false);
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

      {showReview && encodedData && operatorPasteInstructions && blueprint && (
        <ReviewTractorOrderDialog
          open={showReview}
          onOpenChange={setShowReview}
          onSuccess={() => onOpenChange(false)}
          onOrderPublished={onOrderPublished}
          orderData={{
            totalAmount,
            temperature,
            podLineLength,
            minSoil,
            operatorTip,
            tokenStrategy: selectedTokenStrategy.type,
            tokenSymbol:
              selectedTokenStrategy.type === "SPECIFIC_TOKEN"
                ? whitelistedTokens.find((t) => t.address === selectedTokenStrategy.address)?.symbol
                : undefined,
            morningAuction,
          }}
          encodedData={encodedData}
          operatorPasteInstrs={operatorPasteInstructions}
          blueprint={blueprint}
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

import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "./ui/Dialog";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { usePodLine } from "@/state/useFieldData";
import { TokenValue } from "@/classes/TokenValue";
import { useState, useMemo, useEffect, useRef } from "react";
import { formatter } from "@/utils/format";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import useTokenData from "@/state/useTokenData";
import useSwap from "@/hooks/swap/useSwap";
import { PINTO } from "@/constants/tokens";
import useBuildSwapQuote from "@/hooks/swap/useBuildSwapQuote";
import { FarmFromMode, FarmToMode } from "@/utils/types";
import IconImage from "@/components/ui/IconImage";
import { TokenStrategy, createSowTractorData } from "@/lib/Tractor/utils";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
import { createBlueprint } from "@/lib/Tractor/blueprint";
import { useGetBlueprintHash } from "@/lib/Tractor/blueprint";
import { toast } from "sonner";
import { useAccount, usePublicClient } from "wagmi";
import { isDev } from "@/utils/utils"; // Only used for pre-filling form data for faster developing, remove before prod
import { Blueprint } from "@/lib/Tractor/types";
import { InfoOutlinedIcon, WarningIcon } from "@/components/Icons";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import stalkIcon from "@/assets/protocol/Stalk.png";
import seedIcon from "@/assets/protocol/Seed.png";
import { usePriceData } from "@/state/usePriceData";

interface SowOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SowOrderDialog({ open, onOpenChange }: SowOrderDialogProps) {
  const podLine = usePodLine();
  const [podLineLength, setPodLineLength] = useState("");
  const [rawPodLineLength, setRawPodLineLength] = useState(""); // Track raw input
  const podLineLengthTimeoutRef = useRef<NodeJS.Timeout | null>(null); // For debounce
  const farmerSilo = useFarmerSiloNew();
  const farmerDeposits = farmerSilo.deposits;
  const { whitelistedTokens } = useTokenData();
  const priceData = usePriceData();
  const [minSoil, setMinSoil] = useState("");
  const [maxPerSeason, setMaxPerSeason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState("");
  const [temperature, setTemperature] = useState("");
  const [morningAuction, setMorningAuction] = useState(false);
  const [operatorTip, setOperatorTip] = useState("1");
  const { address } = useAccount();
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [encodedData, setEncodedData] = useState<`0x${string}` | null>(null);
  const [operatorPasteInstructions, setOperatorPasteInstructions] = useState<`0x${string}`[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();
  const [showTokenSelectionDialog, setShowTokenSelectionDialog] = useState(false);
  const [runBlocksAfterSunrise, setRunBlocksAfterSunrise] = useState("0");
  const [operatorAddress, setOperatorAddress] = useState("");
  const [whitelistedOperators, setWhitelistedOperators] = useState<`0x${string}`[]>([]);

  // Get LP tokens
  const lpTokens = useMemo(() => whitelistedTokens.filter((t) => t.isLP), [whitelistedTokens]);

  // Create swap hooks for each LP token
  const swapQuotes = lpTokens.map((token) => {
    const amount = farmerDeposits.get(token)?.amount || TokenValue.ZERO;
    return useSwap({
      tokenIn: token,
      tokenOut: PINTO,
      amountIn: amount,
      slippage: 0.5,
      disabled: amount.eq(0), // Only enable if there's an amount to swap
    });
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

  // Update the default token strategy
  const [selectedTokenStrategy, setSelectedTokenStrategy] = useState<TokenStrategy>({
    type: "LOWEST_SEEDS", // Default to pure PINTO
  });

  // Add state for the review dialog
  const [showReview, setShowReview] = useState(false);

  // Function to format number with commas
  const formatNumberWithCommas = (value: string) => {
    // Remove any existing commas
    const cleanValue = value.replace(/,/g, "");
    // Format with commas but preserve decimal portion
    const parts = cleanValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
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
    if (increment === 0) {
      // Set to current pod line length in human readable format
      const formattedValue = formatter.number(podLine);
      setPodLineLength(formattedValue);
      setRawPodLineLength(formattedValue.replace(/,/g, ""));
    } else {
      // Calculate new value with percentage increase
      const increase = podLine.mul(increment).div(100);
      const newValue = podLine.add(increase);
      const formattedValue = formatter.number(newValue);
      setPodLineLength(formattedValue);
      setRawPodLineLength(formattedValue.replace(/,/g, ""));
    }
  };

  // Validation function
  const validateSoilAmounts = (minSoilAmount: string, maxSeasonAmount: string) => {
    if (!minSoilAmount || !maxSeasonAmount) return;

    try {
      // Remove commas and convert to numbers first
      const minClean = minSoilAmount.replace(/,/g, "");
      const maxClean = maxSeasonAmount.replace(/,/g, "");

      const min = TokenValue.fromHuman(minClean, PINTO.decimals);
      const max = TokenValue.fromHuman(maxClean, PINTO.decimals);

      if (min.gt(max)) {
        setError("Available Soil must be greater than or equal to Max amount per Season");
      } else {
        setError(null);
      }
    } catch (e) {
      console.error("Validation error:", e);
      setError("Invalid number format");
    }
  };

  // Validate whenever either value changes
  useEffect(() => {
    validateSoilAmounts(minSoil, maxPerSeason);
  }, [minSoil, maxPerSeason]);

  // Set initial pod line length to current + 100% when component mounts
  useEffect(() => {
    const increase = podLine.mul(100).div(100); // Calculate 100% increase
    const newValue = podLine.add(increase);
    const formattedValue = formatter.number(newValue);
    setPodLineLength(formattedValue);
    setRawPodLineLength(formattedValue.replace(/,/g, ""));
  }, [podLine]); // Only run when podLine changes

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

  // Update the dev mode defaults
  useEffect(() => {
    if (isDev()) {
      // Generate random numbers within specified ranges
      const randomTotal = Math.floor(Math.random() * (10000 - 1000) + 1000);
      const randomTemp = Math.floor(Math.random() * (900-100) + 100);
      const randomMaxSeason = Math.floor(Math.random() * (1000 - 500) + 500);
      const randomMinSoil = Math.floor(Math.random() * (100 - 50) + 50);
      const randomPodLineLength = Math.floor(Math.random() * (70000000 - 35000000) + 35000000);

      setTotalAmount(randomTotal.toString());
      setTemperature(randomTemp.toString());
      setPodLineLength(randomPodLineLength.toString());
      setMinSoil(randomMinSoil.toString());
      setOperatorTip("0.1");
      setMaxPerSeason(randomMaxSeason.toString());
      setSelectedTokenStrategy({ type: "LOWEST_SEEDS" });
    }
  }, [isDev]);

  // Add this function to check if the pod line length is valid
  const isPodLineLengthValid = () => {
    try {
      // Remove commas and convert to a number
      const inputLength = parseFloat(podLineLength.replace(/,/g, ""));
      const currentLength = parseFloat(formatter.number(podLine).replace(/,/g, ""));

      return !Number.isNaN(inputLength) && inputLength > currentLength;
    } catch (e) {
      return false;
    }
  };

  const handleNext = async () => {
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
        maxPodlineLength: podLineLength || "0",
        maxGrownStalkPerBdv: "10000000000000000", // default of 100 grown stalk per bdv, which would take about 21 years at 4 seeds. TODO: add input for this in the future
        runBlocksAfterSunrise: runBlocksAfterSunrise || "0",
        operatorTip: operatorTip || "0",
        whitelistedOperators: whitelistedOperators,
        tokenStrategy: selectedTokenStrategy,
        publicClient,
      });

      console.log("createSowTractorData, data:", data);
      console.log("rawCall:", rawCall);

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

  // Add a function to get the selected token display text
  const getSelectedTokenDisplay = () => {
    if (selectedTokenStrategy.type === "LOWEST_SEEDS") {
      return "Token with Least Seeds";
    } else if (selectedTokenStrategy.type === "LOWEST_PRICE") {
      return "Token with Best Price";
    } else if (selectedTokenStrategy.type === "SPECIFIC_TOKEN") {
      const token = whitelistedTokens.find(t => t.address === selectedTokenStrategy.address);
      return token?.symbol || "Select Token";
    }
    return "Select Deposited Silo Token";
  };

  // Add a function to get the dollar value for the selected strategy
  const getSelectedTokenDollarValue = () => {
    if (selectedTokenStrategy.type === "SPECIFIC_TOKEN" && selectedTokenStrategy.address) {
      const token = whitelistedTokens.find(t => t.address === selectedTokenStrategy.address);
      
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
      const pintoToken = whitelistedTokens.find(t => t.symbol === "PINTO");
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

  if (!open) return null;

  const inputIds = {
    totalAmount: "total-amount-input",
    minPerSeason: "min-per-season-input",
    maxPerSeason: "max-per-season-input",
    fundOrder: "fund-order-select",
    temperature: "temperature-input",
    podLineLength: "pod-line-length-input",
    morningAuction: "morning-auction-input",
    operatorTip: "operator-tip-input",
    runBlocksAfterSunrise: "run-blocks-after-sunrise-input",
    operatorAddress: "operator-address-input",
  };

  return (
    <>
      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex flex-col gap-9 flex-1">
            {/* Title */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row items-center gap-6">
                  <h2 className="font-antarctica font-medium text-[20px] leading-[115%] text-black">
                    Create an Order to Sow automatically
                  </h2>
                </div>
                <div className="w-full h-[1px] bg-[#D9D9D9]" />
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-6 flex-1">
              {/* I want to Sow up to */}
              <div className="flex flex-col gap-2">
                <label htmlFor={inputIds.totalAmount} className="text-[#9C9C9C] text-base font-light">
                  I want to Sow up to
                </label>
                <div className="flex items-center border border-[#D9D9D9] rounded-xl bg-white">
                  <Input
                    id={inputIds.totalAmount}
                    className="h-12 px-3 py-1.5 border-0 rounded-l-xl flex-1"
                    placeholder="0.00"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                    type="text"
                  />
                  <div className="flex items-center gap-2 px-4">
                    <img src="/src/assets/tokens/PINTO.png" alt="PINTO" className="w-6 h-6" />
                    <span className="text-black">PINTO</span>
                  </div>
                </div>
              </div>

              {/* Fund order using */}
              <div className="flex flex-col gap-2">
                <label htmlFor={inputIds.fundOrder} className="text-[#9C9C9C] text-base font-light">
                  Fund order using
                </label>
                <button
                  className="flex items-center justify-between h-12 px-4 py-3 border border-[#D9D9D9] rounded-xl bg-white"
                  onClick={() => setShowTokenSelectionDialog(true)}
                >
                  <div className="flex items-center gap-2">
                    {selectedTokenStrategy.type === "SPECIFIC_TOKEN" && (
                      <IconImage 
                        src={whitelistedTokens.find(t => t.address === selectedTokenStrategy.address)?.logoURI || ""} 
                        alt="token" 
                        size={6} 
                        className="rounded-full"
                      />
                    )}
                    <span className="text-[#404040]">{getSelectedTokenDisplay()}</span>
                    {getSelectedTokenDollarValue().gt(0) && (
                      <span className="text-[#9C9C9C] text-sm">
                        (${formatter.number(getSelectedTokenDollarValue(), { minDecimals: 2, maxDecimals: 2 })})
                      </span>
                    )}
                  </div>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#404040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Execute if Available Soil is at least */}
              <div className="flex flex-col gap-2">
                <label htmlFor={inputIds.minPerSeason} className="text-[#9C9C9C] text-base font-light">
                  Execute if Available Soil is at least
                </label>
                <Input
                  id={inputIds.minPerSeason}
                  className={`h-12 px-3 py-1.5 border ${error ? "border-red-500" : "border-[#D9D9D9]"} rounded-xl`}
                  placeholder="0.00"
                  value={minSoil}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.,]/g, "");
                    setMinSoil(value);
                  }}
                  type="text"
                />
              </div>

              {/* Max amount to sow per Season */}
              <div className="flex flex-col gap-2">
                <label htmlFor={inputIds.maxPerSeason} className="text-[#9C9C9C] text-base font-light">
                  Max amount to sow per Season
                </label>
                <div className="flex items-center border border-[#D9D9D9] rounded-xl bg-white">
                  <Input
                    id={inputIds.maxPerSeason}
                    className={`h-12 px-3 py-1.5 border-0 rounded-l-xl flex-1 ${error ? "border-red-500" : ""}`}
                    placeholder="0.00"
                    value={maxPerSeason}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.,]/g, "");
                      setMaxPerSeason(value);
                    }}
                    type="text"
                  />
                </div>
              </div>

              {/* Error message */}
              {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

              {/* Execute when Temperature is at least */}
              <div className="flex flex-col gap-2">
                <label htmlFor={inputIds.temperature} className="text-[#9C9C9C] text-base font-light">
                  Execute when Temperature is at least
                </label>
                <Input
                  id={inputIds.temperature}
                  className="h-12 px-3 py-1.5 border border-[#D9D9D9] rounded-xl"
                  placeholder="400%"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value.replace(/[^0-9.,]/g, ""))}
                  type="text"
                />
              </div>

              {/* Execute when the length of the Pod Line is at most */}
              <div className="flex flex-col gap-2">
                <label htmlFor={inputIds.podLineLength} className="text-[#9C9C9C] text-base font-light">
                  Execute when the length of the Pod Line is at most
                </label>
                <Input
                  id={inputIds.podLineLength}
                  className={`h-12 px-3 py-1.5 border ${
                    !isPodLineLengthValid() ? "border-red-500" : "border-[#D9D9D9]"
                  } rounded-xl`}
                  placeholder="9,000,000"
                  value={podLineLength}
                  onChange={(e) => {
                    // Allow numbers, commas, and at most one decimal point
                    const value = e.target.value.replace(/[^\d,\.]/g, "");
                    // Ensure at most one decimal point
                    const decimalCount = (value.match(/\./g) || []).length;
                    const sanitizedValue = decimalCount > 1 
                      ? value.replace(/\./g, (match, index) => index === value.indexOf('.') ? match : '')
                      : value;
                    
                    // Store raw input and update displayed value
                    setRawPodLineLength(sanitizedValue.replace(/,/g, ""));
                    setPodLineLength(sanitizedValue);
                  }}
                />
                {!isPodLineLengthValid() && (
                  <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-lg flex items-start gap-2">
                    <WarningIcon color="#DC2626" width={25} height={25} />
                    <span>
                      Pod Line is length is {formatter.number(podLine)}, this order cannot execute under current
                      conditions.
                    </span>
                  </div>
                )}
                <div className="flex justify-between gap-2 mt-1 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full px-4 py-2 ${
                      isButtonActive(5)
                        ? "bg-gradient-to-r from-[#46A955] to-[#1F9C5A] text-white border-transparent"
                        : "bg-pinto-off-white border-pinto-gray-2 text-pinto-gray-4"
                    } flex-1`}
                    onClick={() => handlePodLineSelect(5)}
                  >
                    5% ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full px-4 py-2 ${
                      isButtonActive(10)
                        ? "bg-gradient-to-r from-[#46A955] to-[#1F9C5A] text-white border-transparent"
                        : "bg-pinto-off-white border-pinto-gray-2 text-pinto-gray-4"
                    } flex-1`}
                    onClick={() => handlePodLineSelect(10)}
                  >
                    10% ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full px-4 py-2 ${
                      isButtonActive(25)
                        ? "bg-gradient-to-r from-[#46A955] to-[#1F9C5A] text-white border-transparent"
                        : "bg-pinto-off-white border-pinto-gray-2 text-pinto-gray-4"
                    } flex-1`}
                    onClick={() => handlePodLineSelect(25)}
                  >
                    25% ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full px-4 py-2 ${
                      isButtonActive(50)
                        ? "bg-gradient-to-r from-[#46A955] to-[#1F9C5A] text-white border-transparent"
                        : "bg-pinto-off-white border-pinto-gray-2 text-pinto-gray-4"
                    } flex-1`}
                    onClick={() => handlePodLineSelect(50)}
                  >
                    50% ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full px-4 py-2 ${
                      isButtonActive(100)
                        ? "bg-gradient-to-r from-[#46A955] to-[#1F9C5A] text-white border-transparent"
                        : "bg-pinto-off-white border-pinto-gray-2 text-pinto-gray-4"
                    } flex-1`}
                    onClick={() => handlePodLineSelect(100)}
                  >
                    100% ↑
                  </Button>
                </div>
              </div>

              {/* Execute during the Morning Auction */}
              <div className="flex flex-col gap-2">
                <label htmlFor={inputIds.morningAuction} className="text-[#9C9C9C] text-base font-light">
                  Execute during the Morning Auction
                </label>
                <div className="flex justify-between gap-2 w-full">
                  <Button
                    variant="outline"
                    className={`rounded-full px-4 py-2 flex-1 ${
                      morningAuction
                        ? "bg-gradient-to-r from-[#46A955] to-[#1F9C5A] text-white"
                        : "bg-pinto-off-white border-pinto-gray-2 text-pinto-gray-4"
                    }`}
                    onClick={() => setMorningAuction(true)}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    className={`rounded-full px-4 py-2 flex-1 ${
                      !morningAuction
                        ? "bg-gradient-to-r from-[#46A955] to-[#1F9C5A] text-white"
                        : "bg-pinto-off-white border-pinto-gray-2 text-pinto-gray-4"
                    }`}
                    onClick={() => setMorningAuction(false)}
                  >
                    No
                  </Button>
                </div>
              </div>

              {/* Run Blocks After Sunrise */}
              <div className="flex flex-col gap-2">
                <label htmlFor={inputIds.runBlocksAfterSunrise} className="text-[#9C9C9C] text-base font-light">
                  Run Blocks After Sunrise
                </label>
                <Input
                  id={inputIds.runBlocksAfterSunrise}
                  className="h-12 px-3 py-1.5 border border-[#D9D9D9] rounded-xl"
                  placeholder="0"
                  value={runBlocksAfterSunrise}
                  onChange={(e) => setRunBlocksAfterSunrise(e.target.value.replace(/[^0-9]/g, ""))}
                  type="text"
                />
              </div>

              {/* Operator Whitelist */}
              <div className="flex flex-col gap-2">
                <label htmlFor={inputIds.operatorAddress} className="text-[#9C9C9C] text-base font-light">
                  Add Operator Address
                </label>
                <div className="flex gap-2">
                  <Input
                    id={inputIds.operatorAddress}
                    className="h-12 px-3 py-1.5 border border-[#D9D9D9] rounded-xl flex-1"
                    placeholder="0x..."
                    value={operatorAddress}
                    onChange={(e) => setOperatorAddress(e.target.value)}
                    type="text"
                  />
                  <Button
                    variant="outline"
                    className="h-12 px-4 py-2 rounded-xl bg-gradient-to-r from-[#46A955] to-[#1F9C5A] text-white"
                    onClick={() => {
                      if (operatorAddress && operatorAddress.startsWith("0x") && operatorAddress.length === 42) {
                        setWhitelistedOperators([...whitelistedOperators, operatorAddress as `0x${string}`]);
                        setOperatorAddress("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {whitelistedOperators.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {whitelistedOperators.map((address, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm font-mono">{address}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setWhitelistedOperators(whitelistedOperators.filter((_, i) => i !== index));
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* After Morning Auction buttons */}
              <div className="flex flex-col gap-2">
                <label htmlFor={inputIds.operatorTip} className="text-[#9C9C9C] text-base font-light">
                  Operator Tip
                </label>
                <div className="flex items-center border border-[#D9D9D9] rounded-xl bg-white">
                  <Input
                    id={inputIds.operatorTip}
                    className="h-12 px-3 py-1.5 border-0 rounded-l-xl flex-1"
                    placeholder="0.00"
                    value={operatorTip}
                    onChange={(e) => setOperatorTip(e.target.value.replace(/[^0-9.,]/g, ""))}
                    type="text"
                  />
                  <div className="flex items-center gap-2 px-4">
                    <img src="/src/assets/tokens/PINTO.png" alt="PINTO" className="w-6 h-6" />
                    <span className="text-black">PINTO</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 h-[60px] rounded-full text-2xl font-medium text-[#404040] bg-[#F8F8F8]"
                  onClick={() => onOpenChange(false)}
                >
                  ← Back
                </Button>
                <Button
                  className={`flex-1 h-[60px] rounded-full text-2xl font-medium ${
                    error || !isPodLineLengthValid()
                      ? "bg-[#D9D9D9] text-[#9C9C9C]"
                      : "bg-gradient-to-r from-[#46A955] to-[#1F9C5A] text-white"
                  }`}
                  disabled={!!error || !isPodLineLengthValid() || isLoading}
                  onClick={handleNext}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                    </div>
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Selection Dialog */}
      <Dialog open={showTokenSelectionDialog} onOpenChange={setShowTokenSelectionDialog}>
        <DialogPortal>
          <DialogOverlay className="backdrop-blur-sm bg-black/30" />
          <DialogContent className="sm:max-w-[700px] mx-auto p-0 bg-white rounded-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-antarctica font-medium text-[20px] leading-[115%] text-black">
                  Select Token from Silo Deposits
                </h2>
              </div>
              <p className="text-gray-500 mb-6">Tractor allows you to fund Orders for Soil using Deposits</p>
              
              {/* Dynamic funding source options */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="text-gray-500">Dynamic funding source</div>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`flex items-center px-6 py-4 gap-2 rounded-[36px] cursor-pointer ${
                      selectedTokenStrategy.type === "LOWEST_PRICE" 
                        ? "bg-[#F8F8F8] border border-[#D9D9D9]" 
                        : "bg-[#F8F8F8] border border-[#D9D9D9]"
                    }`}
                    onClick={() => {
                      setSelectedTokenStrategy({ type: "LOWEST_PRICE" });
                      setShowTokenSelectionDialog(false);
                    }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedTokenStrategy.type === "LOWEST_PRICE" 
                        ? "bg-[#D8F1E2] border border-dashed border-[#387F5C]" 
                        : "border border-[#D9D9D9]"
                    }`}>
                      {selectedTokenStrategy.type === "LOWEST_PRICE" && (
                        <div className="w-3 h-3 bg-[#387F5C] rounded-full"></div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-antarctica text-base font-normal leading-[110%] text-black">Token with Best Price</span>
                      <span className="font-antarctica text-base font-normal leading-[110%] text-[#9C9C9C]">at time of execution</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-center px-6 py-4 gap-2 rounded-[36px] cursor-pointer ${
                      selectedTokenStrategy.type === "LOWEST_SEEDS" 
                        ? "bg-[#F8F8F8] border border-[#D9D9D9]" 
                        : "bg-[#F8F8F8] border border-[#D9D9D9]"
                    }`}
                    onClick={() => {
                      setSelectedTokenStrategy({ type: "LOWEST_SEEDS" });
                      setShowTokenSelectionDialog(false);
                    }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedTokenStrategy.type === "LOWEST_SEEDS" 
                        ? "bg-[#D8F1E2] border border-dashed border-[#387F5C]" 
                        : "border border-[#D9D9D9]"
                    }`}>
                      {selectedTokenStrategy.type === "LOWEST_SEEDS" && (
                        <div className="w-3 h-3 bg-[#387F5C] rounded-full"></div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-antarctica text-base font-normal leading-[110%] text-black">Token with Least Seeds</span>
                      <span className="font-antarctica text-base font-normal leading-[110%] text-[#9C9C9C]">at time of execution</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Deposited Tokens */}
              <div className="flex flex-col gap-2">
                <div className="text-gray-500">Deposited Tokens</div>
                <div className="flex flex-col divide-y border rounded-xl">
                  {whitelistedTokens.map((token) => {
                    const deposit = farmerDeposits.get(token);
                    const amount = deposit?.amount || TokenValue.ZERO;
                    
                    // Calculate dollar value - use price for PINTO, swap results for LP tokens
                    const pintoAmount = token.symbol === "PINTO" 
                      ? amount.mul(priceData.price) 
                      : swapResults.get(token.address) || TokenValue.ZERO;
                      
                    const isSelected = selectedTokenStrategy.type === "SPECIFIC_TOKEN" && 
                                      selectedTokenStrategy.address === token.address;

                    return (
                      <div 
                        key={token.address}
                        className={`flex items-center justify-between p-4 cursor-pointer ${
                          isSelected ? "bg-green-50" : ""
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
                            <div className="font-medium">{token.symbol}</div>
                            <div className="flex items-center text-xs text-gray-500 gap-1">
                              <IconImage src={stalkIcon} size={3} alt="Stalk" /> {formatter.number(deposit?.stalk?.total || 0)} Stalk 
                              <IconImage src={seedIcon} size={3} alt="Seeds" className="ml-1" /> {formatter.number(deposit?.seeds || 0)} Seeds
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

      {showReview && encodedData && operatorPasteInstructions && (
        <ReviewTractorOrderDialog
          open={showReview}
          onOpenChange={setShowReview}
          onSuccess={() => onOpenChange(false)}
          orderData={{
            totalAmount,
            temperature,
            podLineLength,
            minSoil,
            operatorTip,
            tokenStrategy: selectedTokenStrategy.type,
            tokenSymbol: selectedTokenStrategy.type === "SPECIFIC_TOKEN" 
              ? whitelistedTokens.find(t => t.address === selectedTokenStrategy.address)?.symbol 
              : undefined
          }}
          encodedData={encodedData}
          operatorPasteInstrs={operatorPasteInstructions}
          blueprint={blueprint!}
        />
      )}
    </>
  );
}

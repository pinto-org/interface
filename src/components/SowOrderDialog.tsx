import { Dialog, DialogContent, DialogPortal } from "./ui/Dialog";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { usePodLine } from "@/state/useFieldData";
import { TokenValue } from "@/classes/TokenValue";
import { useState, useMemo, useEffect } from "react";
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
import { useAccount } from "wagmi";
import { isDev } from "@/utils/utils"; // Only used for pre-filling form data for faster developing, remove before prod
import { Blueprint } from "@/lib/Tractor/types";

interface SowOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SowOrderDialog({
  open,
  onOpenChange,
}: SowOrderDialogProps) {
  const podLine = usePodLine();
  const [podLineLength, setPodLineLength] = useState("");
  const farmerSilo = useFarmerSiloNew();
  const farmerDeposits = farmerSilo.deposits;
  const { whitelistedTokens } = useTokenData();
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
  const [operatorPasteInstructions, setOperatorPasteInstructions] = useState<
    `0x${string}`[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get LP tokens
  const lpTokens = useMemo(
    () => whitelistedTokens.filter((t) => t.isLP),
    [whitelistedTokens]
  );

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
  const [selectedTokenStrategy, setSelectedTokenStrategy] =
    useState<TokenStrategy>({
      type: "LOWEST_SEEDS", // Default to pure PINTO
    });

  // Add state for the review dialog
  const [showReview, setShowReview] = useState(false);

  const handlePodLineSelect = (increment: number) => {
    if (increment === 0) {
      // Set to current pod line length in human readable format
      setPodLineLength(formatter.number(podLine));
    } else {
      // Calculate new value with percentage increase
      const increase = podLine.mul(increment).div(100);
      const newValue = podLine.add(increase);
      setPodLineLength(formatter.number(newValue));
    }
  };

  // Validation function
  const validateSoilAmounts = (
    minSoilAmount: string,
    maxSeasonAmount: string
  ) => {
    if (!minSoilAmount || !maxSeasonAmount) return;

    try {
      // Remove commas and convert to numbers first
      const minClean = minSoilAmount.replace(/,/g, "");
      const maxClean = maxSeasonAmount.replace(/,/g, "");

      const min = TokenValue.fromHuman(minClean, PINTO.decimals);
      const max = TokenValue.fromHuman(maxClean, PINTO.decimals);

      if (min.gt(max)) {
        setError(
          "Available Soil must be greater than or equal to Max amount per Season"
        );
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
    setPodLineLength(formatter.number(newValue));
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
      setTotalAmount("1000");
      setTemperature("20");
      setPodLineLength("100");
      setMinSoil("1000");
      setOperatorTip("1");
      setMaxPerSeason("1000");
      setSelectedTokenStrategy({ type: "LOWEST_SEEDS" });
    }
  }, [isDev]);

  const handleNext = async () => {
    try {
      console.time("handleNext total");
      setIsLoading(true);

      console.time("createSowTractorData");
      const { data, operatorPasteInstrs } = createSowTractorData({
        totalAmountToSow: totalAmount || "0",
        temperature: temperature || "0",
        minAmountPerSeason: minSoil || "0",
        maxAmountToSowPerSeason: maxPerSeason || "0",
        maxPodlineLength: podLineLength || "0",
        maxGrownStalkPerBdv: "10000000000000",
        runBlocksAfterSunrise: "0",
        operatorTip: operatorTip || "0",
        whitelistedOperators: [],
        tokenStrategy: selectedTokenStrategy,
      });
      console.timeEnd("createSowTractorData");

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
      setEncodedData(data);
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

  if (!open) return null;

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
                <label className="text-[#9C9C9C] text-base font-light">
                  I want to Sow up to
                </label>
                <div className="flex items-center border border-[#D9D9D9] rounded-xl bg-white">
                  <Input
                    className="h-12 px-3 py-1.5 border-0 rounded-l-xl flex-1"
                    placeholder="0.00"
                    value={totalAmount}
                    onChange={(e) =>
                      setTotalAmount(e.target.value.replace(/[^0-9.,]/g, ""))
                    }
                    type="text"
                  />
                  <div className="flex items-center gap-2 px-4">
                    <img
                      src="/src/assets/tokens/PINTO.png"
                      alt="PINTO"
                      className="w-6 h-6"
                    />
                    <span className="text-black">PINTO</span>
                  </div>
                </div>
              </div>

              {/* Fund order using */}
              <div className="flex flex-col gap-2">
                <label className="text-[#9C9C9C] text-base font-light">
                  Fund order using
                </label>
                <Select
                  value={
                    selectedTokenStrategy.type === "LOWEST_SEEDS"
                      ? "lowest-seeds"
                      : selectedTokenStrategy.type === "LOWEST_PRICE"
                        ? "lowest-price"
                        : selectedTokenStrategy.type === "SPECIFIC_TOKEN"
                          ? selectedTokenStrategy.address
                          : undefined
                  }
                  onValueChange={(value) => {
                    if (value === "lowest-seeds") {
                      setSelectedTokenStrategy({ type: "LOWEST_SEEDS" });
                    } else if (value === "lowest-price") {
                      setSelectedTokenStrategy({ type: "LOWEST_PRICE" });
                    } else {
                      setSelectedTokenStrategy({
                        type: "SPECIFIC_TOKEN",
                        address: value,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="h-12 px-3 py-1.5 border border-[#D9D9D9] rounded-xl flex items-center">
                    <SelectValue
                      placeholder="Select token"
                      className="w-full flex-1 text-left min-w-0"
                    />
                  </SelectTrigger>
                  <SelectContent className="w-full min-w-[var(--radix-select-trigger-width)]">
                    <SelectItem
                      value="lowest-seeds"
                      className="w-full pr-3 [&>span]:w-full relative pl-8"
                    >
                      <div className="w-full flex items-center justify-start">
                        <span className="flex-1 truncate">
                          Lowest Seeds Token
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="lowest-price"
                      className="w-full pr-3 [&>span]:w-full relative pl-8"
                    >
                      <div className="w-full flex items-center">
                        <span className="flex-1 truncate">
                          Lowest Price Token
                        </span>
                      </div>
                    </SelectItem>
                    {whitelistedTokens.map((token) => {
                      const deposit = farmerDeposits.get(token);
                      const amount = deposit?.amount || TokenValue.ZERO;
                      const pintoAmount =
                        swapResults.get(token.address) || TokenValue.ZERO;

                      return (
                        <SelectItem
                          key={token.address}
                          value={token.address}
                          className="w-full pr-3 [&>span]:w-full relative pl-8 [&>span[aria-hidden]]:left-2"
                        >
                          <div className="w-full flex items-center justify-start">
                            <div className="flex mr-2">
                              <IconImage
                                src={token.logoURI}
                                alt={token.symbol}
                                size={6}
                                className="rounded-full"
                              />
                            </div>
                            <span className="flex-1 truncate">
                              {token.name}
                            </span>
                            <span className="text-pinto-gray-4 shrink-0 pl-4">
                              {token.isLP
                                ? formatter.number(pintoAmount)
                                : formatter.number(amount)}
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Execute if Available Soil is at least */}
              <div className="flex flex-col gap-2">
                <label className="text-[#9C9C9C] text-base font-light">
                  Execute if Available Soil is at least
                </label>
                <Input
                  className={`h-12 px-3 py-1.5 border ${
                    error ? "border-red-500" : "border-[#D9D9D9]"
                  } rounded-xl`}
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
                <label className="text-[#9C9C9C] text-base font-light">
                  Max amount to sow per Season
                </label>
                <div className="flex items-center border border-[#D9D9D9] rounded-xl bg-white">
                  <Input
                    className={`h-12 px-3 py-1.5 border-0 rounded-l-xl flex-1 ${
                      error ? "border-red-500" : ""
                    }`}
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
              {error && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
              )}

              {/* Execute when Temperature is at least */}
              <div className="flex flex-col gap-2">
                <label className="text-[#9C9C9C] text-base font-light">
                  Execute when Temperature is at least
                </label>
                <Input
                  className="h-12 px-3 py-1.5 border border-[#D9D9D9] rounded-xl"
                  placeholder="400%"
                  value={temperature}
                  onChange={(e) =>
                    setTemperature(e.target.value.replace(/[^0-9.,]/g, ""))
                  }
                  type="text"
                />
              </div>

              {/* Execute when the length of the Pod Line is at most */}
              <div className="flex flex-col gap-2">
                <label className="text-[#9C9C9C] text-base font-light">
                  Execute when the length of the Pod Line is at most
                </label>
                <Input
                  className="h-12 px-3 py-1.5 border border-[#D9D9D9] rounded-xl"
                  placeholder="9,000,000"
                  value={podLineLength}
                  onChange={(e) => setPodLineLength(e.target.value)}
                />
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
                <label className="text-[#9C9C9C] text-base font-light">
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

              {/* After Morning Auction buttons */}
              <div className="flex flex-col gap-2">
                <label className="text-[#9C9C9C] text-base font-light">
                  Operator Tip
                </label>
                <div className="flex items-center border border-[#D9D9D9] rounded-xl bg-white">
                  <Input
                    className="h-12 px-3 py-1.5 border-0 rounded-l-xl flex-1"
                    placeholder="0.00"
                    value={operatorTip}
                    onChange={(e) =>
                      setOperatorTip(e.target.value.replace(/[^0-9.,]/g, ""))
                    }
                    type="text"
                  />
                  <div className="flex items-center gap-2 px-4">
                    <img
                      src="/src/assets/tokens/PINTO.png"
                      alt="PINTO"
                      className="w-6 h-6"
                    />
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
                    error
                      ? "bg-[#D9D9D9] text-[#9C9C9C]"
                      : "bg-gradient-to-r from-[#46A955] to-[#1F9C5A] text-white"
                  }`}
                  disabled={!!error || isLoading}
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
      {showReview && encodedData && operatorPasteInstructions && (
        <ReviewTractorOrderDialog
          open={showReview}
          onOpenChange={setShowReview}
          orderData={{
            totalAmount,
            temperature,
            podLineLength,
            minSoil,
            operatorTip,
          }}
          encodedData={encodedData}
          operatorPasteInstrs={operatorPasteInstructions}
          blueprint={blueprint!}
        />
      )}
    </>
  );
}

import { TokenValue } from "@/classes/TokenValue";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useGasPrice } from "@/hooks/useGasPrice";
import useTransaction from "@/hooks/useTransaction";
import { RequisitionEvent } from "@/lib/Tractor/utils";
import useTractorPublishedRequisitions from "@/state/tractor/useTractorPublishedRequisitions";
import { useTemperature } from "@/state/useFieldData";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import LoadingSpinner from "../LoadingSpinner";
import { PlowDetails } from "./PlowDetails";

const BASESCAN_URL = "https://basescan.org/address/";

// Helper function to extract error message from error
const extractErrorMessage = (error: unknown): string => {
  if (!error) return "Unknown error";

  if (typeof error === "object" && error !== null) {
    // Check for common error properties
    if ("message" in error && typeof error.message === "string") {
      const message = error.message;

      // Extract the error message between "following reason:" and "Contract Call:"
      const reasonPattern = /following reason:\s*(.*?)(?:\s*\n\s*Contract Call:|$)/s;
      const reasonMatch = message.match(reasonPattern);

      if (reasonMatch && reasonMatch[1]) {
        return reasonMatch[1].trim();
      }

      // Fallback to simpler pattern
      const simpleMatch = message.match(/execution reverted: (.+?)(?:\n|$)/);
      if (simpleMatch && simpleMatch[1]) {
        return simpleMatch[1].trim();
      }

      return message;
    }

    if ("reason" in error && typeof (error as any).reason === "string") {
      return (error as any).reason;
    }
  }

  return String(error);
};

// Helper function to calculate USD value of PINTO amount
const calculateUsdValue = (
  amount: bigint | TokenValue,
  pintoToken: Token,
  prices: Map<Token, { instant: TokenValue; twa: TokenValue }>,
): { tokenAmount: TokenValue; usdValue: TokenValue; usdValueNumber: number } | null => {
  // Convert to TokenValue if bigint
  const tokenAmount = amount instanceof TokenValue ? amount : TokenValue.fromBlockchain(amount, 6);

  // Get PINTO price in USD
  const pintoPrice = prices.get(pintoToken)?.instant;
  if (!pintoPrice) return null;

  // Calculate USD value
  const usdValue = tokenAmount.mul(pintoPrice).reDecimal(6);
  return {
    tokenAmount,
    usdValue,
    usdValueNumber: Number(usdValue.toHuman()),
  };
};

// Helper function to format operator tip properly
const formatOperatorTip = (
  amount: bigint | undefined,
  pintoToken: Token,
  tokenPrices: Map<Token, { instant: TokenValue; twa: TokenValue }>,
): string => {
  if (amount === undefined) return "Failed to decode";

  const usdData = calculateUsdValue(amount, pintoToken, tokenPrices);
  if (!usdData) {
    return `${formatter.number(TokenValue.fromBlockchain(amount, 6))} PINTO`;
  }

  return `${formatter.number(usdData.tokenAmount)} PINTO (${formatter.usd(usdData.usdValue)})`;
};

// Helper function to calculate profit for a requisition
const calculateProfit = (
  req: RequisitionEvent,
  successfulSimulations: Set<string>,
  gasEstimates: Map<string, bigint>,
  gasPrice: bigint | undefined,
  mainToken: Token,
  nativeToken: Token,
  tokenPrices: Map<Token, { instant: TokenValue; twa: TokenValue }>,
): number => {
  if (!successfulSimulations.has(req.requisition.blueprintHash) || !req.decodedData) {
    return -Infinity; // Unsimulated items go to the bottom
  }

  const gas = gasEstimates.get(req.requisition.blueprintHash);
  if (!gas) return -Infinity;

  // Get ETH price in USD
  const ethPrice = tokenPrices.get(nativeToken)?.instant;
  if (!ethPrice) return -Infinity;

  // Calculate gas cost in USD
  const currentGasPrice = gasPrice || BigInt(1_000_000_000);
  const gasCostInWei = gas * currentGasPrice;
  const gasCostInEth = Number(gasCostInWei) / 1e18;
  const ethPriceInUsd = Number(ethPrice.toString()) / 1e6;
  const gasCostInUsd = gasCostInEth * ethPriceInUsd;

  // Calculate tip amount in USD using our reusable function
  const tipData = calculateUsdValue(req.decodedData.operatorParams.operatorTipAmount, mainToken, tokenPrices);
  if (!tipData) return -Infinity;

  // Calculate profit (tip - gas cost)
  return tipData.usdValueNumber - gasCostInUsd;
};

export function Plow() {
  const [selectedRequisition, setSelectedRequisition] = useState<RequisitionEvent | null>(null);
  const protocolAddress = useProtocolAddress();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { tokenPrices } = usePriceData();
  const { mainToken, nativeToken } = useTokenData();
  const temperatures = useTemperature();

  // Add state for gas estimates
  const [gasEstimates, setGasEstimates] = useState<Map<string, bigint>>(new Map());
  const { data: gasPrice } = useGasPrice();

  // Add state for sorted requisitions
  const [sortedRequisitions, setSortedRequisitions] = useState<RequisitionEvent[]>([]);
  const [sortingEnabled, setSortingEnabled] = useState(false);

  // Add state to track if any order has been executed, requiring resimulation
  const [hasExecutedOrder, setHasExecutedOrder] = useState(false);

  const { isLoading, ...requisitionsQuery } = useTractorPublishedRequisitions();

  const requisitions = useMemo(() => {
    if (!requisitionsQuery.data) return [];

    const currentTemperature = temperatures.scaled;
    console.debug("Current temperature:", currentTemperature?.toHuman ? `${currentTemperature.toHuman()}%` : "Unknown");

    // Filter out requisitions with zero or negative tip, cancelled requisitions,
    // and those with minTemp higher than current temperature
    const filteredEvents = requisitionsQuery.data.filter((req) => {
      // Skip cancelled requisitions
      if (req.isCancelled) return false;

      // Skip requisitions with invalid data or non-positive tip
      if (!req.decodedData || !req.decodedData.operatorParams) return false;
      const tipAmount = req.decodedData.operatorParams.operatorTipAmount;

      // Skip requisitions with temperature requirements higher than current temperature
      if (currentTemperature && req.decodedData.minTemp) {
        const reqMinTemp = TokenValue.fromBlockchain(req.decodedData.minTemp, 6);
        if (reqMinTemp.gt(currentTemperature)) {
          console.debug(
            `Filtered out requisition with minTemp ${reqMinTemp.toHuman()}% > current temp ${currentTemperature.toHuman()}%`,
          );
          return false;
        }
      }

      return tipAmount > 0n;
    });
    console.debug("Filtered requisitions (executable with positive tips):", filteredEvents.length);

    return filteredEvents;
  }, [requisitionsQuery.data, temperatures.scaled]);

  const handlePlow = useCallback((requisition: RequisitionEvent) => {
    setSelectedRequisition(requisition);
  }, []);

  // Add state for simulation loading
  const [simulatingReq, setSimulatingReq] = useState<string | null>(null);

  // Add state for tracking failed simulations
  const [failedSimulations, setFailedSimulations] = useState<Set<string>>(new Set());

  // Add state for tracking error messages for each failed simulation
  const [simulationErrors, setSimulationErrors] = useState<Map<string, string>>(new Map());

  // Add state for tracking successful simulations
  const [successfulSimulations, setSuccessfulSimulations] = useState<Set<string>>(new Set());

  // Add state for tracking if we're simulating all
  const [simulatingAll, setSimulatingAll] = useState(false);
  // Add state to track if all transactions have been simulated at least once
  const [hasSimulatedAll, setHasSimulatedAll] = useState(false);

  // Add state for tracking completed executions
  const [completedExecutions, setCompletedExecutions] = useState<Set<string>>(new Set());

  // Add state for tracking which requisition is being executed
  const [executingReq, setExecutingReq] = useState<string | null>(null);

  // Setup transaction handler
  const { writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Plow successful",
    errorMessage: "Plow failed",
    successCallback: (receipt) => {
      if (!receipt?.transactionHash) return;
      // Add to completed executions
      setCompletedExecutions((prev) => new Set(prev).add(receipt.transactionHash));
      // Invalidate queries to refresh data
      requisitionsQuery.refetch();
    },
  });

  // Helper function reference for component use
  const calculateReqProfit = useCallback(
    (req: RequisitionEvent): number => {
      return calculateProfit(req, successfulSimulations, gasEstimates, gasPrice, mainToken, nativeToken, tokenPrices);
    },
    [successfulSimulations, gasEstimates, gasPrice, mainToken, nativeToken, tokenPrices],
  );

  // Sort requisitions by profit when needed
  useEffect(() => {
    // Only sort if we have requisitions and simulations
    if (!sortingEnabled || requisitions.length === 0 || successfulSimulations.size === 0) {
      setSortedRequisitions(requisitions);
      return;
    }

    console.debug("Sorting requisitions by profit");

    // Use a stable sort to avoid unnecessary reordering
    const sorted = [...requisitions].sort((a, b) => {
      // Use the function hash instead of recalculating for stability
      const aHash = a.requisition.blueprintHash;
      const bHash = b.requisition.blueprintHash;

      // If one simulation failed, put it at the bottom
      if (failedSimulations.has(aHash) && !failedSimulations.has(bHash)) return 1;
      if (!failedSimulations.has(aHash) && failedSimulations.has(bHash)) return -1;

      // If both requisitions are successful, sort by profit
      if (successfulSimulations.has(aHash) && successfulSimulations.has(bHash)) {
        return calculateReqProfit(b) - calculateReqProfit(a); // Higher profit first
      }

      // If only one is successful, prioritize it
      if (successfulSimulations.has(aHash)) return -1;
      if (successfulSimulations.has(bHash)) return 1;

      // Otherwise, keep original order
      return 0;
    });

    setSortedRequisitions(sorted);
  }, [
    requisitions,
    // Only re-sort when these specific values change
    successfulSimulations.size,
    failedSimulations.size,
    sortingEnabled,
    // calculateReqProfit is a derived value, don't include it in deps
    // Instead, include its dependencies explicitly
    gasEstimates.size,
    !!gasPrice,
  ]);

  // Update handleSimulateAll function to enable sorting after completion
  const handleSimulateAll = useCallback(async () => {
    if (!protocolAddress || !publicClient || simulatingAll) return;
    setSimulatingAll(true);
    // Reset the executed order flag when simulating all
    setHasExecutedOrder(false);

    try {
      for (const req of requisitions) {
        setSimulatingReq(req.requisition.blueprintHash);
        // Clear previous states
        setFailedSimulations((prev) => {
          const next = new Set(prev);
          next.delete(req.requisition.blueprintHash);
          return next;
        });
        setSuccessfulSimulations((prev) => {
          const next = new Set(prev);
          next.delete(req.requisition.blueprintHash);
          return next;
        });
        setSimulationErrors((prev) => {
          const next = new Map(prev);
          next.delete(req.requisition.blueprintHash);
          return next;
        });

        try {
          await publicClient.simulateContract({
            address: protocolAddress,
            abi: diamondABI,
            functionName: "tractor",
            args: [
              {
                blueprint: req.requisition.blueprint,
                blueprintHash: req.requisition.blueprintHash,
                signature: req.requisition.signature,
              },
              "0x",
            ] as const,
          });

          // Get gas estimate separately
          const gasEstimate = await publicClient.estimateContractGas({
            address: protocolAddress,
            abi: diamondABI,
            functionName: "tractor",
            args: [
              {
                blueprint: req.requisition.blueprint,
                blueprintHash: req.requisition.blueprintHash,
                signature: req.requisition.signature,
              },
              "0x",
            ] as const,
          });

          // Debug log
          console.debug(`Gas estimate for ${req.requisition.blueprintHash}:`, gasEstimate.toString());

          // Store gas estimate
          setGasEstimates((prev) => {
            const next = new Map(prev);
            next.set(req.requisition.blueprintHash, gasEstimate);
            return next;
          });

          console.debug(`Simulation successful for ${req.requisition.blueprintHash}`);
          setSuccessfulSimulations((prev) => new Set(prev).add(req.requisition.blueprintHash));
        } catch (error) {
          // console.error(`Simulation failed for ${req.requisition.blueprintHash}:`, error);

          // Log additional details for debugging
          console.debug("Simulation details:");
          console.debug("Blueprint Hash:", req.requisition.blueprintHash);
          console.debug("To Address:", protocolAddress);
          console.debug("From Address:", address || "Unknown");

          // Try to log call args
          try {
            // Just log the raw args
            const encodedCallData = encodeFunctionData({
              abi: diamondABI,
              functionName: "tractor",
              args: [
                {
                  blueprint: req.requisition.blueprint,
                  blueprintHash: req.requisition.blueprintHash,
                  signature: req.requisition.signature,
                },
                "0x",
              ],
            });
            console.debug("Encoded Call Data:", encodedCallData);
            console.debug("Simulator Ready Format:");
            console.debug(
              JSON.stringify(
                {
                  to: protocolAddress,
                  from: address || "0x0000000000000000000000000000000000000000",
                  data: encodedCallData,
                },
                null,
                2,
              ),
            );
          } catch (dataError) {
            console.error("Failed to encode call data:", dataError);
          }

          setFailedSimulations((prev) => new Set(prev).add(req.requisition.blueprintHash));

          // Store the error message
          const errorMsg = extractErrorMessage(error);
          setSimulationErrors((prev) => {
            const next = new Map(prev);
            next.set(req.requisition.blueprintHash, errorMsg);
            return next;
          });
        }
        setSimulatingReq(null);
      }
      toast.success("Completed simulating all requisitions");
      // Enable sorting after simulations are complete
      setSortingEnabled(true);
      // Mark that we've simulated all transactions at least once
      setHasSimulatedAll(true);
    } catch (error) {
      console.error("Failed during simulate all:", error);
      toast.error("Failed to simulate all requisitions");
    } finally {
      setSimulatingAll(false);
    }
  }, [protocolAddress, publicClient, requisitions, address]);

  // Update handleSimulate function to include gas estimation
  const handleSimulate = useCallback(
    async (req: RequisitionEvent) => {
      if (!protocolAddress || !publicClient) return;
      setSimulatingReq(req.requisition.blueprintHash);
      // Clear previous states
      setFailedSimulations((prev) => {
        const next = new Set(prev);
        next.delete(req.requisition.blueprintHash);
        return next;
      });
      setSuccessfulSimulations((prev) => {
        const next = new Set(prev);
        next.delete(req.requisition.blueprintHash);
        return next;
      });
      setSimulationErrors((prev) => {
        const next = new Map(prev);
        next.delete(req.requisition.blueprintHash);
        return next;
      });
      setGasEstimates((prev) => {
        const next = new Map(prev);
        next.delete(req.requisition.blueprintHash);
        return next;
      });

      try {
        const result = await publicClient.simulateContract({
          address: protocolAddress,
          abi: diamondABI,
          functionName: "tractor",
          args: [
            {
              blueprint: req.requisition.blueprint,
              blueprintHash: req.requisition.blueprintHash,
              signature: req.requisition.signature,
            },
            "0x",
          ] as const,
        });

        // Get gas estimate separately
        const gasEstimate = await publicClient.estimateContractGas({
          address: protocolAddress,
          abi: diamondABI,
          functionName: "tractor",
          args: [
            {
              blueprint: req.requisition.blueprint,
              blueprintHash: req.requisition.blueprintHash,
              signature: req.requisition.signature,
            },
            "0x",
          ] as const,
        });

        // Debug log
        console.debug("Gas estimate:", gasEstimate.toString());

        // Store gas estimate
        setGasEstimates((prev) => {
          const next = new Map(prev);
          next.set(req.requisition.blueprintHash, gasEstimate);
          return next;
        });

        toast.success("Simulation successful");
        setSuccessfulSimulations((prev) => new Set(prev).add(req.requisition.blueprintHash));
      } catch (error) {
        // console.error("Simulation failed:", error);

        // Log additional details for debugging
        console.debug("Simulation details:");
        console.debug("Blueprint Hash:", req.requisition.blueprintHash);
        console.debug("To Address:", protocolAddress);
        console.debug("From Address:", address || "Unknown");

        // Try to encode and log call data for simulator use
        try {
          const encodedCallData = encodeFunctionData({
            abi: diamondABI,
            functionName: "tractor",
            args: [
              {
                blueprint: req.requisition.blueprint,
                blueprintHash: req.requisition.blueprintHash,
                signature: req.requisition.signature,
              },
              "0x",
            ],
          });
          console.debug("Encoded Call Data:", encodedCallData);
          console.debug("Simulator Ready Format:");
          console.debug(
            JSON.stringify(
              {
                to: protocolAddress,
                from: address || "0x0000000000000000000000000000000000000000",
                data: encodedCallData,
              },
              null,
              2,
            ),
          );
        } catch (dataError) {
          console.error("Failed to encode call data:", dataError);
        }

        toast.error(`Simulation failed: ${extractErrorMessage(error)}`);
        setFailedSimulations((prev) => new Set(prev).add(req.requisition.blueprintHash));

        // Store the error message
        const errorMsg = extractErrorMessage(error);
        setSimulationErrors((prev) => {
          const next = new Map(prev);
          next.set(req.requisition.blueprintHash, errorMsg);
          return next;
        });
      } finally {
        setSimulatingReq(null);
      }
    },
    [protocolAddress, publicClient, address],
  );

  // Add execute handler
  const handleExecute = useCallback(
    async (req: RequisitionEvent) => {
      if (!protocolAddress) return;
      setExecutingReq(req.requisition.blueprintHash);
      setSubmitting(true);

      try {
        await writeWithEstimateGas({
          address: protocolAddress,
          abi: diamondABI,
          functionName: "tractor",
          args: [
            {
              blueprint: req.requisition.blueprint,
              blueprintHash: req.requisition.blueprintHash,
              signature: req.requisition.signature,
            },
            "0x",
          ] as const,
        });
        // Set the flag indicating an order has been executed
        setHasExecutedOrder(true);
      } catch (error) {
        console.error("Failed to execute plow:", error);
      } finally {
        setExecutingReq(null);
        setSubmitting(false);
      }
    },
    [protocolAddress, writeWithEstimateGas, setSubmitting],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 min-h-72">
        <LoadingSpinner size={20} />
        <span>Loading requisitions...</span>
      </div>
    );
  }

  // Return the sorted requisitions in the table
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-pinto-gray-3/20">
            <TableHead className="px-0 text-left text-xs font-light text-pinto-gray-4">Created At</TableHead>
            <TableHead className="px-1.5 text-left text-xs font-light text-pinto-gray-4">Publisher</TableHead>
            <TableHead className="px-1.5 text-left text-xs font-light text-pinto-gray-4">Blueprint Hash</TableHead>
            <TableHead className="px-1.5 text-left text-xs font-light text-pinto-gray-4">Temperature</TableHead>
            <TableHead className="px-1.5 text-left text-xs font-light text-pinto-gray-4 min-w-[220px]">
              Operator Tip
            </TableHead>
            <TableHead className="px-1.5 text-left text-xs font-light text-pinto-gray-4 min-w-[200px]">
              <div className="flex flex-row justify-between items-start">
                <span>Simulate</span>
                <div className="text-xs text-pinto-gray-4 text-right">
                  {(() => {
                    if (!gasPrice) return "Loading gas price...";
                    return `Gas Price: ${(Number(gasPrice) / 1e9).toFixed(6)} gwei`;
                  })()}
                </div>
              </div>
            </TableHead>
            {successfulSimulations.size > 0 && (
              <TableHead className="px-1.5 text-left text-xs font-light text-pinto-gray-4">Estimated Profit</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:first-child]:border-t [&_tr:last-child]:border-b">
          {sortedRequisitions.map((req, index) => {
            const dateOptions: Intl.DateTimeFormatOptions = {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h24",
            };

            return (
              <TableRow
                key={index}
                className="h-[2.75rem] bg-transparent items-center hover:bg-pinto-green-1 cursor-pointer transition-colors"
                noHoverMute
                onClick={() => handlePlow(req)}
              >
                <TableCell className="px-0 py-1.5">
                  {req.timestamp ? new Date(req.timestamp).toLocaleString(undefined, dateOptions) : "Unknown"}
                </TableCell>
                <TableCell className="px-1.5 py-1.5 text-sm">
                  <a
                    href={`${BASESCAN_URL}${req.requisition.blueprint.publisher}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pinto-green-4 hover:text-pinto-green-5 hover:underline"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {`${req.requisition.blueprint.publisher.slice(0, 6)}...${req.requisition.blueprint.publisher.slice(-4)}`}
                  </a>
                </TableCell>
                <TableCell className="px-1.5 py-1.5 text-sm">
                  <span className="text-pinto-green-4">
                    {`${req.requisition.blueprintHash.slice(0, 6)}...${req.requisition.blueprintHash.slice(-4)}`}
                  </span>
                </TableCell>
                <TableCell className="px-1.5 py-1.5 text-sm">
                  {req.decodedData ? `${(Number(req.decodedData.minTemp) / 1e6).toFixed(2)}%` : "Unknown"}
                </TableCell>
                <TableCell className="px-1.5 py-1.5 text-sm">
                  {req.decodedData
                    ? formatOperatorTip(req.decodedData.operatorParams.operatorTipAmount, mainToken, tokenPrices)
                    : "Failed to decode"}
                </TableCell>
                <TableCell className="px-1.5 py-1.5">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation(); // Prevent row onClick from firing
                        if (successfulSimulations.has(req.requisition.blueprintHash)) {
                          handleExecute(req);
                        } else {
                          handleSimulate(req);
                        }
                      }}
                      disabled={
                        simulatingReq === req.requisition.blueprintHash ||
                        failedSimulations.has(req.requisition.blueprintHash) ||
                        executingReq === req.requisition.blueprintHash ||
                        completedExecutions.has(req.requisition.blueprintHash) ||
                        // Disable execution button if any order has been executed and this is not a simulation
                        (hasExecutedOrder && successfulSimulations.has(req.requisition.blueprintHash))
                      }
                      className={`
                        ${
                          successfulSimulations.has(req.requisition.blueprintHash) &&
                          !completedExecutions.has(req.requisition.blueprintHash) &&
                          !hasExecutedOrder
                            ? "bg-pinto-green-4 text-white hover:bg-pinto-green-5"
                            : completedExecutions.has(req.requisition.blueprintHash) ||
                                (hasExecutedOrder && successfulSimulations.has(req.requisition.blueprintHash))
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "text-pinto-gray-4 hover:text-pinto-gray-5"
                        } 
                        ${failedSimulations.has(req.requisition.blueprintHash) ? "opacity-50 cursor-not-allowed" : ""}
                        px-2 py-0 text-xs min-w-[80px]
                      `}
                    >
                      {simulatingReq === req.requisition.blueprintHash
                        ? "Simulating..."
                        : executingReq === req.requisition.blueprintHash
                          ? "Executing..."
                          : failedSimulations.has(req.requisition.blueprintHash)
                            ? "Reverted"
                            : completedExecutions.has(req.requisition.blueprintHash)
                              ? "Plowed"
                              : hasExecutedOrder && successfulSimulations.has(req.requisition.blueprintHash)
                                ? "Resimulate"
                                : successfulSimulations.has(req.requisition.blueprintHash)
                                  ? "Execute"
                                  : "Simulate"}
                    </Button>
                    {successfulSimulations.has(req.requisition.blueprintHash) && (
                      <div
                        className="flex items-center text-pinto-gray-4 flex-1 min-w-0"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1 text-xs">
                          Est. Gas: {(() => {
                            const gas = gasEstimates.get(req.requisition.blueprintHash);
                            if (!gas) return "0";

                            // Get ETH price in USD
                            const ethPrice = tokenPrices.get(nativeToken)?.instant;
                            if (!ethPrice) return formatter.number(gas.toString());

                            // Use current gas price from network, fallback to 1 gwei if not available
                            const currentGasPrice = gasPrice || BigInt(1_000_000_000);

                            // Debug log the values
                            console.debug("Gas estimate:", gas.toString());
                            console.debug("Gas price:", currentGasPrice.toString());
                            console.debug("ETH price:", ethPrice.toString());

                            // Calculate gas cost in wei, then convert to USD
                            const gasCostInWei = gas * currentGasPrice;
                            // Convert wei to ETH (as a number) for calculation and display
                            const gasCostInEth = Number(gasCostInWei) / 1e18;
                            // Convert ETH price from its stored format (with 6 decimals) to actual USD
                            const ethPriceInUsd = Number(ethPrice.toString()) / 1e6;
                            // Calculate USD directly from ETH amount
                            const gasCostInUsd = gasCostInEth * ethPriceInUsd;

                            console.debug("Gas cost in Wei:", gasCostInWei.toString());
                            console.debug("Gas cost in ETH:", gasCostInEth.toFixed(18));
                            console.debug("ETH price in USD:", ethPriceInUsd.toFixed(2));
                            console.debug("Gas cost in USD:", gasCostInUsd.toFixed(6));

                            return `${formatter.number(gas.toString())} ($${gasCostInUsd.toFixed(6)})`;
                          })()}
                        </div>
                      </div>
                    )}
                    {failedSimulations.has(req.requisition.blueprintHash) &&
                      simulationErrors.get(req.requisition.blueprintHash) && (
                        <div
                          className="flex items-center text-pinto-red-4 flex-1 min-w-0"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <TooltipSimple
                            content={
                              <span className="font-light text-pinto-gray-3">
                                {simulationErrors.get(req.requisition.blueprintHash) || "Unknown error"}
                              </span>
                            }
                            variant="gray"
                          >
                            <div className="inline-flex items-center gap-1 text-xs text-pinto-red-4 max-w-full">
                              <InfoCircledIcon className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{simulationErrors.get(req.requisition.blueprintHash)}</span>
                            </div>
                          </TooltipSimple>
                        </div>
                      )}
                  </div>
                </TableCell>
                {successfulSimulations.size > 0 && (
                  <TableCell
                    className="px-1.5 text-sm text-right"
                    style={{ paddingTop: "0.375rem", paddingBottom: "0.375rem" }}
                  >
                    {(() => {
                      // Skip if this simulation hasn't been run yet
                      if (!successfulSimulations.has(req.requisition.blueprintHash) || !req.decodedData) {
                        return "-";
                      }

                      const profit = calculateReqProfit(req);
                      if (profit === -Infinity) return "-";

                      // Format with color based on profit/loss
                      const isPositive = profit >= 0;
                      const color = isPositive ? "text-pinto-green-4" : "text-pinto-red-2";
                      const sign = isPositive ? "+" : "-";

                      return (
                        <span className={color}>
                          {isPositive ? `${sign}$${profit.toFixed(6)}` : `${sign}$${Math.abs(profit).toFixed(6)}`}
                        </span>
                      );
                    })()}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
          {requisitions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="px-1.5 text-center text-gray-500">
                No active requisitions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PlowDetails
        requisition={selectedRequisition}
        isOpen={selectedRequisition !== null}
        onClose={() => setSelectedRequisition(null)}
      />

      <div className="mt-6 flex justify-between items-center">
        <div className="pinto-sm-light text-pinto-light">
          <div>Select Soil Orders to Simulate and Execute for a tip.</div>
          <div className="mt-1">
            Note that executing an order will likely affect the ability to execute another order.
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            rounded="full"
            className={`flex-1 ${
              simulatingAll || requisitions.length === 0
                ? "bg-pinto-gray-2 text-pinto-gray-4"
                : "bg-pinto-green-4 text-white"
            }`}
            disabled={simulatingAll || requisitions.length === 0}
            onClick={handleSimulateAll}
          >
            {simulatingAll ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                <span>Simulating All...</span>
              </div>
            ) : hasSimulatedAll ? (
              "Resimulate All"
            ) : (
              "Simulate all transactions"
            )}
          </Button>

          {/* You can add additional buttons like "Simulate 2 Transactions" or "Execute 2 Soil Orders" here later */}
        </div>
      </div>
    </div>
  );
}

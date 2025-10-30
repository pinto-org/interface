import { TokenValue } from "@/classes/TokenValue";
import { useScaledTemperature } from "@/hooks/useContinuousMorningTime";
import { TractorRequisitionEvent as RequisitionEvent, SowBlueprintData } from "@/lib/Tractor";
import useTractorPublishedRequisitions from "@/state/tractor/useTractorPublishedRequisitions";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { useCallback, useMemo, useState } from "react";
import { BaseOrderType, ColumnConfig, ExecuteOrdersTab } from "./ExecuteOrdersTab";
import { PlowDetails } from "./PlowDetails";

const BASESCAN_URL = "https://basescan.org/address/";

// Helper function to calculate USD value of PINTO amount
const calculateUsdValue = (
  amount: bigint | TokenValue,
  pintoToken: Token,
  prices: Map<Token, { instant: TokenValue; twa: TokenValue }>,
): { tokenAmount: TokenValue; usdValue: TokenValue; usdValueNumber: number } | null => {
  const tokenAmount = amount instanceof TokenValue ? amount : TokenValue.fromBlockchain(amount, 6);
  const pintoPrice = prices.get(pintoToken)?.instant;
  if (!pintoPrice) return null;

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
  req: RequisitionEvent<SowBlueprintData>,
  gasEstimate: bigint,
  gasPrice: bigint | undefined,
  mainToken: Token,
  nativeToken: Token,
  tokenPrices: Map<Token, { instant: TokenValue; twa: TokenValue }>,
): number => {
  if (!req.decodedData) return -Infinity;

  // Get ETH price in USD
  const ethPrice = tokenPrices.get(nativeToken)?.instant;
  if (!ethPrice) return -Infinity;

  // Calculate gas cost in USD
  const currentGasPrice = gasPrice || BigInt(1_000_000_000);
  const gasCostInWei = gasEstimate * currentGasPrice;
  const gasCostInEth = Number(gasCostInWei) / 1e18;
  const ethPriceInUsd = Number(ethPrice.toString()) / 1e6;
  const gasCostInUsd = gasCostInEth * ethPriceInUsd;

  // Calculate tip amount in USD
  const tipData = calculateUsdValue(req.decodedData.operatorParams.operatorTipAmount, mainToken, tokenPrices);
  if (!tipData) return -Infinity;

  // Calculate profit (tip - gas cost)
  return tipData.usdValueNumber - gasCostInUsd;
};

export function Plow() {
  const [selectedRequisition, setSelectedRequisition] = useState<RequisitionEvent<SowBlueprintData> | null>(null);
  const { tokenPrices } = usePriceData();
  const { mainToken, nativeToken } = useTokenData();
  const temperatures = useScaledTemperature();

  const { isLoading: requisitionsLoading, ...requisitionsQuery } = useTractorPublishedRequisitions(
    undefined,
    "sowBlueprintv0" as const,
  );

  // Filter logic for Sow orders
  const filterOrders = useCallback(
    (orders: RequisitionEvent<SowBlueprintData>[]): RequisitionEvent<SowBlueprintData>[] => {
      const currentTemperature = temperatures.scaled;

      return orders.filter((req) => {
        // Skip cancelled requisitions
        if (req.isCancelled) return false;

        // Skip requisitions with invalid data or non-positive tip
        if (!req.decodedData || !req.decodedData.operatorParams) return false;
        const tipAmount = req.decodedData.operatorParams.operatorTipAmount;

        // Skip requisitions with temperature requirements higher than current temperature
        if (currentTemperature && req.decodedData.minTemp) {
          const reqMinTemp = TokenValue.fromBlockchain(req.decodedData.minTemp, 6);
          if (reqMinTemp.gt(currentTemperature)) {
            return false;
          }
        }

        return tipAmount > 0n;
      });
    },
    [temperatures.scaled],
  );

  // Profit calculation logic for Sow orders
  const calculateOrderProfit = useCallback(
    (
      order: RequisitionEvent<SowBlueprintData>,
      gasEstimate: bigint,
      gasPrice: bigint | undefined,
      mainToken: Token,
      nativeToken: Token,
      tokenPrices: Map<Token, { instant: TokenValue; twa: TokenValue }>,
    ): number => {
      return calculateProfit(order, gasEstimate, gasPrice, mainToken, nativeToken, tokenPrices);
    },
    [],
  );

  // Column configuration for Sow orders
  const columns: ColumnConfig<RequisitionEvent<SowBlueprintData>>[] = useMemo(
    () => [
      {
        header: "Created At",
        className: "px-0",
        accessor: (req) => {
          const dateOptions: Intl.DateTimeFormatOptions = {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h24",
          };
          return req.timestamp ? new Date(req.timestamp).toLocaleString(undefined, dateOptions) : "Unknown";
        },
      },
      {
        header: "Publisher",
        accessor: (req) => (
          <a
            href={`${BASESCAN_URL}${req.requisition.blueprint.publisher}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pinto-green-4 hover:text-pinto-green-5 hover:underline text-sm"
            onClick={(event) => event.stopPropagation()}
          >
            {`${req.requisition.blueprint.publisher.slice(0, 6)}...${req.requisition.blueprint.publisher.slice(-4)}`}
          </a>
        ),
      },
      {
        header: "Blueprint Hash",
        accessor: (req) => (
          <span className="text-pinto-green-4 text-sm">
            {`${req.requisition.blueprintHash.slice(0, 6)}...${req.requisition.blueprintHash.slice(-4)}`}
          </span>
        ),
      },
      {
        header: "Temperature",
        accessor: (req) => (
          <span className="text-sm">
            {req.decodedData ? `${(Number(req.decodedData.minTemp) / 1e6).toFixed(2)}%` : "Unknown"}
          </span>
        ),
      },
      {
        header: "Operator Tip",
        accessor: (req) => (
          <span className="text-sm">
            {req.decodedData
              ? formatOperatorTip(req.decodedData.operatorParams.operatorTipAmount, mainToken, tokenPrices)
              : "Failed to decode"}
          </span>
        ),
      },
    ],
    [mainToken, tokenPrices],
  );

  const handlePlow = useCallback((requisition: RequisitionEvent<SowBlueprintData>) => {
    setSelectedRequisition(requisition);
  }, []);

  return (
    <>
      <ExecuteOrdersTab
        orders={requisitionsQuery.data?.sowBlueprintv0 || []}
        isLoading={requisitionsLoading}
        columns={columns}
        filterOrders={filterOrders}
        calculateProfit={calculateOrderProfit}
        mainToken={mainToken}
        nativeToken={nativeToken}
        tokenPrices={tokenPrices}
        emptyStateMessage="No active requisitions found"
        instructionText="Select Soil Orders to Simulate and execute for a tip."
        onRowClick={handlePlow}
        refetchOrders={requisitionsQuery.refetch}
      />

      <PlowDetails
        requisition={selectedRequisition}
        isOpen={selectedRequisition !== null}
        onClose={() => setSelectedRequisition(null)}
      />
    </>
  );
}

import { TokenValue } from "@/classes/TokenValue";
import IconImage from "@/components/ui/IconImage";
import { PINTO } from "@/constants/tokens";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor";
import { useTractorConvertUpOrderbook } from "@/state/tractor/useTractorConvertUpOrders";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { useCallback, useMemo } from "react";
import { ColumnConfig, ExecuteOrdersTab } from "./ExecuteOrdersTab";

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

// Helper function to calculate profit for a convert up order
const calculateProfit = (
  order: ConvertUpOrderbookEntry,
  gasEstimate: bigint,
  gasPrice: bigint | undefined,
  mainToken: Token,
  nativeToken: Token,
  tokenPrices: Map<Token, { instant: TokenValue; twa: TokenValue }>,
): number => {
  if (!order.decodedData) return -Infinity;

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
  const tipData = calculateUsdValue(order.decodedData.opParams.operatorTipAmount, mainToken, tokenPrices);
  if (!tipData) return -Infinity;

  // Calculate profit (tip - gas cost)
  return tipData.usdValueNumber - gasCostInUsd;
};

// Helper function to format date
const formatDate = (timestamp: number | undefined) => {
  if (!timestamp) return "Unknown";
  const date = new Date(timestamp);

  return (
    date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }) +
    " " +
    date
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(" ", "")
  );
};

export function ConvertUpExecute() {
  const { tokenPrices } = usePriceData();
  const { mainToken, nativeToken } = useTokenData();

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useTractorConvertUpOrderbook({
    select: useCallback((data: ConvertUpOrderbookEntry[] | undefined) => {
      if (!data || data?.length === 0) return [] satisfies ConvertUpOrderbookEntry[];
      return data;
    }, []),
  });

  // Filter logic for ConvertUp orders - basic filtering for executable orders
  const filterOrders = useCallback((orders: ConvertUpOrderbookEntry[]): ConvertUpOrderbookEntry[] => {
    return orders.filter((order) => {
      // Skip orders with no decoded data or zero tip
      if (!order.decodedData || !order.decodedData.opParams) return false;
      const tipAmount = order.decodedData.opParams.operatorTipAmount;

      // Only show orders with positive tips
      return tipAmount.gt(0);
    });
  }, []);

  // Profit calculation logic for ConvertUp orders
  const calculateOrderProfit = useCallback(
    (
      order: ConvertUpOrderbookEntry,
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

  // Column configuration for ConvertUp orders
  const columns: ColumnConfig<ConvertUpOrderbookEntry>[] = useMemo(
    () => [
      {
        header: "Created At",
        className: "px-0",
        accessor: (order) => formatDate(order.timestamp),
      },
      {
        header: "Publisher",
        accessor: (order) => (
          <a
            href={`${BASESCAN_URL}${order.requisition.blueprint.publisher}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pinto-green-4 hover:text-pinto-green-5 hover:underline text-sm"
            onClick={(event) => event.stopPropagation()}
          >
            {`${order.requisition.blueprint.publisher.slice(0, 6)}...${order.requisition.blueprint.publisher.slice(-4)}`}
          </a>
        ),
      },
      {
        header: "Blueprint Hash",
        accessor: (order) => (
          <span className="text-pinto-green-4 text-sm">
            {`${order.requisition.blueprintHash.slice(0, 6)}...${order.requisition.blueprintHash.slice(-4)}`}
          </span>
        ),
      },
      {
        header: "Grown Stalk Bonus",
        accessor: (order) => (
          <span className="text-sm">
            {order.decodedData
              ? `≥ ${formatter.number(order.decodedData.convertUpParams.minGrownStalkPerBdvBonus)}`
              : "Unknown"}
          </span>
        ),
      },
      {
        header: "Price Range",
        accessor: (order) => (
          <span className="text-sm">
            {order.decodedData
              ? `$${formatter.number(order.decodedData.convertUpParams.minPriceToConvertUp)} - $${formatter.number(order.decodedData.convertUpParams.maxPriceToConvertUp)}`
              : "Unknown"}
          </span>
        ),
      },
      {
        header: "Available Pinto",
        accessor: (order) => (
          <div className="flex items-center gap-1 text-sm">
            <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
            <span>{formatter.number(order.currentlyConvertible)}</span>
          </div>
        ),
      },
      {
        header: "BDV per Execution",
        accessor: (order) => (
          <div className="flex items-center gap-1 text-sm">
            <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
            <span>
              {order.decodedData
                ? `${formatter.number(order.decodedData.convertUpParams.minConvertBdvPerExecution)} - ${formatter.number(order.decodedData.convertUpParams.maxConvertBdvPerExecution)}`
                : "Unknown"}
            </span>
          </div>
        ),
      },
      {
        header: "Operator Tip",
        accessor: (order) => (
          <div className="flex items-center gap-1 text-sm">
            <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
            <span>
              {order.decodedData
                ? formatOperatorTip(order.decodedData.opParams.operatorTipAmount.toBigInt(), mainToken, tokenPrices)
                : "Failed to decode"}
            </span>
          </div>
        ),
      },
    ],
    [mainToken, tokenPrices],
  );

  return (
    <ExecuteOrdersTab
      orders={orders}
      isLoading={isLoading}
      columns={columns}
      filterOrders={filterOrders}
      calculateProfit={calculateOrderProfit}
      mainToken={mainToken}
      nativeToken={nativeToken}
      tokenPrices={tokenPrices}
      emptyStateMessage="No active convert up orders found"
      instructionText="Select Convert Up Orders to Simulate and Execute for a tip."
      refetchOrders={refetch}
    />
  );
}

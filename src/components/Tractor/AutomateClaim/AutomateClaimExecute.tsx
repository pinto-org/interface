import { TokenValue } from "@/classes/TokenValue";
import IconImage from "@/components/ui/IconImage";
import { PINTO } from "@/constants/tokens";
import { TractorRequisitionEvent } from "@/lib/Tractor";
import {
  getEnabledClaimOpLabels,
  getEnabledClaimOps,
  transformAutomateClaimRequisitionEvent,
} from "@/lib/Tractor/claimOrder";
import { AutomateClaimBlueprintStruct } from "@/lib/Tractor/claimOrder/tractor-claim-types";
import { useTractorAutomateClaimOrderbook } from "@/state/tractor/useTractorAutomateClaimOrders";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { useCallback, useMemo } from "react";
import { useChainId, useConfig } from "wagmi";
import { ColumnConfig, ExecuteOrdersTab } from "../ExecuteOrdersTab";

type AutomateClaimOrder = TractorRequisitionEvent<AutomateClaimBlueprintStruct>;

const formatDate = formatter.dateFromTS;

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

const calculateProfit = (
  order: AutomateClaimOrder,
  gasEstimate: bigint,
  gasPrice: bigint | undefined,
  mainToken: Token,
  nativeToken: Token,
  tokenPrices: Map<Token, { instant: TokenValue; twa: TokenValue }>,
): number => {
  if (!order.decodedData) return -Infinity;

  const ethPrice = tokenPrices.get(nativeToken)?.instant;
  if (!ethPrice) return -Infinity;

  const currentGasPrice = gasPrice || BigInt(1_000_000_000);
  const gasCostInWei = gasEstimate * currentGasPrice;
  const gasCostInEth = Number(gasCostInWei) / 1e18;
  const ethPriceInUsd = Number(ethPrice.toNumber()) / 1e6;
  const gasCostInUsd = gasCostInEth * ethPriceInUsd;

  // Use the base operator tip amount
  const tipData = calculateUsdValue(order.decodedData.opParams.baseOpParams.operatorTipAmount, mainToken, tokenPrices);
  if (!tipData) return -Infinity;

  return tipData.usdValueNumber - gasCostInUsd;
};

function getEnabledOpsLabel(order: AutomateClaimOrder): string {
  if (!order.decodedData) return "Unknown";

  const transformed = transformAutomateClaimRequisitionEvent(order.decodedData);
  if (!transformed) return "Unknown";

  const ops = getEnabledClaimOps(transformed);
  const labels = getEnabledClaimOpLabels(ops);
  return labels.length > 0 ? labels.join(", ") : "None";
}

export function AutomateClaimExecute() {
  const config = useConfig();
  const chainId = useChainId();
  const blockExplorerUrl =
    config.chains.find((chain) => chain.id === chainId)?.blockExplorers?.default.url ?? "https://basescan.org";

  const { tokenPrices } = usePriceData();
  const { mainToken, nativeToken } = useTokenData();

  const { data: orders = [], isLoading, refetch } = useTractorAutomateClaimOrderbook();

  const filterOrders = useCallback((orders: AutomateClaimOrder[]): AutomateClaimOrder[] => {
    return orders.filter((order) => {
      if (order.isCancelled) return false;
      if (!order.decodedData) return false;

      const tipAmount = order.decodedData.opParams.baseOpParams.operatorTipAmount;
      return tipAmount > 0n;
    });
  }, []);

  const calculateOrderProfit = useCallback(
    (
      order: AutomateClaimOrder,
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

  const columns: ColumnConfig<AutomateClaimOrder>[] = useMemo(
    () => [
      {
        header: "Created At",
        className: "px-0 w-44 max-w-44",
        accessor: (order) => formatDate(order.timestamp),
      },
      {
        header: "Publisher",
        className: "w-32 max-w-32",
        accessor: (order) => (
          <a
            href={`${blockExplorerUrl}/address/${order.requisition.blueprint.publisher}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pinto-green-4 hover:text-pinto-green-5 hover:underline text-sm"
            onClick={(event) => event.stopPropagation()}
          >
            {`${order.requisition.blueprint.publisher.slice(0, 4)}...${order.requisition.blueprint.publisher.slice(-4)}`}
          </a>
        ),
      },
      {
        header: "Blueprint Hash",
        className: "w-32 max-w-32",
        accessor: (order) => (
          <span className="text-pinto-green-4 text-sm">
            {`${order.requisition.blueprintHash.slice(0, 4)}...${order.requisition.blueprintHash.slice(-3)}`}
          </span>
        ),
      },
      {
        header: "Enabled Ops",
        className: "w-36 max-w-36",
        accessor: (order) => <span className="text-sm">{getEnabledOpsLabel(order)}</span>,
      },
      {
        header: "Operator Tip",
        className: "text-right w-44 max-w-44",
        accessor: (order) => (
          <div className="flex items-center gap-1 text-sm place-self-end">
            <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
            <span>
              {order.decodedData
                ? formatOperatorTip(order.decodedData.opParams.baseOpParams.operatorTipAmount, mainToken, tokenPrices)
                : "Failed to decode"}
            </span>
          </div>
        ),
      },
    ],
    [mainToken, tokenPrices, blockExplorerUrl],
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
      emptyStateMessage="No active automate claim orders found"
      instructionText="Select Automate Claim orders to simulate and execute for a tip."
      refetchOrders={refetch}
    />
  );
}

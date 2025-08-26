import { Skeleton } from "@/components/ui/Skeleton";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor";
import { useTractorConvertUpOrderbook } from "@/state/tractor/useTractorConvertUpOrders";
import useConvertStalkPerBdvBonusData from "@/state/useConvertStalkPerBdvBonusData";
import { usePriceData } from "@/state/usePriceData";
import { useMainToken } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { stringEq, truncateAddress } from "@/utils/string";
import { useCallback, useState } from "react";
import React from "react";
import { Col } from "../Container";
import { Button } from "../ui/Button";
import IconImage from "../ui/IconImage";

export default function ConvertUpTractorOrders() {
  const { price } = usePriceData();

  const bonusGrownStalkPerBDV = useConvertStalkPerBdvBonusData();

  const { data, isLoading } = useTractorConvertUpOrderbook({
    select: useCallback(
      (data: ConvertUpOrderbookEntry[] | undefined) => {
        if (!data) return undefined;

        const filteredOrders = data.filter((order) => {
          const { decodedData: dd } = order;
          if (!dd) return false;

          const {
            minPriceToConvertUp: minPrice,
            maxPriceToConvertUp: maxPrice,
            minGrownStalkPerBdvBonus: bonus,
          } = dd.convertUpParams;

          return minPrice.lte(price) && maxPrice.gte(price) && bonus.gte(bonusGrownStalkPerBDV.data?.bonus ?? 0);
        });

        return {
          // All orders
          all: data ?? [],
          // Filtered orders based on price and bonus
          filtered: filteredOrders,
        };
      },
      [price, bonusGrownStalkPerBDV.data],
    ),
  });

  return (
    <div className="w-full relative">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <ConvertUpTractorOrdersHeader />
          <tbody>
            {isLoading ? (
              <LoadingTableBody />
            ) : data?.filtered.length ? (
              <TractorOrdersContent orders={data.filtered} />
            ) : (
              <>
                <td colSpan={8} className="px-2 py-4 text-center text-xs font-light text-pinto-gray-4">
                  <Col className="items-center justify-center">
                    No Tractor orders executable with the current price and bonus
                  </Col>
                </td>
              </>
            )}
            {!isLoading && <SeeAllTractorOrdersRow onClick={() => {}} />}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TractorOrdersContent = ({ orders }: { orders: ConvertUpOrderbookEntry[] }) => {
  const [hoveredAddress, setHoveredAddress] = useState<string | null>(null);
  return (
    <>
      {orders.map((order) => (
        <TractorOrderRow
          key={order.requisition.blueprintHash}
          order={order}
          hoveredAddress={hoveredAddress}
          setHoveredAddress={setHoveredAddress}
        />
      ))}
    </>
  );
};

const TractorOrderRow = React.memo(
  ({
    order,
    hoveredAddress,
    setHoveredAddress,
  }: {
    order: ConvertUpOrderbookEntry;
    hoveredAddress: string | null;
    setHoveredAddress: (address: string | null) => void;
  }) => {
    const mainToken = useMainToken();

    if (!order.decodedData) return null;

    const req = order.requisition;
    const publisher = req.blueprint.publisher;
    const isHovered = stringEq(hoveredAddress, publisher);

    const { convertUpParams: cop, opParams: op } = order.decodedData;

    return (
      <tr
        className={`tractor-order-row hover:bg-pinto-green-1 transition-colors ${isHovered ? "bg-pinto-green-1" : ""}`}
      >
        <td className="px-2 py-1 text-xs font-light text-pinto-gray-4">
          {`0x${req.blueprintHash.slice(2, 7)}...${req.blueprintHash.slice(-4)}`}
        </td>
        <td className="px-2 py-1 text-xs font-light text-pinto-gray-4">
          <a
            href={`https://basescan.org/address/${publisher}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-light text-pinto-gray-4 underline ${isHovered ? "font-medium" : ""}`}
          >
            {truncateAddress(publisher)}
          </a>
        </td>
        <td className="px-2 py-1 text-xs font-light text-pinto-gray-4" align="right">
          {formatter.number(cop.minConvertBonusCapacity, { maxDecimals: 3 })} PDV
        </td>
        <td className="px-2 py-1 text-xs font-light text-pinto-gray-4" align="right">
          {formatter.number(cop.minGrownStalkPerBdvBonus, { maxDecimals: 3 })}
        </td>
        <td className="px-2 py-1 text-xs font-light text-pinto-gray-4" align="right">
          {formatter.number(order.orderInfo.bdvLeftToConvert, { maxDecimals: 3 })} PDV
        </td>
        <td className="px-2 py-1 text-xs font-light text-pinto-gray-4" align="right">
          {formatter.number(cop.minPriceToConvertUp, { maxDecimals: 3 })}
        </td>
        <td className="px-2 py-1 text-xs font-light text-pinto-gray-4" align="right">
          {formatter.number(cop.maxPriceToConvertUp, { maxDecimals: 3 })}
        </td>
        <td className="px-2 py-1 text-xs font-light text-pinto-gray-4" align="right">
          <span className="inline-flex items-center gap-1">
            <IconImage src={mainToken.logoURI} alt="PINTO" size={4} />
            <span className="ml-1">{formatter.number(op.operatorTipAmount, { maxDecimals: 3 })}</span>
          </span>
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if:
    // 1. The hoveredAddress matches this row's address
    // 2. The order data has changed
    return (
      prevProps.hoveredAddress !== nextProps.hoveredAddress &&
      prevProps.hoveredAddress !== prevProps.order.requisition.blueprint.publisher &&
      nextProps.hoveredAddress !== nextProps.order.requisition.blueprint.publisher &&
      prevProps.order === nextProps.order
    );
  },
);

const SeeAllTractorOrdersRow = ({ onClick }: { onClick: () => void }) => {
  return (
    <tr className="border-b-2 border-pinto-gray-3/20">
      <td colSpan={9}>
        <div className="flex flex-col items-center justify-center w-full">
          <Button variant="hoverTextPrimary" onClick={onClick} noPadding className="text-sm">
            See all Convert Up Tractor Orders
          </Button>
        </div>
      </td>
    </tr>
  );
};

const ConvertUpTractorOrdersHeader = () => (
  <thead>
    <tr className="border-b border-pinto-gray-3/20">
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Blueprint Hash</th>
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Publisher</th>
      <th className="px-2 py-1 text-right text-xs font-light text-pinto-gray-4">Min Capacity (PDV)</th>
      <th className="px-2 py-1 text-right text-xs font-light text-pinto-gray-4">Grown Stalk Bonus Per PDV</th>
      <th className="px-2 py-1 text-right text-xs font-light text-pinto-gray-4">Convert Amount (PDV)</th>
      <th className="px-2 py-1 text-right text-xs font-light text-pinto-gray-4">Min Price</th>
      <th className="px-2 py-1 text-right text-xs font-light text-pinto-gray-4">Max Price</th>
      <th className="px-2 py-1 text-right text-xs font-light text-pinto-gray-4">Operator Tip</th>
    </tr>
  </thead>
);

// const ActivityRow = React.memo()

const LoadingTableBody = () => (
  <>
    {Array(5)
      .fill(0)
      .map((_, index) => (
        <tr key={index}>
          <td className="px-2 py-1">
            <Skeleton className="h-3 w-12" />
          </td>
          <td className="px-2 py-1">
            <Skeleton className="h-3 w-12" />
          </td>
          <td className="px-2 py-1" align="right">
            <Skeleton className="h-3 w-24" />
          </td>
          <td className="px-2 py-1" align="right">
            <Skeleton className="h-3 w-20" />
          </td>
          <td className="px-2 py-1" align="right">
            <Skeleton className="h-3 w-28" />
          </td>
          <td className="px-2 py-1" align="right">
            <Skeleton className="h-3 w-28" />
          </td>
          <td className="px-2 py-1" align="right">
            <Skeleton className="h-3 w-14" />
          </td>
          <td className="px-2 py-1" align="right">
            <Skeleton className="h-3 w-20" />
          </td>
        </tr>
      ))}
  </>
);

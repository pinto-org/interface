import { Col } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor";
import { useTractorConvertUpOrderbook } from "@/state/tractor/useTractorConvertUpOrders";
import useConvertStalkPerBdvBonusAndMaximumCapacity from "@/state/useConvertStalkPerBdvBonusData";
import { usePriceData } from "@/state/usePriceData";
import { useMainToken } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { stringEq, truncateAddress } from "@/utils/string";
import { cn } from "@/utils/utils";
import { memo, useCallback, useState } from "react";

const NUM_COLS = 8;

export default function ConvertUpTractorOrders({ onSeeAllClick }: { onSeeAllClick: () => void }) {
  const { price } = usePriceData();

  const [hoveredAddress, setHoveredAddress] = useState<string | null>(null);

  const bonusGrownStalkPerBDV = useConvertStalkPerBdvBonusAndMaximumCapacity();

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
            grownStalkPerBdvBonusBid: bonus,
          } = dd.convertUpParams;

          return minPrice.lte(price) && maxPrice.gte(price) && bonusGrownStalkPerBDV.data?.bonus?.gte(bonus);
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
    <div className="relative w-full">
      <div className="overflow-auto">
        <table className="w-full border-collapse min-w-[60rem]">
          <thead className="[&_th]:px-2 [&_th]:py-1 [&_th]:text-xs [&_th]:font-light [&_th]:text-pinto-gray-4">
            <tr className="border-b border-pinto-gray-3/20">
              <th className="text-left">Blueprint Hash</th>
              <th className="text-left">Publisher</th>
              <th className="text-right">Min Capacity (PDV)</th>
              <th className="text-right">Grown Stalk Bonus Per PDV</th>
              <th className="text-right">Convert Amount (PDV)</th>
              <th className="text-right">Min Price</th>
              <th className="text-right">Max Price</th>
              <th className="text-right">Operator Tip</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingTableBody />
            ) : data?.filtered.length ? (
              <>
                {data.filtered.map((order) => (
                  <TractorOrderRow
                    key={order.requisition.blueprintHash}
                    order={order}
                    hoveredAddress={hoveredAddress}
                    setHoveredAddress={setHoveredAddress}
                  />
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={NUM_COLS} className="px-2 py-4 text-center text-xs font-light text-pinto-gray-4">
                  <Col className="items-center justify-center">
                    No Tractor orders executable with the current price and bonus
                  </Col>
                </td>
              </tr>
            )}
            {!isLoading && <SeeAllTractorOrdersRow onClick={onSeeAllClick} />}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TractorOrderRow = memo(
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
        className={cn(
          "tractor-order-row hover:bg-pinto-green-1 transition-colors",
          "[&_td]:px-2 [&_td]:py-1 [&_td]:text-xs [&_td]:font-light [&_td]:text-pinto-gray-4",
          isHovered ? "bg-pinto-green-1" : "",
        )}
      >
        <td>{`0x${req.blueprintHash.slice(2, 7)}...${req.blueprintHash.slice(-4)}`}</td>
        <td onMouseEnter={() => setHoveredAddress(publisher)} onMouseLeave={() => setHoveredAddress(null)}>
          <a
            href={`https://basescan.org/address/${publisher}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {truncateAddress(publisher)}
          </a>
        </td>
        <td align="right">{formatter.number(cop.minConvertBonusCapacity, { maxDecimals: 3 })} PDV</td>
        <td align="right">{formatter.number(cop.grownStalkPerBdvBonusBid, { maxDecimals: 6 })}</td>
        <td align="right">{formatter.number(order.orderInfo.bdvLeftToConvert, { maxDecimals: 3 })} PDV</td>
        <td align="right">{formatter.number(cop.minPriceToConvertUp, { maxDecimals: 3 })}</td>
        <td align="right">{formatter.number(cop.maxPriceToConvertUp, { maxDecimals: 3 })}</td>
        <td align="right">
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
    <tr className="border-t-[1px] border-pinto-gray-3/20">
      <td colSpan={8} className="relative">
        <div className="flex flex-col items-center justify-center py-2">
          <div className="sticky left-1/2 transform -translate-x-1/2">
            <Button variant="hoverTextPrimary" onClick={onClick} noPadding className="text-sm">
              See all Tractor Orders
            </Button>
          </div>
        </div>
      </td>
    </tr>
  );
};

const LoadingTableBody = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <tr key={index} className="[&_td]:px-2 [&_td]:py-1">
        <td>
          <Skeleton className="h-3 w-12" />
        </td>
        <td>
          <Skeleton className="h-3 w-12" />
        </td>
        <td align="right">
          <Skeleton className="h-3 w-24" />
        </td>
        <td align="right">
          <Skeleton className="h-3 w-20" />
        </td>
        <td align="right">
          <Skeleton className="h-3 w-28" />
        </td>
        <td align="right">
          <Skeleton className="h-3 w-20" />
        </td>
        <td align="right">
          <Skeleton className="h-3 w-14" />
        </td>
        <td align="right">
          <Skeleton className="h-3 w-20" />
        </td>
      </tr>
    ))}
  </>
);

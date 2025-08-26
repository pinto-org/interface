import { TV } from "@/classes/TokenValue";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor";
import { useTractorConvertUpOrderbook } from "@/state/tractor/useTractorConvertUpOrders";
import { formatter } from "@/utils/format";
import { exists } from "@/utils/utils";
import React, { useState } from "react";
import { Col, Row } from "../Container";
import OrderBook, { OrderbookColumnConfig } from "../OrderBook";
import { Card } from "../ui/Card";
import { TooltipLabel } from "../ui/Label";
import { MultiSlider } from "../ui/Slider";
import { Switch } from "../ui/Switch";

interface OrderBookEntry extends ConvertUpOrderbookEntry {
  decodedData: NonNullable<ConvertUpOrderbookEntry["decodedData"]>;
}

// Define the shape of the tractor order data we need
interface TractorOrder {
  bonus: TV;
  penalty: TV;
  convertAmountPDV: TV;
  minPrice: TV;
  maxPrice: TV;
  order: OrderBookEntry;
}

const empty = {};

const columns: OrderbookColumnConfig<TractorOrder>[] = [
  {
    key: "bonus",
    header: "Grown Stalk Bonus Per PDV ",
    format: (_, row) => formatter.number(row.bonus, { minDecimals: 4, maxDecimals: 4 }),
    align: "left",
  },
  {
    key: "convertAmountPDV",
    header: "Convert Amount (PDV)",
    format: (_, row) => formatter.number(row.convertAmountPDV, { minDecimals: 2, maxDecimals: 2 }),
    align: "left",
  },
];

const formatThumbValue = (value: number) => {
  return `$${value}`;
};

export default function ConvertUpTractorOrderBook() {
  const [priceToggleActive, setPriceToggleActive] = useState(false);

  const { data: orders, isLoading } = useTractorConvertUpOrderbook(empty);
  const [minPrice, setMinPrice] = useState(0.001);
  const [maxPrice, setMaxPrice] = useState(0.999);

  const filteredOrders = React.useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      return (
        order.decodedData?.convertUpParams.minPriceToConvertUp.gte(minPrice) &&
        order.decodedData?.convertUpParams.maxPriceToConvertUp.lte(maxPrice)
      );
    });
  }, [orders, minPrice, maxPrice]);

  // Transform the tractor data into the format needed for OrderBook
  const { bids, asks } = React.useMemo(
    () => transformOrderBookData(orders, filteredOrders, 10),
    [orders, filteredOrders],
  );

  return (
    <Card className="p-0">
      <Col className="p-4 gap-5 w-full">
        <Row className="w-full gap-2 justify-between">
          <span className="pinto-sm sm:pinto-body">Convert Orderbook</span>
          <Row className="gap-2">
            <span className="pinto-xs sm:pinto-sm-light text-pinto-lighter sm:text-pinto-lighter text-right">
              Toggle Price Axis
            </span>
            <Switch checked={priceToggleActive} onCheckedChange={setPriceToggleActive} />
          </Row>
        </Row>
        <Col className="gap-4">
          <TooltipLabel className="pinto-xs" tooltipText={"Price filter"}>
            {"Price Filter"}
          </TooltipLabel>
          <MultiSlider
            value={[minPrice, maxPrice]}
            onValueChange={([newMin, newMax]) => {
              setMinPrice(newMin);
              setMaxPrice(newMax);
            }}
            showThumbValue
            formatThumbValue={formatThumbValue}
            step={0.001}
            min={0.001}
            max={0.999}
          />
        </Col>
      </Col>
      <OrderBook
        bids={bids}
        asks={asks}
        columns={columns}
        depthVisualization={{
          enabled: true,
          field: "convertAmountPDV",
          alignment: "left",
        }}
        showSpread={false}
        visibleLevels={10} // Allow up to 10 levels
        isLoading={isLoading}
        onEmpty={
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="pinto-sm text-pinto-light">No convert orders available</p>
            <p className="pinto-xs text-pinto-light">Adjust the price range to see more orders</p>
          </div>
        }
      />
    </Card>
  );
}

const transformOrderBookData = (
  allOrders?: ConvertUpOrderbookEntry[],
  filteredOrders?: ConvertUpOrderbookEntry[],
  visibleLevels: number = 10,
) => {
  if (!allOrders || allOrders.length === 0) {
    // Return empty arrays when no orders
    return { bids: [], asks: [] };
  }

  // Use all orders to determine the full range
  const { orders: allValidOrders, minBonus, maxBonus, minPenalty, maxPenalty } = getValidOrders(allOrders);

  if (allValidOrders.length === 0) {
    return { bids: [], asks: [] };
  }

  // Use filtered orders for actual volume calculations
  const { orders: filteredValidOrders } = getValidOrders(filteredOrders);

  // Separate filtered orders into bids and asks
  const filteredBidOrders = filteredValidOrders.filter((order) => order.bonus.gt(TV.ZERO));
  const filteredAskOrders = filteredValidOrders.filter((order) => order.penalty.gt(TV.ZERO));

  // Check if we have any bids or asks in the full dataset to determine layout
  const allBidOrders = allValidOrders.filter((order) => order.bonus.gt(TV.ZERO));
  const allAskOrders = allValidOrders.filter((order) => order.penalty.gt(TV.ZERO));

  // Determine row counts - use original logic based on all orders
  const halfLevels = Math.floor(visibleLevels / 2);
  const bidRowCount = allAskOrders.length > 0 ? halfLevels : visibleLevels; // Use all 10 if no asks
  const askRowCount = allBidOrders.length > 0 ? halfLevels : visibleLevels; // Use all 10 if no bids

  // Create bid tiers using full range but filtered volume
  const bids =
    allBidOrders.length > 0 ? createPriceTiers(filteredBidOrders, bidRowCount, minBonus, maxBonus, true, false) : [];

  // Create ask tiers using full range but filtered volume
  const asks =
    allAskOrders.length > 0
      ? createPriceTiers(filteredAskOrders, askRowCount, minPenalty, maxPenalty, false, true)
      : [];

  return { bids, asks };
};

// Create nice rounded tier levels
const createNiceTiers = (min: TV, max: TV, count: number): TV[] => {
  const minNum = Number(min.toHuman());
  const maxNum = Number(max.toHuman());
  const range = maxNum - minNum;

  // Define nice increments based on range size
  let increment: number;
  if (range <= 0.1)
    increment = 0.005; // 0.005, 0.01, 0.015, etc.
  else if (range <= 0.5)
    increment = 0.025; // 0.025, 0.05, 0.075, etc.
  else if (range <= 1)
    increment = 0.05; // 0.05, 0.1, 0.15, etc.
  else if (range <= 2)
    increment = 0.1; // 0.1, 0.2, 0.3, etc.
  else if (range <= 5)
    increment = 0.25; // 0.25, 0.5, 0.75, etc.
  else if (range <= 10)
    increment = 0.5; // 0.5, 1, 1.5, etc.
  else if (range <= 20)
    increment = 1; // 1, 2, 3, etc.
  else if (range <= 50)
    increment = 2.5; // 2.5, 5, 7.5, etc.
  else if (range <= 100)
    increment = 5; // 5, 10, 15, etc.
  else increment = 10; // 10, 20, 30, etc.

  // Start from a nice rounded value at or below minNum
  const startValue = Math.floor(minNum / increment) * increment;

  const tiers: TV[] = [];
  let currentValue = Math.max(startValue, minNum);

  // Generate tiers within the range
  while (tiers.length < count && currentValue <= maxNum) {
    if (currentValue >= minNum) {
      tiers.push(TV.fromHuman(currentValue, min.decimals));
    }
    currentValue += increment;
  }

  // If we don't have enough tiers, fill with evenly spaced values
  if (tiers.length < count) {
    const remainingCount = count - tiers.length;
    const lastTier = tiers.length > 0 ? Number(tiers[tiers.length - 1].toHuman()) : minNum;
    const remainingRange = maxNum - lastTier;
    const evenStep = remainingRange / (remainingCount + 1);

    for (let i = 1; i <= remainingCount; i++) {
      const value = lastTier + evenStep * i;
      if (value <= maxNum) {
        tiers.push(TV.fromHuman(value, min.decimals));
      }
    }
  }

  return tiers.slice(0, count);
};

// Create price tiers at fixed intervals
const createPriceTiers = (
  orders: TractorOrder[],
  tierCount: number,
  minValue: TV,
  maxValue: TV,
  useBonus: boolean, // true for bonus-based tiers, false for penalty-based tiers
  sortAscending: boolean,
): TractorOrder[] => {
  if (orders.length === 0 || tierCount === 0) {
    return [];
  }

  const range = maxValue.sub(minValue);
  const tiers: TractorOrder[] = [];

  // If all values are the same, create a single tier with all orders
  if (range.eq(TV.ZERO)) {
    const totalAmount = orders.reduce((sum, order) => sum.add(order.convertAmountPDV), TV.ZERO);

    tiers.push({
      bonus: useBonus ? minValue : orders[0].bonus,
      penalty: !useBonus ? minValue : orders[0].penalty,
      convertAmountPDV: totalAmount,
      minPrice: orders[0].minPrice,
      maxPrice: orders[0].maxPrice,
      order: orders[0].order,
    });
    return tiers;
  }

  const tierValues = createNiceTiers(minValue, maxValue, tierCount);

  for (let i = 0; i < tierValues.length; i++) {
    const tierValue = tierValues[i];

    // Find orders closest to this tier level
    const tierOrders = orders.filter((order) => {
      const value = useBonus ? order.bonus : order.penalty;

      // Find the closest tier for this order
      let closestTierIndex = 0;
      let minDistance = Number.MAX_VALUE;

      for (let j = 0; j < tierValues.length; j++) {
        const distance = Math.abs(Number(value.toHuman()) - Number(tierValues[j].toHuman()));
        if (distance < minDistance) {
          minDistance = distance;
          closestTierIndex = j;
        }
      }

      return closestTierIndex === i;
    });

    if (tierOrders.length === 0) {
      // Create empty tier with the tier value
      tiers.push({
        bonus: tierValue,
        penalty: orders[0].penalty, // Use representative penalty
        convertAmountPDV: TV.ZERO,
        minPrice: orders[0].minPrice,
        maxPrice: orders[0].maxPrice,
        order: orders[0].order,
      });
      continue;
    }

    // Aggregate orders in this tier
    let totalConvertAmount = TV.ZERO;

    for (const order of tierOrders) {
      totalConvertAmount = totalConvertAmount.add(order.convertAmountPDV);
    }

    tiers.push({
      bonus: tierValue, // Use the fixed tier value
      penalty: tierOrders[0].penalty,
      convertAmountPDV: totalConvertAmount,
      minPrice: tierOrders[0].minPrice,
      maxPrice: tierOrders[0].maxPrice,
      order: tierOrders[0].order,
    });
  }

  const sortKey = useBonus ? "bonus" : "penalty";

  // Sort tiers by bonus value
  return tiers.sort((a, b) =>
    sortAscending ? a[sortKey].toNumber() - b[sortKey].toNumber() : b[sortKey].toNumber() - a[sortKey].toNumber(),
  );
};

const getValidOrders = (orders?: ConvertUpOrderbookEntry[]) => {
  if (!orders || orders.length === 0) {
    return { orders: [], minBonus: TV.ZERO, maxBonus: TV.ZERO, minPenalty: TV.ZERO, maxPenalty: TV.ZERO };
  }

  let minBonus = TV.MAX_UINT256;
  let maxBonus = TV.ZERO;
  let minPenalty = TV.MAX_UINT256;
  let maxPenalty = TV.ZERO;

  const valid: TractorOrder[] = [];

  for (const order of orders) {
    if (!exists(order) || !exists(order.decodedData) || !exists(order.orderInfo)) {
      continue;
    }

    const bonus = order.decodedData.convertUpParams.minGrownStalkPerBdvBonus;
    const penalty = order.decodedData.convertUpParams.maxGrownStalkPerBdvPenalty;
    const bdvLeftToConvert = order.orderInfo.bdvLeftToConvert;
    const minPrice = order.decodedData.convertUpParams.minPriceToConvertUp;
    const maxPrice = order.decodedData.convertUpParams.maxPriceToConvertUp;

    minBonus = TV.min(bonus, minBonus);
    maxBonus = TV.max(bonus, maxBonus);
    minPenalty = TV.min(penalty, minPenalty);
    maxPenalty = TV.max(penalty, maxPenalty);

    valid.push({
      bonus,
      penalty,
      minPrice,
      maxPrice,
      convertAmountPDV: bdvLeftToConvert,
      order: order as OrderBookEntry,
    });
  }

  return {
    orders: valid,
    minBonus,
    maxBonus,
    minPenalty,
    maxPenalty,
  };
};

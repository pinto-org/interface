import { Col } from "@/components/Container";
import TextSkeleton from "@/components/TextSkeleton";
import TooltipSimple from "@/components/TooltipSimple";
import { Card } from "@/components/ui/Card";
import { useTractorConvertUpOrderbook } from "@/state/tractor/useTractorConvertUpOrders";
import useConvertStalkPerBdvBonusData from "@/state/useConvertStalkPerBdvBonusData";
import { formatter } from "@/utils/format";
import { exists } from "@/utils/utils";
import { ReactNode } from "react";

const empty = {};

interface StatCardWithCardProps {
  title: string;
  tooltip: string;
  value: string | number | ReactNode;
  loading: boolean;
  className?: string;
}

function StatCardWithCard({ title, tooltip, value, loading, className = "" }: StatCardWithCardProps) {
  return (
    <Card className={`flex flex-1 p-4 min-w-0 ${className}`}>
      <Col className="gap-2 min-w-0">
        <div className="flex flex-row gap-1 flex-nowrap">
          <div className="pinto-sm-light whitespace-nowrap">{title}</div>
          <TooltipSimple variant="outlined" content={tooltip} triggerClassName="pinto-sm-light" />
        </div>
        <TextSkeleton loading={loading} height="body" className="w-10">
          <div className="pinto-body truncate">{value}</div>
        </TextSkeleton>
      </Col>
    </Card>
  );
}

export default function SiloConvertUpStats() {
  const { data, isLoading } = useConvertStalkPerBdvBonusData();
  const orderbook = useTractorConvertUpOrderbook(empty);

  // Active Orders stat data
  const activeOrdersValue = exists(orderbook.data?.length) ? orderbook.data?.length : "--";

  // Max Capacity stat data
  const maxCapacityValue = formatter.number(data?.maxCapacity, { minDecimals: 0, maxDecimals: 6 });

  // Stalk Bonus stat data
  const stalkBonusValue = data?.bonus?.toHuman();

  return (
    <>
      {/* <StatCardWithCard
        title="Active Orders"
        tooltip="The number of active Convert Up orders"
        value={activeOrdersValue}
        loading={orderbook.isLoading}
      /> */}
      <StatCardWithCard
        title="Max Capacity"
        tooltip="The maximum capacity of the Convert Up Blueprint"
        value={maxCapacityValue}
        loading={isLoading}
      />
      <StatCardWithCard
        title="Stalk Bonus / PDV"
        tooltip="The bonus given for converting up, in terms of Grown Stalk per Pinto Denominated Value"
        value={stalkBonusValue}
        loading={isLoading}
      />
    </>
  );
}

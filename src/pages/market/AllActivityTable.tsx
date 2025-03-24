import { useAllMarket } from "@/state/market/useAllMarket";
import { MarketActivityTable } from "./MarketActivityTable";

export function AllActivityTable() {
  const marketData = useAllMarket();

  return <MarketActivityTable marketData={marketData} titleText="All Pod Market transactions" />;
}

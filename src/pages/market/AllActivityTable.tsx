import { MarketActivityTable } from "./MarketActivityTable";
import { useAllMarket } from "@/state/market/useAllMarket";

export function AllActivityTable() {
  const marketData = useAllMarket();

  return <MarketActivityTable marketData={marketData} titleText="All Pod Market transactions" />;
}

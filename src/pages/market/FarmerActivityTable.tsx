import { useAccount } from "wagmi";
import { useFarmerMarket } from "@/state/market/useFarmerMarket";
import { MarketActivityTable } from "./MarketActivityTable";

export function FarmerActivityTable() {
  const account = useAccount();
  const marketData = useFarmerMarket(account.address);

  return <MarketActivityTable marketData={marketData} titleText="Your transactions" farmer={account.address} />;
}

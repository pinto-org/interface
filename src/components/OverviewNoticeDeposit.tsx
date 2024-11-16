import useTokenData from "@/state/useTokenData";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import Text from "./ui/Text";

export default function OverviewNoticeDeposit() {
  const mainToken = useTokenData().mainToken;
  return (
    <div className="bg-pinto-green-1 border border-pinto-green-4 flex flex-row items-center justify-between w-full p-6 rounded-[1.25rem] gap-2">
      <Text variant="body-light" color="green4">
        You have Pinto in your Wallet that isn’t earning yield. Deposit your Pinto for Stalk and Seed.
      </Text>
      <Button variant="gradient" size="xxl" rounded="full">
        <Link to={`/silo/${mainToken.address}`}>
          <span className="px-4">Deposit</span>
        </Link>
      </Button>
    </div>
  );
}

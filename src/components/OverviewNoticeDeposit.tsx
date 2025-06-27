import useTokenData from "@/state/useTokenData";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";

export default function OverviewNoticeDeposit() {
  const mainToken = useTokenData().mainToken;
  return (
    <div className="bg-pinto-green-1 border border-pinto-green-4 flex flex-row items-center justify-between w-full p-3 sm:p-6 rounded-[1rem] gap-2">
      <div className="pinto-sm sm:pinto-body-light text-pinto-green-4 sm:text-pinto-green-4">
        You have Pinto in your Wallet that isn’t earning yield. Deposit your Pinto for Stalk and Seed.
      </div>
      <Button variant="gradient" size="xxl" rounded="full" className="text-[1rem]">
        <Link to={`/silo/${mainToken.address}`}>
          <span className="px-4">Deposit</span>
        </Link>
      </Button>
    </div>
  );
}

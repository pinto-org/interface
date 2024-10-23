import { TokenValue } from "@/classes/TokenValue";
import { Button } from "@/components/ui/Button";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { Link } from "react-router-dom";

export default function TransferActions() {
  const priceData = usePriceData();

  const farmerBalance = useFarmerBalances();
  const farmerSilo = useFarmerSilo();
  const farmerField = useFarmerField();

  const totalInternalBalance = Array.from(farmerBalance.balances).reduce(
    (total: TokenValue, tokenBalance) =>
      total.add(
        tokenBalance[1].internal.mul(priceData.tokenPrices.get(tokenBalance[0])?.instant || TokenValue.ZERO) ||
          TokenValue.ZERO,
      ),
    TokenValue.ZERO,
  );

  const disableSendAll = totalInternalBalance.eq(0) && farmerSilo.depositsUSD.eq(0) && farmerField.totalPods.eq(0);

  return (
    <>
      <div className="flex flex-row justify-between">
        <span className={"font-[340] text-[1.25rem] text-pinto-gray-4"}>I want to send:</span>
        <Link to={"/transfer/all"}>
          <Button
            disabled={disableSendAll}
            className="font-[340] text-[1.25rem] text-pinto-green bg-transparent hover:underline hover:bg-transparent disabled:opacity-50"
          >
            Send Everything
          </Button>
        </Link>
      </div>
      <Button
        variant="outline"
        disabled={totalInternalBalance.eq(0)}
        className="font-[400] text-[1.25rem] py-10 px-6 w-full text-black hover:text-black disabled:opacity-50 rounded-full justify-between bg-white shadow-none"
      >
        <span>Tokens from my Farm Balance</span>
        <span>{`$${Number(totalInternalBalance.toHuman()).toFixed(2)}`}</span>
      </Button>
      <Button
        variant="outline"
        disabled={farmerSilo.depositsUSD.eq(0)}
        className="font-[400] text-[1.25rem] py-10 px-6 w-full text-black hover:text-black disabled:opacity-50 rounded-full justify-between bg-white shadow-none"
      >
        <span>Silo deposits</span>
        <span>{`$${Number(farmerSilo.depositsUSD.toHuman()).toFixed(2)}`}</span>
      </Button>
      <Button
        variant="outline"
        disabled={farmerField.totalPods.eq(0)}
        className="font-[400] text-[1.25rem] py-10 px-6 w-full text-black hover:text-black disabled:opacity-50 rounded-full justify-between bg-white shadow-none"
      >
        <span>Pods</span>
        <span>{`${farmerField.totalPods.toHuman()} Pods`}</span>
      </Button>
    </>
  );
}

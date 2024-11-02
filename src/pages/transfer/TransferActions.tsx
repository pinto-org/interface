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

  console.log("farmerfield: ", farmerField)

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <span className={"font-[340] text-[1.25rem] text-pinto-gray-4"}>I want to send:</span>
        <Button
          asChild
          className={`font-[340] text-[1.25rem] text-pinto-green-4 bg-transparent hover:underline hover:bg-transparent ${disableSendAll ? "opacity-50 grayscale pointer-events-none" : ""}`}
        >
          <Link to="/transfer/all">Send Everything</Link>
        </Button>
      </div>
      <Button
        variant="outline"
        asChild
        className={`font-[400] text-[1.25rem] md:py-10 md:px-6 w-full text-black hover:text-black rounded-full justify-between bg-white shadow-none ${totalInternalBalance.eq(0) ? "opacity-50 pointer-events-none" : ""}`}
      >
        <Link to="/transfer/farmbalance">
          <span>Tokens from my Farm Balance</span>
          <span>{`$${Number(totalInternalBalance.toHuman()).toFixed(2)}`}</span>
        </Link>
      </Button>
      <Button
        variant="outline"
        asChild
        disabled={farmerSilo.depositsUSD.eq(0)}
        className={`font-[400] text-[1.25rem] md:py-10 md:px-6 w-full text-black hover:text-black disabled:opacity-50 rounded-full justify-between bg-white shadow-none ${farmerSilo.depositsUSD.eq(0) ? "opacity-50 pointer-events-none" : ""}`}
      >
                <Link to="/transfer/deposits">
        <span>Silo deposits</span>
        <span>{`$${Number(farmerSilo.depositsUSD.toHuman()).toFixed(2)}`}</span>
        </Link>
      </Button>
      <Button
        variant="outline"
        asChild
        disabled={farmerField.totalPods.eq(0)}
        className={`font-[400] text-[1.25rem] md:py-10 md:px-6 w-full text-black hover:text-black disabled:opacity-50 rounded-full justify-between bg-white shadow-none ${farmerField.totalPods.eq(0) ? "opacity-50 pointer-events-none" : ""}`}
      >
                        <Link to="/transfer/pods">
        <span>Pods</span>
        <span>{`${farmerField.totalPods.toHuman()} Pods`}</span>
        </Link>
      </Button>
    </div>
  );
}

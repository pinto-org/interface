import podIcon from "@/assets/protocol/Pod.png";
import { TokenValue } from "@/classes/TokenValue";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { formatter } from "@/utils/format";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export default function TransferActions() {
  const priceData = usePriceData();

  const farmerBalance = useFarmerBalances();
  const farmerSilo = useFarmerSilo();
  const farmerField = useFarmerField();
  const repayment = useFarmerBeanstalkRepayment();

  // Compute total bsFERT token count from per-ID balances
  const totalBsFert = useMemo(() => {
    let total = 0n;
    for (const detail of repayment.fertilizer.perIdData.values()) {
      total += detail.balance;
    }
    return total;
  }, [repayment.fertilizer.perIdData]);

  const totalInternalBalance = Array.from(farmerBalance.balances).reduce(
    (total: TokenValue, tokenBalance) =>
      total.add(
        tokenBalance[1].internal.mul(priceData.tokenPrices.get(tokenBalance[0])?.instant || TokenValue.ZERO) ||
          TokenValue.ZERO,
      ),
    TokenValue.ZERO,
  );

  const disableSendAll =
    totalInternalBalance.eq(0) &&
    farmerSilo.depositsUSD.eq(0) &&
    farmerField.totalPods.eq(0) &&
    repayment.silo.balance.eq(0) &&
    repayment.pods.totalPods.eq(0) &&
    totalBsFert === 0n;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <span className={"font-[400] text-[1rem] sm:font-[340] sm:text-[1.25rem] text-pinto-gray-4"}>
          I want to send:
        </span>
        <Button
          asChild
          className={`font-[400] text-[1rem] sm:font-[340] sm:text-[1.25rem] sm:pr-0 text-pinto-green-4 bg-transparent hover:underline hover:bg-transparent ${disableSendAll ? "opacity-50 grayscale pointer-events-none" : ""}`}
        >
          <Link to="/transfer/all">Send Everything</Link>
        </Button>
      </div>
      <Button
        variant="outline"
        asChild
        className={`font-[400] text-[1rem] sm:text-[1.25rem] p-6 md:py-10 md:px-6 w-full text-black hover:text-black rounded-full justify-between bg-white shadow-none ${totalInternalBalance.eq(0) ? "opacity-50 pointer-events-none" : ""}`}
      >
        <Link to="/transfer/farmbalance">
          <span>Tokens from my Farm Wallet</span>
          <span>{formatter.usd(totalInternalBalance)}</span>
        </Link>
      </Button>
      <Button
        variant="outline"
        asChild
        disabled={farmerSilo.depositsUSD.eq(0)}
        className={`font-[400] text-[1rem] sm:text-[1.25rem] p-6 md:py-10 md:px-6 w-full text-black hover:text-black disabled:opacity-50 rounded-full justify-between bg-white shadow-none ${farmerSilo.depositsUSD.eq(0) ? "opacity-50 pointer-events-none" : ""}`}
      >
        <Link to="/transfer/deposits">
          <span>Silo Deposits</span>
          <span>{formatter.usd(farmerSilo.depositsUSD)}</span>
        </Link>
      </Button>
      <Button
        variant="outline"
        asChild
        disabled={farmerField.totalPods.eq(0)}
        className={`font-[400] text-[1rem] sm:text-[1.25rem] items-center p-6 md:py-10 md:px-6 w-full text-black hover:text-black disabled:opacity-50 rounded-full justify-between bg-white shadow-none ${farmerField.totalPods.eq(0) ? "opacity-50 pointer-events-none" : ""}`}
      >
        <Link to="/transfer/pods">
          <span>Pods</span>
          <div className="flex flex-row gap-1 items-center">
            <IconImage src={podIcon} size={6} mobileSize={5} />
            <span>{`${formatter.twoDec(farmerField.totalPods)} Pods`}</span>
          </div>
        </Link>
      </Button>
      <Button
        variant="outline"
        asChild
        className={`font-[400] text-[1rem] sm:text-[1.25rem] p-6 md:py-10 md:px-6 w-full text-black hover:text-black rounded-full justify-between bg-white shadow-none ${repayment.silo.balance.eq(0) ? "opacity-50 pointer-events-none" : ""}`}
      >
        <Link to="/transfer/beanstalk-silo">
          <span>Beanstalk Repayment Silo Tokens</span>
          <span>{`${formatter.twoDec(repayment.silo.balance)} urBDV`}</span>
        </Link>
      </Button>
      <Button
        variant="outline"
        asChild
        className={`font-[400] text-[1rem] sm:text-[1.25rem] p-6 md:py-10 md:px-6 w-full text-black hover:text-black rounded-full justify-between bg-white shadow-none ${totalBsFert === 0n ? "opacity-50 pointer-events-none" : ""}`}
      >
        <Link to="/transfer/beanstalk-fertilizer">
          <span>Beanstalk Repayment Fertilizer</span>
          <span>{`${formatter.number(Number(totalBsFert))} bsFERT`}</span>
        </Link>
      </Button>
      <Button
        variant="outline"
        asChild
        className={`font-[400] text-[1rem] sm:text-[1.25rem] items-center p-6 md:py-10 md:px-6 w-full text-black hover:text-black rounded-full justify-between bg-white shadow-none ${repayment.pods.totalPods.eq(0) ? "opacity-50 pointer-events-none" : ""}`}
      >
        <Link to="/transfer/beanstalk-pods">
          <span>Beanstalk Repayment Pods</span>
          <div className="flex flex-row gap-1 items-center">
            <IconImage src={podIcon} size={6} mobileSize={5} />
            <span>{`${formatter.twoDec(repayment.pods.totalPods)} Pods`}</span>
          </div>
        </Link>
      </Button>
    </div>
  );
}

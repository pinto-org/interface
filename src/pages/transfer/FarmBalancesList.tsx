import useFarmerBalances from "@/state/useFarmerBalances";
import { Token } from "@/utils/types";

export default function FarmBalancesList({ transferData }: { transferData?: { token: Token; amount: string }[] }) {
  const farmerBalances = useFarmerBalances();
  const tokenData: { token: Token; amount: string }[] = [];
  if (!transferData) {
    for (const data of farmerBalances.balances) {
      tokenData.push({ token: data[0], amount: data[1].internal.reDecimal(2).toHuman() });
    }
  } else {
    for (const data of transferData) {
      tokenData.push({ token: data.token, amount: data.amount });
    }
  }

  return (
    <div className="flex flex-col gap-y-4 sm:flex-wrap sm:gap-x-4">
      {tokenData.map((data) => {
        if (Number(data.amount) === 0) return;
        return (
          <div
            key={`farmBalance_value_${data.token.address}`}
            className={
              "flex flex-row gap-1.5 items-center font-[400] sm:font-[340] text-[1.5rem] sm:text-[2rem] text-pinto-gray-5"
            }
          >
            <img src={data.token.logoURI} className="h-8 w-8" alt={data.token.name} />
            <span>{data.amount}</span>
            <span>{data.token.symbol}</span>
          </div>
        );
      })}
    </div>
  );
}

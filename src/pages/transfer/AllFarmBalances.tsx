import { useFarmerBalances } from "@/state/useFarmerBalances";

export default function AllFarmBalances() {
  const farmerBalances = useFarmerBalances();
  const balancesToSend = [...farmerBalances.balances].map(([token, balance]) => ({ token, balance }));

  return (
    <div className="flex flex-wrap gap-x-4">
      {balancesToSend.map((tokenData) => {
        if (tokenData.balance.internal.eq(0)) return;
        return (
          <div
            key={`farmBalance_value_${tokenData.token.address}`}
            className={"flex flex-row gap-1.5 items-center font-[340] text-[2rem] text-pinto-gray-5"}
          >
            <img src={tokenData.token.logoURI} className="h-8 w-8" alt={tokenData.token.name} />
            <span>{tokenData.balance.internal.reDecimal(2).toHuman()}</span>
            <span>{tokenData.token.symbol}</span>
          </div>
        );
      })}
    </div>
  );
}

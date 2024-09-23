import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import pdvIcon from "@/assets/protocol/PDV.png";
import apyIcon from "@/assets/protocol/APY.svg";
import stalkIcon from "@/assets/protocol/Stalk-default.png";
import seedsIcon from "@/assets/protocol/Seed-default.png";


function SiloTable() {
  const siloData = useSiloData();
  const farmerDeposits = useFarmerDepositedBalances().data;
  const SILO_WHITELIST = useTokenData().whitelistedTokens;
  const priceData = usePriceData();

  return (

    <div className="border border-pinto-gray-2 rounded-[1rem] overflow-clip mt-2">
    <Table>
        <TableHeader>
            <TableRow className="bg-pinto-gray-1 hover:bg-pinto-gray-1 h-14">
                <TableHead className="text-black font-[400] text-[1rem] w-[20%] p-4">Token</TableHead>
                <TableHead className="text-black font-[400] text-[1rem] w-[30%]">Reward</TableHead>
                <TableHead className="text-black font-[400] text-[1rem] w-[15%]">Total Value Deposited</TableHead>
                <TableHead className="text-black text-right font-[400] text-[1rem] w-[20%]">My Deposited Amount</TableHead>
                <TableHead className="text-black text-right font-[400] text-[1rem] w-[15%] p-4">Value Deposited</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {SILO_WHITELIST.map((token) => {
                const data = siloData.tokenData.get(token);
                const userData = farmerDeposits.get(token);
                return (
                <TableRow className="h-[4.5rem] bg-white hover:bg-pinto-green-1 hover:cursor-pointer">
                    <TableCell className="text-black font-[400] text-[1rem] p-4 inline-flex items-center gap-1.5">
                        <img src={token.logoURI} className="h-8 w-8" />
                        <div>{token.name}</div>
                    </TableCell>
                    <TableCell>
                        <div className="inline-flex items-center gap-3">
                          <div className="inline-flex gap-1 px-1.5 py-1 bg-pinto-green-1 text-pinto-green font-[400] text-[1rem] rounded-[0.65em]">
                            <img src={apyIcon} />
                            {(data.yields.beanAPY * 100).toFixed(2)}% APY
                          </div>
                          <div className="inline-flex gap-1 items-center">
                            <img src={stalkIcon} className="w-[1rem] h-[1rem]" />
                            <div className="font-[400] text-[1rem]">{data.rewards.stalk.mul(1000000).reDecimal(2).toHuman()} Stalk</div>
                          </div>
                          <div className="inline-flex gap-1 items-center">
                            <img src={seedsIcon} className="w-4 h-4" />
                            <div className="font-[400] text-[1rem]">{data.rewards.seeds.reDecimal(2).toHuman()} Seeds</div>
                          </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="text-pinto-gray-5 font-[400] text-[1rem]">
                        {`$${(data.depositedBDV.mul(priceData.price)).reDecimal(2).toHuman()}`}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="text-pinto-gray-5 font-[400] text-[1rem]">
                        {`${data.totalDeposited.reDecimal(2).toHuman()} ${token.name}`}
                        </div>
                    </TableCell>
                    <TableCell className="text-black font-[400] text-[1rem] text-right p-4">
                        <div>
                            {`$${userData.currentBDV.mul(priceData.price).toHuman()}`}
                        </div>
                        <div className="inline-flex items-center gap-1">
                            <img src={pdvIcon} className="h-3 w-5" />
                            <div className="text-pinto-gray-4 font-[300] text-[1rem]">{`${userData.depositBDV.toHuman('short')} PDV`}</div>
                        </div>
                    </TableCell>
                </TableRow>
                );
            })}
        </TableBody>
    </Table>
</div>
  );
}

export default SiloTable;

import apyIcon from "@/assets/protocol/APY.svg";
import pdvIcon from "@/assets/protocol/PDV.png";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import Text from "@/components/ui/Text";
import { SEEDS } from "@/constants/internalTokens";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { useNavigate } from "react-router-dom";

function SiloTable() {
  const siloData = useSiloData();
  const farmerDeposits = useFarmerDepositedBalances().data;
  const SILO_WHITELIST = useTokenData().whitelistedTokens;
  const priceData = usePriceData();

  const navigate = useNavigate();

  return (
    <div className="border border-pinto-gray-2 rounded-[1rem] overflow-clip">
      <Table>
        <TableHeader>
          <TableRow className="bg-pinto-gray-1 hover:bg-pinto-gray-1 h-14">
            <TableHead className="text-black font-[400] text-[1rem] w-[20%] p-4">Token</TableHead>
            <TableHead className="text-black font-[400] text-[1rem] w-[30%]">Reward</TableHead>
            <TableHead className="text-black font-[400] text-right text-[1rem] w-[15%]">
              Total Value Deposited
            </TableHead>
            <TableHead className="text-black text-right font-[400] text-[1rem] w-[20%]">My Deposited Amount</TableHead>
            <TableHead className="text-black text-right font-[400] text-[1rem] w-[15%] p-4">Value Deposited</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SILO_WHITELIST.map((token) => {
            const data = siloData.tokenData.get(token);
            const userData = farmerDeposits.get(token);

            const depositedBDV = data?.depositedBDV;
            const germinatingBDV = data?.germinatingBDV;
            const totalBDV = depositedBDV?.add(germinatingBDV ?? TokenValue.ZERO);

            const userDepositedBDV = userData?.deposits.reduce(
              (acc, curr) => curr.depositBdv.add(acc),
              TokenValue.ZERO,
            );

            // const germinatingBDV = data?.
            if (!data || !userData) return;
            return (
              <TableRow
                className="h-[4.5rem] bg-white hover:bg-pinto-green-1/50 hover:cursor-pointer"
                key={`silo_table_${token.address}`}
                onClick={() => navigate(`/silo/${token.address}`)}
                data-action-target={`token-row-${token.address}`}
              >
                <Text as={TableCell} className="inline-flex items-center gap-2 p-4">
                  <IconImage src={token.logoURI} alt={token.name} size={8} />
                  {token.name}
                </Text>
                <TableCell>
                  <div className="inline-flex items-center gap-3">
                    <div className="inline-flex gap-1 px-1.5 py-1 bg-pinto-green-1 text-pinto-green font-[400] text-[1rem] rounded-[0.65em]">
                      <img src={apyIcon} alt={"apy"} />
                      <Text variant="sm" className="opacity-70">
                        {formatter.pct(data.yields.beanAPY * 100)} APY
                      </Text>
                    </div>
                    <div className="inline-flex gap-1 items-center">
                      <img src={stalkIcon} alt={"stalk"} className="w-[1rem] h-[1rem]" />
                      <Text variant="sm" className="opacity-70">
                        {formatter.noDec(data.rewards.stalk.mul(10 ** SEEDS.decimals))} Stalk
                      </Text>
                    </div>
                    <div className="inline-flex gap-1 items-center">
                      <img src={seedsIcon} alt={"seeds"} className="w-4 h-4" />
                      <Text variant="sm" className="opacity-70">
                        {formatter.twoDec(data.rewards.seeds)} Seeds
                      </Text>
                    </div>
                  </div>
                </TableCell>
                <Text as={TableCell} align="right" variant="sm" color="secondary" className="opacity-70">
                  {formatter.usd(totalBDV?.mul(priceData.price))}
                </Text>
                <Text as={TableCell} align="right" variant="sm" className="opacity-70">
                  {formatter.number(farmerDeposits.get(token)?.amount)} {token.name}
                </Text>
                <TableCell className="text-right p-4">
                  <Text variant="sm" align="right" className="opacity-70">
                    {formatter.usd(userData.currentBDV.mul(priceData.price))}
                  </Text>
                  <div className="inline-flex items-center gap-1">
                    <img src={pdvIcon} alt={"pdv"} className="h-3 w-5" />
                    <Text variant="sm-thin" align="right" color="light">
                      {formatter.pdv(userData.depositBDV)}
                    </Text>
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

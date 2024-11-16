import apyIcon from "@/assets/protocol/APY.svg";
import pdvIcon from "@/assets/protocol/PDV.png";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { UpArrowIcon } from "@/components/Icons";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import Text from "@/components/ui/Text";
import { SEEDS } from "@/constants/internalTokens";
import useFarmerActions from "@/hooks/useFarmerActions";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { sortTokensForDeposits } from "@/utils/token";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function SiloTable({ hovering }: { hovering: boolean }) {
  const siloData = useSiloData();
  const mainToken = useTokenData().mainToken;
  const farmerDeposits = useFarmerDepositedBalances().data;
  const SILO_WHITELIST = useTokenData().whitelistedTokens;
  const priceData = usePriceData();
  const farmerActions = useFarmerActions();

  // Sort tokens with PINTO first, then by Seeds
  const sortedTokens = useMemo(() => {
    return sortTokensForDeposits(
      SILO_WHITELIST,
      farmerDeposits,
      mainToken,
      priceData.price,
      "rewards",
      siloData.tokenData,
    );
  }, [farmerDeposits, priceData.price, SILO_WHITELIST, mainToken, siloData.tokenData]);

  const claimEnabled = farmerActions.claimRewards.enabled;
  const gains = farmerActions.claimRewards.outputs;
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
          {sortedTokens.map((token) => {
            const data = siloData.tokenData.get(token);
            const userData = farmerDeposits.get(token);

            const depositedBDV = data?.depositedBDV;
            const germinatingBDV = data?.germinatingBDV;
            const totalBDV = depositedBDV?.add(germinatingBDV ?? TokenValue.ZERO);

            const currentBDV = userData ? userData.currentBDV : TokenValue.ZERO;
            const depositBDV = userData ? userData.depositBDV : TokenValue.ZERO;
            const amount = userData ? userData.amount : TokenValue.ZERO;

            // const germinatingBDV = data?.
            if (!data) return;
            return (
              <TableRow
                className="h-[4.5rem] bg-white hover:bg-pinto-green-1/50 hover:cursor-pointer"
                key={`silo_table_${token.address}`}
                onClick={() => navigate(`/silo/${token.address}`)}
                data-action-target={`token-row-${token.address}`}
              >
                <Text as={TableCell} className="inline-flex items-center gap-2 p-4 mt-0.5">
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
                        {formatter.noDec(data.rewards.stalk)} Stalk
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
                <Text as={TableCell} align="right" variant="sm">
                  {token.isMain && hovering && claimEnabled ? (
                    <div className="inline-flex items-center gap-1 text-pinto-green-4">
                      <UpArrowIcon color={"currentColor"} width={20} height={20} />
                      <IconImage src={token.logoURI} size={6} />
                      <div className="font-[400] text-[1rem]">{formatter.number(amount.add(gains.beanGain))}</div>
                      <span className="text-black opacity-70">{token.name}</span>
                    </div>
                  ) : (
                    <span className="flex flex-row gap-1 items-center place-self-end">
                      <IconImage src={token.logoURI} size={6} />
                      <Text textColor="primary">{formatter.number(farmerDeposits.get(token)?.amount)}</Text>

                      <Text>{token.name}</Text>
                    </span>
                  )}
                </Text>
                <TableCell className="text-right pr-4">
                  <div className="flex flex-col items-end gap-1">
                    {token.isMain && hovering && claimEnabled ? (
                      <>
                        <span className="inline-flex items-center gap-1 text-pinto-green-4">
                          <UpArrowIcon color={"currentColor"} width={20} height={20} />
                          <Text variant="sm" align="right" color="green4">
                            {formatter.usd(currentBDV.add(gains.bdvGain).mul(priceData.price))}
                          </Text>
                        </span>
                        <div className="inline-flex items-center gap-1">
                          <img src={pdvIcon} alt={"pdv"} className="h-3 w-5" />
                          <Text variant="sm-thin" align="right" color="light">
                            {formatter.pdv(depositBDV.add(gains.bdvGain))}
                          </Text>
                        </div>
                      </>
                    ) : (
                      <>
                        <Text variant="sm" align="right">
                          {formatter.usd(currentBDV.mul(priceData.price))}
                        </Text>
                        <div className="inline-flex items-center gap-1">
                          <img src={pdvIcon} alt={"pdv"} className="h-3 w-5" />
                          <Text variant="sm-thin" align="right" color="light">
                            {formatter.pdv(depositBDV)}
                          </Text>
                        </div>
                      </>
                    )}
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

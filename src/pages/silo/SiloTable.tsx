import apyIcon from "@/assets/protocol/APY.svg";
import pdvIcon from "@/assets/protocol/PDV.png";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { UpArrowIcon } from "@/components/Icons";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import Text from "@/components/ui/Text";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
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
  const farmerSilo = useFarmerSiloNew();
  const farmerDeposits = farmerSilo.deposits;
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
  const earnedPinto = farmerActions.claimRewards.outputs.beanGain.gt(0.01);
  const gains = farmerActions.claimRewards.outputs;
  const navigate = useNavigate();

  return (
    <div className="border border-pinto-gray-2 rounded-[1rem] overflow-clip">
      <Table>
        <TableHeader>
          <TableRow className="bg-pinto-gray-1 hover:bg-pinto-gray-1 h-14">
            <TableHead className="text-black font-[400] text-[1rem] w-[20%] p-4">Token</TableHead>
            <TableHead className="text-black font-[400] text-[1rem] w-[30%]">Reward</TableHead>
            <TableHead className="text-black font-[400] text-right text-[1rem] w-[20%]">
              Total Value Deposited
            </TableHead>
            {/* <TableHead className="text-black text-right font-[400] text-[1rem] w-[20%]">My Deposited Amount</TableHead> */}
            <TableHead className="text-black text-right font-[400] text-[1rem] w-[30%] p-4">
              My Deposited Amount
            </TableHead>
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
                    <div className="inline-flex gap-1 px-1.5 py-1 bg-pinto-green-1 text-pinto-green font-[400] text-[1rem] rounded-[0.65em]">
                      <img src={apyIcon} alt={"apy"} />
                      <Text variant="sm" className="opacity-70">
                        {formatter.pct(data.yields.beanAPY * 100)} APY
                      </Text>
                    </div>
                  </div>
                </TableCell>
                <Text as={TableCell} align="right" variant="sm" color="secondary" className="opacity-70">
                  {formatter.usd(totalBDV?.mul(priceData.price))}
                </Text>
                <TableCell className="text-right pr-4">
                  <div className="flex flex-col items-end gap-1">
                    {token.isMain && hovering && earnedPinto ? (
                      <>
                        <span className="inline-flex items-center gap-1 text-pinto-green-4">
                          <UpArrowIcon color={"currentColor"} width={20} height={20} />
                          <IconImage src={token.logoURI} size={6} />

                          <Text variant="sm" align="right" color="green4">
                            {formatter.number(farmerDeposits.get(token)?.amount.add(gains.bdvGain))}
                          </Text>
                          <Text color="green4">{token.name}</Text>
                        </span>

                        <div className="inline-flex items-center gap-1">
                          <Text variant="sm-thin" align="right" color="green4">
                            {formatter.usd(currentBDV.mul(priceData.price).add(gains.beanGain.mul(priceData.price)))}
                          </Text>
                        </div>
                      </>
                    ) : (
                      <>
                        {token.isMain ? (
                          <>
                            <span className="inline-flex items-center gap-1">
                              <IconImage src={token.logoURI} size={6} />

                              <Text variant="sm">{formatter.number(farmerDeposits.get(token)?.amount)}</Text>
                              {earnedPinto ? (
                                <>
                                  <Text variant="sm" align="right" color="green4">
                                    + {formatter.number(gains.bdvGain)}
                                  </Text>
                                  <Text color="green4">{token.name}</Text>
                                </>
                              ) : (
                                <Text>{token.name}</Text>
                              )}
                            </span>
                            {earnedPinto ? (
                              <div className="inline-flex items-center gap-1">
                                <Text variant="sm-thin" align="right" color="light">
                                  {formatter.usd(currentBDV.mul(priceData.price))} +{" "}
                                </Text>
                                <Text variant="sm-thin" align="right" color="green4">
                                  {formatter.usd(gains.beanGain.mul(priceData.price))}
                                </Text>
                              </div>
                            ) : (
                              <Text variant="sm-thin" align="right" color="light">
                                {formatter.usd(currentBDV.mul(priceData.price))}
                              </Text>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center gap-1">
                              <IconImage src={token.logoURI} size={6} />

                              <Text variant="sm">{formatter.number(farmerDeposits.get(token)?.amount)}</Text>
                              <Text color="primary">{token.name}</Text>
                            </span>

                            <div className="inline-flex items-center gap-1">
                              <Text variant="sm-thin" align="right" color="light">
                                {formatter.usd(currentBDV.mul(priceData.price))}
                              </Text>
                            </div>
                          </>
                        )}
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

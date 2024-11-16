import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { RightArrowIcon, UpArrowIcon } from "@/components/Icons";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import useFarmerActions from "@/hooks/useFarmerActions";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Text from "./ui/Text";

interface FarmerDepositsTableProps {
  rewardsRef?: React.RefObject<HTMLTableRowElement>;
  hovering?: boolean;
}

const initialState = {
  height: 0,
  opacity: 0,
  borderBottomWidth: 0,
};

export default function FarmerDepositsTable({ rewardsRef, hovering = false }: FarmerDepositsTableProps) {
  const navigate = useNavigate();
  const farmerSilo = useFarmerSilo();
  const priceData = usePriceData();
  const tokenData = useTokenData();
  const mainToken = tokenData.mainToken;
  const farmerActions = useFarmerActions();
  const farmerDeposits = useFarmerDepositedBalances().data;

  const canClaim = farmerActions.claimRewards.enabled;
  const grownStalkPerToken = farmerSilo.grownStalkPerToken;

  // Sort tokens with PINTO first, then by BDV
  const sortedTokens = useMemo(() => {
    return tokenData.whitelistedTokens.sort((a, b) => {
      // PINTO is always first
      if (a.address === mainToken.address) return -1;
      if (b.address === mainToken.address) return 1;

      // Get deposit data for both tokens
      const aDeposit = farmerDeposits.get(a);
      const bDeposit = farmerDeposits.get(b);

      const aBdv = aDeposit?.depositBDV ?? TokenValue.ZERO;
      const bBdv = bDeposit?.depositBDV ?? TokenValue.ZERO;

      // Sort by BDV in descending order
      return Number(bBdv.sub(aBdv).toHuman());
    });
  }, [farmerDeposits, tokenData.whitelistedTokens, mainToken]);
  const plantData = farmerActions.tokenTotals.get(mainToken);
  const plantBeanGain = plantData?.sources.plant?.beanGain || TokenValue.ZERO;
  const plantStalkGain = plantData?.sources.plant?.stalkGain || TokenValue.ZERO;
  const plantSeedGain = plantData?.sources.plant?.seedGain || TokenValue.ZERO;
  const plantBDVGain = plantData?.sources.plant?.bdvGain || TokenValue.ZERO;

  const renderClaimableRow = () => {
    const showRow = !hovering && plantBeanGain.gte(0.01);

    const cellAnimation = {
      height: showRow ? "4.5rem" : 0,
      opacity: showRow ? 1 : 0,
      padding: showRow ? "0.5rem" : 0,
      transition: {
        height: { duration: 0.2 },
        opacity: { duration: 0.15 },
        padding: { duration: 0.2 },
      },
    };

    return (
      <TableRow
        className="bg-pinto-green-1 hover:bg-pinto-green-1 text-pinto-green-4/70"
        data-action-target="claimable-rewards"
        ref={rewardsRef}
        initial={initialState}
        animate={{
          height: showRow ? "4.5rem" : 0,
          opacity: showRow ? 1 : 0,
          borderBottomWidth: showRow ? "1px" : 0,
          transition: {
            height: { duration: 0.2 },
            opacity: { duration: 0.15 },
            borderBottomWidth: { duration: 0.1 },
          },
        }}
      >
        <TableCell initial={{ height: 0, opacity: 0, padding: 0 }} animate={cellAnimation}>
          <motion.div
            className="flex flex-row items-center gap-1.5 ml-2"
            initial={{ height: 0 }}
            animate={{ height: showRow ? "auto" : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-8 w-8 bg-pinto-green-4 rounded-full flex justify-center items-center text-white rotate-90">
              <RightArrowIcon color="currentColor" />
            </div>
            <Text variant="small" color="green4">
              Claimable
            </Text>
          </motion.div>
        </TableCell>
        <TableCell className="text-right" initial={{ height: 0, opacity: 0, padding: 0 }} animate={cellAnimation}>
          <motion.div
            className="flex flex-col items-end"
            initial={{ height: 0 }}
            animate={{ height: showRow ? "auto" : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="inline-flex items-center gap-1">
              <IconImage src={mainToken.logoURI} size={4} />
              <Text variant="small" color="green4">
                {formatter.number(plantBeanGain)} {mainToken.name}
              </Text>
            </div>
          </motion.div>
        </TableCell>
        <TableCell className="text-right" initial={{ height: 0, opacity: 0, padding: 0 }} animate={cellAnimation}>
          <motion.div
            className="flex flex-col items-end"
            initial={{ height: 0 }}
            animate={{ height: showRow ? "auto" : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="inline-flex items-center gap-1">
              <IconImage src={stalkIcon} size={4} />
              <Text variant="small" color="green4">
                {formatter.number(plantStalkGain)}
              </Text>
            </div>
          </motion.div>
        </TableCell>
        <TableCell initial={{ height: 0, opacity: 0, padding: 0 }} animate={cellAnimation}>
          <motion.div
            className="flex flex-col items-end text-right mr-2"
            initial={{ height: 0 }}
            animate={{ height: showRow ? "auto" : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="inline-flex items-center gap-1">
              <IconImage src={seedIcon} size={4} />
              <Text variant="small" color="green4">
                {formatter.number(plantSeedGain)}
              </Text>
            </div>
          </motion.div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className={`relative action-container overflow-visible ${hovering && canClaim && "mb-[4.5rem]"}`}>
      <div className="border border-pinto-gray-2 rounded-[1rem] overflow-clip">
        <Table>
          <TableHeader>
            <TableRow className="bg-pinto-gray-1 hover:bg-pinto-gray-1 h-14">
              <TableHead className="text-black font-[400] text-[1rem] w-1/4 p-4">Deposited Asset</TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">Amount Deposited</TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">
                <div className="flex flex-row items-center justify-end gap-2">
                  {/* <IconImage src={stalkIcon} size={6} /> */}
                  Stalk
                </div>
              </TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4 p-4">
                <div className="flex flex-row items-center justify-end gap-2">
                  {/* <IconImage src={seedIcon} size={6} /> */}
                  Seeds
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderClaimableRow()}
            {sortedTokens.map((token, i) => {
              const userData = farmerDeposits.get(token);
              const grownStalk = grownStalkPerToken.get(token) || TokenValue.ZERO;

              const data = {
                rewards: farmerActions.tokenTotals.get(token)?.sources.mow,
                update: farmerActions.tokenTotals.get(token)?.sources.update,
              };

              const rewardGains = {
                beanGain: data.rewards?.beanGain || TokenValue.ZERO,
                bdvGain: data.rewards?.bdvGain || TokenValue.ZERO,
                seedGain: data.rewards?.seedGain || TokenValue.ZERO,
                stalkGain: data.rewards?.stalkGain || TokenValue.ZERO,
              };

              const updateGains = {
                beanGain: data.update?.beanGain || TokenValue.ZERO,
                bdvGain: data.update?.bdvGain || TokenValue.ZERO,
                seedGain: data.update?.seedGain || TokenValue.ZERO,
                stalkGain: data.update?.stalkGain || TokenValue.ZERO,
              };

              const addClaimable = token.isMain;

              return (
                <TableRow
                  key={`${token.address}_${i}`}
                  className={`h-[4.5rem] bg-white hover:bg-pinto-green-1/50 hover:cursor-pointer .${token.symbol}-row`}
                  onClick={() => navigate(`/silo/${token.address}`)}
                  data-action-target={`token-row-${token.address}`}
                >
                  <TableCell className="text-black font-[400] text-[1rem]">
                      <img src={token.logoURI} className="h-8 w-8" alt={`${token.name} logo`} />
                      <Text variant="sm" noLineHeight>{token.name}</Text>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-end">
                      {!hovering || (rewardGains.beanGain.lt(0.01) && updateGains.bdvGain.lt(0.01)) ? (
                        <>
                          <div className="inline-flex items-center gap-1">
                            <IconImage src={token.logoURI} size={4} />
                            <div className="text-black font-[400] text-[1rem]">
                              {formatter.number(userData?.amount)} {token.name}
                            </div>
                          </div>
                          <div className="text-pinto-gray-4 font-[300] text-[1rem]">
                            {formatter.usd(userData?.depositBDV.mul(priceData.price))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={`inline-flex items-center gap-1 ${rewardGains.beanGain.gt(0) ? "text-pinto-green-4" : ""}`}
                          >
                            {rewardGains.beanGain.gt(0) && <UpArrowIcon color={"currentColor"} />}
                            <IconImage src={token.logoURI} size={4} />
                            <div className="font-[400] text-[1rem]">
                              {formatter.number(userData?.amount.add(rewardGains.beanGain))} {token.name}
                            </div>
                          </div>
                          <div className="text-pinto-gray-4 font-[300] text-[1rem]">
                            {formatter.usd(
                              userData?.depositBDV
                                .add(rewardGains.bdvGain)
                                .add(updateGains.bdvGain)
                                .add(addClaimable ? plantBDVGain : 0)
                                .mul(priceData.price),
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-[400] text-[1rem] text-right">
                    {!hovering || (updateGains.stalkGain.lt(0.01) && grownStalk.lt(0.01)) ? (
                      <div className="flex flex-col items-end">
                        <div className="inline-flex items-center gap-1">
                          <IconImage src={stalkIcon} size={4} />
                          <div>{formatter.number(userData?.stalk.base)}</div>
                        </div>
                        {grownStalk.gt(0.01) && (
                          <div className="text-pinto-gray-4">
                            Claimable Grown Stalk:{" "}
                            <span className="text-pinto-green-4/70">+{formatter.number(grownStalk)}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-end text-pinto-stalk-gold">
                        <div className="inline-flex items-center gap-1">
                          <UpArrowIcon color={"currentColor"} />
                          <IconImage src={stalkIcon} size={4} />
                          <div>
                            {formatter.number(
                              userData?.stalk.base
                                .add(grownStalk)
                                .add(updateGains.stalkGain)
                                .add(addClaimable ? plantStalkGain : 0),
                            )}
                          </div>
                        </div>
                        {data.update?.stalkFromBDVIncrease.gt(0.01) && (
                          <div>
                            Bonus Stalk for updating PDV: <span>{formatter.number(updateGains.bdvGain)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-black font-[400] text-[1rem] text-right p-4">
                    {!hovering || (rewardGains.seedGain.lt(0.01) && updateGains.seedGain.lt(0.01)) ? (
                      <div className="flex flex-col items-end">
                        <div className="inline-flex items-center gap-1">
                          <IconImage src={seedIcon} size={4} />
                          <div>{formatter.number(userData?.seeds)}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end text-pinto-seed-silver">
                        <div className="inline-flex items-center gap-1">
                          <UpArrowIcon color={"currentColor"} />
                          <IconImage src={seedIcon} size={4} />
                          <div>
                            {formatter.number(
                              userData?.seeds
                                .add(rewardGains.seedGain)
                                .add(updateGains.seedGain)
                                .add(addClaimable ? plantSeedGain : 0),
                            )}
                          </div>
                        </div>
                        {data.update?.seedsFromBDVIncrease.gt(0.01) && (
                          <div>
                            Bonus Seeds for updating PDV: <span>{formatter.number(updateGains.seedGain)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

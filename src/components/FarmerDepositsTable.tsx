import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { RightArrowIcon, UpArrowIcon } from "@/components/Icons";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { useDenomination } from "@/hooks/useAppSettings";
import { useClaimRewards } from "@/hooks/useClaimRewards";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { trackSimpleEvent, withTracking } from "@/utils/analytics";
import { formatter } from "@/utils/format";
import { stringEq } from "@/utils/string";
import { sortTokensForDeposits } from "@/utils/token";
import { motion } from "framer-motion";
import { Dispatch, RefObject, SetStateAction, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CornerBorders from "./CornerBorders";
import TooltipSimple from "./TooltipSimple";

interface FarmerDepositsTableProps {
  rewardsRef?: RefObject<HTMLTableRowElement>;
  hoveredButton?: string;
  setHoveredButton: Dispatch<SetStateAction<string>>;
}

const initialState = {
  height: 0,
  opacity: 0,
  borderBottomWidth: 0,
};

export default function FarmerDepositsTable({
  rewardsRef,
  hoveredButton = "",
  setHoveredButton,
}: FarmerDepositsTableProps) {
  const navigate = useNavigate();
  const farmerSilo = useFarmerSilo();
  const priceData = usePriceData();
  const tokenData = useTokenData();
  const siloData = useSiloData();
  const mainToken = tokenData.mainToken;
  const farmerActions = useFarmerActions();
  const farmerDeposits = farmerSilo.deposits;
  const denomination = useDenomination();
  const { submitClaimRewards } = useClaimRewards();

  const canClaim = farmerActions.claimRewards.enabled;
  const grownStalkPerToken = farmerSilo.grownStalkPerToken;

  const hoveringClaim = hoveredButton === "claim";
  const hoveringWrap = hoveredButton === "wrap";

  // Sort tokens with PINTO first, then by BDV
  const sortedTokens = useMemo(() => {
    const sorted = sortTokensForDeposits(
      tokenData.mayBeWhitelistedTokens,
      farmerDeposits,
      mainToken,
      priceData.price,
      "value",
    );
    const filtered = sorted.filter((token) => {
      if (token.isWhitelisted) {
        return true;
      }
      const hasDeposits = farmerDeposits.get(token)?.amount?.gt(0);

      return !!hasDeposits;
    });

    return filtered;
  }, [farmerDeposits, priceData.price, tokenData.mayBeWhitelistedTokens, mainToken]);

  const claimBeanGain = farmerActions.claimRewards.outputs.beanGain;
  const claimStalkGain = farmerActions.claimRewards.outputs.stalkGain;
  const claimSeedGain = farmerActions.claimRewards.outputs.seedGain;
  const claimBDVGain = farmerActions.claimRewards.outputs.bdvGain;

  const updateBeanGain = farmerActions.updateDeposits.totalGains.beanGain;
  const updateStalkGain = farmerActions.updateDeposits.totalGains.stalkGain;
  const updateSeedGain = farmerActions.updateDeposits.totalGains.seedGain;
  const updateBDVGain = farmerActions.updateDeposits.totalGains.bdvGain;

  const beanGain = claimBeanGain.add(updateBeanGain);
  const stalkGain = claimStalkGain.add(updateStalkGain);
  const seedGain = claimSeedGain.add(updateSeedGain);
  const BDVGain = claimBDVGain.add(updateBDVGain);

  const renderClaimableRow = () => {
    const showRow = stalkGain.gte(0.01);

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
        className={`bg-pinto-green-1 hover:bg-pinto-green-1/50 hover:opacity-50 hover:cursor-pointer text-pinto-green-4/70 ${showRow ? "pointer-events-auto" : "pointer-events-none"}`}
        data-action-target="claimable-rewards"
        ref={rewardsRef}
        initial={initialState}
        onClick={withTracking(ANALYTICS_EVENTS.OVERVIEW.DEPOSITS_CLAIM_REWARDS_CLICK, submitClaimRewards, {
          source_component: "deposits_table",
        })}
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
        onMouseEnter={() => setHoveredButton("claim")}
        onMouseLeave={() => setHoveredButton("")}
      >
        <TableCell initial={{ height: 0, opacity: 0, padding: 0 }} animate={cellAnimation}>
          <motion.div
            className="flex flex-row items-center gap-1.5 ml-0 sm:ml-2"
            initial={{ height: 0 }}
            animate={{ height: showRow ? "auto" : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-8 w-8 bg-pinto-green-4 rounded-full flex justify-center items-center text-white rotate-90">
              <RightArrowIcon color="currentColor" />
            </div>
            <div className="pinto-sm text-pinto-green-4">Claimable</div>
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
              <div className="pinto-sm text-pinto-green-4 inline-flex gap-1">
                <span>{formatter.number(beanGain)}</span>
                <span className="max-[1300px]:hidden block">{mainToken.name}</span>
              </div>
            </div>
          </motion.div>
        </TableCell>
        <TableCell
          className="text-right hidden sm:table-cell"
          initial={{ height: 0, opacity: 0, padding: 0 }}
          animate={cellAnimation}
        >
          <motion.div
            className="flex flex-col items-end"
            initial={{ height: 0 }}
            animate={{ height: showRow ? "auto" : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="inline-flex items-center gap-1">
              <IconImage src={stalkIcon} size={4} />
              <div className="pinto-sm text-pinto-green-4">{formatter.number(stalkGain)}</div>
            </div>
          </motion.div>
        </TableCell>
        <TableCell
          className="hidden sm:table-cell"
          initial={{ height: 0, opacity: 0, padding: 0 }}
          animate={cellAnimation}
        >
          <motion.div
            className="flex flex-col items-end text-right mr-2"
            initial={{ height: 0 }}
            animate={{ height: showRow ? "auto" : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="inline-flex items-center gap-1">
              <IconImage src={seedIcon} size={4} />
              <div className="pinto-sm text-pinto-green-4">{formatter.number(seedGain)}</div>
            </div>
          </motion.div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className={`relative action-container overflow-visible`}>
      <div className="border border-pinto-gray-2 rounded-[1rem] overflow-clip">
        <Table>
          <TableHeader className="bg-pinto-gray-1 hover:bg-pinto-gray-1">
            <TableRow className="bg-pinto-gray-1 hover:bg-pinto-gray-1 h-14">
              <TableHead className="text-black font-[400] text-[1rem] w-[22.5%] p-2 sm:p-4">Deposited Asset</TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] max-[1350px]:w-[32.5%] w-[27.5%]">
                Amount Deposited
              </TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] max-[1350px]:w-[25%] w-[30%] hidden sm:table-cell">
                <div className="flex flex-row items-center justify-end gap-2">
                  {/* <IconImage src={stalkIcon} size={6} /> */}
                  Stalk
                </div>
              </TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-[20%] hidden sm:table-cell p-4">
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
              const pool = priceData.pools.find((poolData) => stringEq(poolData.pool.address, token.address));
              const poolPrice = pool?.price ?? TokenValue.ZERO;

              const userData = farmerDeposits.get(token);
              const grownStalk = grownStalkPerToken?.get(token) || TokenValue.ZERO;
              const amountOfDeposits = userData?.deposits.length || 0;
              const germinatingStalk =
                userData?.deposits.reduce(
                  (sum, deposit) => sum.add(deposit.isGerminating ? deposit.stalk.germinating : TokenValue.ZERO),
                  TokenValue.ZERO,
                ) || TokenValue.ZERO;

              const tokenSiloData = siloData.tokenData.get(token);

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

              const effectiveBDV = !token.isWhitelisted
                ? userData?.depositBDV
                : userData?.currentBDV.gt(0)
                  ? userData?.currentBDV
                  : userData?.depositBDV;

              const addClaimable = token.isMain;

              return (
                <TableRow
                  key={`${token.address}_${i}`}
                  className={`h-[4.5rem] hover:cursor-pointer ${
                    !token.isWhitelisted
                      ? "bg-gray-100 opacity-60 hover:bg-gray-200"
                      : germinatingStalk.gt(0)
                        ? "bg-pinto-off-green/15 hover:bg-pinto-green-1/50"
                        : "bg-white hover:bg-pinto-green-1/50"
                  } ${(amountOfDeposits === 0 && !addClaimable) || (addClaimable && amountOfDeposits === 0 && !hoveringClaim && beanGain.gt(0)) ? "opacity-70" : "opacity-100"}`}
                  onClick={withTracking(
                    ANALYTICS_EVENTS.OVERVIEW.DEPOSITS_TOKEN_ROW_CLICK,
                    () => navigate(`/silo/${token.address}`),
                    {
                      token_symbol: token.symbol,
                      token_name: token.name,
                      source_page: "farmer_overview",
                    },
                  )}
                  data-action-target={`token-row-${token.address}`}
                >
                  <TableCell className="text-black/70 font-[400] text-[1rem]">
                    <div className="pl-0 sm:pl-2 flex-row items-center gap-1.5">
                      <div className="inline-flex items-center gap-1.5">
                        <img src={token.logoURI} className="h-8 w-8 min-w-8 max-w-8" alt={`${token.name} logo`} />
                        <div className="flex-row space-y-0.5">
                          <div className="pinto-sm whitespace-nowrap flex flex-col gap-1">
                            {token.name}
                            {!token.isWhitelisted && (
                              <div className="bg-pinto-gray-2/70 text-pinto-secondary px-[0.1875rem] py-[0.1875rem] rounded-[0.25rem] pinto-xs w-fit leading-none">
                                Dewhitelisted
                              </div>
                            )}
                          </div>
                          <div className="pinto-xs sm:pinto-sm inline-flex items-center align-bottom gap-1 opacity-70 flex-wrap">
                            <span className="inline-flex gap-1 text-pinto-gray-4">
                              <IconImage src={seedIcon} alt={"seeds"} size={4} />
                              {formatter.twoDec(tokenSiloData?.rewards.seeds)}
                              <span>Seeds</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-end text-right">
                      {!hoveringClaim ||
                      (rewardGains.beanGain.lt(0.01) &&
                        updateGains.bdvGain.lt(0.01) &&
                        addClaimable &&
                        beanGain.lt(0.01)) ? (
                        <>
                          <div className="inline-flex items-center gap-1">
                            <IconImage src={token.logoURI} size={4} />
                            <div className="text-black/70 font-[400] text-[1rem] inline-flex items-center gap-1">
                              <span>{formatter.token(userData?.amount, token)}</span>
                              <span className="max-[1300px]:hidden block">{token.name}</span>
                            </div>
                          </div>
                          <div className="text-pinto-gray-4 font-[300] text-[1rem]">
                            {denomination === "USD"
                              ? formatter.usd(effectiveBDV?.mul(token.isMain ? priceData.price : poolPrice))
                              : formatter.pdv(userData?.depositBDV)}
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={`inline-flex items-center gap-1 ${rewardGains.beanGain.gt(0.01) || (addClaimable && beanGain.gt(0.01)) ? "text-pinto-green-4" : ""}`}
                          >
                            {rewardGains.beanGain.gt(0) ||
                              (addClaimable && beanGain.gt(0) && <UpArrowIcon color={"currentColor"} />)}
                            <IconImage src={token.logoURI} size={4} />
                            <div className="font-[400] text-[1rem]">
                              {formatter.token(
                                userData?.amount.add(rewardGains.beanGain).add(addClaimable ? beanGain : 0),
                                token,
                              )}{" "}
                              {token.name}
                            </div>
                          </div>
                          <div
                            className={`${rewardGains.bdvGain.gt(0.01) || updateGains.bdvGain.gt(0.01) || (addClaimable && BDVGain.gt(0.01)) ? "text-pinto-green-4" : "text-pinto-gray-4"} font-[300] text-[1rem]`}
                          >
                            {denomination === "USD"
                              ? formatter.usd(
                                  effectiveBDV
                                    ?.add(rewardGains.bdvGain)
                                    .add(updateGains.bdvGain)
                                    .add(addClaimable ? BDVGain : 0)
                                    .mul(token.isMain ? priceData.price : poolPrice),
                                )
                              : formatter.pdv(
                                  userData?.depositBDV
                                    .add(rewardGains.bdvGain)
                                    .add(updateGains.bdvGain)
                                    .add(addClaimable ? BDVGain : 0),
                                )}
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-black/70 font-[400] text-[1rem] text-right hidden sm:table-cell">
                    {!hoveringClaim ||
                    (updateGains.stalkGain.lt(0.01) && grownStalk.lt(0.01) && addClaimable && stalkGain.lt(0.01)) ? (
                      <div className="flex flex-col items-end">
                        <div className="inline-flex items-center gap-1">
                          <IconImage src={stalkIcon} size={4} />
                          {!(userData?.stalk.base.eq(0) && amountOfDeposits === 1 && germinatingStalk.gt(0)) && (
                            <div>{formatter.twoDec(userData?.stalk.base)}</div>
                          )}
                          {germinatingStalk.gt(0.01) && (
                            <TooltipSimple content={"This Stalk is germinating."}>
                              <div className="text-pinto-off-green/60">
                                {formatter.twoDec(germinatingStalk, { showPositiveSign: amountOfDeposits > 1 })}
                              </div>
                            </TooltipSimple>
                          )}
                        </div>
                        {grownStalk.gt(0.01) && (
                          <div className="text-pinto-gray-4/70 inline-flex items-center gap-1">
                            <span className="hidden min-[1350px]:block">Claimable Grown Stalk:</span>
                            <span className="min-[1350px]:hidden">Claimable:</span>
                            <span className="text-pinto-green-4/70">+{formatter.twoDec(grownStalk)}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`flex flex-col items-end ${rewardGains.stalkGain.gt(0.01) || data.update?.stalkFromBDVIncrease.gt(0.01) || grownStalk.gt(0.01) || (addClaimable && stalkGain.gt(0.01)) ? "text-pinto-stalk-gold" : ""}`}
                      >
                        <div className="inline-flex items-center gap-1">
                          {(rewardGains.stalkGain.gt(0.01) ||
                            data.update?.stalkFromBDVIncrease.gt(0.01) ||
                            grownStalk.gt(0.01) ||
                            (addClaimable && stalkGain.gt(0.01))) && <UpArrowIcon color={"currentColor"} />}
                          <IconImage src={stalkIcon} size={4} />
                          <div>
                            {formatter.twoDec(
                              userData?.stalk.base
                                .add(grownStalk)
                                .add(updateGains.stalkGain)
                                .add(addClaimable ? stalkGain : 0),
                            )}
                          </div>
                          {germinatingStalk.gt(0) && (
                            <TooltipSimple content={"This Stalk is germinating."}>
                              <div className="text-pinto-off-green/60">
                                {formatter.twoDec(germinatingStalk, {
                                  showPositiveSign: Boolean(
                                    amountOfDeposits > 1 ||
                                      userData?.stalk.base
                                        .add(grownStalk)
                                        .add(updateGains.stalkGain)
                                        .add(addClaimable ? stalkGain : 0),
                                  ),
                                })}
                              </div>
                            </TooltipSimple>
                          )}
                        </div>
                        {data.update?.stalkFromBDVIncrease.gt(0.01) && (
                          <div>
                            Bonus Stalk for updating PDV: <span>{formatter.twoDec(updateGains.bdvGain)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-black/70 font-[400] text-[1rem] text-right p-4 hidden sm:table-cell">
                    {!hoveringClaim ||
                    (rewardGains.seedGain.lt(0.01) &&
                      updateGains.seedGain.lt(0.01) &&
                      addClaimable &&
                      seedGain.lt(0.01)) ? (
                      <div className="flex flex-col items-end">
                        <div className="inline-flex items-center gap-1">
                          <IconImage src={seedIcon} size={4} />
                          <div>{formatter.twoDec(userData?.seeds)}</div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`flex flex-col items-end ${rewardGains.seedGain.gt(0.01) || updateGains.seedGain.gt(0.01) || (addClaimable && seedGain.gt(0.01)) ? "text-pinto-seed-silver" : ""}`}
                      >
                        <div className="inline-flex items-center gap-1">
                          {rewardGains.seedGain.gt(0.01) ||
                            updateGains.seedGain.gt(0.01) ||
                            (addClaimable && seedGain.gt(0.01) && <UpArrowIcon color={"currentColor"} />)}
                          <IconImage src={seedIcon} size={4} />
                          <div>
                            {formatter.twoDec(
                              userData?.seeds
                                .add(rewardGains.seedGain)
                                .add(updateGains.seedGain)
                                .add(addClaimable ? seedGain : 0),
                            )}
                          </div>
                        </div>
                        {data.update?.seedsFromBDVIncrease.gt(0.01) && (
                          <div>
                            Bonus Seeds for updating PDV: <span>{formatter.twoDec(updateGains.seedGain)}</span>
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
      {stalkGain.gte(0.01) && <CornerBorders rowNumber={0} active={hoveringClaim} />}
      <CornerBorders
        rowNumber={sortedTokens.findIndex((token) => token.isMain) + (stalkGain.gte(0.01) ? 1 : 0)}
        active={hoveringWrap}
      />
    </div>
  );
}

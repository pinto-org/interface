import apyIcon from "@/assets/protocol/APY.svg";
import pdvIcon from "@/assets/protocol/PDV.png";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import APYTooltip from "@/components/APYTooltip";
import { InlineCenterSpan } from "@/components/Container";
import { UpArrowIcon } from "@/components/Icons";
import TooltipSimple from "@/components/TooltipSimple";
import IconImage from "@/components/ui/IconImage";
import { Separator } from "@/components/ui/Separator";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { PINTO } from "@/constants/tokens";
import { useDenomination } from "@/hooks/useAppSettings";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { EMAWindows, SiloYieldsByToken, useSiloYieldsByToken } from "@/state/useSiloAPYs";
import { useSiloData } from "@/state/useSiloData";
import { useSeason } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { stringEq } from "@/utils/string";
import { getTokenIndex, sortTokensForDeposits } from "@/utils/token";
import { AddressLookup } from "@/utils/types.generic";
import { cn } from "@/utils/utils";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function SiloTable({ hovering }: { hovering: boolean }) {
  const siloData = useSiloData();
  const mainToken = useTokenData().mainToken;
  const farmerSilo = useFarmerSilo();
  const farmerDeposits = farmerSilo.deposits;
  const SILO_WHITELIST = useTokenData().whitelistedTokens;
  const priceData = usePriceData();
  const farmerActions = useFarmerActions();
  const { data: apys } = useSiloTableAPYs();

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
  const denomination = useDenomination();

  const hideFlags = useMemo(() => {
    if (!apys) {
      return {
        hide24hEma: false,
        hide7dEma: false,
        hide30dEma: false,
      };
    }
    const values = Object.values(apys);
    return {
      hide24hEma: Math.max(...values.map((addr) => addr.ema24.apy)) === 0,
      hide7dEma: Math.max(...values.map((addr) => addr.ema168.apy)) === 0,
      hide30dEma: Math.max(...values.map((addr) => addr.ema720.apy)) === 0,
    };
  }, [apys]);

  return (
    <div className="border border-pinto-gray-2 rounded-[1rem] overflow-clip">
      {/* <ScrollArea className="w-full"> */}
      <Table className="w-full">
        <TableHeader className="rounded-t-xl bg-pinto-gray-1 hover:bg-pinto-gray-1">
          <TableRow className="rounded-[1rem] bg-pinto-gray-1 hover:bg-pinto-gray-1 h-14">
            <TableHead className="text-black font-[400] text-[1rem] w-[60%] sm:w-[20%] lg:w-[5%] sm:min-w-[150px] min-[1270px]:w-[15%] 2xl:w-[20%] pl-3 pr-1 py-2.5 sm:p-4">
              Token
            </TableHead>
            <TableHead className="text-black font-[400] text-[1rem] w-[35%] min-[1600px]:w-[40%] hidden sm:table-cell">
              <APYHeader hide24h={hideFlags.hide24hEma} hide7d={hideFlags.hide7dEma} hide30d={hideFlags.hide30dEma} />
            </TableHead>
            <TableHead className="text-black font-[400] text-right text-[1rem] w-[10%] min-[1600px]:whitespace-nowrap hidden sm:table-cell">
              Total Value Deposited
            </TableHead>
            {/* <TableHead className="text-black text-right font-[400] text-[1rem] w-[20%]">My Deposited Amount</TableHead> */}
            <TableHead className="text-black text-right font-[400] text-[1rem] w-[20%] min-[1600px]:w-[30%] p-4 hidden sm:table-cell">
              My Deposits
            </TableHead>
            <TableHead className="text-black text-right font-[400] text-[1rem] w-[40%] pl-1 pr-2 py-2.5 sm:hidden">
              <APYHeader hide24h={hideFlags.hide24hEma} hide7d={hideFlags.hide7dEma} hide30d={hideFlags.hide30dEma} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTokens.map((token) => {
            const data = siloData.tokenData.get(token);
            const userData = farmerDeposits.get(token);
            const apy = apys?.[getTokenIndex(token)] as ExtendSiloTokenYield | undefined;

            const depositedBDV = data?.depositedBDV;
            const germinatingBDV = data?.germinatingBDV;
            const totalBDV = depositedBDV?.add(germinatingBDV ?? TokenValue.ZERO);

            const currentBDV = userData ? userData.currentBDV : TokenValue.ZERO;
            const depositBDV = userData ? userData.depositBDV : TokenValue.ZERO;
            const amount = userData ? userData.amount : TokenValue.ZERO;

            const _pool = priceData.pools.find((poolData) => stringEq(poolData.pool.address, token.address));
            const _poolPrice = _pool?.price ?? TokenValue.ZERO;

            const hasGerminatingDeposits = farmerSilo.deposits
              .get(token)
              ?.deposits.some((deposit) => deposit.isGerminating && !deposit.isPlantDeposit);

            if (!data) return;

            return (
              <TableRow
                className={`h-[4.5rem] ${hasGerminatingDeposits ? "bg-pinto-off-green/15" : "bg-white"} hover:bg-pinto-green-1/50 hover:cursor-pointer`}
                key={`silo_table_${token.address}`}
                onClick={() => navigate(`/silo/${token.address}`)}
                data-action-target={`token-row-${token.address}`}
              >
                <TableCell className="text-left pl-2 sm:pl-4 table-cell items-center">
                  <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                      <IconImage src={token.logoURI} alt={token.name} size={8} />
                      {token.name}
                    </div>
                    <div className="sm:hidden">
                      <div className="pinto-xs inline-flex gap-0.5">
                        <span className="text-pinto-gray-4">Value:</span>
                        {farmerSilo.isLoading ? (
                          <Skeleton className="w-16 h-4 rounded-[0.75rem]" />
                        ) : (
                          <span>
                            {formatter.usd(
                              farmerDeposits.get(token)?.currentBDV.mul(token.isMain ? priceData.price : _poolPrice),
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    {earnedPinto && token.isMain && (
                      <div className="sm:hidden">
                        <div className="pinto-xs inline-flex gap-0.5">
                          <span className="text-pinto-gray-4">Claimable:</span>
                          {farmerSilo.isLoading ? (
                            <Skeleton className="w-16 h-4 rounded-[0.75rem]" />
                          ) : (
                            <span className="text-pinto-green">
                              {formatter.usd(farmerActions.claimRewards.outputs.beanGain.mul(priceData.price))}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="pl-1 pr-2 py-2.5 sm:p-auto ">
                  <div className="flex flex-col-reverse place-self-end items-center gap-3 sm:place-self-start sm:flex-row">
                    <div className="inline-flex items-center gap-1 sm:gap-3">
                      <div className="pinto-xs sm:pinto-sm inline-flex items-center gap-1 opacity-70 flex-wrap">
                        <InlineCenterSpan gap1>
                          <IconImage src={stalkIcon} alt={"stalk"} size={4} />
                          {formatter.noDec(data.rewards.stalk)}
                        </InlineCenterSpan>
                        Stalk
                      </div>
                      <div className="pinto-xs sm:pinto-sm inline-flex items-center gap-1 opacity-70 flex-wrap">
                        <InlineCenterSpan gap1>
                          <IconImage src={seedsIcon} alt={"seeds"} size={4} />
                          {formatter.twoDec(data.rewards.seeds)}
                        </InlineCenterSpan>
                        Seeds
                      </div>
                    </div>
                    <div className="hidden sm:inline">
                      <APYCell apys={apy} />
                    </div>
                    <div className="sm:hidden">
                      <APYCell apys={apy} noTooltip />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="pinto-sm text-right text-pinto-secondary pl-0 opacity-70 hidden sm:table-cell">
                  {farmerSilo.isLoading ? (
                    <Skeleton className="w-20 h-6 rounded-[0.75rem] ml-auto" />
                  ) : _pool || token.isMain ? (
                    formatter.usd(totalBDV?.mul(_pool ? _pool.price : priceData.price))
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right pr-4 hidden sm:table-cell">
                  <div className="flex flex-col items-end gap-1 whitespace-nowrap">
                    {token.isMain && hovering && earnedPinto ? (
                      <>
                        <span className="inline-flex items-center gap-1 text-pinto-green-4">
                          <UpArrowIcon color={"currentColor"} width={"1.25rem"} height={"1.25rem"} />
                          <IconImage src={token.logoURI} size={6} />
                          {farmerSilo.isLoading ? (
                            <Skeleton className="w-20 h-6 rounded-[0.75rem]" />
                          ) : (
                            <div className="pinto-sm text-right text-pinto-green-4">
                              {formatter.number(farmerDeposits.get(token)?.amount.add(gains.bdvGain))}
                            </div>
                          )}
                          <div className="pinto-sm text-pinto-green-4 hidden min-[1600px]:block">{token.name}</div>
                        </span>
                        <div className="inline-flex items-center gap-1">
                          {farmerSilo.isLoading ? (
                            <Skeleton className="w-20 h-6 rounded-[0.75rem]" />
                          ) : (
                            <div className="pinto-sm-thin text-right text-pinto-green-4">
                              {formatter.usd(currentBDV.mul(priceData.price).add(gains.beanGain.mul(priceData.price)))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {token.isMain ? (
                          <>
                            <span className="inline-flex items-center gap-1">
                              <IconImage src={token.logoURI} size={6} />

                              {farmerSilo.isLoading ? (
                                <Skeleton className="w-20 h-6 rounded-[0.75rem]" />
                              ) : (
                                <div className="pinto-sm">{formatter.number(farmerDeposits.get(token)?.amount)}</div>
                              )}
                              {earnedPinto ? (
                                <>
                                  <div className="pinto-sm text-right text-pinto-green-4">
                                    + {formatter.number(gains.bdvGain)}
                                  </div>
                                  <div className="pinto-sm text-pinto-green-4 hidden min-[1600px]:block">
                                    {token.name}
                                  </div>
                                </>
                              ) : (
                                <div className="pinto-sm hidden min-[1600px]:block">{token.name}</div>
                              )}
                            </span>
                            {earnedPinto ? (
                              // if there are earned pinto, show the gains
                              <div className="inline-flex items-center gap-1">
                                {farmerSilo.isLoading ? (
                                  <Skeleton className="w-20 h-6 rounded-[0.75rem]" />
                                ) : (
                                  <>
                                    <div className="pinto-sm-thin text-right text-pinto-light">
                                      {`${denomination === "USD" ? formatter.usd((userData?.currentBDV || TokenValue.ZERO).mul(priceData.price)) : formatter.pdv(userData?.depositBDV)}`}{" "}
                                      +{" "}
                                    </div>
                                    <div className="pinto-sm-thin text-right text-pinto-green-4">
                                      {`${denomination === "USD" ? formatter.usd(farmerActions.claimRewards.outputs.beanGain.mul(priceData.price)) : formatter.pdv(gains.bdvGain)}`}{" "}
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              // if there is no earned pinto, show the total
                              <div className="pinto-sm-thin text-right text-pinto-light">
                                {farmerSilo.isLoading ? (
                                  <Skeleton className="w-20 h-6 rounded-[0.75rem]" />
                                ) : (
                                  `${denomination === "USD" ? formatter.usd((userData?.currentBDV || TokenValue.ZERO).mul(priceData.price)) : formatter.pdv(userData?.depositBDV)}`
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center gap-1">
                              <IconImage src={token.logoURI} size={6} />

                              <div className="pinto-sm">
                                {farmerSilo.isLoading ? (
                                  <Skeleton className="w-20 h-6 rounded-[0.75rem]" />
                                ) : (
                                  formatter.token(farmerDeposits.get(token)?.amount, token)
                                )}
                              </div>
                              <div className="pinto-sm text-pinto-primary hidden min-[1600px]:block">{token.name}</div>
                            </span>
                            <div className="inline-flex items-center gap-1">
                              <div className="pinto-sm-thin text-right text-pinto-light">
                                {farmerSilo.isLoading ? (
                                  <Skeleton className="w-20 h-6 rounded-[0.75rem]" />
                                ) : (
                                  `${denomination === "USD" ? formatter.usd((userData?.currentBDV || TokenValue.ZERO).mul(token.isMain ? priceData.price : _poolPrice)) : formatter.pdv(userData?.depositBDV)}`
                                )}
                              </div>
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
      {/* </ScrollArea> */}
    </div>
  );
}

export default SiloTable;

// ---------------------- helper hooks ----------------------

type ExtendSiloTokenYield = EMAWindows<{
  apy: number | undefined;
  notApplicable: boolean;
}>;

const useSiloTableAPYs = () => {
  const season = useSeason();

  const selectAPYs = useCallback(
    (data: SiloYieldsByToken): AddressLookup<ExtendSiloTokenYield> => {
      const map: AddressLookup<ExtendSiloTokenYield> = {};

      const entries = Object.entries(data);

      for (const [token, apys] of entries) {
        map[token] = {
          ema24: {
            notApplicable: season <= 24,
            apy: apys.ema24,
          },
          ema168: {
            notApplicable: season <= 168,
            apy: apys.ema168,
          },
          ema720: {
            notApplicable: season <= 720,
            apy: apys.ema720,
          },
          ema2160: {
            notApplicable: false,
            apy: apys.ema2160,
          },
        };
      }

      return map;
    },
    [season],
  );

  return useSiloYieldsByToken<AddressLookup<ExtendSiloTokenYield>>({
    select: selectAPYs,
  });
};

// ---------------------- components ----------------------

const SeparatorVertical = () => <Separator orientation="vertical" className="bg-pinto-green-4/30 w-[1px] h-4" />;

const APYHeader = ({ hide24h, hide7d, hide30d }: { hide24h: boolean; hide7d: boolean; hide30d: boolean }) => {
  return (
    <InlineCenterSpan className="gap-2 flex-col sm:flex-row">
      <span className="place-self-start self-center">Reward</span>
      <TooltipSimple content={<APYTooltip />}>
        <span className="flex flex-row gap-2 items-center rounded-full bg-pinto-green-1 px-2 py-1">
          <span className="pinto-xs text-pinto-green-4 items-center leading-none hidden sm:inline-flex">
            <InlineCenterSpan gap1>
              <IconImage src={PINTO.logoURI} size={4} /> vAPY
            </InlineCenterSpan>
          </span>
          <span className="pinto-xs text-pinto-green-4 sm:hidden">vAPY</span>
          {!hide24h && (
            <>
              <span className="pinto-xs text-pinto-green-4 leading-none">24H</span>
              <SeparatorVertical />
            </>
          )}
          {!hide7d && (
            <>
              <span className="pinto-xs text-pinto-green-4 leading-none">7D</span>
              <SeparatorVertical />
            </>
          )}
          {!hide30d ? (
            <span className="pinto-xs text-pinto-green-4 leading-none">30D</span>
          ) : (
            <span className="pinto-xs text-pinto-green-4 leading-none">90D</span>
          )}
        </span>
      </TooltipSimple>
    </InlineCenterSpan>
  );
};

const formatAPY = (apy: number | undefined) => {
  if (apy === undefined) return "-";
  return formatter.pct(apy * 100, {
    defaultValue: "0%",
    minDecimals: 1,
    maxDecimals: 1,
  });
};

const APYCell = ({
  apys,
  noTooltip,
}: {
  apys: ExtendSiloTokenYield | undefined;
  noTooltip?: boolean;
}) => {
  function APYPill() {
    return (
      <div className="flex flex-row gap-1 items-center rounded-full bg-pinto-green-1 px-2 py-1">
        <div className="pinto-xs text-pinto-green-4 flex flex-row gap-1">
          {Number(apys?.ema24.apy) > 0 && (
            <>
              <div className={cn("leading-none", apys?.ema24.notApplicable && "opacity-50")}>
                {apys?.ema24.notApplicable ? "N/A" : formatAPY(apys?.ema24.apy)}
              </div>
              <SeparatorVertical />
            </>
          )}
          {Number(apys?.ema168.apy) > 0 && (
            <>
              <div className={cn("leading-none", apys?.ema168.notApplicable && "opacity-50")}>
                {apys?.ema168.notApplicable ? "N/A" : formatAPY(apys?.ema168.apy)}
              </div>
              <SeparatorVertical />
            </>
          )}
          {Number(apys?.ema720.apy) > 0 && (
            <div className={cn("leading-none", apys?.ema720.notApplicable && "opacity-50")}>
              {apys?.ema720.notApplicable ? "N/A" : formatAPY(apys?.ema720.apy)}
            </div>
          )}
          {Number(apys?.ema720.apy) === 0 && (
            <div className={cn("leading-none", apys?.ema2160.notApplicable && "opacity-50")}>
              {apys?.ema2160.notApplicable ? "N/A" : formatAPY(apys?.ema2160.apy)}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (noTooltip) {
    return <APYPill />;
  } else {
    return (
      <TooltipSimple content={<APYTooltip />}>
        <APYPill />
      </TooltipSimple>
    );
  }
};

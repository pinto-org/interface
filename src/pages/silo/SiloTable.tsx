import apyIcon from "@/assets/protocol/APY.svg";
import pdvIcon from "@/assets/protocol/PDV.png";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { InlineCenterSpan } from "@/components/Container";
import { UpArrowIcon } from "@/components/Icons";
import IconImage from "@/components/ui/IconImage";
import { Separator } from "@/components/ui/Separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import Text from "@/components/ui/Text";
import { PINTO } from "@/constants/tokens";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { usePriceData } from "@/state/usePriceData";
import { EMAWindows, SiloYieldsByToken, useSiloYieldsByToken } from "@/state/useSiloAPYs";
import { useSiloData } from "@/state/useSiloData";
import { useSeason } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { getTokenIndex, sortTokensForDeposits } from "@/utils/token";
import { Token } from "@/utils/types";
import { AddressLookup } from "@/utils/types.generic";
import { cn } from "@/utils/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { div } from "three/webgpu";

function SiloTable({ hovering }: { hovering: boolean }) {
  const siloData = useSiloData();
  const mainToken = useTokenData().mainToken;
  const farmerSilo = useFarmerSiloNew();
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

  return (
    <div className="border border-pinto-gray-2 rounded-[1rem] overflow-clip">
      {/* <ScrollArea className="w-full"> */}
      <Table className="w-full min-w-[950px]">
        <TableHeader className="rounded-t-xl">
          <TableRow className="rounded-[1rem] bg-pinto-gray-1 hover:bg-pinto-gray-1 h-14">
            <TableHead className="text-black font-[400] text-[1rem] w-[20%] p-4">Token</TableHead>
            <TableHead className="text-black font-[400] text-[1rem] w-[30%]">
              <APYHeader />
            </TableHead>
            <TableHead className="text-black font-[400] text-right text-[1rem] w-[20%]">
              Total Value Deposited
            </TableHead>
            {/* <TableHead className="text-black text-right font-[400] text-[1rem] w-[20%]">My Deposited Amount</TableHead> */}
            <TableHead className="text-black text-right font-[400] text-[1rem] w-[30%] p-4">My Deposits</TableHead>
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

            const hasGerminatingDeposits = farmerSilo.deposits
              .get(token)
              ?.deposits.some((deposit) => deposit.isGerminating);

            if (!data) return;
            return (
              <TableRow
                className={`h-[4.5rem] ${hasGerminatingDeposits ? "bg-pinto-off-green/15" : "bg-white"} hover:bg-pinto-green-1/50 hover:cursor-pointer`}
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
                    <Text variant="sm" className="inline-flex items-center gap-1 opacity-70 flex-wrap">
                      <InlineCenterSpan gap1>
                        <IconImage src={stalkIcon} alt={"stalk"} size={4} />
                        {formatter.noDec(data.rewards.stalk)}
                      </InlineCenterSpan>
                      Stalk
                    </Text>
                    <Text variant="sm" className="inline-flex items-center gap-1 opacity-70 flex-wrap">
                      <InlineCenterSpan gap1>
                        <IconImage src={seedsIcon} alt={"seeds"} size={4} />
                        {formatter.twoDec(data.rewards.seeds)}
                      </InlineCenterSpan>
                      Seeds
                    </Text>
                    <APYCell apys={apy} />
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
        };
      }

      return map;
    },
    [season],
  );

  return useSiloYieldsByToken<AddressLookup<ExtendSiloTokenYield>>({ select: selectAPYs });
};

// ---------------------- components ----------------------

const SeparatorVertical = () => <Separator orientation="vertical" className="bg-pinto-green-4/30 w-[1px] h-[16px]" />;

const APYHeader = () => {
  return (
    <InlineCenterSpan className="gap-2">
      Reward
      <span className="flex flex-row gap-2 items-center rounded-full bg-pinto-green-1 px-2 py-1">
        <Text as="span" variant="xs" color="green4" className="inline-flex items-center leading-none">
          <InlineCenterSpan gap1>
            <IconImage src={PINTO.logoURI} size={4} /> vAPY
          </InlineCenterSpan>
        </Text>
        <Text as="span" variant="xs" color="green4" className="leading-none">
          24H
        </Text>
        <SeparatorVertical />
        <Text as="span" variant="xs" color="green4" className="leading-none">
          7D
        </Text>
        <SeparatorVertical />
        <Text as="span" variant="xs" color="green4" className="leading-none">
          30D
        </Text>
      </span>
    </InlineCenterSpan>
  );
};

const formatAPY = (apy: number | undefined) => {
  if (apy === undefined) return "-";
  return formatter.pct(apy, { defaultValue: "0%", minDecimals: 1, maxDecimals: 1 });
};

const APYCell = ({ apys }: { apys: ExtendSiloTokenYield | undefined }) => {
  return (
    <div className="flex flex-row gap-1 items-center rounded-full bg-pinto-green-1 px-2 py-1">
      <Text color="green4" variant="xs" className="flex flex-row gap-1">
        <Text
          variant="inherit"
          color="inherit"
          className={cn("leading-none", apys?.ema24.notApplicable && "opacity-50")}
        >
          {apys?.ema24.notApplicable ? "N/A" : formatAPY(apys?.ema24.apy)}
        </Text>
        <SeparatorVertical />
        <Text
          variant="inherit"
          color="inherit"
          className={cn("leading-none", apys?.ema168.notApplicable && "opacity-50")}
        >
          {apys?.ema168.notApplicable ? "N/A" : formatAPY(apys?.ema168.apy)}
        </Text>
        <SeparatorVertical />
        <Text
          variant="inherit"
          color="inherit"
          className={cn("leading-none", apys?.ema720.notApplicable && "opacity-50")}
        >
          {apys?.ema720.notApplicable ? "N/A" : formatAPY(apys?.ema720.apy)}
        </Text>
      </Text>
    </div>
  );
};

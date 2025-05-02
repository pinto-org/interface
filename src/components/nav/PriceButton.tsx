import chevronDown from "@/assets/misc/ChevronDown.svg";
import backArrowIcon from "@/assets/misc/LeftArrow.svg";
import { default as pintoIcon, default as pintoIconOriginal } from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import Panel from "@/components/ui/Panel";
import useIsMobile from "@/hooks/display/useIsMobile";
import {
  useInstantTWATokenPricesQuery,
  usePriceData,
  useTwaDeltaBLPQuery,
  useTwaDeltaBQuery,
} from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { HTMLAttributes, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useChainId } from "wagmi";
import { InlineCenterSpan } from "../Container";
import { ExternalLinkIcon, ForwardArrowIcon, GearIcon } from "../Icons";
import TooltipSimple from "../TooltipSimple";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/Card";
import { ScrollArea } from "../ui/ScrollArea";
import { Separator } from "../ui/Separator";
import { Skeleton } from "../ui/Skeleton";
import { Switch } from "../ui/Switch";

function PriceButtonPanel() {
  const priceData = usePriceData();
  const tokenData = useTokenData();
  const twaDeltaB = useTwaDeltaBQuery();
  const chainId = useChainId();

  const { data: twaDeltaBMap, ...twaDeltaBQuery } = useTwaDeltaBLPQuery();

  const mainTokenBalances = priceData.pools.flatMap((pool) =>
    pool.balances.map(
      (balance, index) => pool.tokens[index].isMain && tokenData.whitelistedTokens.includes(pool.pool) && balance,
    ),
  );
  const totalMainTokens = mainTokenBalances.reduce(
    (total: TokenValue, balance) => total.add(balance || TokenValue.ZERO),
    TokenValue.ZERO,
  );

  const totalDeltaBar = priceData.deltaB.div(totalMainTokens.gt(0) ? totalMainTokens : 1).mul(-100);

  const [showSettings, setShowSettings] = useState(false);
  const [showPrices, setShowPrices] = useState(false);

  const [useTwa, setUseTwa] = useState(() => {
    // Initialize from localStorage, default to false if not found
    const savedUseTwa = localStorage.getItem("pinto.priceButton.useTwa");
    return savedUseTwa ? JSON.parse(savedUseTwa) : false;
  });
  const [expandAll, setExpandAll] = useState(() => {
    // Initialize from localStorage, default to false if not found
    const savedExpandAll = localStorage.getItem("pinto.priceButton.expandAll");
    return savedExpandAll ? JSON.parse(savedExpandAll) : false;
  });

  // Update localStorage when settings change
  useEffect(() => {
    localStorage.setItem("pinto.priceButton.useTwa", JSON.stringify(useTwa));
  }, [useTwa]);

  useEffect(() => {
    localStorage.setItem("pinto.priceButton.expandAll", JSON.stringify(expandAll));
  }, [expandAll]);

  const combinedDeltaB = priceData.deltaB;

  return (
    <>
      <CardHeader className="transition-all p-0 space-y-0 sm:space-y-1.5">
        {!showSettings ? (
          <div className="px-4 py-3 sm:p-6">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row justify-between items-center">
                <div className="pinto-sm sm:pinto-body">Price of Pinto</div>
                <span
                  className="text-pinto-gray-4 hover:text-black transition-colors hover:cursor-pointer"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <GearIcon color={"currentColor"} height={"1.25rem"} width={"1.25rem"} />
                </span>
              </div>
              <div className="pinto-xs sm:pinto-body-light text-pinto-light sm:text-pinto-light">
                The Pinto price is determined by the ratio and value of assets in each liquidity pool.
              </div>
            </div>
            <div className="flex flex-row justify-between items-center mt-6">
              <div className="pinto-body-bold sm:pinto-h3 inline-flex gap-2 items-center">
                <IconImage src={pintoIconOriginal} size={9} mobileSize={6} />
                <>${formatter.number(priceData.price, { minDecimals: 4, maxDecimals: 4 })}</>
              </div>
              <div className="flex flex-col gap-y-2 justify-end items-end">
                <div className="pinto-xs sm:pinto-sm text-pinto-green-3 sm:text-pinto-green-3 px-2 py-0.5 h-6 bg-pinto-green-1 rounded-[0.25rem] inline-flex items-center gap-1">
                  Total ΔP:{" "}
                  <InlineCenterSpan gap1>
                    {formatter.twoDec(combinedDeltaB, {
                      showPositiveSign: true,
                    })}
                    <TooltipSimple content={"The sum of the current shortages or excesses of Pinto each pool."} />
                  </InlineCenterSpan>
                </div>
                {useTwa && (
                  <div className="pinto-xs sm:pinto-sm text-pinto-green-3 sm:text-pinto-green-3 px-2 py-0.5 h-6 bg-pinto-green-1 rounded-[0.25rem] inline-flex items-center gap-1">
                    Total TWAΔP:{" "}
                    <InlineCenterSpan gap1>
                      {formatter.twoDec(twaDeltaB.data, {
                        showPositiveSign: true,
                      })}
                      <TooltipSimple
                        content={
                          "The sum of the time weighted average shortages or excesses of Pinto in each pool since the beginning of the Season."
                        }
                      />
                    </InlineCenterSpan>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-row relative pt-2.5 sm:pt-6">
              <div
                className={"h-2 rounded-l-[0.5rem] bg-pinto min-w-2"}
                style={{
                  width: `${Number(totalDeltaBar.add(50).toHuman())}%`,
                }}
              />
              <div
                className={"h-2 w-full relative flex flex-row min-w-2 rounded-r-[0.5rem] overflow-clip bg-red-500"}
                style={{
                  width: `${totalDeltaBar.add(50).sub(100).abs().toHuman()}%`,
                }}
              >
                {priceData.pools.map((pool, i) => {
                  const deltaBar = Number(
                    pool.deltaB
                      .abs()
                      .div(priceData.deltaB.eq(0) ? 1 : priceData.deltaB.abs())
                      .mul(100)
                      .toHuman(),
                  ).toFixed(2);
                  if (!pool.pool?.color) return;
                  return (
                    <div
                      key={`${pool.pool.address}_bar_${i}`}
                      className={`${i === 0 ? "border-l-0" : "border-l-2"} border-white min-w-2`}
                      style={{
                        background: pool.pool.color,
                        width: `${deltaBar}%`,
                      }}
                    />
                  );
                })}
              </div>
              <div
                className={`${priceData.deltaB.gt(0) ? "right-[50%] border-l-2" : "left-[50%] border-r-2"} h-2 bg-white opacity-50 absolute max-w-[calc(50%_-_0.5rem)]`}
                style={{
                  width: `${totalDeltaBar.abs().toHuman()}%`,
                }}
              />
              <div
                className={`${priceData.deltaB.gt(0) ? "right-[50%] border-l-2" : "left-[50%] border-r-2"} h-2 bg-transparent border-white absolute max-w-[calc(50%_-_0.5rem)]`}
                style={{
                  width: `${totalDeltaBar.abs().toHuman()}%`,
                }}
              />
              <div className="left-[50%] absolute -bottom-2 flex flex-col">
                <div className="pinto-xs text-pinto-lighter flex flex-col text-center -ml-4 mb-1">
                  <span className="hidden sm:block">$1.00</span>
                  {/* <span>target</span> */}
                </div>
                <div className="h-6 border-box text-center w-0 bg-white border-pinto-gray-3 border border-dashed" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col px-4 py-3 sm:p-6 gap-4 sm:gap-6">
            <Button
              noPadding
              variant={"outline"}
              rounded="full"
              className="h-9 w-9 sm:h-12 sm:w-12 cursor-pointer"
              onClick={() => setShowSettings(!showSettings)}
            >
              <IconImage src={backArrowIcon} size={0.5} />
            </Button>
            <div className="pinto-body-bold">Settings</div>
          </div>
        )}
        <Separator className="w-full" />
      </CardHeader>
      <CardContent className={`${showSettings ? "mb-0" : "mb-12"} px-3 pb-0 3xl:px-4 3xl:pb-4 3xl:pt-0`}>
        <ScrollArea
          className={cn(
            "-mx-3 px-3 transition-all",
            showSettings ? "h-[12.5rem]" : "h-[calc(100dvh-18.5rem)] sm:h-[calc(100dvh-27rem)]",
          )}
        >
          {!showSettings ? (
            <div className="flex flex-col gap-3 sm:gap-4 mt-0 sm:mt-4 relative first:mt-3 last:mb-3 sm:first:mt-4 sm:last:mb-4">
              {showPrices && (
                <Button
                  asChild
                  variant={"outline"}
                  className={`h-8 w-full p-0 border-0 hover:cursor-pointer shadow-none`}
                  onClick={() => setShowPrices(false)}
                >
                  <span className="text-black rotate-180">
                    <ForwardArrowIcon color={"currentColor"} />
                  </span>
                </Button>
              )}
              {priceData.pools.map((pool, i) => {
                const isWhitelisted =
                  tokenData.whitelistedTokens.findIndex(
                    (token) => token?.address.toLowerCase() === pool.pool?.address.toLowerCase(),
                  ) > -1;
                if (!isWhitelisted) return;
                const token0Price = pool.tokens[0].isMain
                  ? pool.price
                  : useTwa
                    ? priceData.tokenPrices.get(pool.tokens[0])?.twa
                    : priceData.tokenPrices.get(pool.tokens[0])?.instant || TokenValue.ZERO;
                const token1Price = pool.tokens[1].isMain
                  ? pool.price
                  : useTwa
                    ? priceData.tokenPrices.get(pool.tokens[1])?.twa
                    : priceData.tokenPrices.get(pool.tokens[1])?.instant || TokenValue.ZERO;
                const token0BalanceUsd = pool.balances[0].mul(token0Price ?? TokenValue.ZERO) || 0n;
                const token1BalanceUsd = pool.balances[1].mul(token1Price ?? TokenValue.ZERO) || 0n;
                const mainTokenIndex = pool.tokens.findIndex((token: Token) => token.isMain);
                const backingTokenIndex = pool.tokens.findIndex((token: Token) => !token.isMain);
                const deltaBar = pool.balances[mainTokenIndex].gt(0)
                  ? Number(pool.deltaB.abs().div(pool.balances[mainTokenIndex]).mul(100).toHuman()).toFixed(2)
                  : TokenValue.ZERO;

                if (showPrices) {
                  const tokenToShow = priceData.tokenPrices.get(pool.tokens[backingTokenIndex]);
                  if (!tokenToShow) return;
                  return (
                    <div key={`${pool.pool.address}_prices_${i}`} className="flex flex-row justify-between">
                      <div className="inline-flex gap-2 sm:gap-4 items-center">
                        <IconImage src={pool.tokens[backingTokenIndex].logoURI} size={12} mobileSize={9} />
                        <div className="pinto-body text-pinto-secondary">{pool.tokens[backingTokenIndex].symbol}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-pinto-secondary">
                          <span className="pinto-sm sm:pinto-body mr-2">Current Price:</span>
                          <span className="pinto-sm sm:pinto-h4 sm:font-medium">
                            {formatter.usd(tokenToShow.instant)}
                          </span>
                        </div>
                        <div className="pinto-sm text-pinto-light mt-0.5">
                          <span className="hidden sm:block">
                            Time Weighted Average Price: {formatter.usd(tokenToShow.twa)}
                          </span>
                          <span className="sm:hidden">TWA Price: {formatter.usd(tokenToShow.twa)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Card
                    key={`${pool.pool.address}_card_${i}`}
                    className="overflow-clip group hover:border-pinto-green-4"
                  >
                    <Link
                      to={`https://pinto.exchange/#/wells/${chainId}/${pool.pool?.address}`}
                      target={"_blank"}
                      className="hover:cursor-pointer transition-all"
                    >
                      <CardContent className="px-2 py-1.5 3xl:p-4 bg-white flex flex-col gap-2 sm:gap-4">
                        <div className="flex flex-row justify-between items-center">
                          <div className="inline-flex gap-1.5 items-center">
                            <IconImage src={pool.pool?.logoURI} size={8} mobileSize={6} />
                            <div className="pinto-sm text-pinto-secondary">{pool.pool?.symbol || ""}</div>
                          </div>
                          <div className="pinto-sm-bold sm:pinto-body-bold text-pinto-secondary sm:text-pinto-secondary gap-2 items-center flex flex-row">
                            $
                            {formatter.number(pool.price, {
                              minDecimals: 4,
                              maxDecimals: 4,
                            })}
                            <Link
                              to={`https://pinto.exchange/#/wells/${chainId}/${pool.pool?.address}`}
                              target={"_blank"}
                              className="text-pinto-gray-5 ml-2 -mr-10 group-hover:ml-0 group-hover:mr-0 hover:text-pinto-green-4 hover:cursor-pointer transition-all"
                            >
                              <ExternalLinkIcon color="currentColor" />
                            </Link>
                          </div>
                        </div>
                        <div className="flex flex-row relative">
                          <div
                            className={"w-full h-2 rounded-l-[0.5rem]"}
                            style={{
                              background: pool.tokens[0].color,
                            }}
                          />
                          <div
                            className={"w-full h-2 rounded-r-[0.5rem]"}
                            style={{
                              background: pool.tokens[1].color,
                            }}
                          />
                          <div
                            className={`${pool.deltaB.gt(0) ? "right-[50%] border-l-2" : "left-[50%] border-r-2"} h-2 border-white bg-white absolute max-w-[calc(50%_-_0.5rem)]`}
                            style={{
                              width: `${deltaBar}%`,
                            }}
                          />
                          <div
                            className={`${pool.deltaB.gt(0) ? "right-[50%] border-l-2" : "left-[50%] border-r-2"} h-2 border-white opacity-50 absolute max-w-[calc(50%_-_0.5rem)]`}
                            style={{
                              width: `${deltaBar}%`,
                              background: `${pool.deltaB.gt(0) ? pool.tokens[1].color : pool.tokens[0].color}`,
                            }}
                          />
                          <div className="left-[50%] absolute -bottom-2 flex flex-col">
                            <div className="pinto-xs text-[0.75rem] sm:pinto-xs text-pinto-lighter sm:text-pinto-lighter flex flex-col text-center -ml-4 mb-1">
                              <span className="invisible sm:visible">$1.00</span>
                              <span>target</span>
                            </div>
                            <div className="h-6 box-border text-center w-0 bg-white border-pinto-gray-3 border border-dashed" />
                          </div>
                        </div>
                        <div className="flex flex-row justify-between">
                          <div className="inline-flex gap-1 items-center flex-wrap">
                            <IconImage src={pool.tokens[0].logoURI} size={4} className="hidden sm:flex" />
                            <div className="pinto-xs sm:pinto-sm text-pinto-light sm:text-pinto-light text-left">
                              {`${pool.balances[0].toHuman("short")} ${pool.tokens[0].symbol} (~$${token0BalanceUsd.toHuman("short")})`}
                            </div>
                          </div>
                          <div className="inline-flex gap-1 items-center justify-end flex-wrap">
                            <IconImage src={pool.tokens[1].logoURI} size={4} className="hidden sm:flex" />
                            <div className="pinto-xs sm:pinto-sm text-pinto-light sm:text-pinto-light text-right">
                              {`${pool.balances[1].toHuman("short")} ${pool.tokens[1].symbol} (~$${token1BalanceUsd.toHuman("short")})`}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`flex flex-row gap-4 justify-center ${expandAll ? "mb-0" : "-mb-8 sm:-mb-10 group-hover:mb-0"} transition-all`}
                        >
                          <div className="pinto-xs inline-flex font-normal leading-same-xs items-center px-2 py-0.5 h-6 bg-pinto-gray-blue rounded-[0.25rem]">
                            <span className="hidden sm:block">Liquidity: {formatter.usd(pool.liquidity)}</span>
                            <span className="sm:hidden">Liq: ${pool.liquidity.toHuman("ultraShort")}</span>
                          </div>
                          <div className="pinto-xs inline-flex font-normal leading-same-xs items-center px-2 py-0.5 h-6 text-pinto-green-3 bg-pinto-green-1 rounded-[0.25rem] gap-1">
                            <span className="hidden sm:block">
                              ΔP:{" "}
                              {formatter.twoDec(pool.deltaB, {
                                showPositiveSign: true,
                              })}
                            </span>
                            <span className="sm:hidden">ΔP: {pool.deltaB.toHuman("ultraShort", true)}</span>
                            <TooltipSimple content={"The current shortage or excess of Pinto in the pool."} />
                          </div>
                          {useTwa && (
                            <div className="pinto-xs inline-flex font-normal leading-same-xs items-center px-2 py-0.5 h-6 text-pinto-green-3 bg-pinto-green-1 rounded-[0.25rem] gap-1">
                              <span className="hidden sm:block">
                                TWAΔP:{" "}
                                {formatter.twoDec(twaDeltaBMap?.[getTokenIndex(pool.pool)], {
                                  showPositiveSign: true,
                                })}
                              </span>
                              <span className="sm:hidden">
                                TWAΔP: {twaDeltaBMap?.[getTokenIndex(pool.pool)]?.toHuman("ultraShort")}
                              </span>
                              <TooltipSimple
                                content={
                                  "The time weighted average shortage or excess of Pinto in the pool since the beginning of the Season."
                                }
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-6 p-2 pt-6 box-border">
              <div className="flex flex-row justify-between h-14 items-center">
                <div className="pinto-sm sm:pinto-body inline-flex items-center gap-1.5">
                  Show time-weighted average values
                  <TooltipSimple content={"Show the time-weighted average ΔP and price in each pool."} />
                </div>
                <Switch checked={useTwa} onCheckedChange={() => setUseTwa(!useTwa)} variant="omegaLarge" />
              </div>
              <div className="flex flex-row justify-between h-14 items-center">
                <div className="pinto-sm sm:pinto-body">Show ΔP and total liquidity on all Wells</div>
                <Switch checked={expandAll} onCheckedChange={() => setExpandAll(!expandAll)} variant="omegaLarge" />
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      {!showPrices && !showSettings && (
        <CardFooter
          onClick={() => setShowPrices(!showPrices)}
          className="flex flex-col absolute bottom-0 z-[2] peer bg-pinto-gray-1 pb-2 3xl:pb-4 items-stretch hover:bg-pinto-gray-2 transition-colors cursor-pointer"
        >
          <Separator className="w-[38rem] -ml-4 " />
          <div className="inline-flex items-center">
            <div className="flex flex-row min-w-fit max-w-fit mt-2 3xl:mt-4 animate-marquee">
              {Array.from(priceData.tokenPrices).map((token, i) => {
                if (!token[0].isWhitelisted) return;
                return (
                  <div key={`${token[0].address}_marquee1_${i}`}>
                    {token[0]?.name && (
                      <div className="inline-flex items-center px-2 gap-1.5">
                        <IconImage src={token[0].logoURI} size={6} />
                        <div className="pinto-body text-pinto-secondary text-nowrap">
                          {`${token[0].symbol}: ${formatter.usd(token[1][useTwa ? "twa" : "instant"] ? token[1][useTwa ? "twa" : "instant"].toHuman() : 0)}`}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-row min-w-fit max-w-fit mt-2 3xl:mt-4 animate-marquee">
              {Array.from(priceData.tokenPrices).map((token, i) => {
                if (!token[0].isWhitelisted) return;
                return (
                  <div key={`${token[0].address}_marquee2_${i}`}>
                    {token[0]?.name && (
                      <div className="inline-flex items-center px-2 gap-1.5">
                        <IconImage src={token[0].logoURI} size={6} />
                        <div className="pinto-body text-pinto-secondary text-nowrap">
                          {`${token[0].symbol}: ${formatter.usd(token[1][useTwa ? "twa" : "instant"] ? token[1][useTwa ? "twa" : "instant"].toHuman() : 0)}`}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-row min-w-fit max-w-fit mt-2 3xl:mt-4 animate-marquee">
              {Array.from(priceData.tokenPrices).map((token, i) => {
                if (!token[0].isWhitelisted) return;
                return (
                  <div key={`${token[0].address}_marquee3_${i}`}>
                    {token[0]?.name && (
                      <div className="inline-flex items-center px-2 gap-1.5">
                        <IconImage src={token[0].logoURI} size={6} />
                        <div className="pinto-body text-pinto-secondary text-nowrap">
                          {`${token[0].symbol}: ${formatter.usd(token[1][useTwa ? "twa" : "instant"] ? token[1][useTwa ? "twa" : "instant"].toHuman() : 0)}`}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardFooter>
      )}
      {!showPrices && !showSettings && (
        <Button
          variant="outline"
          noShrink
          rounded="full"
          className={`h-6 w-6 p-0 z-[1] absolute peer-hover:bottom-20 bottom-0 left-[50%] shadow-xl -ml-[0.65rem] border-black transition-all`}
          onClick={() => setShowPrices(true)}
        >
          <span className="text-black mr-[1rem]">
            <ForwardArrowIcon color={"currentColor"} height={"1rem"} width={"1rem"} />
          </span>
        </Button>
      )}
    </>
  );
}

export interface IPriceButton extends HTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  togglePanel: () => void;
}

export default function PriceButton({ isOpen = false, togglePanel, ...props }: IPriceButton) {
  const priceData = usePriceData();
  const isMobile = useIsMobile();

  return (
    <Panel
      isOpen={isOpen}
      toggle={togglePanel}
      side="left"
      panelProps={{
        className: "max-w-panel-price w-panel-price mt-4",
      }}
      screenReaderTitle="Price Panel"
      trigger={
        <Button
          variant="outline-primary"
          size="default"
          rounded="full"
          onClick={togglePanel}
          noShrink
          {...props}
          className={cn(`flex flex-row gap-0.5 sm:gap-2 ${isOpen && "border-pinto-green"}`, props.className)}
        >
          <IconImage src={pintoIcon} size={6} alt="pinto icon" />
          {priceData.loading ? (
            <Skeleton className="w-14 h-6" />
          ) : (
            <>${Number(priceData.price.toHuman()).toFixed(isMobile ? 3 : 4)}</>
          )}
          <IconImage src={chevronDown} size={4} mobileSize={2.5} alt="chevron down" />
        </Button>
      }
    >
      <PriceButtonPanel />
    </Panel>
  );
}

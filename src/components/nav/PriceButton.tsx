import chevronDown from "@/assets/misc/ChevronDown.svg";
import backArrowIcon from "@/assets/misc/LeftArrow.svg";
import pintoIcon from "@/assets/tokens/PINTO.png";
import pintoIconOriginal from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import Panel from "@/components/ui/Panel";
import useIsMobile from "@/hooks/display/useIsMobile";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import clsx from "clsx";
import { HTMLAttributes } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLinkIcon, ForwardArrowIcon, GearIcon } from "../Icons";
import TooltipSimple from "../TooltipSimple";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/Card";
import { ScrollArea } from "../ui/ScrollArea";
import { Separator } from "../ui/Separator";
import { Switch, SwitchThumb } from "../ui/Switch";
import Text from "../ui/Text";

function PriceButtonPanel() {
  const priceData = usePriceData();
  const tokenData = useTokenData();

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
  const [useTwa, setUseTwa] = useState(false);
  const [expandAll, setExpandAll] = useState(false);
  const [showPrices, setShowPrices] = useState(false);

  return (
    <>
      <CardHeader className="transition-all p-0">
        {!showSettings ? (
          <div className="p-6">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row justify-between items-center">
                <Text variant="body">Price of Pinto</Text>
                <span
                  className="text-pinto-gray-4 hover:text-black transition-colors hover:cursor-pointer"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <GearIcon color={"currentColor"} height={20} width={20} />
                </span>
              </div>
              <Text variant="body-light" color="light">
                The Pinto price is determined by the ratio and value of assets in each liquidity pool.
              </Text>
            </div>
            <div className="flex flex-row justify-between items-center mt-6">
              <Text variant="h3" className="inline-flex gap-2 items-center">
                <IconImage src={pintoIconOriginal} size={9} />
                <>${formatter.number(priceData.price, { minDecimals: 4, maxDecimals: 4 })}</>
              </Text>
              <Text
                variant="sm"
                color="green3"
                className="px-2 py-0.5 h-6 bg-pinto-green-1 rounded-[0.25rem] inline-flex items-center gap-1"
              >
                Total deltaP: {formatter.twoDec(priceData.deltaB, { showPositiveSign: true })}
                <TooltipSimple
                  content={
                    useTwa
                      ? "The sum of the time weighted average shortages or excesses of Pinto in each pool since the beginning of the Season."
                      : "The sum of the current shortages or excesses of Pinto each pool."
                  }
                />
              </Text>
            </div>
            <div className="flex flex-row relative pt-6">
              <div
                className={"h-2 rounded-l-[0.5rem] bg-pinto min-w-2"}
                style={{ width: `${Number(totalDeltaBar.add(50).toHuman())}%` }}
              />
              <div
                className={"h-2 w-full relative flex flex-row min-w-2 rounded-r-[0.5rem] overflow-clip bg-red-500"}
                style={{ width: `${totalDeltaBar.add(50).sub(100).abs().toHuman()}%` }}
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
                      style={{ background: pool.pool.color, width: `${deltaBar}%` }}
                    />
                  );
                })}
              </div>
              <div
                className={`${priceData.deltaB.gt(0) ? "right-[50%] border-l-2" : "left-[50%] border-r-2"} h-2 bg-white opacity-50 absolute max-w-[calc(50%_-_8px)]`}
                style={{ width: `${totalDeltaBar.abs().toHuman()}%` }}
              />
              <div
                className={`${priceData.deltaB.gt(0) ? "right-[50%] border-l-2" : "left-[50%] border-r-2"} h-2 bg-transparent border-white absolute max-w-[calc(50%_-_8px)]`}
                style={{ width: `${totalDeltaBar.abs().toHuman()}%` }}
              />
              <div className="left-[50%] absolute -bottom-2 flex flex-col">
                <Text variant="xs" color="lighter" className="flex flex-col text-center -ml-4 mb-1">
                  <span className="hidden sm:block">$1.00</span>
                  <span>peg</span>
                </Text>
                <div className="h-6 border-box text-center w-0 bg-white border-pinto-gray-3 border border-dashed" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col p-6 gap-6">
            <Button
              noPadding
              variant={"outline"}
              rounded="full"
              className="h-12 w-12 cursor-pointer"
              onClick={() => setShowSettings(!showSettings)}
            >
              <IconImage src={backArrowIcon} size={0.5} />
            </Button>
            <Text variant="body-bold">Settings</Text>
          </div>
        )}
        <Separator className="w-full" />
      </CardHeader>
      <CardContent className="mb-16">
        <ScrollArea className="h-[calc(100vh-24rem)] -mx-3 px-3">
          {!showSettings ? (
            <div className="flex flex-col gap-4 mt-4 relative last:mb-4">
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
                      <div className="inline-flex gap-4 items-center">
                        <IconImage src={pool.tokens[backingTokenIndex].logoURI} size={12} />
                        <Text variant="body" color="secondary">
                          {pool.tokens[backingTokenIndex].symbol}
                        </Text>
                      </div>
                      <div className="flex flex-col items-end">
                        <Text color="secondary">
                          <Text as="span" variant="body" color="inherit" className="mr-2">
                            Current Price:
                          </Text>
                          <Text as="span" variant="h4" color="inherit" weight="medium">
                            {formatter.usd(tokenToShow.instant)}
                          </Text>
                        </Text>
                        <Text variant="sm" color="light" className="mt-0.5">
                          Time Weighted Average Price: {formatter.usd(tokenToShow.twa)}
                        </Text>
                      </div>
                    </div>
                  );
                }

                return (
                  <Card
                    key={`${pool.pool.address}_card_${i}`}
                    className="overflow-clip group hover:border-pinto-green-4"
                  >
                    <CardContent className="p-4 bg-white flex flex-col gap-4">
                      <div className="flex flex-row justify-between items-center">
                        <div className="inline-flex gap-1.5 items-center">
                          <IconImage src={pool.pool?.logoURI} size={8} />
                          <Text variant="sm" color="secondary">
                            {pool.pool?.symbol || ""}
                          </Text>
                        </div>
                        <Text variant="body-bold" color="secondary" className="gap-2 items-center flex flex-row">
                          ${formatter.number(pool.price, { minDecimals: 4, maxDecimals: 4 })}
                          <Link
                            to={`https://pinto.exchange/#/wells/${pool.pool?.address}`}
                            target={"_blank"}
                            className="text-pinto-gray-5 ml-2 -mr-10 group-hover:ml-0 group-hover:mr-0 hover:text-pinto hover:cursor-pointer transition-all"
                          >
                            <ExternalLinkIcon color="currentColor" />
                          </Link>
                        </Text>
                      </div>
                      <div className="flex flex-row relative">
                        <div className={"w-full h-2 rounded-l-[0.5rem]"} style={{ background: pool.tokens[0].color }} />
                        <div className={"w-full h-2 rounded-r-[0.5rem]"} style={{ background: pool.tokens[1].color }} />
                        <div
                          className={`${pool.deltaB.gt(0) ? "right-[50%] border-l-2" : "left-[50%] border-r-2"} h-2 border-white bg-white absolute max-w-[calc(50%_-_8px)]`}
                          style={{ width: `${deltaBar}%` }}
                        />
                        <div
                          className={`${pool.deltaB.gt(0) ? "right-[50%] border-l-2" : "left-[50%] border-r-2"} h-2 border-white opacity-50 absolute max-w-[calc(50%_-_8px)]`}
                          style={{
                            width: `${deltaBar}%`,
                            background: `${pool.deltaB.gt(0) ? pool.tokens[1].color : pool.tokens[0].color}`,
                          }}
                        />
                        <div className="left-[50%] absolute -bottom-2 flex flex-col">
                          <Text variant="xs" color="lighter" className="flex flex-col text-center -ml-4 mb-1">
                            <span>$1.00</span>
                            <span>peg</span>
                          </Text>
                          <div className="h-6 box-border text-center w-0 bg-white border-pinto-gray-3 border border-dashed" />
                        </div>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="inline-flex gap-1 items-center">
                          <IconImage src={pool.tokens[0].logoURI} size={4} />
                          <Text variant="small" color="light" alignt="left">
                            {`${pool.balances[0].toHuman("short")} ${pool.tokens[0].symbol} (~$${token0BalanceUsd.toHuman("short")})`}
                          </Text>
                        </div>
                        <div className="inline-flex gap-1 items-center justify-end">
                          <IconImage src={pool.tokens[1].logoURI} size={4} />
                          <Text variant="small" color="light" alignt="right">
                            {`${pool.balances[1].toHuman("short")} ${pool.tokens[1].symbol} (~$${token1BalanceUsd.toHuman("short")})`}
                          </Text>
                        </div>
                      </div>
                      <div
                        className={`flex flex-row gap-4 justify-center ${expandAll ? "mb-0" : "-mb-10 group-hover:mb-0"} transition-all`}
                      >
                        <Text
                          variant="xs"
                          weight="normal"
                          noLineHeight
                          className="inline-flex items-center px-2 py-0.5 h-6 bg-pinto-gray-blue rounded-[0.25rem]"
                        >
                          Liquidity: {formatter.usd(pool.liquidity)}
                        </Text>
                        <Text
                          variant="xs"
                          weight="normal"
                          color="green3"
                          noLineHeight
                          className="px-2 py-0.5 h-6 bg-pinto-green-1 rounded-[0.25rem] inline-flex items-center gap-1"
                        >
                          deltaP: {formatter.twoDec(pool.deltaB, { showPositiveSign: true })}
                          <TooltipSimple
                            content={
                              useTwa
                                ? "The sum time weighted average shortage or excess of Pinto in the pool since the beginning of the Season."
                                : "The current shortage or excess of Pinto in the pool."
                            }
                          />
                        </Text>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-6 p-2 pt-6 box-border">
              <div className="flex flex-row justify-between h-14 items-center">
                <Text variant="body" className="inline-flex items-center gap-1.5">
                  Use time-weighted average values
                  <TooltipSimple content={"Show the time-weighted average deltaP and price in each pool."} />
                </Text>
                <Switch
                  style={{
                    borderWidth: "1px",
                    height: "56px",
                    width: "104px",
                  }}
                  checked={useTwa}
                  onCheckedChange={() => setUseTwa(!useTwa)}
                >
                  <SwitchThumb className="w-[48px] h-[48px] data-[state=checked]:translate-x-[50px] data-[state=unchecked]:translate-x-[2px]" />
                </Switch>
              </div>
              <div className="flex flex-row justify-between h-14 items-center">
                <Text variant="body">Show deltaP and total liquidity on all Wells</Text>
                <Switch
                  style={{
                    borderWidth: "1px",
                    height: "56px",
                    width: "104px",
                  }}
                  checked={expandAll}
                  onCheckedChange={() => setExpandAll(!expandAll)}
                >
                  <SwitchThumb className="w-[48px] h-[48px] data-[state=checked]:translate-x-[50px] data-[state=unchecked]:translate-x-[2px]" />
                </Switch>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      {!showPrices && !showSettings && (
        <CardFooter
          onClick={() => setShowPrices(!showPrices)}
          className="flex flex-col absolute bottom-0 z-[2] peer bg-pinto-gray-1 pb-4 items-stretch hover:bg-pinto-gray-2 transition-colors cursor-pointer"
        >
          <Separator className="w-[38rem] -ml-4 " />
          <div className="inline-flex items-center">
            <div className="flex flex-row min-w-fit max-w-fit mt-4 animate-marquee">
              {Array.from(priceData.tokenPrices).map((token, i) => {
                if (!token[0].isWhitelisted) return;
                return (
                  <div key={`${token[0].address}_marquee1_${i}`}>
                    {token[0]?.name && (
                      <div className="inline-flex items-center px-2 gap-1.5">
                        <IconImage src={token[0].logoURI} size={6} />
                        <Text variant="body" color="secondary" className="text-nowrap">
                          {`${token[0].symbol}: ${formatter.usd(token[1][useTwa ? "twa" : "instant"] ? token[1][useTwa ? "twa" : "instant"].toHuman() : 0)}`}
                        </Text>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-row min-w-fit max-w-fit mt-4 animate-marquee">
              {Array.from(priceData.tokenPrices).map((token, i) => {
                if (!token[0].isWhitelisted) return;
                return (
                  <div key={`${token[0].address}_marquee2_${i}`}>
                    {token[0]?.name && (
                      <div className="inline-flex items-center px-2 gap-1.5">
                        <IconImage src={token[0].logoURI} size={6} />
                        <Text variant="body" color="secondary" className="text-nowrap">
                          {`${token[0].symbol}: ${formatter.usd(token[1][useTwa ? "twa" : "instant"] ? token[1][useTwa ? "twa" : "instant"].toHuman() : 0)}`}
                        </Text>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-row min-w-fit max-w-fit mt-4 animate-marquee">
              {Array.from(priceData.tokenPrices).map((token, i) => {
                if (!token[0].isWhitelisted) return;
                return (
                  <div key={`${token[0].address}_marquee3_${i}`}>
                    {token[0]?.name && (
                      <div className="inline-flex items-center px-2 gap-1.5">
                        <IconImage src={token[0].logoURI} size={6} />
                        <Text variant="body" color="secondary" className="text-nowrap">
                          {`${token[0].symbol}: ${formatter.usd(token[1][useTwa ? "twa" : "instant"] ? token[1][useTwa ? "twa" : "instant"].toHuman() : 0)}`}
                        </Text>
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
            <ForwardArrowIcon color={"currentColor"} height={16} width={16} />
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
      top={5}
      isOpen={isOpen}
      toggle={togglePanel}
      side="left"
      panelProps={{
        className: "max-w-panel-price w-panel-price",
      }}
      trigger={
        <Button
          variant="outline-primary"
          size="default"
          rounded="full"
          onClick={togglePanel}
          noShrink
          {...props}
          className={cn("flex flex-row gap-2", props.className)}
        >
          <IconImage src={pintoIcon} size={6} alt="pinto icon" />
          <>${Number(priceData.price.toHuman()).toFixed(isMobile ? 2 : 4)}</>
          <IconImage src={chevronDown} size={4} mobileSize={2.5} alt="chevron down" />
        </Button>
      }
    >
      <PriceButtonPanel />
    </Panel>
  );
}

import { usePriceData } from "@/state/usePriceData";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/Card";
import { TokenValue } from "@/classes/TokenValue";
import useTokenData from "@/state/useTokenData";
import { ExternalLinkIcon, ForwardArrowIcon, GearIcon } from "./Icons";
import { Separator } from "./ui/Separator";
import pintoIconOriginal from "@/assets/tokens/Pinto.png";
import backArrowIcon from "@/assets/misc/LeftArrow.svg";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Switch } from "./ui/Switch";
import TooltipSimple from "./TooltipSimple";

export default function PriceButtonPanel({isOpen = false}: {isOpen: boolean}) {

    const priceData = usePriceData();
    const tokenData = useTokenData();

    const mainTokenBalances = priceData.pools.flatMap((pool) => 
      pool.balances.map((balance, index) => (pool.tokens[index].isMain && tokenData.whitelistedTokens.includes(pool.pool)) && balance));
    const totalMainTokens = mainTokenBalances.reduce((total: TokenValue, balance) => total.add(balance || TokenValue.ZERO), TokenValue.ZERO);
         
    const totalDeltaBar = (priceData.deltaB).div(totalMainTokens.gt(0) ? totalMainTokens : 1).mul(-100);

    const [showSettings, setShowSettings] = useState(false);
    const [useTwa, setUseTwa] = useState(false);
    const [expandAll, setExpandAll] = useState(false);
    const [showPrices, setShowPrices] = useState(false);

    return (
      <Card className={`absolute top-[5rem] transition-all ${isOpen ? 'left-[1.5rem]' : '-left-[38rem]'} w-[38rem] overflow-clip h-[calc(100vh-9rem)] z-[51]`}>
        <CardHeader className="transition-all">
          {!showSettings ?
            <div className="pb-4">
            <div className="flex flex-row justify-between items-center">
              <div className="font-[400] text-[1.25rem] text-black">Price of Pinto</div>
              <span className="text-pinto-gray-4 hover:text-black transition-colors hover:cursor-pointer" onClick={() => setShowSettings(!showSettings)}>
                <GearIcon color={"currentColor"} height={20} width={20} />
              </span>
            </div>
            <div className="font-[300] text-[1.25rem] text-pinto-gray-4">The Pinto price is determined by the ratio and value of assets in each liquidity pool.</div>
            <div className="flex flex-row justify-between items-center mt-4">
              <div className="font-[400] text-[1.25rem] text-black inline-flex gap-1.5 items-center">
                <img src={pintoIconOriginal} className={"w-9 h-9"} />
                <span className={"text-[2rem]"}>${priceData.price.toHuman("short")}</span>
              </div>
              <div className="px-2 py-0.5 h-6 bg-pinto-green-1 rounded-[0.25rem] text-pinto-green font-[400] text-[0.875rem] inline-flex items-center gap-1">
                Total deltaP: {Number(priceData.deltaB.toHuman()).toFixed(2)}
                <TooltipSimple />
              </div>
            </div>
            <div className="flex flex-row relative mt-4">
              <div className={"h-2 rounded-l-[0.5rem] bg-pinto"} style={{ width: `${Number(totalDeltaBar.add(50).toHuman())}%` }} />
              <div className={"h-2 w-full relative flex flex-row rounded-r-[0.5rem] overflow-clip bg-red-500"} style={{ width: `${totalDeltaBar.add(50).sub(100).abs().toHuman()}%` }}>
                {priceData.pools.map((pool, i) => {                  
                  const deltaBar = Number((pool.deltaB.abs()).div(priceData.deltaB.eq(0) ? 1 : priceData.deltaB.abs()).mul(100).toHuman()).toFixed(2);
                  if (!pool.pool?.color) return
                    return (
                      <div key={`${pool.pool.address}_bar_${i}`} className={`${i === 0 ? 'border-l-0' : 'border-l-2'} border-white min-w-2`} style={{ background: pool.pool.color, width: `${deltaBar}%` }} />
                    )
                })}
              </div>
              <div className={`${priceData.deltaB.gt(0) ? 'right-[50%] border-l-2' : 'left-[50%] border-r-2'} h-2 bg-white opacity-50 absolute`} style={{ width: `${Number(totalDeltaBar.toHuman())}%` }} />
              <div className={`${priceData.deltaB.gt(0) ? 'right-[50%] border-l-2' : 'left-[50%] border-r-2'} h-2 bg-transparent border-white absolute`} style={{ width: `${Number(totalDeltaBar.toHuman())}%` }} />
                <div className="left-[50%] absolute -bottom-2 flex flex-col">
                <div className="flex flex-col text-center -ml-4 mb-1 text-[0.75rem] text-pinto-gray-3 font-[400]">
                  <span>$1.00</span>
                  <span>peg</span>
                </div>
                <div className="h-6 border-box text-center w-0 bg-white border-pinto-gray-3 border border-dashed" />
              </div>
            </div>
            </div>
          : <div>
              <Button asChild variant={'outline'} className="rounded-full h-12 w-12 p-0 hover:cursor-pointer" onClick={() => setShowSettings(!showSettings)}>
                <img src={backArrowIcon} />
              </Button>
              <div className="text-black text-[1.25rem] my-2 font-[500]">Settings</div>
            </div> 
          }
            <Separator className="w-[38rem] -ml-4"/>
        </CardHeader>
        <CardContent className={`overflow-y-auto pt-0 -mt-4 mb-16 max-h-[calc(100vh-28rem)]`}>
            {!showSettings ? 
            <div className="flex flex-col gap-4 mt-4 relative">
              {showPrices && 
                <Button 
                  asChild 
                  variant={'outline'} 
                  className={`h-8 w-full p-0 border-0 hover:cursor-pointer shadow-none`} 
                  onClick={() => setShowPrices(false)}
                >
                  <span className="text-black rotate-180">
                    <ForwardArrowIcon color={"currentColor"} />
                  </span>
                </Button>
              }
            {priceData.pools.map((pool, i) => {
              const isWhitelisted = tokenData.whitelistedTokens.findIndex((token) => token?.address.toLowerCase() === pool.pool?.address.toLowerCase()) > -1;
              if (!isWhitelisted) return;
              const token0Price = pool.tokens[0].isMain ? priceData.price : useTwa ? priceData.tokenPrices.get(pool.tokens[0])?.twa : priceData.tokenPrices.get(pool.tokens[0])?.instant || TokenValue.ZERO;
              const token1Price = pool.tokens[1].isMain ? priceData.price : useTwa ? priceData.tokenPrices.get(pool.tokens[1])?.twa : priceData.tokenPrices.get(pool.tokens[1])?.instant || TokenValue.ZERO;
              const token0BalanceUsd = pool.balances[0].mul(token0Price) || 0n;
              const token1BalanceUsd = pool.balances[1].mul(token1Price) || 0n;
              const mainTokenIndex = pool.tokens.findIndex((token) => token.isMain);
              const backingTokenIndex = pool.tokens.findIndex((token) => !token.isMain);
              const deltaBar = Number((pool.deltaB.abs()).div(pool.balances[mainTokenIndex]).mul(100).toHuman()).toFixed(2);
              
              if (showPrices) {
                return (
                    <div key={`${pool.pool.address}_prices_${i}`} className="flex flex-row justify-between">
                      <div className="inline-flex gap-4 items-center">
                        <img src={pool.tokens[backingTokenIndex].logoURI} className="w-12 h-12" />
                        <span className="text-pinto-gray-5 text-[1.25rem] font-[400]">{pool.tokens[backingTokenIndex].symbol}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-pinto-gray-5 text-[1.25rem] font-[400]">
                          Current Price: ${Number(priceData.tokenPrices.get(pool.tokens[backingTokenIndex]).instant.toHuman()).toFixed(2)}
                        </div>
                        <div className="text-pinto-gray-4 text-[1rem] font-[400]">
                          Time Weighted Average Price: ${Number(priceData.tokenPrices.get(pool.tokens[backingTokenIndex]).twa.toHuman()).toFixed(2)}
                        </div>
                      </div>
                    </div>
                )
              }
              
              return (
                <Card key={`${pool.pool.address}_card_${i}`} className="overflow-clip group hover:border-pinto-green-2">
                  <CardContent className="p-4 bg-white flex flex-col gap-4">
                    <div className="flex flex-row justify-between items-center">
                      <div className="inline-flex gap-1.5 items-center">
                        <img src={pool.pool?.logoURI} className="w-[2rem] h-[2rem]" />
                        <span className="font-[400] text-[1rem] text-pinto-gray-5">{pool.pool?.name || ""}</span>
                      </div>
                      <div className="font-[500] text-[1.25rem] text-pinto-gray-5 gap-2 items-center flex flex-row">
                        ${Number(pool.price.toHuman()).toFixed(4)}
                        <a href={`https://basin.exchange/#/wells/${pool.pool?.address}`} target={"_blank"} className="text-pinto-gray-5 ml-2 -mr-10 group-hover:ml-0 group-hover:mr-0 hover:text-pinto-green-2 hover:cursor-pointer transition-all">
                          <ExternalLinkIcon color="currentColor" />
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-row relative">
                      <div className={"w-full h-2 rounded-l-[0.5rem]"}  style={{ background: pool.tokens[0].color }} />
                      <div className={"w-full h-2 rounded-r-[0.5rem]"}  style={{ background: pool.tokens[1].color }} />
                      <div className={`${pool.deltaB.gt(0) ? 'right-[50%] border-l-2' : 'left-[50%] border-r-2'} h-2 border-white bg-white absolute`} style={{ width: `${deltaBar}%` }} />
                      <div className={`${pool.deltaB.gt(0) ? 'right-[50%] border-l-2' : 'left-[50%] border-r-2'} h-2 border-white opacity-50 absolute`} style={{ width: `${deltaBar}%`, background: `${pool.deltaB.gt(0) ? pool.tokens[1].color : pool.tokens[0].color }` }} />
                      <div className="left-[50%] absolute -bottom-2 flex flex-col">
                        <div className="flex flex-col text-center -ml-4 mb-1 text-[0.75rem] text-pinto-gray-3 font-[400]">
                          <span>$1.00</span>
                          <span>peg</span>
                        </div>
                        <div className="h-6 border-box text-center w-0 bg-white border-pinto-gray-3 border border-dashed" />
                      </div>
                    </div>
                    <div className="flex flex-row justify-between">
                      <div className="inline-flex gap-1 items-center">
                        <img src={pool.tokens[0].logoURI} className="w-[1rem] h-[1rem]" />
                        <span className="font-[300] text-[1rem] text-pinto-gray-4">
                          {`${pool.balances[0].toHuman("short")} ${pool.tokens[0].name} (~$${token0BalanceUsd.toHuman("short")})`}
                        </span>
                      </div>
                      <div className="inline-flex gap-1 items-center">
                        <img src={pool.tokens[1].logoURI} className="w-[1rem] h-[1rem]" />
                        <span className="font-[400] text-[1rem] text-pinto-gray-4">
                          {`${pool.balances[1].toHuman("short")} ${pool.tokens[1].name} (~$${token1BalanceUsd.toHuman("short")})`}
                        </span>
                      </div>
                    </div>
                    <div className={`flex flex-row gap-4 justify-center ${expandAll ? 'mb-0' : '-mb-10 group-hover:mb-0'} transition-all`}>
                      <div className="px-2 py-0.5 h-6 bg-pinto-gray-blue rounded-[0.25rem] text-black font-[400] text-[0.875rem]">Total Liquidity: ${pool.liquidity.toHuman("short")}</div>
                      <div className="px-2 py-0.5 h-6 bg-pinto-green-1 rounded-[0.25rem] text-pinto-green font-[400] text-[0.875rem] inline-flex items-center gap-1">
                        deltaP: {Number(pool.deltaB.toHuman()).toFixed(0)}
                        <TooltipSimple />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }
            )}
            </div>
            : 
            <div className="flex flex-col gap-4 mt-4 mr-2">
              <div className="flex flex-row justify-between h-14 items-center">
                <div className="text-black font-[400] text-[1.25rem] inline-flex items-center gap-1.5">
                  Use time-weighted average values
                  <TooltipSimple  />
                </div>
                <Switch 
                  checked={useTwa}
                  onCheckedChange={() => setUseTwa(!useTwa)}
                  className="scale-[1.5] border-[1px]"
                />
              </div>
              <div className="flex flex-row justify-between h-14 items-center">
                <div className="text-black font-[400] text-[1.25rem]">Show deltaP and total liquidity on all Wells</div>
                <Switch 
                  checked={expandAll}
                  onCheckedChange={() => setExpandAll(!expandAll)}
                  className="scale-[1.5] border-[1px]"
                />
              </div>
            </div>
            }
            {!showPrices && 
            <Button 
              asChild 
              variant={'outline'} 
              className={`rounded-full h-6 w-6 p-0 absolute bottom-20 left-[50%] shadow-xl -ml-[0.65rem] border-black hover:bg-pinto-gray-2 hover:cursor-pointer`} 
              onClick={() => setShowPrices(!showPrices)}
            >
              <span className="text-black">
                <ForwardArrowIcon color={"currentColor"} />
              </span>
            </Button>
            }
        </CardContent>
        <CardFooter className="flex flex-col absolute bottom-0 bg-pinto-gray-1 pb-4 items-stretch">
          <Separator className="w-[38rem] -ml-4 "/>
          <div className="inline-flex items-center">
            <div className="flex flex-row min-w-fit max-w-fit mt-4 animate-marquee">
              {Array.from(priceData.tokenPrices).map((token, i) => {
                if (!token[0].isWhitelisted) return
                return (
                  <div key={`${token[0].address}_marquee1_${i}`}>
                  {token[0]?.name &&
                      <div className="inline-flex items-center px-2 gap-1.5">
                        <img src={token[0].logoURI} className={"w-6 h-6"} />
                        <span className="text-nowrap font-[400] text-[1.25rem] text-pinto-gray-5">{`${token[0].symbol}: $${Number(token[1][useTwa ? 'twa' : 'instant'] ? token[1][useTwa ? 'twa' : 'instant'].toHuman() : 0).toFixed(2)}`}</span>   
                      </div>
                      }
                  </div>
                )}
              )}
            </div>
            <div className="flex flex-row min-w-fit max-w-fit mt-4 animate-marquee">
              {Array.from(priceData.tokenPrices).map((token, i) => {
                if (!token[0].isWhitelisted) return
                return (
                  <div key={`${token[0].address}_marquee2_${i}`}>
                    {token[0]?.name &&
                      <div className="inline-flex items-center px-2 gap-1.5">
                        <img src={token[0].logoURI} className={"w-6 h-6"} />
                        <span className="text-nowrap font-[400] text-[1.25rem] text-pinto-gray-5">{`${token[0].symbol}: $${Number(token[1][useTwa ? 'twa' : 'instant'] ? token[1][useTwa ? 'twa' : 'instant'].toHuman() : 0).toFixed(2)}`}</span>   
                      </div>
                    }
                  </div>
                )}
              )}
            </div>
            <div className="flex flex-row min-w-fit max-w-fit mt-4 animate-marquee">
              {Array.from(priceData.tokenPrices).map((token, i) => {
                if (!token[0].isWhitelisted) return
                return (
                <div key={`${token[0].address}_marquee3_${i}`}>
                  {token[0]?.name &&
                    <div className="inline-flex items-center px-2 gap-1.5">
                      <img src={token[0].logoURI} className={"w-6 h-6"} />
                      <span className="text-nowrap font-[400] text-[1.25rem] text-pinto-gray-5">{`${token[0].symbol}: $${Number(token[1][useTwa ? 'twa' : 'instant'] ? token[1][useTwa ? 'twa' : 'instant'].toHuman() : 0).toFixed(2)}`}</span>   
                    </div>
                  }
                </div>
                )}
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    )
}
import { usePriceData } from "@/state/usePriceData";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/Card";
import { TokenValue } from "@/classes/TokenValue";
import useTokenData from "@/state/useTokenData";
import { ExternalLinkIcon } from "./Icons";
import { Separator } from "./ui/Separator";
import pintoIconOriginal from "@/assets/tokens/Pinto.png";

export default function PriceButtonPanel({isOpen = false}: {isOpen: boolean}) {

    const priceData = usePriceData();
    const tokenData = useTokenData();

    const mainTokenBalances = priceData.pools.flatMap((pool) => 
      pool.balances.map((balance, index) => (pool.tokens[index].isMain && tokenData.whitelistedTokens.includes(pool.pool)) && balance));
    const totalMainTokens = mainTokenBalances.reduce((total: TokenValue, balance) => total.add(balance || TokenValue.ZERO), TokenValue.ZERO);
         
    const totalDeltaBar = (priceData.deltaB).div(totalMainTokens.gt(0) ? totalMainTokens : 1).mul(-100);

    return (
      <Card className={`absolute top-[5rem] transition-all ${isOpen ? 'left-[1.5rem]' : '-left-[100%]'} w-[38rem] overflow-clip max-h-[calc(100vh-9rem)] z-[5]`}>
        <CardHeader>
            <div className="pb-4">
            <div className="font-[400] text-[1.25rem] text-black">Price of Pinto</div>
            <div className="font-[300] text-[1.25rem] text-pinto-gray-4">The Pinto price is determined by the ratio and value of assets in each liquidity pool.</div>
            <div className="flex flex-row justify-between items-center mt-4">
              <div className="font-[400] text-[1.25rem] text-black inline-flex gap-1.5 items-center">
                <img src={pintoIconOriginal} className={"w-9 h-9"} />
                <span className={"text-[2rem]"}>${priceData.price.toHuman("short")}</span>
              </div>
              <div className="px-2 py-0.5 h-6 bg-pinto-green-1 rounded-[0.25rem] text-pinto-green font-[400] text-[0.875rem]">
                Total deltaP: {Number(priceData.deltaB.toHuman()).toFixed(2)}
              </div>
            </div>
            <div className="flex flex-row relative mt-4">
              <div className={"h-2 rounded-l-[0.5rem] bg-pinto"} style={{ width: `${Number(totalDeltaBar.add(50).toHuman())}%` }} />
              <div className={"h-2 w-full relative flex flex-row rounded-r-[0.5rem] overflow-clip bg-red-500"} style={{ width: `${totalDeltaBar.add(50).sub(100).abs().toHuman()}%` }}>
                {priceData.pools.map((pool, i) => {                  
                  const deltaBar = Number((pool.deltaB.abs()).div(priceData.deltaB.eq(0) ? 1 : priceData.deltaB.abs()).mul(100).toHuman()).toFixed(2);
                  if (!pool.pool?.color) return
                    return (
                      <div className={`${i === 0 ? 'border-l-0' : 'border-l-2'} border-white min-w-2`} style={{ background: pool.pool.color, width: `${deltaBar}%` }} />
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
            <Separator className="w-[38rem] -ml-4"/>
        </CardHeader>
        <CardContent className="overflow-y-auto pt-0 -mt-4 mb-16 max-h-[calc(100vh-28rem)]">
            <div className="flex flex-col gap-4 mt-4">
            {priceData.pools.map((pool) => {
              const token0Price = pool.tokens[0].isMain ? priceData.price : priceData.tokenPrices.get(pool.tokens[0])?.instant || TokenValue.ZERO;
              const token1Price = pool.tokens[1].isMain ? priceData.price : priceData.tokenPrices.get(pool.tokens[1])?.instant || TokenValue.ZERO;
              const token0BalanceUsd = pool.balances[0].mul(token0Price) || 0n;
              const token1BalanceUsd = pool.balances[1].mul(token1Price) || 0n;
              const mainTokenIndex = pool.tokens.findIndex((token) => token.isMain);
              const isWhitelisted = tokenData.whitelistedTokens.findIndex((token) => token?.address.toLowerCase() === pool.pool?.address.toLowerCase()) > -1;
              const deltaBar = Number((pool.deltaB.abs()).div(pool.balances[mainTokenIndex]).mul(100).toHuman()).toFixed(2);
              if (!isWhitelisted) return;
              return (
                <Card className="overflow-clip group hover:border-pinto-green-2">
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
                    <div className="flex flex-row gap-4 justify-center -mb-10 group-hover:mb-0 transition-all">
                      <div className="px-2 py-0.5 h-6 bg-pinto-gray-blue rounded-[0.25rem] text-black font-[400] text-[0.875rem]">Total Liquidity: ${pool.liquidity.toHuman("short")}</div>
                      <div className="px-2 py-0.5 h-6 bg-pinto-green-1 rounded-[0.25rem] text-pinto-green font-[400] text-[0.875rem]">deltaP: {Number(pool.deltaB.toHuman()).toFixed(0)}</div>
                    </div>
                  </CardContent>
                </Card>
              )
            }
            )}
            </div>
        </CardContent>
        <CardFooter className="flex flex-col absolute bottom-0 bg-pinto-gray-1 pb-4 items-stretch">
          <Separator className="w-[38rem] -ml-4 "/>
          <div className="inline-flex items-center">
            <div className="flex flex-row min-w-fit max-w-fit mt-4 animate-marquee">
              {Array.from(priceData.tokenPrices).map((token) => 
                <>
                {token[0]?.name &&
                <div className="inline-flex items-center px-2 gap-1.5">
                  <img src={token[0].logoURI} className={"w-6 h-6"} />
                  <span className="text-nowrap font-[400] text-[1.25rem] text-pinto-gray-5">{`${token[0].symbol}: $${Number(token[1].instant.toHuman()).toFixed(2)}`}</span>   
                </div>
                }
                </>
              )}
            </div>
            <div className="flex flex-row min-w-fit max-w-fit mt-4 animate-marquee">
              {Array.from(priceData.tokenPrices).map((token) => 
                <>
                {token[0]?.name &&
                <div className="inline-flex items-center px-2 gap-1.5">
                  <img src={token[0].logoURI} className={"w-6 h-6"} />
                  <span className="text-nowrap font-[400] text-[1.25rem] text-pinto-gray-5">{`${token[0].symbol}: $${Number(token[1].instant.toHuman()).toFixed(2)}`}</span>   
                </div>
                }
                </>
              )}
            </div>
            <div className="flex flex-row min-w-fit max-w-fit mt-4 animate-marquee">
              {Array.from(priceData.tokenPrices).map((token) => 
                <>
                {token[0]?.name &&
                <div className="inline-flex items-center px-2 gap-1.5">
                  <img src={token[0].logoURI} className={"w-6 h-6"} />
                  <span className="text-nowrap font-[400] text-[1.25rem] text-pinto-gray-5">{`${token[0].symbol}: $${Number(token[1].instant.toHuman()).toFixed(2)}`}</span>   
                </div>
                }
                </>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    )
}
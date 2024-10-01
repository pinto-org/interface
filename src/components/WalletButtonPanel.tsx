import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/Card";
import { Avatar } from "connectkit";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { usePriceData } from "@/state/usePriceData";
import { TokenValue } from "@/classes/TokenValue";
import { Button } from "./ui/Button";
import { Separator } from "./ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import { BackwardArrowDotsIcon, ChevronDownIcon, CloseIcon, LeftArrowIcon, UpDownArrowsIcon } from "./Icons";
import { Toggle } from "./ui/Toggle";
import { useState } from "react";
import WalletButtonTransfer from "./WalletButtonTransfer";

export default function WalletButtonPanel({isOpen = false, togglePanel}: {isOpen: boolean, togglePanel: () => void}) {

    const { address } = useAccount();
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName as string })
    const { disconnect } = useDisconnect();

    const farmerBalances = useFarmerBalances();
    const priceData = usePriceData();

    const totalBalance = Array.from(farmerBalances.balances).reduce((totalBalance, tokenBalance) => {
        const price = priceData.tokenPrices.get(tokenBalance[0])?.instant || 0
        const internalValue = tokenBalance[1].internal.mul(price).add(totalBalance.internal)
        const externalValue = tokenBalance[1].external.mul(price).add(totalBalance.external)
        const totalValue = tokenBalance[1].total.mul(price).add(totalBalance.total)
        return ({ internal: internalValue, external: externalValue, total: totalValue })
    }, { internal: TokenValue.ZERO, external: TokenValue.ZERO, total: TokenValue.ZERO });

    const [showTransfer, setShowTransfer] = useState(false);

    return (
        <Card className={`absolute top-[5rem] flex flex-col bg-white transition-all ${isOpen ? 'right-[1.5rem]' : '-right-[38rem]'} w-[38rem] ${showTransfer ? 'h-[calc(100vh-9rem)]' : 'h-auto'} overflow-clip max-h-[calc(100vh-9rem)] z-[51]`}>
            {!showTransfer ? 
            <> 
                <CardHeader className="flex flex-col gap-4 p-6 pb-10">
                    <div className="flex flex-row gap-1">
                        {ensAvatar && <Avatar address={address} size={24} />}
                        <span className="font-[400] text-[1rem] text-pinto-gray-5">{ensName ? ensName : address ? `${address.substring(0, 7)}...${address.substring(38, 42)}` : ''}</span>
                    </div>
                    <span className="font-[300] text-[3.425rem] text-pinto-gray-5 leading-none">{`$${Number(totalBalance.total.toHuman()).toFixed(2)}`}</span>
                    <div className="flex flex-col gap-2">
                        <div className="font-[340] text-[1rem] text-pinto-gray-4 inline-flex gap-1 items-center leading-none">
                            <div className="rounded-full bg-pinto w-3 h-3"/>
                            <div>Wallet Balance:</div>
                            <div className="text-pinto-gray-5">{`$${Number(totalBalance.external.toHuman()).toFixed(2)}`}</div>
                        </div>
                        <div className="font-[340] text-[1rem] text-pinto-gray-4 inline-flex gap-1 items-center leading-none">
                            <div className="rounded-full bg-pinto-yellow-1 w-3 h-3"/>
                            <div>Farm Balance:</div>
                            <div className="text-pinto-gray-5">{`$${Number(totalBalance.internal.toHuman()).toFixed(2)}`}</div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 w-full">
                        <Button variant="ghost" className="bg-pinto-gray-1 hover:hover:bg-pinto-green-2 w-full h-[6.375rem] rounded-[1rem] font-[400] text-[1rem] text-pinto-gray-5 hover:text-white flex flex-col gap-4">
                            <div className="rounded-full bg-pinto-green-2 h-9 w-9 flex justify-evenly">
                                <span className="self-center items-center">
                                    <UpDownArrowsIcon color={"white"} />
                                </span>
                            </div>
                            Swap
                        </Button>
                        <Button variant="ghost" className="bg-pinto-gray-1 hover:hover:bg-pinto-green-2 w-full h-[6.375rem] rounded-[1rem] font-[400] text-[1rem] text-pinto-gray-5 hover:text-white flex flex-col gap-4">
                            <div className="rounded-full bg-pinto-green-2 h-9 w-9 flex justify-evenly">
                                <span className="self-center items-center">
                                    <LeftArrowIcon color={"white"} />
                                </span>
                            </div>
                            Send
                        </Button>
                        <Button onClick={() => setShowTransfer(true)} variant="ghost" className="bg-pinto-gray-1 hover:hover:bg-pinto-green-2 w-full h-[6.375rem] rounded-[1rem] font-[400] text-[1rem] text-pinto-gray-5 hover:text-white flex flex-col gap-4">
                            <div className="rounded-full bg-pinto-green-2 h-9 w-9 flex justify-evenly">
                                <span className="self-center items-center">
                                    <BackwardArrowDotsIcon color={"white"} />
                                </span>
                            </div>
                            Transfer
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-0 -mt-4 pb-0">
                    <Separator className="w-[38rem] -ml-4"/>
                    <div className="pt-6 px-3 pb-0">
                        <Tabs defaultValue="combined" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 h-11 py-0 px-1 gap-[0.75rem]">
                                <TabsTrigger className="h-9 text-[1rem] hover:bg-pinto-gray-1" value="combined">Combined</TabsTrigger>
                                <TabsTrigger className="h-9 text-[1rem] hover:bg-pinto-gray-1" value="external">Wallet Balance</TabsTrigger>
                                <TabsTrigger className="h-9 text-[1rem] hover:bg-pinto-gray-1" value="internal">Farm Balance</TabsTrigger>
                            </TabsList>
                            <TabsContent value="combined" className="overflow-y-auto overflow-x-clip max-h-[calc(100vh-39rem)] -mx-4 px-4">
                            {totalBalance.total.eq(0) ? 
                            <div className="flex flex-grow items-center justify-around h-40">
                                No balances found.
                            </div>
                            :
                            <div className={"mt-4 -mx-4"}>
                                {Array.from(farmerBalances.balances).map((tokenBalance) => {
                                    const [token, balances] = tokenBalance;
                                    const price = priceData.tokenPrices.get(token)?.instant || TokenValue.ZERO;
                                    if (balances.total.eq(0)) return;
                                    return (
                                        <Toggle key={`${token.address}_totalBalance`} className="flex flex-row w-full gap-4 group overflow-hidden transition-all hover:bg-pinto-gray-1 hover:cursor-pointer data-[state=on]:bg-white data-[state=on]:hover:bg-pinto-gray-1 data-[state=off]:hover:bg-pinto-gray-1 data-[state=off]:bg-white rounded-[0.75rem] h-auto px-4 py-2">
                                            <img src={token.logoURI} className="w-12 h-12 self-start" />
                                            <div className="flex flex-col w-full -mb-12 group-data-[state=on]:mb-0 transition-all">
                                                <div className="flex flex-row justify-between items-center">
                                                    <div className="flex flex-col text-left gap-2 my-1">
                                                        <span className="text-[1.25rem] text-pinto-gray-5">{token.symbol}</span>
                                                        <span className="font-[340] transition-all group-hover:text-pinto-green-2 text-pinto-gray-4 inline-flex gap-1 items-center">
                                                            {`${balances.total.toHuman('short')} ${token.symbol}`}
                                                            <ChevronDownIcon color={"currentColor"} className={"transform transition-transform group-data-[state=on]:-scale-y-100"} />
                                                        </span>
                                                    </div>
                                                    <span className="text-[1.5rem] font-[500] text-pinto-gray-5">{`$${Number(balances.total.mul(price).toHuman()).toFixed(2)}`}</span>    
                                                </div>
                                                <div className="font-[340] text-[1rem] mt-2 text-pinto-gray-4 inline-flex justify-between gap-1 items-center leading-none">
                                                    <div className="inline-flex gap-1 items-center">
                                                        <div className="rounded-full bg-pinto w-3 h-3"/>
                                                        <div>Wallet Balance</div>
                                                    </div>
                                                    <div>{`${balances.external.toHuman('short')} ${token.symbol}`}</div>
                                                </div>
                                                <div className="font-[340] text-[1rem] mt-1 text-pinto-gray-4 inline-flex justify-between gap-1 items-center leading-none">
                                                    <div className="inline-flex gap-1 items-center">
                                                        <div className="rounded-full bg-pinto-yellow-1 w-3 h-3"/>
                                                        <div>Farm Balance</div>
                                                    </div>
                                                    <div>{`${balances.internal.toHuman('short')} ${token.symbol}`}</div>
                                                </div>
                                            </div>
                                        </Toggle>
                                        )
                                    })}
                            </div>
                            }
                            </TabsContent>
                            <TabsContent value="external" className="overflow-y-auto overflow-x-clip max-h-[calc(100vh-39rem)] -mx-4 px-4">
                            {totalBalance.external.eq(0) ? 
                            <div className="flex flex-grow items-center justify-around h-40">
                                You have no balance in your Wallet
                            </div>
                            : 
                            <div className="mt-4 -mx-4">
                                {Array.from(farmerBalances.balances).map((tokenBalance) => {
                                const [token, balances] = tokenBalance;
                                const price = priceData.tokenPrices.get(token)?.instant || TokenValue.ZERO;
                                if (balances.external.eq(0)) return;
                                return (
                                    <Toggle key={`${token.address}_externalBalance`} className="flex flex-row w-full gap-4 overflow-hidden transition-all hover:cursor-default hover:bg-pinto-gray-1 data-[state=on]:bg-white data-[state=off]:bg-white rounded-[0.75rem] h-auto px-4 py-2">
                                        <img src={token.logoURI} className="w-12 h-12 self-start" />
                                        <div className="flex flex-col w-full transition-all">
                                            <div className="flex flex-row justify-between items-center">
                                                <div className="flex flex-col text-left gap-2 my-1">
                                                    <span className="text-[1.25rem] text-pinto-gray-5">{token.symbol}</span>
                                                    <span className="font-[340] transition-all text-pinto-gray-4 inline-flex gap-1 items-center">
                                                        {`${balances.external.toHuman('short')} ${token.symbol}`}
                                                    </span>
                                                </div>
                                                <span className="text-[1.5rem] font-[500] text-pinto-gray-5">{`$${Number(balances.external.mul(price).toHuman()).toFixed(2)}`}</span>    
                                            </div>
                                        </div>
                                    </Toggle>
                                )
                                })}
                            </div>
                            }
                            </TabsContent>
                            <TabsContent value="internal" className="overflow-y-auto overflow-x-clip max-h-[calc(100vh-39rem)] -mx-4 px-4">
                            {totalBalance.internal.eq(0) ?
                            <div className="flex flex-grow items-center justify-around h-40">
                                You have no balance in the Farm
                            </div>
                            :
                            <div className="mt-4 -mx-4">
                                {Array.from(farmerBalances.balances).map((tokenBalance) => {
                                    const [token, balances] = tokenBalance;
                                    const price = priceData.tokenPrices.get(token)?.instant || TokenValue.ZERO;
                                    if (balances.internal.eq(0)) return;
                                    return (
                                        <Toggle key={`${token.address}_externalBalance`} className="flex flex-row w-full gap-4 overflow-hidden transition-all hover:cursor-default hover:bg-pinto-gray-1 data-[state=on]:bg-white data-[state=off]:bg-white rounded-[0.75rem] h-auto px-4 py-2">
                                            <img src={token.logoURI} className="w-12 h-12 self-start" />
                                            <div className="flex flex-col w-full transition-all">
                                                <div className="flex flex-row justify-between items-center">
                                                    <div className="flex flex-col text-left gap-2 my-1">
                                                        <span className="text-[1.25rem] text-pinto-gray-5">{token.symbol}</span>
                                                        <span className="font-[340] transition-all text-pinto-gray-4 inline-flex gap-1 items-center">
                                                            {`${balances.internal.toHuman('short')} ${token.symbol}`}
                                                        </span>
                                                    </div>
                                                    <span className="text-[1.5rem] font-[500] text-pinto-gray-5">{`$${Number(balances.internal.mul(price).toHuman()).toFixed(2)}`}</span>    
                                                </div>
                                            </div>
                                        </Toggle>
                                    )
                                })}
                            </div>
                            }
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
                <CardFooter className="justify-around p-0 mt-4 mb-4">
                    <Button variant="ghost" className="inline-flex items-center gap-2 rounded-full text-black bg-pinto-gray-1 hover:hover:bg-pinto-green-2 hover:text-white" onClick={() => { disconnect(); togglePanel(); }}>Disconnect Wallet <CloseIcon color={"currentColor"} /></Button>
                </CardFooter>
            </>
            :
            <WalletButtonTransfer setShowTransfer={setShowTransfer}/>
            }
        </Card>
    )
}
import { Button } from "@/components/ui/Button";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { useParams } from "react-router-dom";
import copyIcon from "@/assets/misc/Copy.svg";
import externalLinkIcon from "@/assets/misc/ExternalLink.svg";
import etherscanIcon from "@/assets/misc/Etherscan.png";
import stalkIcon from "@/assets/protocol/Stalk-variant.png";
import seedsIcon from "@/assets/protocol/Seed-variant.png";
import backArrowIcon from "@/assets/misc/LeftArrow.svg";
import { Separator } from "@/components/ui/Separator";
import APYChip from "@/components/APYChip";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { usePriceData } from "@/state/usePriceData";
import DepositsTable from "./silo/DepositsTable";
import { TokenValue } from "@/classes/TokenValue";
import SiloActions from "./silo/SiloActions";

export default function SiloToken() {
    const { tokenAddress } = useParams();
    const tokenData = useTokenData();
    const siloData = useSiloData();
    const priceData = usePriceData();
    const depositedBalances = useFarmerDepositedBalances();
    
    const siloToken = tokenData.whitelistedTokens.find((token) => token.address.toLowerCase() === tokenAddress?.toLowerCase());
    const siloTokenData = siloData.tokenData.get(siloToken);
    const farmerDeposits = depositedBalances.data.get(siloToken);

    const siloTVD = Array.from(siloData.tokenData)
        .reduce((total, token) => token[1].depositedBDV.add(total), TokenValue.ZERO);
    
    const liquidityTVD = Array.from(siloData.tokenData)
        .reduce((total, token) => (!token[0].isLP ? TokenValue.ZERO : token[1].depositedBDV).add(total), TokenValue.ZERO);

    if (!siloToken) {
        return (
            <>
            404
            </>
        )
    };

    return (    
        <div className="flex flex-col items-center">
            <div className="flex flex-row w-[80%] gap-14">
                <div className="flex flex-col w-[80%] gap-8">
                    <Button asChild variant={'outline'} className="rounded-full -my-4 h-12 w-12 p-0">
                        <a href={"/silo"}>
                            <img src={backArrowIcon} />
                        </a>
                    </Button>
                    <div className="inline-flex items-center gap-3">
                        <img src={siloToken?.logoURI} className="w-14 h-14"/>
                        <span className="text-black font-[300] text-[3.5rem]">{siloToken?.name}</span>
                        <div className="inline-flex gap-2">
                            <Button variant={'outline'} className="rounded-full h-12 w-12 p-0" onClick={() => {navigator.clipboard.writeText(siloToken.address)}}>
                                <img src={copyIcon} />
                            </Button>
                            <Button asChild variant={'outline'} className="rounded-full h-12 w-12 p-0" >
                                <a href={`https://basin.exchange/#/wells/${siloToken.address}`} target={"_blank"}>
                                    <img src={externalLinkIcon} />
                                </a>
                            </Button>
                            <Button variant={'outline'} className="rounded-full h-12 w-12 p-0">
                                <a href={`https://etherscan.io/address/${siloToken.address}`} target={"_blank"}>
                                    <img src={etherscanIcon} />
                                </a>
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                            <div className="font-[400] text-[1rem] text-black">Current Deposit Rewards</div>
                            <div className="flex flex-row gap-3">
                                <div className="inline-flex gap-0.5 items-center">
                                    <img src={stalkIcon} className="w-7 h-7 mt-0.5" />
                                    <div className="font-[400] text-[1.5rem] text-black">
                                        {siloTokenData.rewards.stalk.mul(1000000).toHuman('short')} Stalk
                                    </div>
                                </div>
                                <div className="inline-flex gap-0.5 items-center">
                                    <img src={seedsIcon} className="w-7 h-7 mt-0.5" />
                                    <div className="font-[400] text-[1.5rem] text-black">
                                        {siloTokenData.rewards.seeds.reDecimal(2).toHuman('short')} Seeds
                                    </div>
                                </div>
                            </div>
                        </div>
                        <APYChip apyValue={siloTokenData.yields.beanAPY} />
                    </div>
                    <Separator />
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                            <div className="font-[400] text-[1rem] text-black">My Deposits</div>
                            <div className="flex flex-row gap-3">
                                <div className="flex flex-col">
                                    <div className="inline-flex gap-2 items-center">
                                        <img src={siloToken.logoURI} className="w-9 h-9" />
                                        <div className="font-[400] text-[2rem] text-black">
                                            {`${farmerDeposits.amount.toHuman('short')} ${siloToken.name}`}
                                        </div>
                                    </div>
                                    <div className="font-[300] text-[1.5rem] text-pinto-gray-4">
                                        {`$${farmerDeposits.depositBDV.mul(priceData.price).reDecimal(2).toHuman()}`}
                                    </div>
                                </div>
                                <div className="inline-flex ml-24 gap-8 items-center">
                                    <div className="flex flex-col">
                                        <div className="text-[1rem] font-[400] text-pinto-gray-5">My Stalk</div>
                                        <div className="inline-flex items-center gap-1">
                                            <img src={stalkIcon} className="w-6 h-6 mt-0.5" />
                                            <div className="font-[400] text-[1.5rem] text-black">
                                                {farmerDeposits.stalk.base.reDecimal(2).toHuman('short')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-[1rem] font-[400] text-pinto-gray-5">My Seeds</div>
                                        <div className="inline-flex items-center gap-1">
                                            <img src={stalkIcon} className="w-6 h-6 mt-0.5" />
                                            <div className="font-[400] text-[1.5rem] text-black">
                                                {farmerDeposits.seeds.reDecimal(2).toHuman('short')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DepositsTable token={siloToken} />
                    <div className="flex flex-col gap-8">
                        <div className="font-[400] text-[2rem] text-pinto-gray-5">About {siloToken.name}</div>
                        <div className="flex flex-row items-center justify-start gap-28">
                            <div className="flex flex-col">
                                <div className="font-[400] text-[1rem] text-pinto-gray-5">
                                    Total Value Deposited
                                </div>
                                <div className="font-[400] text-[1.5rem] text-black">
                                    ${siloTokenData.depositedBDV.mul(priceData.price).toHuman('short')}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="font-[400] text-[1rem] text-pinto-gray-5">
                                    % of Value Deposited
                                </div>
                                <div className="font-[400] text-[1.5rem] text-black">
                                    {`${siloTokenData.depositedBDV.div(siloTVD.gt(0) ? siloTVD : TokenValue.ONE).mul(100).toHuman('short')}%`}
                                </div>
                            </div>
                            {siloToken.isLP && 
                                <div className="flex flex-col">
                                    <div className="font-[400] text-[1rem] text-pinto-gray-5">
                                        % of LP Deposits
                                    </div>
                                    <div className="font-[400] text-[1.5rem] text-black">
                                        {`${siloTokenData.depositedBDV.div(liquidityTVD.gt(0) ? liquidityTVD : TokenValue.ONE).mul(100).toHuman('short')}%`}
                                    </div>
                                </div>
                            }
                            {siloToken.isLP && 
                                <div className="flex flex-col">
                                    <div className="font-[400] text-[1rem] text-pinto-gray-5">
                                        Target % of LP Deposits
                                    </div>
                                    <div className="font-[400] text-[1.5rem] text-black">
                                        {`TODO %`}
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="font-[400] text-[1.25rem] text-pinto-gray-3">
                        {siloToken.isLP ?
                            `${siloToken.name} is a liquidity pool token on the Basin decentralized exchange. 
                            You can deposit ETH, DAI, USDC, XX, and your assets will be swapped and deposited into the liquidity pool
                            to provide liquidity for this pair.
                            `
                            :
                            `${siloToken.name} is the token that powers the ${siloToken.name} protocol.
                            `
                        }
                        </div>
                        <div>
                            <a href={"/explorer"} className="font-[400] text-[1.25rem] text-pinto-green-2 hover:underline transition-all">See More Data →</a>
                        </div>
                    </div>
                </div>
                <div className="flex flex-shrink w-[500px] mt-32 p-4 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border">
                    <SiloActions token={siloToken} />
                </div> 
            </div>
        </div>
    )
}
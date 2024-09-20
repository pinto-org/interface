import { TokenValue } from "@/classes/TokenValue";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useFieldData } from "@/state/useFieldData";
import { useSiloData } from "@/state/useSiloData";
import TooltipSimple from "@/components/TooltipSimple";
import stalkIcon from "@/assets/protocol/Stalk-variant.png";
import seedIcon from "@/assets/protocol/Seed-variant.png";
import podIcon from "@/assets/protocol/Pod-variant.png";
import pdvIcon from "@/assets/protocol/PDV.png";
import tooltipIcon from "@/assets/misc/Tooltip-default.png";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function Overview() {

    const farmerSilo = useFarmerSilo();
    const farmerField = useFarmerField();

    const siloData = useSiloData();
    const fieldData = useFieldData();

    const siloPct = siloData.totalStalk.gt(0) ? farmerSilo.activeStalkBalance.div(siloData.totalStalk).mul(100) : TokenValue.ZERO;
    const stalkPerSeason = farmerSilo.activeSeedsBalance.div(10000);

    const placesInLine = farmerField.plots.map((plot) => plot.index.sub(fieldData.harvestableIndex)).sort((a,b) => a.sub(b));

    return (
        <div className="flex flex-col pt-64 gap-52">
            <div>
                <div className="flex flex-col items-center">
                    <div className="text-[1.25rem] text-pinto-gray-5 font-[400]">My deposited value</div>
                    <div className="text-[3.5rem] text-black leading-tight font-[400]">${farmerSilo.depositsUSD.toHuman('short')}</div>
                    <div className="flex flex-row gap-1 items-center">
                        <img src={pdvIcon} className="scale-[1.2]"/>
                        <div className="text-[1.25rem] text-pinto-gray-4 font-[300] leading-none">{farmerSilo.depositsBDV.toHuman('short')} PDV</div>
                    </div>
                    
                </div>
                <div className="flex flex-row justify-center mt-20 gap-16">
                    <div className="flex flex-col items-center w-72">
                        <div className="text-[1.25rem] text-pinto-gray-5 font-[400]">My Stalk</div>
                        <div className="flex flex-row gap-1 items-center">
                            <img src={stalkIcon} className={"h-9 w-9 drop-shadow-md"}/>
                            <div className="text-[2rem] text-black leading-tight font-[400]">{farmerSilo.activeStalkBalance.toHuman('short')}</div>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            <div className="text-[1.25rem] text-pinto-gray-4 font-[300] leading-none">{siloPct.toHuman('short')}% of Stalk supply</div>
                            <TooltipSimple content={"Your ownership of the Stalk supply determines the portion of Pinto supply increases that you earn."}>
                                <img src={tooltipIcon} className={"h-4 w-4"} />
                            </TooltipSimple>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-72">
                        <div className="text-[1.25rem] text-pinto-gray-5 font-[400]">My Seeds</div>
                        <div className="flex flex-row gap-1 items-center">
                            <img src={seedIcon} className={"h-9 w-9 drop-shadow-md]"}/> 
                            <div className="text-[2rem] text-black leading-tight font-[400]">{farmerSilo.activeSeedsBalance.toHuman('short')}</div>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            <div className="text-[1.25rem] text-pinto-gray-4 font-[300] text-nowrap leading-none">+{stalkPerSeason.toHuman('short')} Grown Stalk per Season</div>
                            <TooltipSimple content={"Seeds grow Stalk every Season, creating the time weighted staking mechanism that is the Silo."}>
                                <img src={tooltipIcon} className={"h-4 w-4"} />
                            </TooltipSimple>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-72">
                        <div className="text-[1.25rem] text-pinto-gray-5 font-[400]">My Pods</div>
                        <div className="flex flex-row gap-1 items-center">
                            <img src={podIcon} className={"h-8 w-8 drop-shadow-md"} />
                            <div className="text-[2rem] text-black leading-tight font-[400]">{farmerField.totalPods.toHuman('short')}</div>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            <div className="text-[1.25rem] text-pinto-gray-4 font-[300] text-nowrap leading-none">Next position in line: {placesInLine[0]?.toHuman('short') || 0}</div>
                            <TooltipSimple content={"The number of Pods that need to Harvest before your next place in the Pod Line."}>
                                <img src={tooltipIcon} className={"h-4 w-4"} />
                            </TooltipSimple>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <Tabs defaultValue="deposits" className="w-[1100px]">
                    <TabsList className="h-0 bg-transparent p-0">
                        <TabsTrigger className="pr-3 pl-0 font-[400] text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5" value="deposits">My Deposits</TabsTrigger>
                        <TabsTrigger className="pl-3 pr-0 font-[400] text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5" value="pods">My Pods</TabsTrigger>
                    </TabsList>
                    <TabsContent value="deposits">Deposit table here.</TabsContent>
                    <TabsContent value="pods">Pod table here.</TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
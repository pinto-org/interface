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
import claimableIcon from '@/assets/protocol/Claimable.png';
import tooltipIcon from "@/assets/misc/Tooltip-default.png";
import plotIcon from "@/assets/protocol/Plot.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import useTokenData from "@/state/useTokenData";
import StatPanel from "@/components/StatPanel";

export default function Overview() {

    const farmerSilo = useFarmerSilo();
    const farmerField = useFarmerField();

    const siloData = useSiloData();
    const fieldData = useFieldData();

    const tokenData = useTokenData();

    const siloPct = siloData.totalStalk.gt(0) ? farmerSilo.activeStalkBalance.div(siloData.totalStalk).mul(100) : TokenValue.ZERO;
    const stalkPerSeason = farmerSilo.activeSeedsBalance.div(10000);

    const placesInLine = farmerField.plots.map((plot) => plot.index.sub(fieldData.harvestableIndex)).sort((a,b) => a.sub(b));

    const farmerDeposits = useFarmerDepositedBalances().data;
    const SILO_WHITELIST = tokenData.whitelistedTokens;
    const mainToken = tokenData.mainToken;

    const claimableBeans = farmerSilo.earnedBeansBalance;
    const claimableStalk = Object.values(farmerSilo.grownStalkPerToken).reduce(
        (acc, curr) => acc.add(curr.grownStalk),
        TokenValue.ZERO,
      );
    const claimableSeeds = claimableBeans.mul(siloData.tokenData.get(mainToken).rewards.seeds)

    return (
        <div className="flex flex-col pt-64 gap-52">
            <div>
                <div className="flex flex-col items-center">
                    <StatPanel
                        variant={"depositedValue"}
                        mainValue={farmerSilo.depositsUSD}
                        secondaryValue={farmerSilo.depositsBDV}
                        size={"large"}
                    />
                </div>
                <div className="flex flex-row justify-center mt-20 gap-16">
                    <StatPanel
                        variant={"stalk"}
                        mainValue={farmerSilo.activeStalkBalance}
                        secondaryValue={siloPct}
                        tooltipContent={"Your ownership of the Stalk supply determines the portion of Pinto supply increases that you earn."}
                    />
                    <StatPanel
                        variant={"seeds"}
                        mainValue={farmerSilo.activeSeedsBalance}
                        secondaryValue={stalkPerSeason}
                        tooltipContent={"Seeds grow Stalk every Season, creating the time weighted staking mechanism that is the Silo."}
                    />
                    <StatPanel
                        variant={"pods"}
                        mainValue={farmerField.totalPods}
                        secondaryValue={placesInLine[0] || 0}
                        tooltipContent={"The number of Pods that need to Harvest before your next place in the Pod Line."}
                    />
                </div>
            </div>
            <div className="flex flex-col items-center">
                <Tabs defaultValue="deposits" className="w-[1150px]">
                    <TabsList className="h-0 bg-transparent p-0">
                        <TabsTrigger className="pr-3 pl-0 font-[400] text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5" value="deposits">My Deposits</TabsTrigger>
                        <TabsTrigger className="pl-3 pr-0 font-[400] text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5" value="pods">My Pods</TabsTrigger>
                    </TabsList>
                    <TabsContent className="mt-6" value="deposits">
                        <div className="border border-pinto-gray-2 rounded-[1rem] overflow-clip">
                            <Table>
                                {/* <TableCaption>Your deposits will appear here</TableCaption> */}
                                <TableHeader>
                                    <TableRow className="bg-pinto-gray-1 hover:bg-pinto-gray-1 h-14">
                                        <TableHead className="text-black font-[400] text-[1rem] w-1/4 p-4">Deposited Asset</TableHead>
                                        <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">Amount Deposited</TableHead>
                                        <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">Stalk</TableHead>
                                        <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4 p-4">Seeds</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(claimableBeans.gt(0) || claimableStalk.gt(0) || claimableSeeds.gt(0)) && 
                                        <TableRow className="h-[4.5rem] bg-pinto-green-1 hover:bg-pinto-green-1">
                                        <TableCell className="text-pinto-green-2 font-[400] text-[1rem] p-4 inline-flex items-center gap-1.5">
                                            <img src={claimableIcon} className="h-8 w-8" />
                                            <div>Claimable</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="text-pinto-green-2 font-[400] text-[1rem]">{claimableBeans.toHuman('short')}{' '}{mainToken.name}</div>
                                        </TableCell>
                                        <TableCell className="text-pinto-green-2 font-[400] text-[1rem] text-right">
                                            <div>{claimableStalk.toHuman('short')}</div>
                                        </TableCell>
                                        <TableCell className="text-pinto-green-2 font-[400] text-[1rem] text-right p-4">{claimableSeeds.toHuman('short')}</TableCell>
                                    </TableRow>
                                    }
                                    {SILO_WHITELIST.map((token) => {
                                        const userData = farmerDeposits.get(token);
                                        return (
                                        <TableRow className="h-[4.5rem] bg-white hover:bg-white">
                                            <TableCell className="text-black font-[400] text-[1rem] p-4 inline-flex items-center gap-1.5">
                                                <img src={token.logoURI} className="h-8 w-8" />
                                                <div>{token.name}</div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="text-black font-[400] text-[1rem]">{userData.amount.toHuman('short')}{' '}{token.name}</div>
                                                <div className="inline-flex items-center gap-1">
                                                    <img src={pdvIcon} className="h-3 w-5" />
                                                    <div className="text-pinto-gray-4 font-[300] text-[1rem]">{userData.depositBDV.toHuman('short')}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-black font-[400] text-[1rem] text-right">
                                                <div>{userData.stalk.base.toHuman('short')}</div>
                                                {userData.stalk.grown.gt(0) && 
                                                    <div className="text-pinto-gray-4">Claimable Grown Stalk: <span className="text-pinto-green-2">+{userData.stalk.grown.toHuman('short')}</span></div>
                                                }
                                            </TableCell>
                                            <TableCell className="text-black font-[400] text-[1rem] text-right p-4">{userData.seeds.toHuman('short')}</TableCell>
                                        </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                    <TabsContent className="mt-6" value="pods">
                    <div className="overflow-clip">
                            <Table>
                                <TableBody className="[&_tr:first-child]:border-t [&_tr:last-child]:border-b">
                                    {farmerField.plots.map((plot) => {
                                        return (
                                        <TableRow className="h-[4.5rem] bg-transparent hover:bg-transparent items-center">
                                            <TableCell className="pl-0">
                                                <div className="text-black font-[400] text-[1rem] inline-flex items-center gap-1.5 ml-[-2]">
                                                    <img src={plotIcon} className="h-6 w-6" />
                                                    <div>Plot {plot.id}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-0">
                                                <div className="text-black font-[400] text-[1rem] inline-flex items-center gap-1.5">
                                                    <img src={podIcon} className="h-6 w-6" />
                                                    {plot.pods.toHuman('short')}{' Pods'}
                                                    <span className="text-pinto-gray-4">at</span>
                                                    {(plot.index.sub(fieldData.harvestableIndex)).toHuman('short')}{' in the Pod Line'}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
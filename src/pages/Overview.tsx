import claimableIcon from "@/assets/protocol/Claimable.png";
import pdvIcon from "@/assets/protocol/PDV.png";
import { TokenValue } from "@/classes/TokenValue";
import PlotsTable from "@/components/PlotsTable";
import StatPanel from "@/components/StatPanel";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useFieldData } from "@/state/useFieldData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { BaseError, encodeFunctionData } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { toast } from "sonner";

export default function Overview() {

  const account = useAccount();
  const chainId = useChainId();

  const farmerSilo = useFarmerSilo();
  const farmerField = useFarmerField();

  const siloData = useSiloData();
  const fieldData = useFieldData();

  const tokenData = useTokenData();

  const siloPct = siloData.totalStalk.gt(0)
    ? farmerSilo.activeStalkBalance.div(siloData.totalStalk).mul(100)
    : TokenValue.ZERO;
  const stalkPerSeason = farmerSilo.activeSeedsBalance.div(10000);

  const placesInLine = farmerField.plots
    .map((plot) => plot.index.sub(fieldData.harvestableIndex))
    .sort((a, b) => a.sub(b));

  const farmerDeposits = useFarmerDepositedBalances().data;
  const SILO_WHITELIST = tokenData.whitelistedTokens;
  const mainToken = tokenData.mainToken;

  const claimableBeans = farmerSilo.earnedBeansBalance;
  const claimableStalk = farmerSilo.grownStalkReward;
  const claimableSeeds = claimableBeans.mul(siloData.tokenData.get(mainToken)?.rewards.seeds ?? 0n);

  const hasDeposits = Array.from(farmerDeposits.entries()).find((token) => token[1].deposits.length > 0);

  const podRate = fieldData.temperature.max;
  const siloTokens = Array.from(siloData.tokenData.entries());
  const avg = (siloTokens.reduce((total, token) => token[1].yields.beanAPY + total, 0) / siloTokens.length).toFixed(2);

  const queryClient = useQueryClient();
  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      const allQueryKeys = [...farmerSilo.queryKeys, ...siloData.queryKeys, fieldData.queryKeys]
      // invalidating query results to trigger a refetch
      allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
      farmerField.refetch();
    };
  }, [isSuccess]);

  async function onSubmit() {
    if (!account.address) return;
    
    const plant = encodeFunctionData({
      abi: beanstalkAbi,
      functionName: "plant"
    });
    
    const tokensToMow = SILO_WHITELIST.map((token) => token.address);
    const mow = encodeFunctionData({
      abi: beanstalkAbi,
      functionName: "mowMultiple",
      args: [account.address, tokensToMow],
    });
    
    const tx = () => writeContractAsync({
      address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
      abi: beanstalkAbi,
      functionName: "farm",
      args: [[plant, mow]],
    });

    toast.promise(tx, {
      loading: "Claiming rewards...",
      success: (data) => {
        return `Claim complete!`
      },
      error: (error) => {
        return ((error as BaseError).shortMessage || `Failed to claim rewards.`)
      }
    });
  }

  return (
    <div
      className={`flex flex-col ${hasDeposits ? "pt-64" : "justify-center text-center min-h-[calc(100vh-15rem)]"} gap-52`}
    >
      {hasDeposits ? (
        <>
          <div>
            <div className="flex flex-col items-center">
              <StatPanel
                mode={"depositedValue"}
                mainValue={farmerSilo.depositsUSD}
                secondaryValue={farmerSilo.depositsBDV}
                size={"large"}
              />
            </div>
            <div className="flex flex-row justify-center mt-20 gap-16">
              <StatPanel
                mode={"stalk"}
                mainValue={farmerSilo.activeStalkBalance}
                secondaryValue={siloPct}
                tooltipContent={
                  "Your ownership of the Stalk supply determines the portion of Pinto supply increases that you earn."
                }
              />
              <StatPanel
                mode={"seeds"}
                mainValue={farmerSilo.activeSeedsBalance}
                secondaryValue={stalkPerSeason}
                tooltipContent={
                  "Seeds grow Stalk every Season, creating the time weighted staking mechanism that is the Silo."
                }
              />
              <StatPanel
                mode={"pods"}
                mainValue={farmerField.totalPods}
                secondaryValue={placesInLine[0]}
                tooltipContent={"The number of Pods that need to Harvest before your next place in the Pod Line."}
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Tabs defaultValue="deposits" className="w-[1150px]">
              <TabsList className="h-0 bg-transparent p-0 border-0">
                <TabsTrigger
                  className="pr-3 pl-0 font-[400] text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5"
                  value="deposits"
                >
                  My Deposits
                </TabsTrigger>
                <TabsTrigger
                  className="pl-3 pr-0 font-[400] text-[2rem] text-pinto-gray-4 hover:text-pinto-gray-5/80 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-pinto-gray-5"
                  value="pods"
                >
                  My Pods
                </TabsTrigger>
              </TabsList>
              <TabsContent className="mt-6" value="deposits">
                <div className="border border-pinto-gray-2 rounded-[1rem] overflow-clip">
                  <Table>
                    {/* <TableCaption>Your deposits will appear here</TableCaption> */}
                    <TableHeader>
                      <TableRow className="bg-pinto-gray-1 hover:bg-pinto-gray-1 h-14">
                        <TableHead className="text-black font-[400] text-[1rem] w-1/4 p-4">Deposited Asset</TableHead>
                        <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">
                          Amount Deposited
                        </TableHead>
                        <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">Stalk</TableHead>
                        <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4 p-4">Seeds</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(claimableBeans.gt(0) || claimableStalk.gt(0) || claimableSeeds.gt(0)) && (
                        <TableRow onClick={() => onSubmit()}  className="h-[4.5rem] bg-pinto-green-1 hover:bg-pinto-green-1 hover:cursor-pointer">
                          <TableCell className="text-pinto-green-2 font-[400] text-[1rem] p-4 inline-flex items-center gap-1.5">
                            <img src={claimableIcon} className="h-8 w-8" alt="Claimable Tokens" />
                            <div>Claimable</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-pinto-green-2 font-[400] text-[1rem]">
                              {claimableBeans.toHuman("short")} {mainToken.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-pinto-green-2 font-[400] text-[1rem] text-right">
                            <div>{claimableStalk.toHuman("short")}</div>
                          </TableCell>
                          <TableCell className="text-pinto-green-2 font-[400] text-[1rem] text-right p-4">
                            {claimableSeeds.toHuman("short")}
                          </TableCell>
                        </TableRow>
                      )}
                      {SILO_WHITELIST.map((token, i) => {
                        const userData = farmerDeposits.get(token);
                        const claimableStalk = farmerSilo.grownStalkPerToken.get(token) || TokenValue.ZERO;
                        return (
                          <TableRow key={`${token.address}_${i}`} className="h-[4.5rem] bg-white hover:bg-white">
                            <TableCell className="text-black font-[400] text-[1rem] p-4 inline-flex items-center gap-1.5">
                              <img src={token.logoURI} className="h-8 w-8" alt={`${token.name} logo`} />
                              <div>{token.name}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="text-black font-[400] text-[1rem]">
                                {userData.amount.toHuman("short")} {token.name}
                              </div>
                              <div className="inline-flex items-center gap-1">
                                <img src={pdvIcon} className="h-3 w-5" alt={"PDV"} />
                                <div className="text-pinto-gray-4 font-[300] text-[1rem]">
                                  {userData.depositBDV.toHuman("short")}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-black font-[400] text-[1rem] text-right">
                              <div>{userData.stalk.base.toHuman("short")}</div>
                              {claimableStalk.gt(0) && (
                                <div className="text-pinto-gray-4">
                                  Claimable Grown Stalk:{" "}
                                  <span className="text-pinto-green-2">+{claimableStalk.toHuman("short")}</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-black font-[400] text-[1rem] text-right p-4">
                              {userData.seeds.toHuman("short")}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent className="mt-6" value="pods">
                <div className="overflow-clip">
                  <PlotsTable />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      ) : (
        <div className="flex flex-row justify-between gap-8 p-4">
          <Button
            asChild
            variant="outline"
            className="flex flex-col text-center bg-white hover:bg-pinto-green-1 hover:border-pinto-green-2 w-full h-[33rem] rounded-full gap-4"
          >
            <a href={"/silo"}>
              <span className="text-pinto-h1 text-black">Deposit in the Silo</span>
              <span className="text-pinto-body text-pinto-gray-4">Deposits in the Silo receive Stalk and Seeds,</span>
              <span className="text-pinto-body text-pinto-gray-4">
                and yield additional Pinto when the supply expands.
              </span>
              {Number(avg) > 0 && <span className="text-pinto-h1 text-pinto mt-4">{`${avg}% average vAPY`}</span>}
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex flex-col text-center bg-white hover:bg-pinto-green-1 hover:border-pinto-green-2 w-full h-[33rem] rounded-full gap-4"
          >
            <a href={"/field"}>
              <span className="text-pinto-h1 text-black">Lend in the Field</span>
              <span className="text-pinto-body text-pinto-gray-4">
                Assets lent to Pinto are exchanged for Pods, the Pinto debt asset.
              </span>
              <span className="text-pinto-body text-pinto-gray-4">
                Pods are redeemable for one Pinto when they reach the front of the Pod Line.
              </span>
              {podRate.gt(0) && (
                <span className="text-pinto-h1 text-pinto mt-4">{`${podRate.toHuman()}% interest rate`}</span>
              )}
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

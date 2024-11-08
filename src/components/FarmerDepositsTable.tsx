import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { RightArrowIcon, UpArrowIcon } from "@/components/Icons";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useFarmerActions from "@/hooks/useFarmerActions";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BaseError, encodeFunctionData } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import Text from "./ui/Text";

interface FarmerDepositsTableProps {
  rewardsRef?: React.RefObject<HTMLTableRowElement>;
  hovering?: boolean;
}

export default function FarmerDepositsTable({ rewardsRef, hovering = false }: FarmerDepositsTableProps) {
  const account = useAccount();
  const chainId = useChainId();
  const navigate = useNavigate();
  const farmerSilo = useFarmerSilo();
  const priceData = usePriceData();
  const tokenData = useTokenData();
  const siloData = useSiloData();
  const mainToken = tokenData.mainToken;
  const farmerActions = useFarmerActions();
  const farmerDeposits = useFarmerDepositedBalances().data;

  const queryClient = useQueryClient();
  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  const claimableBeans = farmerActions.totalValue.rewards.earnedBeans;
  const claimableStalk = farmerActions.totalValue.rewards.stalk;
  const claimableSeeds = farmerActions.totalValue.rewards.seeds;

  const canClaim = farmerActions.claimRewards.enabled;

  const grownStalkPerToken = farmerSilo.grownStalkPerToken;

  useEffect(() => {
    if (isSuccess) {
      const allQueryKeys = [...farmerSilo.queryKeys];
      allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    }
  }, [isSuccess]);

  async function onClaimRewards() {
    if (!account.address) return;

    const plant = encodeFunctionData({
      abi: beanstalkAbi,
      functionName: "plant",
    });

    const tokensToMow = tokenData.whitelistedTokens.map((token) => token.address);
    const mow = encodeFunctionData({
      abi: beanstalkAbi,
      functionName: "mowMultiple",
      args: [account.address, tokensToMow],
    });

    const tx = () =>
      writeContractAsync({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [[plant, mow]],
      });

    toast.promise(tx, {
      loading: "Claiming rewards...",
      success: (data) => "Claim complete!",
      error: (error) => (error as BaseError).shortMessage || "Failed to claim rewards.",
    });
  }

  const renderClaimableRow = () => (
    <TableRow
      onClick={onClaimRewards}
      className="h-[4.5rem] bg-pinto-green-1 hover:bg-pinto-green-1 hover:cursor-pointer text-pinto-green-4/70"
      data-action-target="claimable-rewards"
      ref={rewardsRef}
    >
      <TableCell>
        <div className="flex flex-row items-center gap-1.5 ml-2">
          <div className="h-8 w-8 bg-pinto-green-4 rounded-full flex justify-center items-center text-white rotate-90">
            <RightArrowIcon color="currentColor" />
          </div>
          <Text variant="small" color="green4">
            Claimable
          </Text>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex flex-col items-end">
          <div className="inline-flex items-center gap-1">
            <IconImage src={mainToken.logoURI} size={4} />
            <Text variant="small" color="green4">
              {formatter.number(claimableBeans)} {mainToken.name}
            </Text>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex flex-col items-end">
          <div className="inline-flex items-center gap-1">
            <IconImage src={stalkIcon} size={4} />
            <Text variant="small" color="green4">
              {formatter.number(claimableStalk)}
            </Text>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col items-end text-right mr-2">
          <div className="inline-flex items-center gap-1">
            <IconImage src={seedIcon} size={4} />
            <Text variant="small" color="green4">
              {formatter.number(claimableSeeds)}
            </Text>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className={`relative action-container overflow-visible ${hovering && canClaim && "mb-[4.5rem]"}`}>
      <div className="border border-pinto-gray-2 rounded-[1rem] overflow-clip">
        <Table>
          <TableHeader>
            <TableRow className="bg-pinto-gray-1 hover:bg-pinto-gray-1 h-14">
              <TableHead className="text-black font-[400] text-[1rem] w-1/4 p-4">Deposited Asset</TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">Amount Deposited</TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4">
                <div className="flex flex-row items-center justify-end gap-2">
                  <IconImage src={stalkIcon} size={6} />
                  Stalk
                </div>
              </TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-1/4 p-4">
                <div className="flex flex-row items-center justify-end gap-2">
                  <IconImage src={seedIcon} size={6} />
                  Seeds
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!hovering && canClaim && renderClaimableRow()}
            {tokenData.whitelistedTokens.map((token, i) => {
              const userData = farmerDeposits.get(token);
              const grownStalk = grownStalkPerToken.get(token) || TokenValue.ZERO;

              const data = {
                rewards: farmerActions.tokenTotals.get(token)?.sources.rewards,
                update: farmerActions.tokenTotals.get(token)?.sources.update,
              };

              const gains = {
                beanGain: (data.rewards?.beanGain || TokenValue.ZERO).add(data.update?.beanGain || TokenValue.ZERO),
                bdvGain: (data.rewards?.bdvGain || TokenValue.ZERO).add(data.update?.bdvGain || TokenValue.ZERO),
                seedGain: (data.rewards?.seedGain || TokenValue.ZERO).add(data.update?.seedGain || TokenValue.ZERO),
                stalkGain: (data.rewards?.stalkGain || TokenValue.ZERO)
                  .add(data.update?.stalkGain || TokenValue.ZERO)
                  .add(grownStalk),
              };

              return (
                <TableRow
                  key={`${token.address}_${i}`}
                  className={`h-[4.5rem] bg-white hover:bg-pinto-green-1/50 hover:cursor-pointer .${token.symbol}-row`}
                  onClick={() => navigate(`/silo/${token.address}`)}
                  data-action-target={`token-row-${token.address}`}
                >
                  <TableCell className="text-black font-[400] text-[1rem] p-4 inline-flex items-center gap-1.5">
                    <img src={token.logoURI} className="h-8 w-8" alt={`${token.name} logo`} />
                    <div>{token.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-end">
                      {!hovering || gains.bdvGain.lt(0.01) ? (
                        <>
                          <div className="inline-flex items-center gap-1">
                            <IconImage src={token.logoURI} size={4} />
                            <div className="text-black font-[400] text-[1rem]">
                              {formatter.number(userData?.amount)} {token.name}
                            </div>
                          </div>
                          <div className="text-pinto-gray-4 font-[300] text-[1rem]">
                            {formatter.usd(userData?.depositBDV.mul(priceData.price))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="inline-flex items-center gap-1 text-pinto-green-4">
                            <UpArrowIcon color={"currentColor"} />
                            <IconImage src={token.logoURI} size={4} />
                            <div className="font-[400] text-[1rem]">
                              {formatter.number(userData?.amount.add(gains.beanGain))} {token.name}
                            </div>
                          </div>
                          <div className="text-pinto-gray-4 font-[300] text-[1rem]">
                            {formatter.usd(userData?.depositBDV.add(gains.bdvGain).mul(priceData.price))}
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-[400] text-[1rem] text-right">
                    {!hovering || gains.stalkGain.lt(0.01) ? (
                      <div className="flex flex-col items-end">
                        <div className="inline-flex items-center gap-1">
                          <IconImage src={stalkIcon} size={4} />
                          <div>{formatter.number(userData?.stalk.base.add(gains.stalkGain))}</div>
                        </div>
                        {gains.stalkGain.gt(0.01) && (
                          <div className="text-pinto-gray-4">
                            Claimable Grown Stalk:{" "}
                            <span className="text-pinto-green-4/70">+{formatter.number(gains.stalkGain)}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-end text-pinto-stalk-gold">
                        <div className="inline-flex items-center gap-1">
                          <UpArrowIcon color={"currentColor"} />
                          <IconImage src={stalkIcon} size={4} />
                          <div>{formatter.number(userData?.stalk.base.add(gains.stalkGain))}</div>
                        </div>
                        {data.update?.stalkFromBDVIncrease.gt(0.01) && (
                          <div>
                            Bonus Stalk for updating PDV:{" "}
                            <span>{formatter.number(data.update?.stalkFromBDVIncrease)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-black font-[400] text-[1rem] text-right p-4">
                    {!hovering || gains.seedGain.lt(0.01) ? (
                      <div className="flex flex-col items-end">
                        <div className="inline-flex items-center gap-1">
                          <IconImage src={seedIcon} size={4} />
                          <div>{formatter.number(userData?.seeds)}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end text-pinto-seed-silver">
                        <div className="inline-flex items-center gap-1">
                          <UpArrowIcon color={"currentColor"} />
                          <IconImage src={seedIcon} size={4} />
                          <div>{formatter.number(userData?.seeds.add(gains.seedGain))}</div>
                        </div>
                        {data.update?.seedsFromBDVIncrease.gt(0.01) && (
                          <div>
                            Bonus Seed for updating PDV:{" "}
                            <span>{formatter.number(data.update?.seedsFromBDVIncrease)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

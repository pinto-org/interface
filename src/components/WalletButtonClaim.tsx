import { TokenValue } from "@/classes/TokenValue";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { FarmToMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Address, BaseError, encodeFunctionData } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import DestinationBalanceSelect from "./DestinationBalanceSelect";
import { ForwardArrowIcon } from "./Icons";
import { Button } from "./ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/Card";
import { Separator } from "./ui/Separator";

export default function WalletButtonClaim({
  setShowClaim,
  showClaim,
}: { setShowClaim: React.Dispatch<React.SetStateAction<boolean>>; showClaim: boolean }) {
  const chainId = useChainId();
  const account = useAccount();

  const { queryKeys } = useFarmerBalances();
  const farmerSilo = useFarmerSilo();
  const siloQueryKeys = farmerSilo.queryKeys;
  const priceData = usePriceData();
  const { whitelistedTokens } = useTokenData();

  const queryClient = useQueryClient();
  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  const [balanceTo, setBalanceTo] = useState(FarmToMode.EXTERNAL);
  const totalFlood = farmerSilo.flood.farmerSops.reduce(
    (total, sopData) => total.add(sopData.wellsPlenty.plenty),
    TokenValue.ZERO,
  );

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      const allQueryKeys = [...queryKeys, ...siloQueryKeys];
      allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    }
  }, [isSuccess, queryKeys, siloQueryKeys]);

  async function onSubmit() {
    if (!chainId || !account.address || !balanceTo) return;

    const tokensToMow = whitelistedTokens.map((token: Token) => token.address);
    const mow = encodeFunctionData({
      abi: beanstalkAbi,
      functionName: "mowMultiple",
      args: [account.address, tokensToMow],
    });

    const claimFlood = encodeFunctionData({
      abi: beanstalkAbi,
      functionName: "claimAllPlenty",
      args: [Number(balanceTo)],
    });

    const tx = () =>
      writeContractAsync({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress] as Address,
        abi: beanstalkAbi,
        functionName: "farm",
        args: [[mow, claimFlood]],
      });

    toast.promise(tx, {
      loading: "Submitting transaction...",
      success: (data) => {
        return `Transaction complete!`;
      },
      error: (error) => {
        return (error as BaseError).shortMessage || `Transaction failed.`;
      },
    });
  }

  return (
    <Card
      className={`${!showClaim ? "h-16 hover:bg-pinto-gray-2" : "h-[calc(100vh-7.2rem)]"} flex flex-col overflow-clip -m-2 transition-all rounded-[0.75rem] `}
    >
      <CardHeader className={`flex flex-col gap-4 p-6 ${!showClaim ? "py-4" : ""}`}>
        <div className="flex flex-col gap-4">
          <div
            onClick={() => setShowClaim(!showClaim)}
            className="flex flex-row justify-between items-center hover:cursor-pointer transition-all"
          >
            <div className="text-black text-[1.25rem] font-[400]">Claim assets from Flood</div>
            <span className={`${showClaim ? "rotate-180" : "rotate-0"} transition-transform`}>
              <ForwardArrowIcon color={"currentColor"} width={24} height={24} />
            </span>
          </div>
          <div className="text-[1.25rem] text-pinto-gray-4 font-[340] text-left">
            Flood occurs when the price of Pinto gets excessively high and the Pod Rate is excessively low. In order to
            stabilize the Pinto price, new Pinto are minted and sold, and proceeds are distributed to Stalkholders.
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 flex-grow max-h-[55%] overflow-y-auto">
        <Separator className="w-full" />
        <div className="mt-6 flex-grow overflow-y-auto">
          <div className="text-[1.25rem] text-pinto-gray-4 font-[340] text-left">Your proceeds:</div>
          <div className="flex-grow h-full">
            {totalFlood.gt(0) ? (
              <div className="flex flex-col gap-6 mt-6">
                {farmerSilo.flood.farmerSops.map((sopData, index) => {
                  const amount = sopData.wellsPlenty.plenty;
                  if (amount.eq(0)) return;
                  const token = sopData.backingAsset;
                  const price = priceData.tokenPrices.get(token);
                  const value = amount.mul(price ? price.instant : 0);
                  return (
                    <div key={index} className="flex flex-row justify-between">
                      <div className="flex flex-row gap-4 items-center">
                        <img src={token.logoURI} alt={token.symbol} className={"w-12 h-12"} />
                        <span className="font-[400] text-pinto-gray-5 text-[1.25rem]">{token.symbol}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-[400] text-pinto-gray-5 text-[1.5rem]">{`${amount.toHuman()} ${token.symbol}`}</span>
                        <span className="font-[400] text-pinto-gray-4 text-[1rem]">{`$${Number(value.toHuman()).toFixed(2)}`}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center">No Flood assets to be claimed</div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 flex flex-col justify-end gap-4">
        <Separator className="w-full" />
        <div className="flex flex-row justify-between items-center w-full ">
          <div className="font-[340] text-[1.25rem] text-pinto-gray-4">Receive proceeds to:</div>
          <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} variant="small" />
        </div>
        <Button
          onClick={() => onSubmit()}
          disabled={totalFlood.eq(0)}
          className={"w-full h-[3.625rem] grow-0 rounded-[0.75rem] text-[1.5rem]"}
        >
          {totalFlood.eq(0) ? "No assets to claim" : "Claim proceeds"}
        </Button>
      </CardFooter>
    </Card>
  );
}

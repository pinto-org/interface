import { TokenValue } from "@/classes/TokenValue";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { FarmToMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount, useChainId } from "wagmi";
import DestinationBalanceSelect from "./DestinationBalanceSelect";
import { ForwardArrowIcon } from "./Icons";
import { Button } from "./ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/Card";
import { Separator } from "./ui/Separator";
import Text from "./ui/Text";

export default function WalletButtonClaim({
  setShowClaim,
  showClaim,
}: { setShowClaim: React.Dispatch<React.SetStateAction<boolean>>; showClaim: boolean }) {
  const chainId = useChainId();
  const account = useAccount();
  const diamond = useProtocolAddress();

  const { queryKeys } = useFarmerBalances();
  const farmerSilo = useFarmerSilo();
  const siloQueryKeys = farmerSilo.queryKeys;
  const priceData = usePriceData();
  const { whitelistedTokens } = useTokenData();

  const queryClient = useQueryClient();
  const { writeWithEstimateGas, setSubmitting } = useTransaction({
    successCallback: () => {
      const allQueryKeys = [...queryKeys, ...siloQueryKeys];
      allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    },
    successMessage: "Claim success",
    errorMessage: "Claim failed",
  });

  const [balanceTo, setBalanceTo] = useState(FarmToMode.EXTERNAL);
  const totalFlood = farmerSilo.flood.farmerSops.reduce(
    (total, sopData) => total.add(sopData.wellsPlenty.plenty),
    TokenValue.ZERO,
  );

  async function onSubmit() {
    setSubmitting(true);
    toast.loading("Claiming...");
    try {
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

      const encoded = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "farm",
        args: [[mow, claimFlood]],
      });

      return writeWithEstimateGas({
        address: diamond,
        abi: beanstalkAbi,
        functionName: "farm",
        args: [[encoded]],
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Claim failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
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
            <Text variant="body" color="primary">
              Claim assets from Flood
            </Text>
            <span className={`${showClaim ? "rotate-180" : "rotate-0"} transition-transform`}>
              <ForwardArrowIcon color={"currentColor"} width={24} height={24} />
            </span>
          </div>
          <Text variant="body" weight="thin" color="light" className="leading-2">
            Flood occurs when the price of Pinto gets excessively high and the Pod Rate is excessively low. In order to
            stabilize the Pinto price, new Pinto are minted and sold, and proceeds are distributed to Stalkholders.
          </Text>
        </div>
      </CardHeader>
      <CardContent className="px-6 flex-grow h-full overflow-y-auto">
        <Separator className="w-full" />
        <div className="mt-6 flex-grow overflow-y-auto">
          <Text variant="body" weight="light" color="primary">
            Your proceeds:
          </Text>
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
                    <div key={`claim_flood_${index}_${token.address}`} className="flex flex-row justify-between">
                      <div className="flex flex-row gap-4 items-center">
                        <img src={token.logoURI} alt={token.symbol} className={"w-12 h-12"} />
                        <span className="font-[400] text-pinto-gray-5 text-[1.25rem]">{token.symbol}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-[400] text-pinto-gray-5 text-[1.5rem]">{`${formatter.token(amount, token)} ${token.symbol}`}</span>
                        <span className="font-[400] text-pinto-gray-4 text-[1rem]">{formatter.usd(value)}</span>
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
      <CardFooter className="px-6 flex flex-col justify-end gap-4 h-auto">
        <div className="h-full" />
        <Separator className="w-full" />
        <div className="flex flex-row justify-between items-center w-full ">
          <div className="font-[340] text-[1.25rem] text-pinto-gray-4">Receive proceeds to:</div>
          <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} variant="small" />
        </div>
        <Button
          onClick={() => onSubmit()}
          disabled={totalFlood.eq(0)}
          className={"w-full h-[3.625rem] grow-0 rounded-full text-[1.5rem]"}
        >
          {totalFlood.eq(0) ? "No assets to claim" : "Claim proceeds"}
        </Button>
      </CardFooter>
    </Card>
  );
}

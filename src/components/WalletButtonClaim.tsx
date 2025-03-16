import { TokenValue } from "@/classes/TokenValue";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { navbarPanelAtom } from "@/state/app/navBar.atoms";
import { useDestinationBalance } from "@/state/useDestinationBalance";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { FarmToMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount, useChainId } from "wagmi";
import DestinationBalanceSelect from "./DestinationBalanceSelect";
import { ForwardArrowIcon } from "./Icons";
import { Button } from "./ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/Card";
import { Separator } from "./ui/Separator";

export default function WalletButtonClaim() {
  const chainId = useChainId();
  const account = useAccount();
  const diamond = useProtocolAddress();

  const [panelState, setPanelState] = useAtom(navbarPanelAtom);

  const toggleClaimView = () => {
    setPanelState({
      ...panelState,
      walletPanel: {
        ...panelState.walletPanel,
        showClaim: !panelState.walletPanel.showClaim,
      },
    });
  };

  const { queryKeys } = useFarmerBalances();
  const farmerSilo = useFarmerSilo();
  const siloQueryKeys = farmerSilo.queryKeys;
  const priceData = usePriceData();
  const { whitelistedTokens } = useTokenData();
  const [balanceTo, setBalanceTo] = useState<FarmToMode>(FarmToMode.INTERNAL);

  const queryClient = useQueryClient();
  const { writeWithEstimateGas, setSubmitting } = useTransaction({
    successCallback: () => {
      const allQueryKeys = [...queryKeys, ...siloQueryKeys];
      allQueryKeys.forEach((query) =>
        queryClient.invalidateQueries({
          queryKey: query,
        }),
      );
    },
    successMessage: "Claim success",
    errorMessage: "Claim failed",
  });

  const totalFlood = farmerSilo.flood.farmerSops.reduce((total, sopData) => {
    const token = sopData.backingAsset;
    const price = priceData.tokenPrices.get(token);
    const value = sopData.wellsPlenty.plenty.mul(price ? price.instant : 0);
    return total.add(value);
  }, TokenValue.ZERO);

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

      return writeWithEstimateGas({
        address: diamond,
        abi: beanstalkAbi,
        functionName: "farm",
        args: [[mow, claimFlood]],
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
      className={`${!panelState.walletPanel.showClaim ? "h-14 hover:bg-pinto-gray-2" : "h-[calc(100dvh-6.5rem)] sm:h-[calc(100dvh-10.5rem)] lg:h-[calc(100dvh-9.125rem)] 2xl:h-[calc(100dvh-12.75rem)]"} flex flex-col w-[102%] sm:w-[102%] 2xl:w-full overflow-clip -mb-2 sm:mb-0 lg:-mb-2 2xl:mb-0 transition-all rounded-[0.75rem] `}
    >
      <CardHeader className={`flex flex-col gap-4 p-4 sm:p-4 ${!panelState.walletPanel.showClaim ? "py-3" : ""}`}>
        <div className="flex flex-col gap-0">
          <div
            onClick={toggleClaimView}
            className="flex flex-row justify-between items-center hover:cursor-pointer transition-all -mt-4 -mx-4 p-4 "
          >
            <div className="pinto-sm sm:pinto-body">Claim {formatter.usd(totalFlood)} from Flood</div>
            <span className={`${panelState.walletPanel.showClaim ? "rotate-180" : "rotate-0"} transition-transform`}>
              <ForwardArrowIcon color={"currentColor"} width={"1.5rem"} height={"1.5rem"} />
            </span>
          </div>
          <div className="pinto-sm sm:pinto-body font-thin sm:font-thin text-pinto-light sm:text-pinto-light leading-2">
            Flood occurs when the price of Pinto gets excessively high and the Pod Rate is excessively low. In order to
            stabilize the Pinto price, new Pinto are minted and sold, and proceeds are distributed to Stalkholders based
            on Stalk holdings 1 full Season before the Flood started.
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 flex-grow h-full overflow-y-auto">
        <Separator className="w-full" />
        <div className="mt-4 sm:mt-6 flex-grow overflow-y-auto">
          <div className="pinto-sm sm:pinto-body font-light sm:font-light">Your proceeds:</div>
          <div className="flex-grow h-full">
            {totalFlood.gt(0) ? (
              <div className="flex flex-col gap-4 mt-4 sm:gap-6 sm:mt-6">
                {farmerSilo.flood.farmerSops.map((sopData, index) => {
                  const amount = sopData.wellsPlenty.plenty;
                  if (amount.eq(0)) return;
                  const token = sopData.backingAsset;
                  const price = priceData.tokenPrices.get(token);
                  const value = amount.mul(price ? price.instant : 0);
                  return (
                    <div key={`claim_flood_${index}_${token.address}`} className="flex flex-row justify-between">
                      <div className="flex flex-row gap-4 items-center">
                        <img src={token.logoURI} alt={token.symbol} className={"h-10 w-10 sm:w-12 sm:h-12"} />
                        <span className="font-[400] text-pinto-gray-5 text-[1rem] sm:text-[1.25rem]">
                          {token.symbol}
                        </span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-[400] text-pinto-gray-5 text-[1.25rem] sm:text-[1.5rem]">{`${formatter.token(amount, token)} ${token.symbol}`}</span>
                        <span className="font-[400] text-pinto-gray-4 text-[0.875rem] sm:text-[1rem]">
                          {formatter.usd(value)}
                        </span>
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
      <CardFooter className="px-4 sm:px-6 flex flex-col justify-end gap-4 h-auto">
        <div className="h-full" />
        <Separator className="w-full" />
        <div className="flex flex-col sm:flex-row justify-between items-center w-full ">
          <div className="font-[340] text-[1rem] sm:text-[1.25rem] text-pinto-gray-4">Receive proceeds to:</div>
          <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} variant="small" />
        </div>
        <Button
          onClick={() => onSubmit()}
          disabled={totalFlood.eq(0)}
          variant={"gradient"}
          className={"w-full h-[3.125rem] sm:h-[3.625rem] grow-0 rounded-full text-[1.25rem] sm:text-[1.5rem]"}
        >
          {totalFlood.eq(0) ? "No assets to claim" : `Claim ${formatter.usd(totalFlood)} from Flood`}
        </Button>
      </CardFooter>
    </Card>
  );
}

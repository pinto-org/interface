import { TokenValue } from "@/classes/TokenValue";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import Text from "@/components/ui/Text";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useInvalidateField } from "@/state/useFieldData";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BaseError } from "viem";
import { useAccount, useChainId } from "wagmi";

type HarvestProps = {
  isMorning: boolean;
};

function Harvest({ isMorning }: HarvestProps) {
  const chainId = useChainId();
  const account = useAccount();

  const tokenData = useTokenData();
  const mainToken = tokenData.mainToken;

  const priceData = usePriceData();

  const queryClient = useQueryClient();
  const invalidateField = useInvalidateField();

  const { plots: fieldPlots, queryKey } = useFarmerField();
  const balances = useFarmerBalances();
  const [balanceTo, setBalanceTo] = useState(FarmToMode.EXTERNAL);

  const { plots, harvestableAmount } = useMemo(() => {
    let harvestable = TokenValue.ZERO;
    const _plots: string[] = [];
    fieldPlots.forEach((plot) => {
      if (harvestable.gt(0) && plot.id) {
        _plots.push(plot.id);
      }
      harvestable = harvestable.add(plot.harvestablePods);
    });
    return { plots: _plots, harvestableAmount: harvestable };
  }, [fieldPlots]);

  const { writeContractAsync, isConfirming } = useTransaction({
    successCallback: () => {
      queryClient.invalidateQueries({ queryKey });
      balances.queryKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      invalidateField("podLine");
    },
  });

  function onSubmit() {
    if (!!account.address || plots.length === 0 || harvestableAmount.eq(0) || !balanceTo) return;

    return writeContractAsync({
      address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
      abi: beanstalkAbi,
      functionName: "harvest",
      args: [
        0n, // field id
        plots.map((plot) => BigInt(plot)), //array of plot id(s)
        Number(balanceTo), // FarmToMode
      ],
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {harvestableAmount.gt(0) ? (
        <>
          <div className="flex flex-col justify-between">
            <div className="text-pinto-gray-4 text-[1.25rem]">You receive</div>
            <div className="inline-flex gap-1 items-center text-black text-[2rem]">
              {harvestableAmount.toHuman("short")}
              <IconImage size={6} src={mainToken.logoURI} />
              <span className="text-[1.25rem]">{mainToken.name}</span>
            </div>
            <div className="text-[1rem] text-pinto-gray-4">
              ${harvestableAmount.mul(priceData.price).toHuman("short")}
            </div>
          </div>
          <div className="flex flex-col gap-4 text-">
            <Label>I want to Receive my Pinto to my:</Label>
            <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} />
          </div>
        </>
      ) : (
        <Text variant="body-sm" color="light">
          Your Pods become Harvestable when they reach a Place in Line of 0.
        </Text>
      )}
      <SmartSubmitButton
        variant={isMorning ? "morning" : undefined}
        type="button"
        token={undefined}
        disabled={harvestableAmount.eq(0) || isConfirming}
        submitFunction={onSubmit}
        submitButtonText="Harvest"
      />
    </div>
  );
}

export default Harvest;

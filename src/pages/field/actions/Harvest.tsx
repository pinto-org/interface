import { TokenValue } from "@/classes/TokenValue";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import Text from "@/components/ui/Text";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useInvalidateField } from "@/state/useFieldData";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

type HarvestProps = {
  isMorning: boolean;
};

function Harvest({ isMorning }: HarvestProps) {
  const account = useAccount();

  const tokenData = useTokenData();
  const mainToken = tokenData.mainToken;
  const diamond = useProtocolAddress();

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

  const { writeWithEstimateGas, isConfirming } = useTransaction({
    successCallback: () => {
      queryClient.invalidateQueries({ queryKey });
      balances.queryKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      invalidateField("podLine");
    },
  });

  const onSubmit = useCallback(async () => {
    try {
      if (!account.address) throw new Error("Signer required");
      if (!plots.length) throw new Error("No plots to harvest");
      if (harvestableAmount.eq(0)) throw new Error("No harvestable pods");
      if (!balanceTo) throw new Error("Destination required");

      toast.loading(`Harvesting ${formatter.token(harvestableAmount, PODS)} PODS...`);

      return writeWithEstimateGas({
        address: diamond,
        abi: beanstalkAbi,
        functionName: "harvest",
        args: [
          0n, // field id
          plots.map((plot) => BigInt(plot)), //array of plot id(s)
          Number(balanceTo), // FarmToMode
        ],
      });
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error(e instanceof Error ? e.message : "Transaction failed.");
      throw e;
    }
  }, [account.address, plots, harvestableAmount, balanceTo, writeWithEstimateGas, diamond]);

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

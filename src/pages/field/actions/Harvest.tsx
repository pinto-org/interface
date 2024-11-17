import { TokenValue } from "@/classes/TokenValue";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import IconImage from "@/components/ui/IconImage";
import Text from "@/components/ui/Text";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useHarvestableIndex, useInvalidateField } from "@/state/useFieldData";
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
  const harvestableIndex = useHarvestableIndex();

  const priceData = usePriceData();

  const queryClient = useQueryClient();
  const invalidateField = useInvalidateField();

  const { plots: fieldPlots, queryKeys } = useFarmerField();
  const balances = useFarmerBalances();
  const [balanceTo, setBalanceTo] = useState(FarmToMode.EXTERNAL);

  const { plots, harvestableAmount } = useMemo(() => {
    let harvestable = TokenValue.ZERO;
    const _plots: string[] = [];
    fieldPlots.forEach((plot) => {
      if (plot.harvestablePods.gt(0) && plot.id) {
        _plots.push(plot.index.blockchainString);
      }
      harvestable = harvestable.add(plot.harvestablePods);
    });
    return { plots: _plots, harvestableAmount: harvestable };
  }, [fieldPlots]);

  const { writeWithEstimateGas, isConfirming, submitting, setSubmitting } = useTransaction({
    successCallback: () => {
      queryKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      balances.queryKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      invalidateField("podLine");
    },
  });

  const onSubmit = useCallback(async () => {
    try {
      setSubmitting(true);
      toast.loading("Harvesting...");
      if (!account.address) throw new Error("Signer required");
      if (!plots.length) throw new Error("No plots to harvest");
      if (harvestableAmount.lte(0)) throw new Error("No harvestable pods");
      if (!balanceTo) throw new Error("Destination required");

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
      setSubmitting(false);
      console.error(e);
      toast.dismiss();
      toast.error(e instanceof Error ? e.message : "Transaction failed.");
      throw e;
    }
  }, [account.address, plots, harvestableAmount, balanceTo, writeWithEstimateGas, diamond, setSubmitting]);

  const nextHarvestablePlot = fieldPlots?.[0];

  const nextHarvestablePlaceInLine = nextHarvestablePlot?.index.sub(harvestableIndex);

  return (
    <div className="flex flex-col gap-6 pt-2">
      {harvestableAmount.gt(0) ? (
        <>
          <div className="flex flex-col">
            <div className="flex flex-col gap-1">
              <Text variant="body-light" color="light">
                You receive
              </Text>
              <div className="flex flex-row gap-2 items-center">
                <Text variant="h3" className="inline-flex gap-1 items-center">
                  {formatter.token(harvestableAmount, mainToken)}
                </Text>
                <Text variant="h4" weight="light" className="inline-flex gap-1 items-center mt-1">
                  <IconImage size={6} nudge={2} src={mainToken.logoURI} />
                  {mainToken.name}
                </Text>
              </div>
              <Text color="light">{formatter.usd(harvestableAmount.mul(priceData.price))}</Text>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Text variant="body-light" color="light">
              I want to Receive my Pinto to my:
            </Text>
            <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} />
          </div>
        </>
      ) : (
        <Text variant="body-light" color="light" align="center py-6">
          Your Pods become Harvestable when they reach a Place in Line of 0.{" "}
          {nextHarvestablePlaceInLine?.gt(0)
            ? `Your next Plot is at ${formatter.noDec(nextHarvestablePlaceInLine)} in Line.`
            : ""}
        </Text>
      )}
      <SmartSubmitButton
        variant={isMorning ? "morning" : undefined}
        type="button"
        token={undefined}
        disabled={harvestableAmount.eq(0) || isConfirming || submitting}
        submitFunction={onSubmit}
        submitButtonText="Harvest"
      />
    </div>
  );
}

export default Harvest;

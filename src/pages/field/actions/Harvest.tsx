import { TokenValue } from "@/classes/TokenValue";
import MobileActionBar from "@/components/MobileActionBar";
import SiloOutputDisplay from "@/components/SiloOutputDisplay";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import IconImage from "@/components/ui/IconImage";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { useHarvestAndDeposit } from "@/hooks/useHarvestAndDeposit";
import { useFarmerField } from "@/state/useFarmerField";
import { useHarvestableIndex } from "@/state/useFieldData";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { trackSimpleEvent } from "@/utils/analytics";
import { formatter } from "@/utils/format";
import { useCallback } from "react";

type HarvestProps = {
  isMorning: boolean;
};

function Harvest({ isMorning }: HarvestProps) {
  const tokenData = useTokenData();
  const mainToken = tokenData.mainToken;
  const harvestableIndex = useHarvestableIndex();
  const priceData = usePriceData();
  const { plots: fieldPlots } = useFarmerField();

  const { submitHarvestAndDeposit, isSubmitting, harvestableAmount, hasHarvestablePods, stalkGain, seedGain } =
    useHarvestAndDeposit();

  const nextHarvestablePlot = fieldPlots?.[0];

  const nextHarvestablePlaceInLine = nextHarvestablePlot?.index.sub(harvestableIndex);

  // Track harvest submission
  const handleHarvestSubmit = useCallback(async () => {
    trackSimpleEvent(ANALYTICS_EVENTS.FIELD.HARVEST_SUBMIT);
    return submitHarvestAndDeposit();
  }, [isMorning, hasHarvestablePods, submitHarvestAndDeposit]);

  return (
    <div className="flex flex-col gap-6 pt-2">
      {harvestableAmount.gt(0) ? (
        <>
          <div className="flex flex-col">
            <div className="flex flex-col gap-1">
              <div className="pinto-body-light text-pinto-light">You receive</div>
              <div className="flex flex-row gap-2 items-center">
                <div className="pinto-h3 inline-flex gap-1 items-center">
                  {formatter.token(harvestableAmount, mainToken)}
                </div>
                <div className="pinto-h4 font-light inline-flex gap-1 items-center mt-1">
                  <IconImage size={6} nudge={2} src={mainToken.logoURI} />
                  {mainToken.name}
                </div>
              </div>
              <div className="pinto-sm text-pinto-light">{formatter.usd(harvestableAmount.mul(priceData.price))}</div>
            </div>
          </div>
          <SiloOutputDisplay
            title="You will also receive"
            amount={harvestableAmount}
            token={mainToken}
            stalk={stalkGain}
            seeds={seedGain}
          />
          <div className="flex flex-col gap-4">
            <div className="pinto-body-light text-pinto-light">
              Harvest your Pods for freshly minted Pinto in the Silo.
            </div>
          </div>
        </>
      ) : (
        <div className="pinto-body-light text-pinto-light text-center py-6">
          Your Pods become Harvestable when they reach a Place in Line of 0.{" "}
          {nextHarvestablePlaceInLine?.gt(0)
            ? `Your next Plot is at ${formatter.noDec(nextHarvestablePlaceInLine)} in Line.`
            : ""}
        </div>
      )}
      <SmartSubmitButton
        variant={isMorning ? "morning" : "gradient"}
        type="button"
        token={undefined}
        disabled={harvestableAmount.eq(0) || isSubmitting}
        submitFunction={handleHarvestSubmit}
        submitButtonText="Harvest"
        className="hidden sm:flex"
      />
      <MobileActionBar>
        <SmartSubmitButton
          variant={isMorning ? "morning" : "gradient"}
          type="button"
          token={undefined}
          disabled={harvestableAmount.eq(0) || isSubmitting}
          submitFunction={handleHarvestSubmit}
          submitButtonText="Harvest"
          className="h-full"
        />
      </MobileActionBar>
    </div>
  );
}

export default Harvest;

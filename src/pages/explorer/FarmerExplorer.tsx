import SeasonalChart, { tabToSeasonalLookback, TimeTab } from "@/components/charts/SeasonalChart";
import { usePrivateMode } from "@/hooks/useAppSettings";
import { useFarmerSeasonalPlantedPinto, useFarmerSeasonalClaimedGrownStalkBalance, useFarmerSeasonalStalkOwnership } from "@/state/seasonal/seasonalDataHooks";
import { useSunData } from "@/state/useSunData";
import { chartFormatters as f } from "@/utils/format";
import { useState } from "react";

const FarmerExplorer = () => {
  const [plantedTab, setPlantedTab] = useState(TimeTab.AllTime);
  const [grownStalkTab, setGrownStalkTab] = useState(TimeTab.AllTime);
  const [stalkOwnershipTab, setStalkOwnershipTab] = useState(TimeTab.AllTime);
  const season = useSunData().current;

  const plantedData = useFarmerSeasonalPlantedPinto(Math.max(0, season - tabToSeasonalLookback(plantedTab)), season);
  const grownStalkData = useFarmerSeasonalClaimedGrownStalkBalance(Math.max(0, season - tabToSeasonalLookback(grownStalkTab)), season);
  const stalkOwnershipData = useFarmerSeasonalStalkOwnership(Math.max(0, season - tabToSeasonalLookback(stalkOwnershipTab)), season);
  const isPrivateMode = usePrivateMode();

  if (isPrivateMode) {
    return (
      <div className="text-center text-pinto-green flex flex-col items-center justify-center h-full text-2xl">
        <span>Please turn off Private mode to view the charts here</span>
        <span>this can be done by clicking the value in the wallet</span>
      </div>
    )
  }
  return (
    <>
      <SeasonalChart
        title="Planted Pinto"
        size="large"
        fillArea
        activeTab={plantedTab}
        onChangeTab={setPlantedTab}
        useSeasonalResult={plantedData}
        valueFormatter={f.number0dFormatter}
        tickValueFormatter={f.largeNumberFormatter}
      />
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Claimed Grown Stalk Balance"
            size="small"
            activeTab={grownStalkTab}
            onChangeTab={setGrownStalkTab}
            useSeasonalResult={grownStalkData}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumberFormatter}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Stalk Ownership %"
            size="small"
            activeTab={stalkOwnershipTab}
            onChangeTab={setStalkOwnershipTab}
            useSeasonalResult={stalkOwnershipData}
            valueFormatter={f.percent3dFormatter}
            tickValueFormatter={f.percent0dFormatter}
          />
        </div>
      </div>
    </>
  );
};
export default FarmerExplorer;

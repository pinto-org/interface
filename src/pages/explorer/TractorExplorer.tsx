import SeasonalChart, { tabToSeasonalLookback } from "@/components/charts/SeasonalChart";
import { TimeTab } from "@/components/charts/TimeTabs";
import { useSharedTimeTab } from "@/hooks/useSharedTimeTab";
import {
  useSeasonalTractorCumulativeTips,
  useSeasonalTractorExecutionsCount,
  useSeasonalTractorFundedAmount,
  useSeasonalTractorMaxActiveTip,
  useSeasonalTractorMaxSow,
  useSeasonalTractorPodsIssued,
  useSeasonalTractorSownPinto,
  useSeasonalTractorUniquePublishers,
} from "@/state/seasonal/seasonalDataHooks";
import { useSunData } from "@/state/useSunData";
import { chartFormatters as f } from "@/utils/format";

const TractorExplorer = () => {
  const [sownTab, setSownTab] = useSharedTimeTab("tractorSown");
  const [podsTab, setPodsTab] = useSharedTimeTab("tractorPods");
  const [fundedTab, setFundedTab] = useSharedTimeTab("tractorFunded");
  const [maxSowTab, setMaxSowTab] = useSharedTimeTab("tractorMaxSow");
  const [tipsTab, setTipsTab] = useSharedTimeTab("tractorTips");
  const [maxTipTab, setMaxTipTab] = useSharedTimeTab("tractorMaxTip");
  const [executionsTab, setExecutionsTab] = useSharedTimeTab("tractorExecutions");
  const [publishersTab, setPublishersTab] = useSharedTimeTab("tractorPublishers");

  const season = useSunData().current;

  const pintoSownData = useSeasonalTractorSownPinto(Math.max(0, season - tabToSeasonalLookback(sownTab)), season);
  const podsIssuedData = useSeasonalTractorPodsIssued(Math.max(0, season - tabToSeasonalLookback(podsTab)), season);
  const fundedAmountData = useSeasonalTractorFundedAmount(
    Math.max(0, season - tabToSeasonalLookback(fundedTab)),
    season,
  );
  const maxSowData = useSeasonalTractorMaxSow(Math.max(0, season - tabToSeasonalLookback(maxSowTab)), season);
  const cumulativeTipsData = useSeasonalTractorCumulativeTips(
    Math.max(0, season - tabToSeasonalLookback(tipsTab)),
    season,
  );
  const maxActiveTipData = useSeasonalTractorMaxActiveTip(
    Math.max(0, season - tabToSeasonalLookback(maxTipTab)),
    season,
  );
  const executionsCountData = useSeasonalTractorExecutionsCount(
    Math.max(0, season - tabToSeasonalLookback(executionsTab)),
    season,
  );
  const uniquePublishersData = useSeasonalTractorUniquePublishers(
    Math.max(0, season - tabToSeasonalLookback(publishersTab)),
    season,
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Sown Pinto"
            tooltip="Total Pinto Sown using Tractor."
            size="small"
            fillArea
            activeTab={sownTab}
            onChangeTab={setSownTab}
            useSeasonalResult={pintoSownData}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumber1dFormatter}
            analyticsContext={{
              chart_id: "tractorSown",
              chart_title: "Sown Pinto",
              explorer_tab: "tractor",
            }}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Pods Minted"
            tooltip="Total Pods Minted using Tractor."
            size="small"
            fillArea
            activeTab={podsTab}
            onChangeTab={setPodsTab}
            useSeasonalResult={podsIssuedData}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumber1dFormatter}
            analyticsContext={{
              chart_id: "tractorPods",
              chart_title: "Pods Minted",
              explorer_tab: "tractor",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Tractor Sowing Queue"
            tooltip="The amount of Pinto waiting to be sown via Tractor."
            size="small"
            activeTab={fundedTab}
            onChangeTab={setFundedTab}
            useSeasonalResult={fundedAmountData}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumber1dFormatter}
            analyticsContext={{
              chart_id: "tractorFunded",
              chart_title: "Tractor Sowing Queue",
              explorer_tab: "tractor",
            }}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Queued Maximum Sow"
            tooltip="The maximum Pinto sown each season through Tractor."
            size="small"
            activeTab={maxSowTab}
            onChangeTab={setMaxSowTab}
            useSeasonalResult={maxSowData}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumber1dFormatter}
            analyticsContext={{
              chart_id: "tractorMaxSow",
              chart_title: "Queued Maximum Sow",
              explorer_tab: "tractor",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Maximum Offered Tip"
            tooltip="Maximum tip offered to Tractor operators."
            size="small"
            activeTab={maxTipTab}
            onChangeTab={setMaxTipTab}
            useSeasonalResult={maxActiveTipData}
            valueFormatter={f.number2dFormatter}
            tickValueFormatter={f.number2dFormatter}
            analyticsContext={{
              chart_id: "tractorMaxTip",
              chart_title: "Maximum Offered Tip",
              explorer_tab: "tractor",
            }}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Cumulative Operator Tipped Pinto"
            tooltip="Cumulative Pinto tips earned by Tractor operators."
            size="small"
            fillArea
            activeTab={tipsTab}
            onChangeTab={setTipsTab}
            useSeasonalResult={cumulativeTipsData}
            valueFormatter={f.number2dFormatter}
            tickValueFormatter={f.number2dFormatter}
            analyticsContext={{
              chart_id: "tractorTips",
              chart_title: "Cumulative Operator Tipped Pinto",
              explorer_tab: "tractor",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:space-x-8">
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Tractor Executions"
            tooltip="Total amount of Tractor executions."
            size="small"
            fillArea
            activeTab={executionsTab}
            onChangeTab={setExecutionsTab}
            useSeasonalResult={executionsCountData}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumber1dFormatter}
            analyticsContext={{
              chart_id: "tractorExecutions",
              chart_title: "Tractor Executions",
              explorer_tab: "tractor",
            }}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <SeasonalChart
            title="Unique Publishers"
            tooltip="Number of unique Tractor blueprint publishers."
            size="small"
            fillArea
            activeTab={publishersTab}
            onChangeTab={setPublishersTab}
            useSeasonalResult={uniquePublishersData}
            valueFormatter={f.number0dFormatter}
            tickValueFormatter={f.largeNumber1dFormatter}
            analyticsContext={{
              chart_id: "tractorPublishers",
              chart_title: "Unique Publishers",
              explorer_tab: "tractor",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TractorExplorer;

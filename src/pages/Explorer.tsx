import TimeTabsSelector from "@/components/charts/TimeTabs";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import useRouterTabs, { UseRouterTabsOptions } from "@/hooks/useRouterTabs";
import { useSharedTimeTab } from "@/hooks/useSharedTimeTab";
import { withTracking } from "@/utils/analytics";
import { useCallback } from "react";
import AllExplorer from "./explorer/AllExplorer";
import FarmerExplorer from "./explorer/FarmerExplorer";
import FieldExplorer from "./explorer/FieldExplorer";
import PintoExplorer from "./explorer/PintoExplorer";
import SeasonsExplorer from "./explorer/SeasonsExplorer";
import SiloExplorer from "./explorer/SiloExplorer";
import TractorExplorer from "./explorer/TractorExplorer";

const TABS = [
  {
    urlSlug: "pinto",
    tabName: "Pinto",
  },
  {
    urlSlug: "silo",
    tabName: "Silo",
  },
  {
    urlSlug: "field",
    tabName: "Field",
  },
  {
    urlSlug: "seasons",
    tabName: "Seasons",
    description:
      "Seasons are how Pinto keeps time. Each Season is about 1 hour. Pinto adjusts the supply and various incentives every Season to facilitate price stability.",
  },
  {
    urlSlug: "tractor",
    tabName: "Tractor",
  },
  {
    urlSlug: "farmer",
    tabName: "My Silo",
  },
  {
    urlSlug: "all",
    tabName: "All",
  },
];

const routerSlugs = TABS.map((t) => t.urlSlug);
const routerTabsOptions: UseRouterTabsOptions = {
  type: "path",
  key: "tab",
  pathname: "/explorer/:tab",
};
const Explorer = () => {
  const [tab, handleChangeTab] = useRouterTabs(routerSlugs, routerTabsOptions);
  const [globalTimeTab, setGlobalTimeTab] = useSharedTimeTab();

  const selectedIdx = TABS.findIndex((t) => t.urlSlug === tab);

  const handleMainTabClickFactory = useCallback(
    (selection: string) => () => {
      const previousTab = TABS[selectedIdx]?.urlSlug;
      const newTab = selection;
      const tabDescription = TABS.find((t) => t.urlSlug === selection)?.description || null;

      // Track the tab change and then execute the original handler
      withTracking(ANALYTICS_EVENTS.EXPLORER.MAIN_TAB_CLICK, () => handleChangeTab(selection), {
        previous_tab: previousTab,
        new_tab: newTab,
        tab_description: tabDescription,
      })();
    },
    [handleChangeTab, selectedIdx],
  );
  const description = TABS[selectedIdx].description;
  const removeBottomPadding = selectedIdx === 3; //Remove on seasons table for the pagination to fit nicely on the bottm

  return (
    <PageContainer variant="xlAltExplorer" removeBottomPadding={removeBottomPadding}>
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col w-full gap-4 sm:gap-8">
          <div className="flex flex-col gap-2 sm:ml-4">
            <div className="flex justify-between items-center">
              <div className="pinto-h2 sm:pinto-h1 ml-[-3px]">Data</div>
              <div className="scale-110 sm:mr-4">
                <TimeTabsSelector
                  tab={globalTimeTab}
                  setTab={setGlobalTimeTab}
                  context={{
                    component: "explorer_global",
                    explorer_tab: tab,
                    affects_all_charts: true,
                  }}
                />
              </div>
            </div>
            <div className="flex gap-6 sm:gap-10 mt-4 sm:mt-8 overflow-x-auto scrollbar-none  ml-[-1px]">
              {TABS.map(({ tabName, urlSlug }, idx) => (
                <div
                  key={tabName}
                  data-state={selectedIdx === idx ? "active" : "inactive"}
                  onClick={handleMainTabClickFactory(urlSlug)}
                  className={`pinto-h4 sm:pinto-h3 shrink-0 cursor-pointer ${selectedIdx === idx ? "text-pinto-primary sm:text-pinto-primary" : "text-pinto-light sm:text-pinto-light"} data-[state=inactive]:hover:text-pinto-green-3`}
                >
                  {tabName}
                </div>
              ))}
            </div>
          </div>
          {description && (
            <div className="hidden sm:grid px-4 grid-column-0">
              <span>Seasons</span>
              <span className="text-pinto-gray-4">{description}</span>
            </div>
          )}
          <Separator />
          {selectedIdx === 0 && <PintoExplorer />}
          {selectedIdx === 1 && <SiloExplorer />}
          {selectedIdx === 2 && <FieldExplorer />}
          {selectedIdx === 3 && <SeasonsExplorer />}
          {selectedIdx === 4 && <TractorExplorer />}
          {selectedIdx === 5 && <FarmerExplorer />}
          {selectedIdx === 6 && <AllExplorer />}
        </div>
      </div>
    </PageContainer>
  );
};
export default Explorer;

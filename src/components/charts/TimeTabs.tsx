import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { withTracking } from "@/utils/analytics";
import { useCallback } from "react";

export enum TimeTab {
  Week = 0,
  Month = 1,
  AllTime = 2,
}

export interface TimeTabSelector {
  tab: TimeTab;
  setTab: ((tab: TimeTab) => void) | React.Dispatch<React.SetStateAction<TimeTab>>;
  context?: {
    component?: string;
    explorer_tab?: string;
    affects_all_charts?: boolean;
    chart_id?: string;
    chart_title?: string;
  };
}

export const TIME_TABS = ["Week", "Month", "All"];

const TimeTabsSelector = ({ tab, setTab, context }: TimeTabSelector) => {
  const callbackFactory = useCallback(
    (newTab: TimeTab) => () => {
      if (context && context.component === "explorer_global") {
        // Track global time filter changes in Explorer
        withTracking(ANALYTICS_EVENTS.EXPLORER.GLOBAL_TIME_FILTER_CLICK, () => setTab(newTab), {
          previous_time_tab: TIME_TABS[tab].toLowerCase(),
          new_time_tab: TIME_TABS[newTab].toLowerCase(),
          current_explorer_tab: context.explorer_tab,
          affects_all_charts: context.affects_all_charts,
        })();
      } else if (context && context.chart_id) {
        // Track individual chart time filter changes
        withTracking(ANALYTICS_EVENTS.EXPLORER.CHART_TIME_FILTER_CLICK, () => setTab(newTab), {
          chart_id: context.chart_id,
          previous_time_tab: TIME_TABS[tab].toLowerCase(),
          new_time_tab: TIME_TABS[newTab].toLowerCase(),
          explorer_section: context.explorer_tab,
          chart_title: context.chart_title,
        })();
      } else {
        // Default behavior without tracking
        setTab(newTab);
      }
    },
    [setTab, tab, context],
  );

  return (
    <div className="flex gap-4 sm:gap-8">
      {TIME_TABS.map((tabName: string, idx: number) => (
        <div
          key={tabName}
          data-state={tab === idx ? "active" : "inactive"}
          onClick={callbackFactory(idx)}
          className={`${tab === idx ? "text-pinto-green-3 sm:text-pinto-green-3" : "text-pinto-light sm:text-pinto-light"} pinto-sm sm:pinto-body-light cursor-pointer data-[state=inactive]:hover:text-pinto-green-4`}
        >
          {tabName}
        </div>
      ))}
    </div>
  );
};

export default TimeTabsSelector;

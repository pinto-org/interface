import { TimeTab } from "@/components/charts/SeasonalChart";

export interface TimeTabSelector {
  tab: TimeTab;
  setTab: ((tab: TimeTab) => undefined) | React.Dispatch<React.SetStateAction<TimeTab>>;
}

export const TIME_TABS = ["Week", "Month", "All"];

const TimeTabsSelector = ({ tab, setTab }: TimeTabSelector) => {
  return (
    <div className="flex gap-4 sm:gap-8">
      {TIME_TABS.map((tabName: string, idx: number) => (
        <div
          key={tabName}
          data-state={tab === idx ? "active" : "inactive"}
          onClick={() => setTab(idx)}
          className={`${tab === idx ? "text-pinto-green-3 sm:text-pinto-green-3" : "text-pinto-light sm:text-pinto-light"} pinto-sm sm:pinto-body-light cursor-pointer data-[state=inactive]:hover:text-pinto-green-4`}
        >
          {tabName}
        </div>
      ))}
    </div>
  );
};

export default TimeTabsSelector;

import { useCallback } from "react";

export enum TimeTab {
  Week = 0,
  Month = 1,
  AllTime = 2,
}

export interface TimeTabSelector {
  tab: TimeTab;
  setTab: ((tab: TimeTab) => void) | React.Dispatch<React.SetStateAction<TimeTab>>;
}

export const TIME_TABS = ["Week", "Month", "All"];

const TimeTabsSelector = ({ tab, setTab }: TimeTabSelector) => {
  const callbackFactory = useCallback(
    (tab: TimeTab) => () => {
      setTab(tab);
    },
    [setTab],
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

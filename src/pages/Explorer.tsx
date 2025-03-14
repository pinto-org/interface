import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import useRouterTabs, { UseRouterTabsOptions } from "@/hooks/useRouterTabs";
import { useCallback } from "react";
import AllExplorer from "./explorer/AllExplorer";
import FarmerExplorer from "./explorer/FarmerExplorer";
import FieldExplorer from "./explorer/FieldExplorer";
import PintoExplorer from "./explorer/PintoExplorer";

import SeasonsExplorer from "./explorer/SeasonsExplorer";
import SiloExplorer from "./explorer/SiloExplorer";
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
    urlSlug: "farmer",
    tabName: "Farmer",
  },
  {
    urlSlug: "seasons",
    tabName: "Seasons",
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

  const handleMainTabClickFactory = useCallback(
    (selection: string) => () => handleChangeTab(selection),
    [handleChangeTab],
  );

  const selectedIdx = TABS.findIndex((t) => t.urlSlug === tab);

  return (
    <PageContainer variant="xl">
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col w-full gap-4 sm:gap-8">
          <div className="flex flex-col gap-2 sm:ml-4">
            <div className="pinto-h2 sm:pinto-h1">Explorer</div>
            <div className="flex gap-6 sm:gap-10 mt-4 sm:mt-8 overflow-x-auto scrollbar-none">
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
          <Separator />
          {selectedIdx === 0 && <PintoExplorer />}
          {selectedIdx === 1 && <SiloExplorer />}
          {selectedIdx === 2 && <FieldExplorer />}
          {selectedIdx === 3 && <FarmerExplorer />}
          {selectedIdx === 4 && <SeasonsExplorer />}
          {selectedIdx === 5 && <AllExplorer />}
        </div>
      </div>
    </PageContainer>
  );
};
export default Explorer;

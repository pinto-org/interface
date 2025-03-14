import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import useRouterTabs, { UseRouterTabsOptions } from "@/hooks/useRouterTabs";
import { useCallback } from "react";
import CreateBlueprint from "./CreateBlueprint";
import { SoilOrderbook } from "./SoilOrderbook";
import MyBlueprints from "./MyBlueprints";
import { Plow } from "./Plow";

const TABS = [
  {
    urlSlug: "createblueprint",
    tabName: "Create",
  },
  {
    urlSlug: "myblueprints",
    tabName: "My Blueprints",
  },
  {
    urlSlug: "soilorderbook",
    tabName: "Soil Orderbook",
  },
  {
    urlSlug: "plow",
    tabName: "Plow",
  },
];

const routerSlugs = TABS.map((t) => t.urlSlug);
const routerTabsOptions: UseRouterTabsOptions = {
  type: "path",
  key: "tab",
  pathname: "/tractor/:tab",
};
const Tractor = () => {
  console.log("in tractor component");
  const [tab, handleChangeTab] = useRouterTabs(routerSlugs, routerTabsOptions);

  const handleMainTabClickFactory = useCallback(
    (selection: string) => () => handleChangeTab(selection),
    [handleChangeTab],
  );

  const selectedIdx = TABS.findIndex((t) => t.urlSlug === tab);

  console.log("selectedIdx", selectedIdx);

  return (
    <PageContainer variant="xl">
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col w-full gap-4 sm:gap-8">
          <div className="flex flex-col gap-2 sm:ml-4">
            <div className="pinto-h2 sm:pinto-h1">Tractor</div>
            <div className="flex gap-6 sm:gap-10 mt-4 sm:mt-8">
              {TABS.map(({ tabName, urlSlug }, idx) => (
                <div
                  key={tabName}
                  data-state={selectedIdx === idx ? "active" : "inactive"}
                  onClick={handleMainTabClickFactory(urlSlug)}
                  className={`pinto-h4 sm:pinto-h3 cursor-pointer ${selectedIdx === idx ? "text-pinto-primary sm:text-pinto-primary" : "text-pinto-light sm:text-pinto-light"} data-[state=inactive]:hover:text-pinto-green-3`}
                >
                  {tabName}
                </div>
              ))}
            </div>
          </div>
          <Separator />
          {(selectedIdx === 0 || selectedIdx === -1) && <CreateBlueprint />}
          {selectedIdx === 1 && <MyBlueprints />}
          {selectedIdx === 2 && <SoilOrderbook />}
          {selectedIdx === 3 && <Plow />}
        </div>
      </div>
    </PageContainer>
  );
};
export default Tractor;

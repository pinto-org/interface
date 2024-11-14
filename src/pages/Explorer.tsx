import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import { useCallback } from "react";
import PintoExplorer from "./explorer/PintoExplorer";
import SiloExplorer from "./explorer/SiloExplorer";
import FieldExplorer from "./explorer/FieldExplorer";
import SeasonsExplorer from "./explorer/SeasonsExplorer";
import AllExplorer from "./explorer/AllExplorer";
import useRouterTabs from "@/hooks/useRouterTabs";

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
  },
  {
    urlSlug: "all",
    tabName: "All",
  },
];

const Explorer = () => {
  const [tab, handleChangeTab] = useRouterTabs(TABS.map((t) => t.urlSlug));

  const handleMainTabClickFactory = useCallback(
    (selection: string) => () => handleChangeTab(selection),
    [handleChangeTab],
  );

  const selectedIdx = TABS.findIndex((t) => t.urlSlug === tab);

  return (
    <PageContainer variant="xl">
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col w-full gap-4 sm:gap-8">
          <div className="flex flex-col gap-2 ml-4">
            <Text variant="h1">Explorer</Text>
            <div className="flex gap-10 mt-8">
              {TABS.map(({ tabName, urlSlug }, idx) => (
                <Text
                  key={tabName}
                  variant="h3"
                  color={selectedIdx === idx ? "primary" : "light"}
                  data-state={selectedIdx === idx ? "active" : "inactive"}
                  className="cursor-pointer data-[state=inactive]:hover:text-pinto-green-3"
                  onClick={handleMainTabClickFactory(urlSlug)}
                >
                  {tabName}
                </Text>
              ))}
            </div>
          </div>
          <Separator />
          {selectedIdx === 0 && <PintoExplorer />}
          {selectedIdx === 1 && <SiloExplorer />}
          {selectedIdx === 2 && <FieldExplorer />}
          {selectedIdx === 3 && <SeasonsExplorer />}
          {selectedIdx === 4 && <AllExplorer />}
        </div>
      </div>
    </PageContainer>
  );
};
export default Explorer;

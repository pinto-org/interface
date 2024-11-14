import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import { useCallback, useState } from "react";
import PintoExplorer from "./explorer/PintoExplorer";
import SiloExplorer from "./explorer/SiloExplorer";
import FieldExplorer from "./explorer/FieldExplorer";

const MAIN_TABS = ["Pinto", "Silo", "Field", "Seasons", "All"];

const Explorer = () => {
  const [mainTab, setMainTab] = useState(0);

  const handleMainTabClickFactory = useCallback((idx: number) => () => setMainTab(idx), []);

  return (
    <PageContainer variant="xl">
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col w-full gap-4 sm:gap-8">
          <div className="flex flex-col gap-2 ml-4">
            <Text variant="h1">Explorer</Text>
            <div className="flex gap-10 mt-8">
              {MAIN_TABS.map((tabName: string, idx: number) => (
                <Text
                  key={tabName}
                  variant="h3"
                  color={mainTab === idx ? "primary" : "light"}
                  data-state={mainTab === idx ? "active" : "inactive"}
                  className="cursor-pointer data-[state=inactive]:hover:text-pinto-green-3"
                  onClick={handleMainTabClickFactory(idx)}
                >
                  {tabName}
                </Text>
              ))}
            </div>
          </div>
          <Separator />
          {mainTab === 0 && <PintoExplorer />}
          {mainTab === 1 && <SiloExplorer />}
          {mainTab === 2 && <FieldExplorer />}
        </div>
      </div>
    </PageContainer>
  );
};
export default Explorer;

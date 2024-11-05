import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import { useState } from "react";

const MAIN_TABS = ["Pinto", "Silo", "Field", "Seasons", "All"];

function Explorer() {
  const [mainTab, setMainTab] = useState(0);

  const handleMainTabClick = (tabIdx: number) => {
    setMainTab(tabIdx);
  };

  return (
    <PageContainer variant="xl">
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col w-full gap-8">
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
                  onClick={() => handleMainTabClick(idx)}
                >
                  {tabName}
                </Text>
              ))}
            </div>
          </div>
          <Separator />
        </div>
      </div>
    </PageContainer>
  );
}

export default Explorer;

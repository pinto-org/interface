import SeasonalChart from "@/components/charts/SeasonalChart";
import { ReactChart } from "@/components/ReactChart";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import { formatter } from "@/utils/format";
import { ArcElement, BarController, BarElement, CategoryScale, LinearScale, PieController } from "chart.js";
import { useState } from "react";

const MAIN_TABS = ["Pinto", "Silo", "Field", "Seasons", "All"];

function Explorer() {
  const [mainTab, setMainTab] = useState(0);

  const handleMainTabClick = (tabIdx: number) => {
    setMainTab(tabIdx);
  };

  ReactChart.register(PieController, ArcElement, BarController, BarElement, CategoryScale, LinearScale);

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
                  onClick={() => handleMainTabClick(idx)}
                >
                  {tabName}
                </Text>
              ))}
            </div>
          </div>
          <Separator />

          <SeasonalChart
            title="Pinto Price"
            valueFormatter={(v) => `$${formatter.number(v, { minDecimals: 6, maxDecimals: 6 })}`}
          />

          {/* Test chart. Actual charts should ultimately go in separate components */}
          <div className="w-[25%]">
            <ReactChart
              type="bar"
              data={{
                labels: ["Data 1", "Data 2"],
                datasets: [
                  {
                    label: "Dataset 1",
                    data: [123, 456],
                    backgroundColor: ["rgb(254, 225, 140)", "rgb(36, 102, 69)"],
                    borderWidth: 5,
                  },
                ],
              }}
              options={{}}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default Explorer;

import { ReactChart } from "./ReactChart";
import { PieController, ArcElement, ChartOptions, ChartData } from "chart.js";

const donutOptions: ChartOptions = {
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    }
  },
  // @ts-ignore
  offset: 0
};

export default function DonutChart({ data }: { data: ChartData }) {
  ReactChart.register(PieController, ArcElement);

  return (
    <div className="w-4 h-4">
      <ReactChart type="doughnut" data={data} options={donutOptions} height={50} width={50} />
    </div>
  );
}

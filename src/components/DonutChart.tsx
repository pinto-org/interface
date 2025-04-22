import { ArcElement, Chart, ChartData, ChartOptions, PieController } from "chart.js";
import { ReactChart } from "./ReactChart";

Chart.register(PieController, ArcElement);

const donutOptions: ChartOptions = {
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  // @ts-ignore
  offset: 0,
};

export default function DonutChart({ data }: { data: ChartData }) {
  return (
    <div className="w-4 h-4">
      <ReactChart type="doughnut" data={data} options={donutOptions} height={50} width={50} />
    </div>
  );
}

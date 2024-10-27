import { ReactChart } from './ReactChart'; 
import { PieController, ArcElement, ChartOptions, ChartData } from 'chart.js';

export default function DonutChart({ data }: { data: ChartData }) {

    ReactChart.register(PieController, ArcElement);

    const donutOptions: ChartOptions = {
        offset: 0
    };

    return (
    <div className="w-4 h-4">
     <ReactChart
        type="doughnut"
        data={data}
        options={donutOptions}
        height={50}
        width={50}
      />
    </div>
    )
};
import LineChart, { LineChartData, MakeGradientFunction } from "@/components/charts/LineChart";
import { useEffect, useState } from "react";

const makeLineGradients: MakeGradientFunction[] = [
  (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return undefined;
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    gradient.addColorStop(0, "#59f0a7");
    gradient.addColorStop(0.5, "#00C767");
    gradient.addColorStop(1, "#246645");
    return gradient;
  },
];

const makeAreaGradients: MakeGradientFunction[] = [
  (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return undefined;
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, "rgba(0, 199, 103, 0.3)");
    gradient.addColorStop(1, "rgba(0, 199, 103, 0.05)");
    return gradient;
  },
];

const sampleVolumeData: LineChartData[] = [
  { values: [0], day: "2021" },
  { values: [87940000], day: "2021" },
  { values: [126220000], day: "2022" },
  { values: [224640000], day: "2022" },
  { values: [227200000], day: "2022" },
  { values: [230290000], day: "2022" },
  { values: [231430000], day: "2023" },
  { values: [233740000], day: "2023" },
  { values: [235867517], day: "2023" },
  { values: [248240000], day: "2023" },
  { values: [273810000], day: "2024" },
  { values: [290200000], day: "2024" },
  { values: [332640000], day: "2024" },
  { values: [465580000], day: "2024" },
  { values: [626870000], day: "2025" },
  { values: [721310000], day: "2025" },
  { values: [826360000], day: "2025" },
];

const valueFormatter = (value: number) => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(0)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(0)}M`;
  }
  if (value === 0) {
    return "";
  }
  return `$${(value / 1000).toFixed(0)}K`;
};

export default function LandingVolume() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-screen sm:w-full place-self-center">
        <div className="bg-white border mx-4 p-3 sm:mx-0 sm:p-6 rounded-lg flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-sm sm:text-xl font-light text-pinto-gray-4">Cumulative Volume</span>
            <span className="text-body sm:text-[2rem] font-normal leading-[1.1] tracking-h3 text-black">$826M</span>
          </div>
          <div className="max-sm:aspect-3/1">
            <div className="h-[250px] sm:w-[60rem] sm:h-[25rem] bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen sm:w-full">
      <div className="bg-white border mx-4 p-3 sm:mx-0 sm:p-6 rounded-lg flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm sm:text-xl font-light text-pinto-gray-4">Cumulative Volume</span>
          <span className="text-body sm:text-[2rem] font-normal leading-[1.1] tracking-h3 text-black">$826M</span>
        </div>
        <div>
          <div className="h-[150px] sm:w-[60rem] sm:h-[15rem] pointer-events-none">
            <LineChart
              key="volume-chart"
              data={sampleVolumeData}
              size="small"
              xKey="day"
              makeLineGradients={makeLineGradients}
              makeAreaGradients={makeAreaGradients}
              valueFormatter={valueFormatter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

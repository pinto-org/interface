import { useState } from "react";
import Text from "../ui/Text";
import { formatDate } from "@/utils/format";
import LineChart from "./LineChart";

interface SeasonalChartProps {
  title: string;
  valueFormatter: (value: string) => string;
}

export default function SeasonalChart({ title, valueFormatter: formatter }: SeasonalChartProps) {
  // TODO: set default values on initial chart load
  const [displayData, setDisplayData] = useState({
    value: "1.002341",
    season: 22687,
    timestamp: new Date(1730856435986),
  });

  return (
    // TODO: should include a spinner while it is loading initially
    <div className="rounded-[20px] p-4 sm:p-6" style={{ backgroundColor: "#F8F8F8" }}>
      <Text variant="body" color="light">
        {title}
      </Text>
      <Text variant="h3" color="green3">
        {formatter(displayData.value)}
      </Text>
      <div className="flex flex-col gap-2 mt-3">
        <Text variant="sm-light" color="light">
          Season {displayData.season}
        </Text>
        <Text variant="sm-light" color="light">
          {formatDate(displayData.timestamp)}
        </Text>
      </div>

      <LineChart
        data={{
          datasets: [
            {
              label: "Sample Data", // Wont display anywhere, remove later
              data: [123, 234, 345, 456, 345, 234, 123, 1234, 56],
            },
          ],
        }}
      />
    </div>
  );
}

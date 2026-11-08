import type { TVChartFormattedData } from "./TVChart";

export function getChartDataPoint(
  formattedData: TVChartFormattedData[][] | undefined,
  numberOfSeries: number,
  mode: "first" | "last",
) {
  if (!formattedData) return undefined;

  let _time = 0;
  const _value: (number | undefined)[] = Array(numberOfSeries).fill(undefined);
  let _season = 0;

  Array.from({ length: numberOfSeries }).forEach((_, i) => {
    const selectedData = formattedData[i];
    if (!selectedData || selectedData.length === 0) return;

    const dataIndex = mode === "last" ? selectedData.length - 1 : 0;
    if (!selectedData[dataIndex]) return;

    _time = Math.max(_time, selectedData[dataIndex]?.time?.valueOf() as number);
    _season = Math.max(_season, selectedData[dataIndex]?.customValues?.season || 0);
    _value[i] = selectedData[dataIndex]?.value;
  });

  if (_time === 0) return undefined;

  return {
    time: new Date(_time * 1000)?.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" }),
    value: _value,
    season: _season,
    timestamp: _time,
  };
}

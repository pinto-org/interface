import { generateID } from "@/utils/utils";
import { noop } from "@/utils/utils";
import { Chart } from "chart.js";
import type { ChartData, ChartOptions, ChartType, Plugin, UpdateMode } from "chart.js";
import React, { useCallback, useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { LineController, LineElement, LinearScale, CategoryScale, PointElement, Filler } from "chart.js";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

interface ReactChartComponent extends ForwardRefExoticComponent<ChartProps & RefAttributes<Chart | null>> {
  register: typeof Chart.register | typeof noop;
}

type ChartInputFunction<T> = (ctx: CanvasRenderingContext2D | null) => T;
type ReactChartInput<T> = T | ChartInputFunction<T>;

Chart.register(LineController, LineElement, LinearScale, CategoryScale, PointElement, Filler);

// biome-ignore lint/suspicious/noExplicitAny: needed for type check
function isInputFunctionType<T>(value: any): value is ChartInputFunction<T> {
  return typeof value === "function";
}

function getChartInputFn<T>(valueOrFn: ReactChartInput<T>): ChartInputFunction<T> {
  return isInputFunctionType(valueOrFn) ? valueOrFn : () => valueOrFn;
}

export interface ChartProps {
  data: ReactChartInput<ChartData>;
  options: ReactChartInput<ChartOptions>;
  type: ChartType;
  plugins?: Plugin[];
  updateMode?: UpdateMode;
  id?: string;
  height?: number;
  width?: number;
}

export const ReactChart = forwardRef<Chart | null, ChartProps>(
  ({ id, data, options, type, plugins, updateMode, height, width }: ChartProps, ref) => {
    const chartInstance = useRef<Chart>({
      update: noop,
      destroy: noop,
    } as Chart);
    const [CHART_ID] = useState(id || generateID("Chart"));

    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    // Use useImperativeHandle to expose the chart instance to the parent component
    useImperativeHandle(ref, () => chartInstance.current);

    useEffect(() => {
      if (ctxRef.current) {
        chartInstance.current.data = getChartInputFn(data)(ctxRef.current);
        chartInstance.current.options = getChartInputFn(options)(ctxRef.current);
        chartInstance.current.update(updateMode);
      }
    }, [data, options, updateMode]);

    const nodeRef = useCallback<(node: HTMLCanvasElement | null) => void>(
      (node) => {
        chartInstance.current.destroy();
        ctxRef.current = null;

        if (node) {
          ctxRef.current = node.getContext("2d");
          chartInstance.current = new Chart(node, {
            type,
            data: getChartInputFn(data)(ctxRef.current),
            options: getChartInputFn(options)(ctxRef.current),
            plugins,
          });
        }
      },
      [type, data, options, plugins],
    );

    return <canvas ref={nodeRef} height={height} width={width} id={CHART_ID} />;
  },
) as ReactChartComponent;

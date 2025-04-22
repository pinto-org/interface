import { Chart, ChartOptions, Plugin, ScriptableScaleContext } from "chart.js";
import { MutableRefObject } from "react";

export type MakeGradientFunction = (
  ctx: CanvasRenderingContext2D | null,
  position: number,
) => CanvasGradient | undefined;

// Draws dynamic gradient with the given colors at the given positions.
// Positions outside of range [0, 1] are truncated or ignored when appropriate.
export const positionalGradient = (ctx: CanvasRenderingContext2D, colors: string[], positions: number[]) => {
  const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
  for (let i = 0; i < positions.length; ++i) {
    if (positions[i] >= 0 && positions[i] <= 1) {
      gradient.addColorStop(positions[i], colors[i]);
    } else if (positions[i] > 1 && positions[i - 1] < 1) {
      gradient.addColorStop(1, colors[i]);
    } else if (positions[i] < 0 && positions[i + 1] > 0) {
      gradient.addColorStop(0, colors[i]);
    }
  }
  return gradient;
};

export const positionalGradientVertical = (ctx: CanvasRenderingContext2D, colors: string[], positions: number[]) => {
  // Change from (0, 0, ctx.canvas.width, 0) to (0, 0, 0, ctx.canvas.height)
  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  for (let i = 0; i < positions.length; ++i) {
    if (positions[i] >= 0 && positions[i] <= 1) {
      gradient.addColorStop(positions[i], colors[i]);
    } else if (positions[i] > 1 && positions[i - 1] < 1) {
      gradient.addColorStop(1, colors[i]);
    } else if (positions[i] < 0 && positions[i + 1] > 0) {
      gradient.addColorStop(0, colors[i]);
    }
  }
  return gradient;
};

// ---------------------------------------------------------------------------------------------------------------------
// Stroke gradients
// ---------------------------------------------------------------------------------------------------------------------

// stroke configs
const metallicGreenStrokeColors = ["#59f0a7", "#00C767", "#246645", "#00C767", "#F2F6F9"];

const metallicMorningStrokeColors = ["#F6F3E9", "#FEF400", "#BB9400"];
const metallicMorningStrokePositions = [0, 0.52, 1];

// Draws a dynamic gradient depending on mouse position in the chart
export const metallicGreenStrokeGradientFn: MakeGradientFunction = (
  ctx: CanvasRenderingContext2D | null,
  position: number,
) => {
  if (ctx) {
    const positions = [position - 1, position - 0.5, position, position + 0.5, position + 1];
    return positionalGradient(ctx, metallicGreenStrokeColors, positions);
  }
};

// Draws a dynamic gradient depending on mouse position in the chart
export const metallicMorningStrokeGradientFn: MakeGradientFunction = (
  ctx: CanvasRenderingContext2D | null,
  _position: number,
) => {
  if (ctx) {
    return positionalGradient(ctx, metallicMorningStrokeColors, metallicMorningStrokePositions);
  }
};

const gradientFunctionMap = {
  metallicMorning: metallicMorningStrokeGradientFn,
  metallicGreen: metallicGreenStrokeGradientFn,
} as const;

export function getStrokeGradientFunctions(
  options: (keyof typeof gradientFunctionMap | string)[],
): (MakeGradientFunction | string)[] {
  return options.map((option) => gradientFunctionMap[option] || option);
}

// ---------------------------------------------------------------------------------------------------------------------
// Area gradients
// ---------------------------------------------------------------------------------------------------------------------

// area configs
const metallicMorningAreaColors = ["#F9E6AE88", "#FEE18C", "#F1F88C"];
const metallicMorningAreaPositions = [0, 0.5, 1];

export const metallicMorningAreaGradientFn: MakeGradientFunction = (
  ctx: CanvasRenderingContext2D | null,
  _position: number,
) => {
  if (ctx) {
    return positionalGradient(ctx, metallicMorningAreaColors, metallicMorningAreaPositions);
  }
};

// ----------

const fadeAreaGreenColors = [
  "rgba(36, 102, 69, 0.15)",
  "rgba(36, 102, 69, 0.0277607)",
  "rgba(36, 102, 69, 0.1)",
  "rgba(36, 102, 69, 0.2)",
];
const fadeAreaGreenPositions = [0.2805, 0.4326, 0.751, 0.9767];

export const fadeGreenAreaGradientFn: MakeGradientFunction = (
  ctx: CanvasRenderingContext2D | null,
  _position: number,
) => {
  if (ctx) {
    return positionalGradientVertical(ctx, fadeAreaGreenColors, fadeAreaGreenPositions);
  }
};

const areaGradientFunctionMap = {
  metallicMorning: metallicMorningAreaGradientFn,
  fadeGreen: fadeGreenAreaGradientFn,
} as const;
export function getAreaGradientFunctions(
  options: (keyof typeof areaGradientFunctionMap | string)[],
): (MakeGradientFunction | string)[] {
  return options.map((option) => areaGradientFunctionMap[option] || option);
}
// ---------------------------------------------------------------------------------------------------------------------
// Line Chart Options
// ---------------------------------------------------------------------------------------------------------------------

export const defaultLineChartOptions: Omit<ChartOptions<"line">, "scales"> = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    // Tick padding must be uniform, undo it here
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false, // We’re customizing hover logic ourselves
    },
  },
} as const;

// ---------------------------------------------------------------------------------------------------------------------
// Plugins
// ---------------------------------------------------------------------------------------------------------------------

const getVerticalLinePlugin = (
  activeIndexRef: MutableRefObject<number | undefined>,
  fillArea: boolean = false,
): Plugin => ({
  id: "customVerticalLine",
  afterDraw: (chart: Chart) => {
    const ctx = chart.ctx;
    const activeIndex = activeIndexRef.current;
    if (ctx) {
      ctx.save();
      ctx.setLineDash([4, 4]);

      // Draw the vertical line at morningIndex
      if (typeof activeIndex === "number") {
        const morningDataPoint = chart.getDatasetMeta(0).data[activeIndex];
        if (morningDataPoint) {
          const { x } = morningDataPoint.getProps(["x"], true);
          ctx.beginPath();
          ctx.moveTo(x, chart.chartArea.top);
          ctx.lineTo(x, chart.chartArea.bottom);
          ctx.strokeStyle = "#D9AD0F"; // Use a different color for the morning line
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Draw the vertical line for the active element (hovered point)
      const activeElements = chart.getActiveElements();
      if (activeElements.length > 0) {
        const activeElement = activeElements[0];
        const datasetIndex = activeElement.datasetIndex;
        const index = activeElement.index;
        const dataPoint = chart.getDatasetMeta(datasetIndex).data[index];

        if (dataPoint) {
          const { x } = dataPoint.getProps(["x"], true);
          ctx.beginPath();
          ctx.moveTo(x, chart.chartArea.top);
          ctx.lineTo(x, chart.chartArea.bottom);
          ctx.strokeStyle = fillArea ? "#D9AD0F" : "#246645";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      ctx.restore();
    }
  },
});

const getSelectionPointPlugin = (
  activeIndexRef: MutableRefObject<number | undefined>,
  fillArea: boolean = false,
): Plugin => ({
  id: "customSelectPoint",
  afterDraw: (chart: Chart) => {
    const ctx = chart.ctx;
    const activeIndex = activeIndexRef.current;
    if (!ctx) return;

    // Define the function to draw the selection point
    const drawSelectionPoint = (x: number, y: number) => {
      ctx.save();
      ctx.fillStyle = fillArea ? "#D9AD0F" : "#246645";
      ctx.strokeStyle = fillArea ? "#D9AD0F" : "#246645";
      ctx.lineWidth = 1;

      const rectWidth = 6;
      const rectHeight = 6;
      const cornerRadius = 4;

      ctx.beginPath();
      ctx.moveTo(x - rectWidth / 2 + cornerRadius, y - rectHeight / 2);
      ctx.lineTo(x + rectWidth / 2 - cornerRadius, y - rectHeight / 2);
      ctx.quadraticCurveTo(x + rectWidth / 2, y - rectHeight / 2, x + rectWidth / 2, y - rectHeight / 2 + cornerRadius);
      ctx.lineTo(x + rectWidth / 2, y + rectHeight / 2 - cornerRadius);
      ctx.quadraticCurveTo(x + rectWidth / 2, y + rectHeight / 2, x + rectWidth / 2 - cornerRadius, y + rectHeight / 2);
      ctx.lineTo(x - rectWidth / 2 + cornerRadius, y + rectHeight / 2);
      ctx.quadraticCurveTo(x - rectWidth / 2, y + rectHeight / 2, x - rectWidth / 2, y + rectHeight / 2 - cornerRadius);
      ctx.lineTo(x - rectWidth / 2, y - rectHeight / 2 + cornerRadius);
      ctx.quadraticCurveTo(x - rectWidth / 2, y - rectHeight / 2, x - rectWidth / 2 + cornerRadius, y - rectHeight / 2);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    // Draw selection point for the hovered data point
    const activeElements = chart.getActiveElements();
    if (activeElements.length > 0) {
      const activeElement = activeElements[0];
      const datasetIndex = activeElement.datasetIndex;
      const index = activeElement.index;
      const dataPoint = chart.getDatasetMeta(datasetIndex).data[index];

      if (dataPoint) {
        const { x, y } = dataPoint.getProps(["x", "y"], true);
        drawSelectionPoint(x, y);
      }
    }

    // Draw selection point for the morningIndex
    if (typeof activeIndex === "number") {
      const dataPoint = chart.getDatasetMeta(0).data[activeIndex];
      if (dataPoint) {
        const { x, y } = dataPoint.getProps(["x", "y"], true);
        drawSelectionPoint(x, y);
      }
    }
  },
});

const getSelectionCallbackPlugin = (onMouseOver?: (index: number | undefined) => void): Plugin => ({
  id: "selectionCallback",
  afterDraw: (chart: Chart) => {
    onMouseOver?.(chart.getActiveElements()?.[0]?.index);
  },
});

const getGradientShiftPlugin = (
  activeIndexRef: MutableRefObject<number | undefined>,
  makeLineGradients: (MakeGradientFunction | string)[],
  makeAreaGradients?: (MakeGradientFunction | string)[],
) => ({
  id: "customGradientShift",
  beforeUpdate: (chart) => {
    const ctx = chart.ctx;
    const activeIndex = activeIndexRef.current;
    if (ctx && typeof activeIndex === "number") {
      const grayColor = "rgba(128, 128, 128, 0.1)"; // Define your gray color here

      for (let i = 0; i < chart.data.datasets.length; ++i) {
        const dataset = chart.data.datasets[i];
        const lineGradientFnOrHex = makeLineGradients[i];
        const areaGradientFnOrHex = makeAreaGradients?.[i];

        if (areaGradientFnOrHex && typeof areaGradientFnOrHex !== "string") {
          dataset.backgroundColor = areaGradientFnOrHex?.(ctx, 1);
        }

        if (lineGradientFnOrHex && typeof lineGradientFnOrHex !== "string") {
          dataset.borderColor = lineGradientFnOrHex(ctx, 1);
        }

        // Use segment configuration for conditional coloring
        dataset.segment = {
          borderColor: (ctx) => {
            const dataIndex = ctx.p0DataIndex;
            const isAfterActiveIndex = dataIndex >= activeIndex;
            return isAfterActiveIndex ? grayColor : undefined;
          },
          backgroundColor: (ctx) => {
            const dataIndex = ctx.p0DataIndex;
            const isAfterActiveIndex = dataIndex >= activeIndex;
            return isAfterActiveIndex ? grayColor : undefined;
          },
        };
      }
    }
  },
});

export const plugins = {
  verticalLine: getVerticalLinePlugin,
  selectionCallback: getSelectionCallbackPlugin,
  selectionPoint: getSelectionPointPlugin,
  gradientShift: getGradientShiftPlugin,
};

// ---------------------------------------------------------------------------------------------------------------------
// Scales
// ---------------------------------------------------------------------------------------------------------------------

const getXScaleGridColor = (activeIndex: number | undefined) => (context: ScriptableScaleContext) => {
  const tickLabel = context.tick && context.tick.label;
  if (typeof activeIndex === "number") {
    if (tickLabel && tickLabel !== "") {
      return "rgba(0, 0, 0, 0.1)";
    } else {
      return "transparent";
    }
  } else {
    return "rgba(0, 0, 0, 0.1)";
  }
};

const getXScaleTick = (
  _value: unknown,
  index: number,
  ticks: unknown[],
  xValue: string | number | Date | undefined | null,
  activeIndex: number | undefined,
) => {
  if (!xValue) {
    return "";
  }

  const tickLabel = xValue instanceof Date ? `${xValue.getMonth() + 1}/${xValue.getDate()}` : xValue;

  if (typeof activeIndex === "number") {
    if (index === 0 || index === ticks.length - 1) {
      return tickLabel;
    }
    const indicesToShowTicks = [4, 9, 14, 19];
    return indicesToShowTicks.includes(index) ? tickLabel : "";
  }

  // Let Chart.js handle auto-skipping and tick labels
  return tickLabel;
};

export const scalesX = {
  grid: {
    color: getXScaleGridColor,
  },
  ticksWithXValue: getXScaleTick,
};

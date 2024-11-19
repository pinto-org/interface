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

// ---------------------------------------------------------------------------------------------------------------------
// Stroke gradients
// ---------------------------------------------------------------------------------------------------------------------

// stroke configs
const metallicGreenStrokeColors = ["#F2F6F9", "#00C767", "#246645", "#00C767", "#F2F6F9"];

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

// ---------------------------------------------------------------------------------------------------------------------
// Area gradients
// ---------------------------------------------------------------------------------------------------------------------

// area configs
const metallicMorningAreaColors = ["rgba(233, 231, 224, 0.49)", "#FEE18C", "#F1F88C"];
const metallicMorningAreaPositions = [0, 0.5, 1];

export const metallicMorningAreaGradientFn: MakeGradientFunction = (
  ctx: CanvasRenderingContext2D | null,
  _position: number,
) => {
  if (ctx) {
    return positionalGradient(ctx, metallicMorningAreaColors, metallicMorningAreaPositions);
  }
};

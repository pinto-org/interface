export function deriveGroupState(
  hasHarvestablePlot: boolean,
  hasSelectedPlot: boolean,
  hasHoveredPlot: boolean,
  selectionGreen: boolean,
): { isGreen: boolean; isActive: boolean } {
  // Green if harvestable, hovered, or selection indicates green for this context
  const isGreen = hasHarvestablePlot || hasHoveredPlot || selectionGreen;
  const isActive = hasHoveredPlot || hasSelectedPlot;
  return { isGreen, isActive };
}



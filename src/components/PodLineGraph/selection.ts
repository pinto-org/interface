/**
 * Represents the visual state of a plot group
 */
export interface GroupState {
  /** Whether the group should be visually highlighted (green/yellow) */
  isHighlighted: boolean;
  /** Whether the group is in active state (yellow for hover/selection) */
  isActive: boolean;
}

/**
 * Derives the visual state of a plot group based on its properties
 *
 * @param hasHarvestablePlot - Whether the group contains harvestable plots
 * @param hasSelectedPlot - Whether the group contains selected plots
 * @param hasHoveredPlot - Whether the group is currently being hovered
 * @param selectionHighlighted - Whether the group overlaps with a selection range
 * @returns The derived visual state for the group
 */
export function deriveGroupState(
  hasHarvestablePlot: boolean,
  hasSelectedPlot: boolean,
  hasHoveredPlot: boolean,
  selectionHighlighted: boolean,
): GroupState {
  // Group is highlighted if it's harvestable, hovered, or within selection range
  const isHighlighted = hasHarvestablePlot || hasHoveredPlot || selectionHighlighted;

  // Group is active (yellow) if it's hovered or selected
  const isActive = hasHoveredPlot || hasSelectedPlot;

  return { isHighlighted, isActive };
}

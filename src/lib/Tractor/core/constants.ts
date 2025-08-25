// ────────────────────────────────────────────────────────────────────────────────
// TRACTOR SHARED CONSTANTS
// ────────────────────────────────────────────────────────────────────────────────

// Block number at which Tractor was deployed - use this as starting point for event queries
export const TRACTOR_DEPLOYMENT_BLOCK = 28930876n;
export const TRACTOR_DEPLOYMENT_BLOCK_CONVERT_UP = 34515087n;

export const TRACTOR_TOKEN_STRATEGY_INDICIES = {
  LOWEST_PRICE: 254,
  LOWEST_SEEDS: 255,
};

export const TRACTOR_DEPLOYMENT_BLOCKS_BY_TYPE = {
  sowBlueprintV0: TRACTOR_DEPLOYMENT_BLOCK,
  convertUpBlueprint: TRACTOR_DEPLOYMENT_BLOCK_CONVERT_UP,
} as const;

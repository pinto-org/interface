import { CLAIM_PRESETS } from "@/lib/Tractor/claimOrder/tractor-claim";
import { describe, expect, it } from "vitest";

/**
 * Unit tests for ConditionSection preset configuration and display logic.
 * Validates Requirements 3.1-3.10, 6.2-6.5
 */
describe("ConditionSection — Preset Configuration", () => {
  it("should have correct preset values for Mow (Req 3.1-3.3)", () => {
    expect(CLAIM_PRESETS.mow.high.value).toBe(50);
    expect(CLAIM_PRESETS.mow.medium.value).toBe(100);
    expect(CLAIM_PRESETS.mow.low.value).toBe(1000);
  });

  it("should have correct preset values for Plant (Req 3.4-3.6)", () => {
    expect(CLAIM_PRESETS.plant.high.value).toBe(10);
    expect(CLAIM_PRESETS.plant.medium.value).toBe(50);
    expect(CLAIM_PRESETS.plant.low.value).toBe(500);
  });

  it("should have correct preset values for Harvest (Req 3.7-3.9)", () => {
    expect(CLAIM_PRESETS.harvest.high.value).toBe(10);
    expect(CLAIM_PRESETS.harvest.medium.value).toBe(50);
    expect(CLAIM_PRESETS.harvest.low.value).toBe(500);
  });

  it("should have exactly 3 preset levels (high, medium, low) per operation", () => {
    for (const op of ["mow", "plant", "harvest"] as const) {
      const keys = Object.keys(CLAIM_PRESETS[op]);
      expect(keys).toContain("high");
      expect(keys).toContain("medium");
      expect(keys).toContain("low");
      expect(keys).toHaveLength(3);
    }
  });
});

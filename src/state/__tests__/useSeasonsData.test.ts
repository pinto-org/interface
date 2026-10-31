import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useSeasonsData from "../useSeasonsData";
import stalkData from "./fixtures/advanced-chart.json";

const api = vi.hoisted(() => ({ apy: undefined as any, tractor: undefined as any, inflow: undefined as any }));
vi.mock("wagmi", () => ({ useChainId: () => 8453 }));
vi.mock("../useTokenData", () => ({
  default: () => ({ mainToken: { address: "0xb170000aeefa790fa61d6e837d1035906839a3c8", decimals: 6 } }),
}));
vi.mock("../seasonal/queries/useSeasonalInternalQueries", () => ({
  default: () => ({ data: [], isLoading: false }),
  useMultiSeasonalQueries: () => ({ data: stalkData, isLoading: false }),
}));
vi.mock("../seasonal/queries/useSeasonalAPY", () => ({
  APYWindow: { DAILY: 24, WEEKLY: 168, MONTHLY: 720 },
  useSeasonalAPYs: () => ({ data: api.apy, isLoading: false, isError: !api.apy }),
}));
vi.mock("../seasonal/queries/useSeasonalTractorSnapshots", () => ({
  default: () => ({ data: api.tractor, isLoading: false, isError: !api.tractor }),
}));
vi.mock("../seasonal/queries/useSeasonalInflowSnapshots", () => ({
  default: () => ({ data: api.inflow, isLoading: false, isError: !api.inflow }),
}));
vi.mock("../seasonal/queries/useSeasonalMarketPerformance", () => ({
  SMPChartType: {},
  useMarketPerformanceCalc: () => ({}),
  useSeasonalMarketPerformanceData: () => ({ data: [], isLoading: false }),
}));

function readSeasons(options = {}) {
  let result: ReturnType<typeof useSeasonsData> | undefined;
  function Probe() {
    result = useSeasonsData(17028, 17028, {
      seasonSync: true,
      beanData: false,
      basinData: false,
      marketPerformanceData: false,
      ...options,
    });
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  if (!result) throw new Error("Season probe did not render");
  return result;
}

beforeEach(() => {
  api.apy = undefined;
  api.tractor = undefined;
  api.inflow = undefined;
});

describe("All explorer during a Pinto API outage", () => {
  it("does not report errors for disabled API sources on the Seasons page", () => {
    const result = readSeasons({ apyData: false, tractorData: false, inflowData: false });
    expect(result.hasUnavailableApiData).toBe(false);
    expect(result.data).toHaveLength(1);
  });
  it.each([undefined, []])("keeps subgraph prices when API results are %s", (missing) => {
    api.tractor = missing;
    api.inflow = missing;
    const { data, hasUnavailableApiData } = readSeasons();
    expect(hasUnavailableApiData).toBe(true);
    expect(data).toHaveLength(1);
    expect(data[0].season).toBe(17028);
    expect(data[0].price.toNumber()).toBe(0.033);
    expect(data[0].timestamp).toBe(1793415657);
    expect(data[0]).not.toHaveProperty("pinto24h");
    expect(data[0]).not.toHaveProperty("tractorSownPinto");
    expect(data[0]).not.toHaveProperty("inflowAllDeltaNet");
  });

  it("shows real zero APY values when the API recovers, without filling missing windows with zero", () => {
    api.apy = { 24: [{ season: 17028, value: 0, timestamp: new Date(1793415657000) }] };
    const { data } = readSeasons();
    expect(data).toHaveLength(1);
    expect(data[0].pinto24h).toBe(0);
    expect(data[0]).not.toHaveProperty("pinto7d");
    expect(data[0]).not.toHaveProperty("pinto30d");
  });
});

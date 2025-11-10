const TWENTY_MINS = 1000 * 60 * 20;

const FIVE_MINS = 1000 * 60 * 5;

const FIFTEEN_SECONDS = 1000 * 60;

export const defaultQuerySettingsSlow = {
  staleTime: TWENTY_MINS * 3, // 1 hour
  refetchInterval: TWENTY_MINS * 3, // 1 hour
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: true,
} as const;

export const defaultQuerySettings = {
  staleTime: TWENTY_MINS,
  refetchInterval: TWENTY_MINS,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: true,
};

export const defaultQuerySettingsMedium = {
  staleTime: FIVE_MINS,
  refetchInterval: FIVE_MINS,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: true,
};

export const defaultQuerySettingsFast = {
  staleTime: 1000 * 60 * 2,
  refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: true,
};

export const defaultQuerySettingsNoRefetch = {
  // We don't need to refetch this query
  staleTime: Infinity,
  refetchInterval: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
} as const;

/**
 * Default query settings for quote queries.
 * This is used for queries that are used to fetch quote data & need to fetch data very frequently.
 *
 * default query settings is to fetch data every 15 seconds
 */
export const defaultQuerySettingsQuote = {
  ...defaultQuerySettingsFast,
  staleTime: FIFTEEN_SECONDS,
  refetchInterval: FIFTEEN_SECONDS,
};

export const QUERY_SETTINGS = {
  quote: defaultQuerySettingsQuote,
  fast: defaultQuerySettingsFast,
  medium: defaultQuerySettingsMedium,
  default: defaultQuerySettings,
  slow: defaultQuerySettingsSlow,
  noRefetch: defaultQuerySettingsNoRefetch,
} as const;

export const SEASONAL_SCOPE_KEY = "SeasonalQuery" as const;

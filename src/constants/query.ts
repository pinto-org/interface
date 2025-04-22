const TWENTY_MINS = 1000 * 60 * 20;

const FIFTEEN_SECONDS = 1000 * 60;

export const defaultQuerySettings = {
  staleTime: TWENTY_MINS,
  refetchInterval: TWENTY_MINS,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: true,
};

export const defaultQuerySettingsFast = {
  staleTime: 1000 * 60 * 2,
  refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
};

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

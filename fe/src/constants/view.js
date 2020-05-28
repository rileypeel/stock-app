export const BASE_URL = 'http://0.0.0.0:8000'

// view config constants

// periods the view accepts
export const PERIOD_MINUTE = '1 minute'
export const PERIOD_FIVE_MINUTE = '5 minutes'
export const PERIOD_THIRTY_MINUTE = '30 minutes'
export const PERIOD_HOURLY = 'hourly'
export const PERIOD_DAILY = 'daily'
export const PERIOD_WEEKLY = 'weekly'
export const PERIOD_MONTHLY = 'monthly'

// enabled periods for the app
export const PERIODS = [
  PERIOD_MINUTE,
  PERIOD_FIVE_MINUTE,
  PERIOD_THIRTY_MINUTE,
  PERIOD_HOURLY,
  PERIOD_DAILY,
  PERIOD_WEEKLY,
  PERIOD_MONTHLY
]

export const SHORT_PERIODS = [
  PERIOD_MINUTE,
  PERIOD_FIVE_MINUTE,
  PERIOD_THIRTY_MINUTE,
  PERIOD_HOURLY
]

//periods to there associated resolution for api call
export const RESOLUTIONS = {
  [PERIOD_MINUTE]: '1',
  [PERIOD_FIVE_MINUTE]: '5',
  [PERIOD_THIRTY_MINUTE]: '30',
  [PERIOD_HOURLY]: '60',
  [PERIOD_DAILY]: 'D',
  [PERIOD_WEEKLY]: 'W',
  [PERIOD_MONTHLY]: 'M'
}

//period to equivalent timeout in seconds
export const TIMEOUTS = {
  [PERIOD_MINUTE]: '60',
  [PERIOD_FIVE_MINUTE]: '300',
  [PERIOD_THIRTY_MINUTE]: '1800',
  [PERIOD_HOURLY]: '3600'
}

//time frames for viewing data
export const THIRTY_MINUTES = '30 min'
export const ONE_HOUR = '1 hour'
export const FIVE_HOUR = '5 hours'
export const ONE_DAY = '1 day'
export const ONE_WEEK = '1 week'
export const ONE_MONTH = '1 month'
export const SIX_MONTH = '6 month'
export const ONE_YEAR = '1 year'
export const FIVE_YEAR = '5 year'
export const TEN_YEAR = '10 year'
export const TWENTY_YEAR = '20 year'
export const MAX = 'Max'

//time offsets for calculating chart labels
export const OFFSETS = {
  [THIRTY_MINUTES]: 60 * 30,
  [ONE_HOUR]: 3600,
  [FIVE_HOUR]: 3600 * 5,
  [ONE_DAY]: 24 * 3600,
  [ONE_WEEK]: 24 * 7 * 3600,
  [ONE_MONTH]: 24 * 3600 * 30,
  [SIX_MONTH]: 24 * 3600 * 182,
  [ONE_YEAR]: 24 * 3600 * 365,
  [FIVE_YEAR]: 24 * 3600 * 365 * 5,
  [TEN_YEAR]: 24 * 3600 * 365 * 10,
  [TWENTY_YEAR]: 24 * 3600 * 365 * 20,
  [MAX]: 0, 
}

export const TIMEFRAMES = [
  THIRTY_MINUTES,
  ONE_HOUR,
  FIVE_HOUR,
  ONE_DAY,
  ONE_WEEK,
  ONE_MONTH,
  SIX_MONTH,
  ONE_YEAR,
  FIVE_YEAR,
  TEN_YEAR,
  TWENTY_YEAR,
  MAX
]

export const TIMEFRAME_PERIOD_MAP = {
  [THIRTY_MINUTES]: [],
  [ONE_HOUR]: [],
  [FIVE_HOUR]: [],
  [ONE_DAY]: [],
  [ONE_WEEK]: [],
  [ONE_MONTH]: [],
  [SIX_MONTH]: [],
  [ONE_YEAR]: [],
  [FIVE_YEAR]: [],
  [TEN_YEAR]: [],
  [TWENTY_YEAR]: [],
  [MAX]: []
}

TIMEFRAME_PERIOD_MAP[THIRTY_MINUTES].push(PERIOD_MINUTE, PERIOD_FIVE_MINUTE)
TIMEFRAME_PERIOD_MAP[ONE_HOUR].push(PERIOD_MINUTE, PERIOD_FIVE_MINUTE)
TIMEFRAME_PERIOD_MAP[FIVE_HOUR].push(PERIOD_HOURLY, PERIOD_THIRTY_MINUTE, PERIOD_MINUTE, PERIOD_FIVE_MINUTE)
TIMEFRAME_PERIOD_MAP[ONE_DAY].push(PERIOD_HOURLY, PERIOD_THIRTY_MINUTE, PERIOD_FIVE_MINUTE)
TIMEFRAME_PERIOD_MAP[ONE_WEEK].push(PERIOD_HOURLY, PERIOD_THIRTY_MINUTE)
TIMEFRAME_PERIOD_MAP[ONE_MONTH].push(PERIOD_DAILY)
TIMEFRAME_PERIOD_MAP[SIX_MONTH].push(PERIOD_DAILY, PERIOD_WEEKLY)
TIMEFRAME_PERIOD_MAP[ONE_YEAR].push(PERIOD_MONTHLY, PERIOD_WEEKLY, PERIOD_DAILY)
TIMEFRAME_PERIOD_MAP[FIVE_YEAR].push(PERIOD_MONTHLY, PERIOD_WEEKLY)
TIMEFRAME_PERIOD_MAP[TEN_YEAR].push(PERIOD_MONTHLY)
TIMEFRAME_PERIOD_MAP[TWENTY_YEAR].push(PERIOD_MONTHLY)
TIMEFRAME_PERIOD_MAP[MAX].push(PERIOD_MONTHLY)

// chart types that can be show
export const CHART_BAR = 'bar'
export const CHART_CANDLE = 'candle'
export const CHART_LINE = 'line'

// enabled charts for the app
export const CHARTS = [
  CHART_BAR,
  CHART_CANDLE,
  CHART_LINE
]

export const INFO_MAPPING = {
  ['country']: 'Country',
  ['currency']: 'Currency',
  ['exchange']: 'Exchange',
  ['ipo']: 'IPO Date',
  ['name']: 'Name',
  ['phone']: 'Phone Number',
  ['shareOutstanding']: 'Shares Outstanding',
  ['ticker']: 'Ticker',
  ['finnhubIndustry']: 'Industry'
}

export var COMPANY_INFO = {
  ['Country']: 'N/A',
  ['Currency']: 'N/A',
  ['Exchange']: 'N/A',
  ['IPO Date']: 'N/A',
  ['Name']: 'N/A',
  ['Phone Number']: 'N/A',
  ['Shares Outstanding']: 'N/A',
  ['Ticker']: 'N/A',
  ['Industry']: 'N/A',
  ['Logo']: 'N/A'
}
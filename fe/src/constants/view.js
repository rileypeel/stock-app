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
  '1 minute': '1',
  '5 minutes': '5',
  '30 minutes': '30',
  'hourly': '60',
  'daily': 'D',
  'weekly': 'W',
  'monthly': 'M'
}

//time offsets for calculating chart labels
//spaces
export const OFFSETS = {
  '30_minutes': 60 * 30,
  '1_hour': 3600,
  '5_hours': 3600 * 5,
  '1_day': 24 * 3600,
  '1_week': 24 * 7 * 3600,
  '1_month': 24 * 3600 * 30,
  '6_month': 24 * 3600 * 182,
  '1_year': 24 * 3600 * 365,
  '5_year': 24 * 3600 * 365 * 5,
  '10_year': 24 * 3600 * 365 * 10,
  '20_year': 24 * 3600 * 365 * 20,
  'Max': 0, 
}
//period to equivalent timeout in seconds
//spaces
export const TIMEOUTS = {
  '1 minute': '60',
  '5 minutes': '300',
  '30 minutes': '1800',
  'hourly': '3600'
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

export const TIMEFRAMES = {
  ['30_minutes']: THIRTY_MINUTES,
  ['1_hour']: ONE_HOUR,
  ['5_hours']: FIVE_HOUR,
  ['1_day']: ONE_DAY,
  ['1_week']: ONE_WEEK,
  ['1_month']: ONE_MONTH,
  ['6_month']: SIX_MONTH,
  ['1_year']: ONE_YEAR,
  ['5_year']: FIVE_YEAR,
  ['10_year']: TEN_YEAR,
  ['20_year']: TWENTY_YEAR,
  ['Max']: MAX,
}

//not working 
export const TIMEFRAME_PERIOD_MAP = {
  ['30_minutes']: [],
  ['1_hour']: [],
  ['5_hours']: [],
  ['1_day']: [],
  ['1_week']: [],
  ['1_month']: [],
  ['6_month']: [],
  ['1_year']: [],
  ['5_year']: [],
  ['10_year']: [],
  ['20_year']: [],
  ['Max']: []
}
TIMEFRAME_PERIOD_MAP['30_minutes'].push(PERIOD_MINUTE, PERIOD_FIVE_MINUTE)
TIMEFRAME_PERIOD_MAP['1_hour'].push(PERIOD_MINUTE, PERIOD_FIVE_MINUTE)
TIMEFRAME_PERIOD_MAP['5_hours'].push(PERIOD_HOURLY, PERIOD_THIRTY_MINUTE, PERIOD_MINUTE, PERIOD_FIVE_MINUTE)
TIMEFRAME_PERIOD_MAP['1_day'].push(PERIOD_HOURLY, PERIOD_THIRTY_MINUTE, PERIOD_FIVE_MINUTE)
TIMEFRAME_PERIOD_MAP['1_week'].push(PERIOD_HOURLY, PERIOD_THIRTY_MINUTE)
TIMEFRAME_PERIOD_MAP['1_month'].push(PERIOD_DAILY)
TIMEFRAME_PERIOD_MAP['6_month'].push(PERIOD_DAILY, PERIOD_WEEKLY)
TIMEFRAME_PERIOD_MAP['1_year'].push(PERIOD_MONTHLY, PERIOD_WEEKLY, PERIOD_DAILY)
TIMEFRAME_PERIOD_MAP['5_year'].push(PERIOD_MONTHLY, PERIOD_WEEKLY)
TIMEFRAME_PERIOD_MAP['10_year'].push(PERIOD_MONTHLY)
TIMEFRAME_PERIOD_MAP['20_year'].push(PERIOD_MONTHLY)
TIMEFRAME_PERIOD_MAP['Max'].push(PERIOD_MONTHLY)



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

export const INDICATOR_MAPPING = {
  '0-3': 'Number of Employees',
  '0-5': 'Year Founded',
  '4-11': 'Market Cap',
  '0-64': 'Shares Outstanding',
  '1-1': 'Revenues',
  '2-41': 'Total Assets',
  '4-16': 'P/B',
  '4-27': 'Price to Free Cash flow',
  '4-14': 'P/E',
  '4-29': 'Dividends per Share',
  '4-18': 'Book Value per Share',
  '4-12': 'EPS'
}

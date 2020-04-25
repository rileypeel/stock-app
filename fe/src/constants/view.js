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

export const RESOLUTIONS = {
  '1 minute': '1',
  '5 minutes': '5',
  '30 minutes': '30',
  'hourly': '60',
  'daily': 'D',
  'weekly': 'W',
  'monthly': 'M'
}

export const TIMEOUTS = {
  '1 minute': '60',
  '5 minutes': '300',
  '30 minutes': '1800',
  'hourly': '3600'
}

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

// tickers that can be selected
export const TICKER_RMP = 'RMP'
export const TICKER_KMC = 'KMC'
export const TICKER_BS = 'BS'
export const TICKER_BJW = 'BJW'
export const TICKER_LP = 'LP'

// enabled tickers
export const TICKERS = [
  TICKER_BJW,
  TICKER_BS,
  TICKER_KMC,
  TICKER_LP,
  TICKER_RMP
]

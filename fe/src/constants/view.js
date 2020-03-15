// view config constants

// periods the view accepts
export const PERIOD_MINUTE = 'minute'
export const PERIOD_HOURLY = 'hourly'
export const PERIOD_DAILY = 'daily'
export const PERIOD_WEEKLY = 'weekly'
export const PERIOD_MONTHLY = 'monthly'
export const PERIOD_YEARLY = 'yearly'

// enabled periods for the app
export const PERIODS = [
  PERIOD_MINUTE,
  PERIOD_HOURLY,
  PERIOD_DAILY,
  PERIOD_WEEKLY,
  PERIOD_MONTHLY,
  PERIOD_YEARLY
]

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

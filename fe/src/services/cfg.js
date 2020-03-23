// constructor for a config object to hold config state for the user's view
import * as cfg from '../constants/view'

// keep a reference to use as a singleton
var obj

function Cfg() {
  obj = obj || {
    period: cfg.PERIOD_DAILY,
    count: 40,
    chart: cfg.CHART_BAR,
    exchange: 'NASDAQ',
    ticker: 'RMP',
    showLine: true,
  }

  return obj
}

export default Cfg
  
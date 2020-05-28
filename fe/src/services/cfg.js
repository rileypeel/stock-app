// ructor for a config object to hold config state for the user's view
import * as cfg from '../constants/view'


// keep a reference to use as a singleton
var obj

const chartXOffset = 20
const viewWidth = 600
const viewHeight = 300
const chartWidth = viewWidth - (chartXOffset * 2)
const rectCount = 200
const rectAndSpacingWidth = chartWidth / rectCount

const rectSpace = 1
const rectWidth = rectAndSpacingWidth - rectSpace

function Cfg() {

  obj = obj || {
    showTime: false,
    startDate: '1577836800',
    timeframe: cfg.ONE_YEAR,
    period: cfg.PERIOD_DAILY,
    count: 40,
    type: cfg.CHART_BAR,
    exchange: 'NASDAQ',
    ticker: 'RMP',
    showLine: true,
    chart: {
      viewWidth,
      viewHeight,
      chartWidth,
      chartXOffset,
      chartYOffset: 50,
      chartHeight: viewHeight,
      chartXQuartile: 93,
      chartYQuartile: 75,
      chartYAxisLabels: [0, 25, 50, 75, 100],
      chartXAxisLabels: [0, 10, 20, 30, 40],
      chartXAxisBottomLabels: [0, 10, 20, 30, 40],
      rectWidth,
      rectAndSpacingWidth,
      rectCount,
      candleWidth: 5,
      candleOffset: 3.5,
      fontSize: '12px'
    }
  }

  return obj
}

export default Cfg

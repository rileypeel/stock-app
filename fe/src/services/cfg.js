// ructor for a config object to hold config state for the user's view
import * as cfg from '../constants/view'

// keep a reference to use as a singleton
var obj

const viewWidth = 600
const chartLeftXOffset = 60
const chartRightXOffset = 60
const chartWidth = viewWidth - (chartLeftXOffset + chartRightXOffset)
const rectCount = 40
const rectAndSpacingWidth = chartWidth / rectCount

const rectSpace = 1
const rectWidth = rectAndSpacingWidth - rectSpace

function Cfg() {
  obj = obj || {
    period: cfg.PERIOD_DAILY,
    count: 40,
    type: cfg.CHART_BAR,
    exchange: 'NASDAQ',
    ticker: 'RMP',
    showLine: true,
    chart: {
      viewWidth,
      viewHeight: 300,
      chartLeftXOffset,
      charRightXOffset,
      chartWidth,
      chartYOffset: 50,
      chartHeight: 300,
      chartXQuartile: 96,
      chartYQuartile: 75,
      chartYAxisLabels: [0, 25, 50, 75, 100],
      chartXAxisLabels: [0, 10, 20, 30, 40],
      rectWidth,
      rectSpace,
      rectCount,
      rectAndSpacingWidth,
      candleWidth: 5,
      candleOffset: 3.5,
    }
  }

  return obj
}

export default Cfg
  

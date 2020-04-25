// ructor for a config object to hold config state for the user's view
import * as cfg from '../constants/view'

// keep a reference to use as a singleton
var obj

const MAX_RECT_WIDTH = 50
const MIN_RECT_WIDTH = 1
const viewWidth = 600
const chartXOffset = 20

const chartWidth = viewWidth - (chartXOffset * 2)
const rectCount = 200
const rectAndSpacingWidth = chartWidth / rectCount

const rectSpace = 1
const rectWidth = rectAndSpacingWidth - rectSpace

function Cfg() {
  obj = obj || {
    period: cfg.PERIOD_DAILY,
    startDate: '2020-01-01-0-0-0',
    count: 40,
    type: cfg.CHART_BAR,
    exchange: 'NASDAQ',
    ticker: 'RMP',
    showLine: true,
    chart: {
      viewWidth,
      viewHeight: 300,
      chartXOffset,
      chartYOffset: 50,
      chartHeight: 300,
      chartXQuartile: 96,
      chartYQuartile: 75,
      chartYAxisLabels: [0, 25, 50, 75, 100],
      chartXAxisLabels: [0, 10, 20, 30, 40],
      rectWidth,
      rectAndSpacingWidth,
      rectCount,
      candleWidth: 5,
      candleOffset: 3.5,
    },

    updateRect(dataLength) {
      var chart = this.chart
      
      chart.rectCount = dataLength

      chart.rectAndSpacingWidth = chartWidth / chart.rectCount
      chart.rectWidth = chart.rectAndSpacingWidth - rectSpace

      if(this.type != cfg.CHART_LINE) {
        if(chart.rectWidth < MIN_RECT_WIDTH) {
          chart.rectWidth = MIN_RECT_WIDTH
        }
        if(chart.rectWidth > MAX_RECT_WIDTH) {
          chart.rectWidth = MAX_RECT_WIDTH
        }
      }
    }
  }



  return obj
}

export default Cfg
  
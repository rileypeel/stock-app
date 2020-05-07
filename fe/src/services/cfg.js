// ructor for a config object to hold config state for the user's view
import * as cfg from '../constants/view'


// keep a reference to use as a singleton
var obj

<<<<<<< HEAD
const viewWidth = 600
const chartLeftXOffset = 60
const chartRightXOffset = 60
const chartWidth = viewWidth - (chartLeftXOffset + chartRightXOffset)
const rectCount = 40
=======
const chartXOffset = 20
const viewWidth = 600
const viewHeight = 300
const chartWidth = viewWidth - (chartXOffset * 2)
const rectCount = 200
>>>>>>> bellsandwhistles
const rectAndSpacingWidth = chartWidth / rectCount

const rectSpace = 1
const rectWidth = rectAndSpacingWidth - rectSpace

function Cfg() {

  obj = obj || {
    period: cfg.PERIOD_DAILY,
    showTime: false,
    startDate: '1577836800',
    count: 40,
    type: cfg.CHART_BAR,
    exchange: 'NASDAQ',
    ticker: 'RMP',
    showLine: true,
    chart: {
      viewWidth,
<<<<<<< HEAD
      viewHeight: 300,
      chartLeftXOffset,
      charRightXOffset,
      chartWidth,
=======
      viewHeight,
      chartWidth,
      chartXOffset,
>>>>>>> bellsandwhistles
      chartYOffset: 50,
      chartHeight: viewHeight,
      chartXQuartile: 93,
      chartYQuartile: 75,
      chartYAxisLabels: [0, 25, 50, 75, 100],
      chartXAxisLabels: [0, 10, 20, 30, 40],
<<<<<<< HEAD
      rectWidth,
      rectSpace,
      rectCount,
      rectAndSpacingWidth,
=======
      chartXAxisBottomLabels: [0, 10, 20, 30, 40],
      rectWidth,
      rectAndSpacingWidth,
      rectCount,
>>>>>>> bellsandwhistles
      candleWidth: 5,
      candleOffset: 3.5,
      fontSize: '12px'
    }
  }

  return obj
}

export default Cfg
<<<<<<< HEAD
  
=======
>>>>>>> bellsandwhistles

// function for returning a stock ticker view using d3
import * as d3 from 'd3'
import * as cfg from '../../constants/view'
import frame from './widgets/frame'
import bar from './widgets/bar'
import line from './widgets/line'
import candle from './widgets/candle'
import Cfg from '../cfg'

const MAX_RECT_WIDTH = 50
const MIN_RECT_WIDTH = 1

var obj

function View(init = false) {
  
  obj = obj || {
    ticker: null,
    stockData: {
      quote: 0,
      info: {}
    },
    size: 1,
    quartiles: [0,0,0,0,0],
    min: 0,
    max: 0,
    range: 0,
    canvas: null,
    cfg: Cfg(),

    setTicker(ticker) {
      // add an instance of the ticker to read data from if needed
      this.ticker = ticker
    },
    setDate(date) {
      // sets the date object in the header
      d3.select('.date').text(date)
    },
    setSize(newSize) {
      this.size = newSize
    },
    setStock(ticker) {
      // sets the view ticker
      this.cfg.ticker = ticker
      d3.select('.exchange').text(this.cfg.exchange)
      d3.select('.ticker').text(this.cfg.ticker)
    },
    setData(data) {
      if (!data.length) return
      this.updateChartSize()
      this.updateRect(data.length)
      this.calculateXLabels(data)
      this.calculateRange(data)
      this.setPastData(data)
      frame(this, true)
    },
    setPastData(data) {
      // draw previous data
      this.canvas.selectAll('.past').remove()
      this.canvas.data(data)
        .enter()
        .each((d, i) => {
          var length = data.length
          if (this.cfg.type === cfg.CHART_BAR) {
            bar(d, length, i, this)
          }
          if (this.cfg.type === cfg.CHART_CANDLE) {
            candle(d, length, i, this)
          }
          if (this.cfg.type === cfg.CHART_LINE) {
            if (i + 1 != data.length) {
              line(d, data[i + 1], length, i, this)
            } 
          }
        })
    },
    update() {
      if (this.ticker) {
        this.ticker.cfg.chartData.timeframe = this.cfg.timeframe
        this.ticker.cfg.chartData.period = this.cfg.period
        this.ticker.loadData()
      }
    },
    calculateRange(data) {
      if (!data.length) {
        this.min = 0
        this.max = 0
        this.range = 0
        return [0, 0, 0, 0, 0]
      }

      var minMax = data.reduce((acc, d) => ({
        min: acc.min === null || d.lo < acc.min ? d.lo : acc.min,
        max: acc.max === null || d.hi > acc.max ? d.hi : acc.max,
      }), { min: null, max: null })

      this.min = minMax.min
      this.max = minMax.max
      this.range = this.max - this.min

      var quarter = this.range / 4
      this.quartiles = [0, quarter, 2*quarter, 3*quarter, 4*quarter]
          .map(q => q + minMax.min)
    },
    updateChartSize() { 
      var chart = this.cfg.chart
      chart.viewWidth = 600 * this.size
      chart.viewHeight = 300 * this.size
      chart.chartYOffset = 50 * this.size
      chart.chartXQuartile = 93 * this.size
      chart.chartYQuartile = 75 * this.size
      chart.fontSize = '12px'
      chart.chartHeight = chart.viewHeight
      chart.chartWidth = chart.viewWidth - (chart.chartXOffset * 2)
    },
    updateRect(dataLength) {
      var chart = this.cfg.chart
      chart.rectCount = dataLength
      chart.rectAndSpacingWidth = chart.chartWidth / chart.rectCount
      chart.rectWidth = chart.rectAndSpacingWidth - 1
      if (this.cfg.type != cfg.CHART_LINE) {
        if (chart.rectWidth < MIN_RECT_WIDTH) {
          chart.rectWidth = MIN_RECT_WIDTH
        }
        if (chart.rectWidth > MAX_RECT_WIDTH) {
          chart.rectWidth = MAX_RECT_WIDTH
        }
      }
      chart.candleWidth = chart.rectAndSpacingWidth * 5 / 12
      chart.candleOffset = chart.rectAndSpacingWidth * 7 / 24
    },
    calculateXLabels(data) {
      var numberOfPtsPerQuartile = Math.round(this.cfg.chart.chartXQuartile/(this.cfg.chart.rectAndSpacingWidth))
      var labels = this.cfg.chart.chartXAxisLabels 
      var bottomLabels = this.cfg.chart.chartXAxisBottomLabels
      for (var i = 0; i < 5; i ++) {
        labels[i] = new Date(data[data.length - 1 - (numberOfPtsPerQuartile * (i + 1))].timestamp * 1000)
        bottomLabels[i] = labels[i].toTimeString().substr(0,8)
        labels[i] = `${labels[i].getFullYear()}/${labels[i].getMonth() + 1}/${labels[i].getDate()}` 
      }
    },
    init() {
      // initialize the view and draw the frame
      this.canvas = d3.select('#canvas')
    }
  }

  if (init) {
    obj.init()
  }

  return obj
}

export default View


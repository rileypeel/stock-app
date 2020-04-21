// function for returning a stock ticker view using d3
import * as d3 from 'd3'
import * as cfg from '../../constants/view'

import frame from './widgets/frame'
import level from './widgets/level'
import bar from './widgets/bar'
import line from './widgets/line'

import Cfg from '../cfg'

// dimensions of the view
const viewWidth = 600
//const viewHeight = 400

// dimensions of the inner chart
const chartXOffset = 60
const chartYOffset = 50
const chartHeight = 300
const chartXQuartile = 96
const chartYQuartile = 75

// data for the chart
// const chartYAxisLabels = [0, 25, 50, 75, 100]
const chartXAxisLabels = [0, 10, 20, 30, 40]

// dimensions of the graph
const rectWidth = 11
const rectAndSpacingWidth = 12
const rectCount = 40

var obj

function View(init = false) {
  obj = obj || {
    ticker: null,
    quartiles: [0,0,0,0,0],
    min: 0,
    max: 0,
    range: 0,
    canvas: null,
    cfg: Cfg(),
    // TODO(kieran) add dimensions and programmatically make the view
    setTicker(ticker) {
      // add an instance of the ticker to read data from if needed
      this.ticker = ticker
    },
    setDate(date) {
      // sets the date object in the header
      d3.select('.date').text(date)
    },
    setStock() {
      // sets the view ticker
      d3.select('.exchange').text(this.cfg.exchange)
      d3.select('.ticker').text(this.cfg.ticker)
    },
    setCurrentData(data) {
      // remove old data and draw the current data
      this.canvas.selectAll('.current').remove()
      if (this.cfg.showLine) {
        level(data, this.canvas)
      }
      if (this.cfg.chart === cfg.CHART_BAR) {
        bar(data, this.canvas)
      }
      if (this.cfg.chart === cfg.CHART_LINE) {
        var pastData = this.ticker.getPastData()
        if (pastData.length) {
          line(data, pastData[pastData.length - 1], this.canvas)
        }
      }
    },
    setPastData(data) {
      // draw previous data
      this.canvas.selectAll('.past').remove()
      this.canvas.data(data)
        .enter()
        .each((d, i) => {
          var offset = data.length - i
          if (this.cfg.chart === cfg.CHART_BAR) {
            bar(d, this.canvas, offset)
          }
          if (this.cfg.chart === cfg.CHART_LINE) {
            if (i + 1 != data.length) {
              line(d, data[i + 1], this.canvas, offset - 1)
            } 
          }
        })
    },
    update() {
      // update the graph to match settings
      // TODO(kieran) pass in parameters to specifically update
      this.setPastData(this.ticker.getPastData())
      this.setCurrentData(this.ticker.getCurrentData())
      this.setStock()
    },
    calculateRange(data) {
      if (!data.length) {
        this.min = 0
        this.max = 0
        this.range = 0

        return [0, 0, 0, 0, 0]
      }

      var minMax = data.reduce((acc, d) => ({
        min: !acc.min || d.lo < acc.min ? d.lo : acc.min,
        max: !acc.max || d.hi > acc.max ? d.hi : acc.max,
      }), {})

      this.min = minMax.min
      this.max = minMax.max
      this.range = this.max - this.min

      var quarter = this.range / 4
      this.quartiles = [0, quarter, 2*quarter, 3*quarter, 4*quarter]
          .map(q => q + minMax.min)
    },
    init() {
      // initialize the view and draw the frame
      this.canvas = d3.select('#canvas')
      frame(this.canvas)
      this.setStock()
    }
  }

  if (init) {
    obj.init()
  }

  return obj
}

export default View

      /*
      // draw the bars
      var canvas = this.canvas
      var max = this.max
      var range = this.range

      canvas.selectAll('rect').remove()
      canvas.selectAll('rect')
        .data(data)
        .enter()
        .each(function(d, i) {
          var diff = max - d.hi
          var diffNormalized = chartYOffset + ((diff / range) * chartHeight)
          var spread = d.hi - d.lo
          var spreadNormalized = (spread / range) * chartHeight 

          canvas.append('rect')
            .attr('class', '.past')
            .attr('fill', 'green')
            .attr('width', rectWidth)
            .attr('height', spreadNormalized)
            .attr('x', chartXOffset + ((rectCount - (data.length - i)) * rectAndSpacingWidth))
            .attr('y', diffNormalized)
        })
    },
    setData(data) {
      if (!data.length) return
      var past = data.slice(0, data.length - 1)
      this.calculateRange(past)
      this.drawFrame()
      //var current = data.slice(-1)[0]
      //this.setCurrentData(current)
      this.setPastData(past)
    },
    drawCurrent(data) {
      // draw the line
      this.canvas.append('line')
        .attr('class', 'current')
        .style('stroke', 'red')
        .style('stroke-width', 0.5)
        .attr('x1', 0)
        .attr('y1', data ? (data.y * 3) + chartYOffset : (chartHeight + chartYOffset) / 2)
        .attr('x2', viewWidth)
        .attr('y2', data ? (data.y * 3) + chartYOffset : (chartHeight + chartYOffset) / 2)

      this.canvas.append('text')
        .attr('class', 'current')
        .attr('x', chartXOffset + (rectAndSpacingWidth * rectCount) + 40)
        .attr('y', data ? (data.y * 3) + 46 : (chartHeight + chartYOffset) / 2)
        .attr('fill', 'red')
        .text(`${(100 - data.y).toFixed(2)}$`)

      this.canvas.append('rect')
        .attr('class', '.past')
        .attr('fill', 'green')
        .attr('width', rectWidth)
        .attr('height', ((data.hi - data.lo) * 3))
        .attr('x', chartXOffset + (rectAndSpacingWidth * rectCount))
        .attr('y', (data.lo * 3) + chartYOffset)

    },
    drawFrame() {
      // draw the frame around the stonkberg
      var canvas = this.canvas
      var quartiles = this.quartiles

      canvas.selectAll('.y').remove()

      canvas.selectAll('.y')
        .data(quartiles)
        .enter()
        .each(function(d, i) {
          // draw the left axis ticks
          canvas.append('line')
            .style('stroke', 'grey')
            .style('stroke-width', 1)
            .attr('class', 'y')
            .attr('x1', 0)
            .attr('y1', chartYOffset + (chartHeight - (i * chartYQuartile)))
            .attr('x2', !i ? viewWidth : i % 2 ? 10 : 20)
            .attr('y2', chartYOffset + (chartHeight - (i * chartYQuartile)))

          // draw the left axis labels
          canvas.append('text')
            .attr('class', 'y')
            .attr('x', 5)
            .attr('y', 45 + (chartHeight - (i * chartYQuartile)))
            .attr('fill', 'grey')
            .text(`${d.toFixed(0)}${i === 4 ? '$' : ' '}`)
        })

      canvas.selectAll('.x')
        .data(chartXAxisLabels)
        .enter()
        .each(function(d, i) {
          // draw the bottom axis ticks
          canvas.append('line')
            .style('stroke', '#222222')
            .style('stroke-width', 1)
            .attr('x1', chartXOffset + (chartXQuartile * (chartXAxisLabels.length - i)))
            .attr('y1', chartYOffset)
            .attr('x2', chartXOffset + (chartXQuartile * (chartXAxisLabels.length - i)))
            .attr('y2', chartYOffset + chartHeight)

          // draw the bottom axis labels 
          canvas.append('text')
            .attr('x', chartXOffset + (chartXQuartile * (chartXAxisLabels.length - i)))
            .attr('y', chartYOffset + chartHeight + 20)
            .attr('fill', 'dimgrey')
            .text(`+${d}s`)
            .text(`+${d}${!i ? 's' : ' '}`)

        })
>>>>>>> 8da754e92845c7d81799f3f85f8ecaa3cc228d88

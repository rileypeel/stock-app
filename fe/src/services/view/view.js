// function for returning a stock ticker view using d3
import * as d3 from 'd3'
import * as cfg from '../../constants/view'

import frame from './widgets/frame'
import level from './widgets/level'
import bar from './widgets/bar'
import line from './widgets/line'

import Cfg from '../cfg'

var obj

function View(init = false) {
  obj = obj || {
    ticker: null,
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
    setStock(exchange, ticker) {
      // sets the view ticker
      this.cfg.ticker = ticker
      d3.select('.exchange').text(exchange)
      d3.select('.ticker').text(ticker)
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
      this.canvas//.selectAll('rect')
        .data(data)
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
      this.setPastData(this.ticker.getPastData())
      this.setCurrentData(this.ticker.getCurrentData())
    },
    init() {
      // initialize the view and draw the frame
      this.canvas = d3.select('#canvas')
      frame(this.canvas)
    }
  }

  if (init) {
    obj.init()
  }

  return obj
}

export default View
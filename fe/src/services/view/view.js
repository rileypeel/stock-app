// function for returning a stock ticker view using d3
import * as d3 from 'd3'
import * as cfg from '../../constants/view'

import frame from './widgets/frame'
import line from './widgets/line'
import bar from './widgets/bar'

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
    setStock() {
      // sets the view ticker
      d3.select('.exchange').text(this.cfg.exchange)
      d3.select('.ticker').text(this.cfg.ticker)
    },
    setCurrentData(data) {
      // remove old data and draw the current data
      this.canvas.selectAll('.current').remove()
      if (this.cfg.showLine) {
        line(data, this.canvas)
      }
      if (this.cfg.chart === cfg.CHART_BAR) {
        bar(data, this.canvas)
      }
    },
    setPastData(data) {
      // draw previous data
      this.canvas.selectAll('rect').remove()
      this.canvas.selectAll('rect')
        .data(data)
        .enter()
        .each((d, i) => {
          var offset = data.length - i
          if (this.cfg.chart === cfg.CHART_BAR) {
            bar(d, this.canvas, offset)
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
// function for returning a stock ticker view using d3
import * as d3 from 'd3'
import * as cfg from '../../constants/view'

import frame from './widgets/frame'
//import level from './widgets/level'
import bar from './widgets/bar'
import line from './widgets/line'

import Cfg from '../cfg'

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
    setData(data) {
      if (!data.length) return
      // var past = data.slice(0, data.length - 1)
      var past = this.ticker.getPastData()
      this.calculateRange(past)
      frame(this)
      //var current = data.slice(-1)[0]
      //this.setCurrentData(current)
      this.setPastData(past)
    },
    /*
    setCurrentData(data) {
      // remove old data and draw the current data
      this.canvas.selectAll('.current').remove()
      if (this.cfg.showLine) {
        level(data, this.canvas)
      }
      if (this.cfg.type === cfg.CHART_BAR) {
        bar(data, this.canvas)
      }
      if (this.cfg.type === cfg.CHART_LINE) {
        var pastData = this.ticker.getPastData()
        if (pastData.length) {
          line(data, pastData[pastData.length - 1], this.canvas)
        }
      }
    },
    */
    setPastData(data) {
      // draw previous data
      this.canvas.selectAll('.past').remove()
      this.canvas.data(data)
        .enter()
        .each((d, i) => {
          var length = data.length
          var offset = length - i
          if (this.cfg.type === cfg.CHART_BAR) {
            bar(d, length, i, this, offset)
          }
          if (this.cfg.type === cfg.CHART_LINE) {
            if (i + 1 != data.length) {
              line(d, data[i + 1], length, i, this)
            } 
          }
        })
    },
    update() {
      // update the graph to match settings
      // TODO(kieran) pass in parameters to specifically update
      frame(this, true)
      this.setPastData(this.ticker.getPastData())
      //this.setCurrentData(this.ticker.getCurrentData())
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
    init() {
      // initialize the view and draw the frame
      this.canvas = d3.select('#canvas')
      frame(this, true)
      this.setStock()
    }
  }

  if (init) {
    obj.init()
  }

  return obj
}

export default View


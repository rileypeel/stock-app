// function for returning a stock ticker view using d3
import * as d3 from 'd3'

function View() {
  var view = {
    canvas: null,
    // TODO(kieran) add dimensions and programmatically make the view
    setDate(dateString) {
      // sets the date object in the header
      d3.select('#date').text(dateString)
    },
    setStock(exchangeString, tickerString) {
      // sets the view ticker
      d3.select('#exchange').text(exchangeString)
      d3.select('#ticker').text(tickerString)
    },
    setCurrentData(data) {
      // draw the current data line
      this.canvas.selectAll('.current').remove()
      this.drawCurrent(data)
    },
    setPastData(data) {
      // draw the bars
      var canvas = this.canvas
      canvas.selectAll('rect').remove()
      canvas.selectAll('rect')
        .data(data)
        .enter()
        .each(function(d, i) {
          canvas.append('rect')
            .attr('class', '.past')
            .attr('fill', 'green')
            .attr('width', 11)
            .attr('height', ((d.hi - d.lo) * 3))
            .attr('x', 36 + ((40 - (data.length - i)) * 12))
            .attr('y', (d.lo * 3) + 50)
        })
    },
    drawCurrent(data) {
      // draw the line
      this.canvas.append('line')
        .attr('class', 'current')
        .style('stroke', 'red')
        .style('stroke-width', 0.5)
        .attr('x1', 0)
        .attr('y1', data ? (data.y * 3) + 50 : 175)
        .attr('x2', 600)
        .attr('y2', data ? (data.y * 3) + 50 : 175)

      this.canvas.append('text')
        .attr('class', 'current')
        .attr('x', 556)
        .attr('y', data ? (data.y * 3) + 46 : 175)
        .attr('fill', 'red')
        .text(`${(100 - data.y).toFixed(2)}$`)

      this.canvas.append('rect')
        .attr('class', '.past')
        .attr('fill', 'green')
        .attr('width', 11)
        .attr('height', ((data.hi - data.lo) * 3))
        .attr('x', 516)
        .attr('y', (data.lo * 3) + 50)

    },
    drawFrame() {
      // draw the frame around the stonkberg
      var canvas = this.canvas
      canvas.selectAll('.x')
        .data([0, 25, 50, 75, 100])
        .enter()
        .each(function(d, i) {
          canvas.append('line')
            .style('stroke', 'grey')
            .style('stroke-width', 1)
            .attr('x1', 0)
            .attr('y1', 50 + (300 - (i * 75)))
            .attr('x2', !i ? 600 : i % 2 ? 10 : 20)
            .attr('y2', 50 + (300 - (i * 75)))

          canvas.append('text')
            .attr('x', 5)
            .attr('y', 45 + (300 - (i * 75)))
            .attr('fill', 'grey')
            .text(`${d}${i === 4 ? '$' : ' '}`)
        })

      canvas.selectAll('.y')
        .data([0, 10, 20, 30, 40])
        .enter()
        .each(function(d, i) {
          canvas.append('line')
            .style('stroke', '#222222')
            .style('stroke-width', 1)
            .attr('x1', 48 + (96 * (5 - i)))
            .attr('y1', 50)
            .attr('x2', 48 + (96 * (5 - i)))
            .attr('y2', 350)

          canvas.append('text')
            .attr('x', 36 + (96 * (5 - i)))
            .attr('y', 370)
            .attr('fill', 'dimgrey')
            .text(`+${d}s`)
            .text(`+${d}${!i ? 's' : ' '}`)

        })
    },
    init() {
      // initialize the view
      this.canvas = d3.select('#canvas')
      this.drawFrame()
    }
  }

  view.init()

  return view
}

export default View
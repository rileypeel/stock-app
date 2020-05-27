// draws a frame out given a canvas object
import * as constants from '../../../constants/view'
// draw the legend on the y axis
function drawYAxis(view) {
  var canvas = view.canvas
  var quartiles = view.quartiles
  var c = view.cfg.chart
  
  canvas.selectAll('.y').remove()
  var decPlaces = 0 
  if (quartiles[quartiles.length-1] - quartiles[0] < 4) decPlaces = 2
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
        .attr('y1', c.chartYOffset + (c.chartHeight - (i * c.chartYQuartile)))
        .attr('x2', !i ? c.viewWidth : i % 2 ? 10 : 20)
        .attr('y2', c.chartYOffset + (c.chartHeight - (i * c.chartYQuartile)))
      // draw the left axis labels
      canvas.append('text')
        .attr('class', 'y')
        .attr('x', 5)
        .attr('y', 45 + (c.chartHeight - (i * c.chartYQuartile)))
        .attr('fill', 'grey')
        .text(`${d.toFixed(decPlaces)}${i === 4 ? '$' : ' '}`)
    })
}

// draw the legend on the x axis
function drawXAxis(view) {
  var canvas = view.canvas
  var c = view.cfg.chart
  var timeLabelY = 35
  canvas.selectAll('.x').remove()
  canvas.selectAll('.x')
    .data(c.chartXAxisLabels)
    .enter()
    .each(function(d, i) {
      // draw the bottom axis ticks
      canvas.append('line')
        .style('stroke', '#222222')
        .style('stroke-width', 1)
        .attr('x1', c.chartXOffset + (c.chartXQuartile * (c.chartXAxisLabels.length - i)))
        .attr('y1', c.chartYOffset)
        .attr('x2', c.chartXOffset + (c.chartXQuartile * (c.chartXAxisLabels.length - i)))
        .attr('y2', c.chartYOffset + c.chartHeight)
      
      // draw the bottom axis labels 
      if (view.size == 1) {
        canvas.append('text')
          .attr('x', c.chartXOffset + (c.chartXQuartile * (c.chartXAxisLabels.length - i)) - 30)
          .attr('y', c.chartYOffset + c.chartHeight + 20)
          .attr('class', 'x')
          .attr('fill', 'dimgrey')
          .attr('font-size', c.fontSize)
          .attr('font-weight', 'light')
          .text(d)
      }
      if (view.size < 1) {
        timeLabelY = 20
        if (i % 2 == 1) c.chartXAxisBottomLabels[i] = ''
      }
      if (constants.SHORT_PERIODS.includes(view.cfg.period)) { 
        canvas.append('text')
          .attr('x', c.chartXOffset + (c.chartXQuartile * (c.chartXAxisLabels.length - i)) - 30)
          .attr('y', c.chartYOffset + c.chartHeight + timeLabelY)
          .attr('class', 'x')
          .attr('fill', 'dimgrey')
          .attr('font-size', c.fontSize)
          .attr('font-weight', 'light')
          .text(c.chartXAxisBottomLabels[i])
      }
    })
}

// draw the axes
function draw(view, reframeX = false) {
  drawYAxis(view)
  reframeX && drawXAxis(view)
}

export default draw
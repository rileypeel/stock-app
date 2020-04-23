// functions for drawing candlesticks on a chart representing stock ranges 
function draw(data, length, index, view) {
  var canvas = view.canvas
  var max = view.max
  var range = view.range
  var c = view.cfg.chart

  var upper = max - data.hi
  var upperNormalized = c.chartYOffset + ((upper / range) * c.chartHeight)
  var lower = max - data.lo
  var lowerNormalized = c.chartYOffset + ((lower / range) * c.chartHeight)

  var innerDiff = max - Math.max(data.open, data.close)
  var innerDiffNormalized = c.chartYOffset + ((innerDiff / range) * c.chartHeight)
  var innerSpread = Math.abs(data.open - data.close)
  var innerSpreadNormalized = (innerSpread / range) * c.chartHeight

  var avg = max - data.avg
  var avgNormalized = c.chartYOffset + ((avg / range) * c.chartHeight)

  var color = data.open > data.close ? 'red' : 'green'

  // diff is max
  // spread is min
  // rect is abs (open - close) 
  // mean is avg
  // color is open > close ? green : red

  // open/close spread
  canvas.append('rect')
    .attr('class', 'past')
    .attr('fill', color)
    .attr('width', c.candleWidth)
    .attr('height', innerSpreadNormalized)
    .attr('x', c.chartXOffset + c.candleOffset + ((c.rectCount - (length - index)) * c.rectAndSpacingWidth))
    .attr('y', innerDiffNormalized)

  // avg
  canvas.append('line')
    .attr('class', 'past')
    .style('stroke', 'lightgrey')
    .style('stroke-width', 2)
    .attr('x1', c.chartXOffset + ((c.rectCount - (length - index)) * c.rectAndSpacingWidth))
    .attr('x2', c.chartXOffset + ((c.rectCount - (length - (index + 1))) * c.rectAndSpacingWidth))
    .attr('y1', avgNormalized)
    .attr('y2', avgNormalized)

  // upper
  canvas.append('line')
    .attr('class', 'past')
    .style('stroke', 'lightgrey')
    .style('stroke-width', 0.5)
    .attr('x1', c.chartXOffset + ((c.rectCount - (length - index)) * c.rectAndSpacingWidth))
    .attr('x2', c.chartXOffset + ((c.rectCount - (length - (index + 1))) * c.rectAndSpacingWidth))
    .attr('y1', upperNormalized)
    .attr('y2', upperNormalized)

  canvas.append('line')
    .attr('class', 'past')
    .style('stroke', 'lightgrey')
    .style('stroke-width', 0.5)
    .attr('x1', c.chartXOffset + (c.rectAndSpacingWidth / 2) + ((c.rectCount - (length - index)) * c.rectAndSpacingWidth))
    .attr('x2', c.chartXOffset + (c.rectAndSpacingWidth / 2) + ((c.rectCount - (length - index)) * c.rectAndSpacingWidth))
    .attr('y1', upperNormalized)
    .attr('y2', innerDiffNormalized)

  // lower 
  canvas.append('line')
    .attr('class', 'past')
    .style('stroke', 'lightgrey')
    .style('stroke-width', 0.5)
    .attr('x1', c.chartXOffset + ((c.rectCount - (length - index)) * c.rectAndSpacingWidth))
    .attr('x2', c.chartXOffset + ((c.rectCount - (length - (index + 1))) * c.rectAndSpacingWidth))
    .attr('y1', lowerNormalized)
    .attr('y2', lowerNormalized)

  canvas.append('line')
    .attr('class', 'past')
    .style('stroke', 'lightgrey')
    .style('stroke-width', 0.5)
    .attr('x1', c.chartXOffset + (c.rectAndSpacingWidth / 2) + ((c.rectCount - (length - index)) * c.rectAndSpacingWidth))
    .attr('x2', c.chartXOffset + (c.rectAndSpacingWidth / 2) + ((c.rectCount - (length - index)) * c.rectAndSpacingWidth))
    .attr('y2', innerDiffNormalized + innerSpreadNormalized)
    .attr('y1', lowerNormalized)



}

export default draw
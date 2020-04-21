// functions for drawing line graphs
function draw(curr, prev, length, index, view) {
  var canvas = view.canvas
  var max = view.max
  var range = view.range
  var c = view.cfg.chart

  var prevDiff = max - prev.avg
  var prevDiffNormalized = c.chartYOffset + ((prevDiff / range) * c.chartHeight)
  var currDiff = max - curr.avg
  var currDiffNormalized = c.chartYOffset + ((currDiff / range) * c.chartHeight)

  canvas.append('line')
    .attr('class', 'past')
    .style('stroke', 'green')
    .style('stroke-width', 3)
    .attr('x1', c.chartXOffset + (((c.rectCount + 1) - (length - (index + 1))) * c.rectAndSpacingWidth))
    .attr('x2', c.chartXOffset + (((c.rectCount + 1) - (length - index)) * c.rectAndSpacingWidth))
    .attr('y1', prevDiffNormalized)
    .attr('y2', currDiffNormalized)
}

export default draw
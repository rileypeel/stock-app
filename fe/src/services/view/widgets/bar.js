// functions for drawing bars on a chart representing stock hi/lo's 
function drawBar(data, length, index, view) {
  var canvas = view.canvas
  var max = view.max
  var range = view.range
  var c = view.cfg.chart
  var diff = max - data.hi
  var diffNormalized = c.chartYOffset + ((diff / range) * c.chartHeight)
  var spread = data.hi - data.lo
  var spreadNormalized = (spread / range) * c.chartHeight 

  canvas.append('rect')
    .attr('class', 'past')
    .attr('fill', 'green')
    .attr('width', c.rectWidth)
    .attr('height', spreadNormalized)
    .attr('x', c.chartXOffset + ((c.rectCount - (length - index)) * c.rectAndSpacingWidth))
    .attr('y', diffNormalized)
}

function draw(data, length, index, view) {
  drawBar(data, length, index, view)
}

export default draw
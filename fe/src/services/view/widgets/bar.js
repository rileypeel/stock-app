// functions for drawing bars on a chart representing stock hi/lo's 
function drawBar(data, canvas, offset) {
  var isPast = offset !== null
  canvas.append('rect')
    .attr('class', isPast ? '.past' : '.current')
    .attr('fill', 'green')
    .attr('width', 11)
    .attr('height', ((data.hi - data.lo) * 3))
    .attr('x', 36 + (isPast ? ((40 - offset) * 12) : 480))
    .attr('y', (data.lo * 3) + 50)
}

function draw(data, canvas, offset = null) {
  drawBar(data, canvas, offset)
}

export default draw
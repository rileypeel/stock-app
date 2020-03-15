// functions for drawing line graphs
function drawLine(curr, prev, canvas, offset) {
  var isPast = offset !== null
  var x = 36 + (isPast ? ((40 - offset) * 12) : 480)
  canvas.append('line')
    .attr('class', isPast ? 'past' : 'current')
    .style('stroke', 'green')
    .style('stroke-width', 3)
    .attr('x1', x + (isPast ? 0 : 12))
    .attr('y1', ((isPast ? curr.avg : curr.y) * 3) + 50)
    .attr('x2', x + (isPast? 12 : 0))
    .attr('y2', (prev.avg * 3) + 50)
}

function draw(curr, prev, canvas, offset = null) {
  drawLine(curr, prev, canvas, offset)
}

export default draw
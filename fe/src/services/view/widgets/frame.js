// draws a frame out given a canvas object

// draw the legend on the y axis
function drawYAxis(canvas) {
  canvas.selectAll('.y')
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
}

// draw the legend on the x axis
function drawXAxis(canvas) {
  canvas.selectAll('.x')
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
}

// draw the axes
function draw(canvas) {
  drawXAxis(canvas)
  drawYAxis(canvas)
}

export default draw
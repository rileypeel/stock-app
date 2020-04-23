// functions for drawing the current level of a stock as a horizontal line 

// draw the current level as a red line
function drawLine(data, canvas) {
  canvas.append('line')
    .attr('class', 'current')
    .style('stroke', 'red')
    .style('stroke-width', 0.5)
    .attr('x1', 0)
    .attr('y1', data ? (data.y * 3) + 50 : 175)
    .attr('x2', 600)
    .attr('y2', data ? (data.y * 3) + 50 : 175)
}

// render the current level numerically 
function drawLabel(data, canvas) {
  canvas.append('text')
    .attr('class', 'current')
    .attr('x', 556)
    .attr('y', data ? (data.y * 3) + 46 : 175)
    .attr('fill', 'red')
    .text(`${(100 - data.y).toFixed(2)}$`)
}

// render the current level
function draw(data, canvas) {
  drawLine(data, canvas)
  drawLabel(data, canvas)
}

export default draw

/*
    drawCurrent(data) {
      // draw the line
      this.canvas.append('line')
        .attr('class', 'current')
        .style('stroke', 'red')
        .style('stroke-width', 0.5)
        .attr('x1', 0)
        .attr('y1', data ? (data.y * 3) + chartYOffset : (chartHeight + chartYOffset) / 2)
        .attr('x2', viewWidth)
        .attr('y2', data ? (data.y * 3) + chartYOffset : (chartHeight + chartYOffset) / 2)

      this.canvas.append('text')
        .attr('class', 'current')
        .attr('x', chartXOffset + (rectAndSpacingWidth * rectCount) + 40)
        .attr('y', data ? (data.y * 3) + 46 : (chartHeight + chartYOffset) / 2)
        .attr('fill', 'red')
        .text(`${(100 - data.y).toFixed(2)}$`)

      this.canvas.append('rect')
        .attr('class', '.past')
        .attr('fill', 'green')
        .attr('width', rectWidth)
        .attr('height', ((data.hi - data.lo) * 3))
        .attr('x', chartXOffset + (rectAndSpacingWidth * rectCount))
        .attr('y', (data.lo * 3) + chartYOffset)
    },
*/

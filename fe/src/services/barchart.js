import * as d3 from 'd3'

function barChart(data) {
  console.log(data)
  delete data.symbol
  delete data.period
  const div = d3.select("#chart")
      .style("font", "10px sans-serif")
      .style("text-align", "right")
      .style("color", "white");

  console.log(div)
  div.selectAll("div")
    .data(data)
    .join("div")
      .style("background", "steelblue")
      .style("padding", "3px")
      .style("margin", "1px")
      .style("width", d => {
        console.log(d)
        return `${d * 10}px`
      })
      .text(d => d);
  
  console.log(div.node())
  return div.node();
}

export default barChart;
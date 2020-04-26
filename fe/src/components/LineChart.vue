<template>
  <div id="view">
    <svg id="canvas"></svg>
  </div>
</template>

<script>
import View from '../services/view/view'
import Ticker from '../services/realTicker.js'
import { CHART_LINE } from '../constants/view'

export default {
  name: "Ticker",
  components: {
    
  },
  mounted() {
    var ticker = Ticker('SPY')
    var view = View(true)
    view.setTicker(this.ticker)
    ticker.subscribe(view)
    view.cfg.type = CHART_LINE
    ticker.startDate = '2020-03-01-0-0-0'
    ticker.realTime = false
  }
}
</script>

<style>
#view {
  font-family: 'VT323', monospace;
  color: white;
}
#canvas {
  width: 600px;
  height: 400px;
  background: black;
  display: block;
}

</style>
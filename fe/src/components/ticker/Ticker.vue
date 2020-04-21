<template>
  <div id="view">
    <Header/>
    <svg id="canvas"></svg>
    <Options/>
  </div>
</template>

<script>
import View from '../../services/view/view'
import Ticker from '../../services/fakeTicker'

import Header from './Header.vue'
import Options from './Options.vue'

export default {
  name: "Ticker",
  components: {
    Header,
    Options 
  },
  mounted() {
    var ticker = Ticker()
    var view = View(true)
    view.setTicker(ticker)
    ticker.subscribe(view)
  },
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
<template>
  <div id="view">
    <Header/>
    <svg id="canvas"></svg>
    <Options/>
  </div>
</template>

<script>
import View from '../../services/view/view'
import Ticker from '../../services/realTicker.js'
import Header from './Header.vue'
import Options from './Options.vue'

export default {
  name: "Ticker",
  components: {
    Header,
    Options
  },
  data () {
    return {
      ticker: ''
    }
  },
  props: {
    tickerSym: {
      type: String, 
      default: 'TSLA'
    }
  },
  mounted() {
    this.ticker = Ticker(this.tickerSym)
    var view = View(true)
    view.setTicker(this.ticker)
    this.ticker.subscribe(view)
  },

  destroyed() {
    this.ticker.halt()
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
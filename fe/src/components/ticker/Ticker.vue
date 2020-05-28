<template>
  <div id="view">
    <el-row v-if="showOptions">
      <Options/>
    </el-row>
    <el-row>
      <Header :size="size" />
      <svg v-bind:style="styleObject" id="canvas"></svg>
    </el-row>
  </div>
</template>

<script>
import View from '../../services/view/view'
import Header from './Header.vue'
import Options from './Options.vue'
import * as constants from '../../constants/view'
export default {
  name: "Ticker",
  components: {
    Header,
    Options
  },
  data () {
    return {
    }
  },
  props: {
    ticker: {
      type: Object,
      default: null
    },
    stockSymbol: {
      type: String, 
      default: 'TSLA'
    },
    showOptions: {
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default: 1
    }
  },
  mounted() {
    
    var view = View(true, this.size)
    view.setSize(this.size)
    this.ticker.subscribe(view)
    view.setTicker(this.ticker)
    if (this.size < 1) {
      view.cfg.type = 'line' 
      view.cfg.period = constants.PERIOD_FIVE_MINUTE
      view.cfg.timeframe = constants.ONE_DAY 
      view.update()
    }
    
  },
  computed: {
    styleObject: function() {
      var width = 600 * this.size
      var height = 100 + (300 * this.size)
      return {
        height: `${height}px`,
        width: `${width}px`
      }
    }
  }
}
</script>

<style>
#view {
  font-family: 'VT323', monospace;
  color: black;
  margin: 20px;
}

#canvas {
  background: black;
  display: block;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 8);
  margin-bottom: 20px;
}
</style>
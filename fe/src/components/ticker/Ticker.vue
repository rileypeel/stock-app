<template>
  <div id="view">
    <div v-if="showOptions">
      <DatePeriodSelect/>
    </div>
    <el-row>
      <el-col :span="18">
        <Header :small="small" />
        <svg v-bind:class="classObject" id="canvas"></svg>
      </el-col>
      <el-col :span="4" >
        <div v-if="showOptions">
          <Options/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import View from '../../services/view/view'
import Ticker from '../../services/realTicker.js'
import Header from './Header.vue'
import Options from './Options.vue'
import DatePeriodSelect from './DatePeriodSelect.vue'

export default {
  name: "Ticker",
  components: {
    Header,
    Options,
    DatePeriodSelect
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
    },
    showOptions: {
      type: Boolean,
      default: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    var view = View(true, this.small)
    this.ticker = Ticker(this.tickerSym, this.small)
    this.ticker.subscribe(view)
    view.setTicker(this.ticker)
    view.cfg.period = this.ticker.cfg.period
    view.cfg.startDate = this.ticker.cfg.startDate //do this in view RILEY 
    if(this.small) {
      view.cfg.type = 'line' 
    }
  },
  computed: {
    classObject: function() {
      return {
        sml: this.small,
        lg: !this.small
      }
    }
  },
  destroyed() {
    this.ticker.halt()
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

.lg {
  width: 600px;
  height: 400px;
}

.sml {
  width: 400px;
  height: 275px;
}
</style>
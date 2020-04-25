<template>
  <div class="options">
    <el-row>
      <el-col :span="8">
        <DatePicker />
      </el-col>  
      <el-col :span="4" >
        <div class="option">
          <label class="option-label">Period</label>
          <select class="option-period"
              v-model="period" @change="setPeriod">
            <option v-for="p in periods" :key="p" :value="p">{{p}}</option>
          </select>
        </div>
      </el-col>
      <el-col :span="4">  
        <div class="option">
          <label class="option-label">Line</label>
          <input class="option-show-line" type="checkbox"
              v-model="showLine" @change="setLine"/>
        </div>
      </el-col>
      <el-col :span="4">  
        <div class="option">
          <label class="option-label">Chart</label>
          <select class="option-chart"
              v-model="chart" @change="setChart">
            <option v-for="c in charts" :key="c" :value="c">{{c}}</option>
          </select>
        </div>
      </el-col>  
    </el-row>
  </div>
</template>

<script>
import { PERIODS, CHARTS, TICKERS } from '../../constants/view'
import DatePicker from './DatePicker.vue'
import Cfg from '../../services/cfg'
import View from '../../services/view/view'

export default {
  name: 'Options',
  components: {
    DatePicker
  },
  data() {
    var cfg = Cfg()
    var view = View()
    return {
      view,
      cfg,
      periods: PERIODS,
      charts: CHARTS,
      tickers: TICKERS,
      period: cfg.period,
      count: cfg.count,
      ticker: cfg.ticker,
      showLine: cfg.showLine,
      staticOrReal: '',
      chart: cfg.type,
    }
  },
  methods: {
    // TODO(kieran) Change these so they don't call view update directly
    setPeriod() {
      this.cfg.period = this.period
      this.view.update()
    },
    setLine() {
      this.cfg.showLine = this.showLine
      this.view.update()
    },
    setChart() {
      this.cfg.type = this.chart
      this.view.update()
    }
  }
}
</script>

<style>
.options {
  color: black;
  float: left;
}

.option {
  display: inline-block;
  margin-right: 10px;
}

.option-label {
  font-weight: bold;
  display: inline-block;
  margin-right: 5px;
}

.option-count {
  width: 40px;
}
</style>
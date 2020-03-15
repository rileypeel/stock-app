<template>
  <div class="options">
    <div class="option">
      <label class="option-label">Period</label>
      <select class="option-period"
          v-model="period" @change="setPeriod">
        <option v-for="p in periods" :key="p" :value="p">{{p}}</option>
      </select>
    </div>
    <div class="option">
      <label class="option-label">Count</label>
      <input class="option-count" v-model.number="count"
          type="number" @change="setCount"/>
    </div>
    <div class="option">
      <label class="option-label">Line</label>
      <input class="option-show-line" type="checkbox"
          v-model="showLine" @change="setLine"/>
    </div>
    <div class="option">
      <label class="option-label">Chart</label>
      <select class="option-chart"
          v-model="chart" @change="setChart">
        <option v-for="c in charts" :key="c" :value="c">{{c}}</option>
      </select>
    </div>
  </div>
</template>

<script>
import { PERIODS, CHARTS } from '../../constants/view'

import Cfg from '../../services/cfg'
import View from '../../services/view/view'

export default {
  name: 'Options',
  data() {
    var cfg = Cfg()
    var view = View()
    return {
      view,
      cfg,
      periods: PERIODS,
      charts: CHARTS,
      period: cfg.period,
      count: cfg.count,
      showLine: cfg.showLine,
      chart: cfg.chart,
    }
  },
  methods: {
    // TODO(kieran) Change these so they don't call view update directly
    setPeriod() {
      this.cfg.period = this.period
      this.view.update()
    },
    setCount() {
      this.cfg.count = this.count
      this.view.update()
    },
    setLine() {
      this.cfg.showLine = this.showLine
      this.view.update()
    },
    setChart() {
      this.cfg.chart = this.chart
      this.view.update()
    }
  }
}
</script>

<style>
.options {
  color: black;
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
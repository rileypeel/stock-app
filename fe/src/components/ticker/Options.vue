<template>
  <div class="options">
    <el-row class="option"> 
      <label class="option-label">Line</label>
      <el-checkbox  class="option-show-line" type="checkbox"
        v-model="showLine" @change="setLine"></el-checkbox>    
    </el-row>
    <el-row class="option">
      <label class="option-label">Chart</label>
      <el-select class="option-chart"
        v-model="chart" @change="setChart">
        <el-option v-for="c in charts" :key="c" :value="c">{{c}}</el-option>
      </el-select>
    </el-row>
  </div>
</template>

<script>
import { CHARTS } from '../../constants/view'
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
      charts: CHARTS,
      showLine: cfg.showLine,
      chart: cfg.type,
    }
  },
  methods: {
    // TODO(kieran) Change these so they don't call view update directly
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
  margin: 10px;
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
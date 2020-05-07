<template>
  <div class="options">
    <el-row class="option">
      <el-col :span="12">
        <DatePeriodSelect/>
      </el-col>
      
      <el-col class="option-chart" :span="10">
        <p class="option-label">Chart Type</p>
        <el-select
            v-model="chart" @change="setChart">
            <el-option v-for="c in charts" :key="c" :value="c">{{c}}</el-option>
          </el-select>
          
        </el-col>
    </el-row>
  </div>
</template>

<script>
import { CHARTS } from '../../constants/view'
import Cfg from '../../services/cfg'
import View from '../../services/view/view'
import DatePeriodSelect from './DatePeriodSelect.vue'

export default {
  name: 'Options',
  components: {
    DatePeriodSelect
  },
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
  position: absolute;
  top: -25px;
  left: 85px;
}

.option-chart {
  position: relative;
  margin-top: 10px;
}
.option-count {
  width: 40px;
}
</style>
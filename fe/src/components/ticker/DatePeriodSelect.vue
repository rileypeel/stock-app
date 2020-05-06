<template>
  <div class="slider">
    <div class="block">
      <el-row class="selector">  
        <div v-for="(item, key, index) in timeframes" :key="key">
          <el-col class="col" :span="4">    
            {{ item }}
            <el-select class="select" v-model="selectedPeriod[index]" @change="changeView(key, index)" :placeholder="item">
              <el-option
                v-for="period in tfMap[key]"
                :key="period"
                :label="period"
                :value="period"
                width="20">
              </el-option>
            </el-select>
          </el-col>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { PERIODS, TIMEFRAMES, TIMEFRAME_PERIOD_MAP, MAX  } from '../../constants/view'
import Cfg from '../../services/cfg'
import View from '../../services/view/view'
import timeService from '../../services/datetime.js'

export default {
  name: 'DatePeriodSelect',
  data() {
    var cfg = Cfg()
    var view = View()
    return {
      cfg,
      view,
      periods: PERIODS,
      timeframes: TIMEFRAMES,
      tfMap: TIMEFRAME_PERIOD_MAP,
      selectedPeriod: []
    }
  },
  methods: {
    changeView(key, index) {
      for(var i = 0; i < this.selectedPeriod.length; i++) {
        if(i != index) {
          this.selectedPeriod[i] = null;
        }
      }
      this.cfg.period = this.selectedPeriod[index]
      if(key == MAX) {
        this.cfg.startDate = 0
      } else {
        this.cfg.startDate = timeService.getStartDate(key)
      }
      this.view.update()
    }
  }
}
</script>

<style>
.col {
  margin: 0;
}

.select {
  width: 100%;
}

.selector {
  margin: 10px;
}
</style>
<template>
  <div class="stockDetail">
    <div v-if="info" > 
      <el-tabs v-model="tabName" style="margin: 10px;">
        <el-tab-pane name="Chart" label="Chart" >
          <el-row>
            <el-col :offset="4">
              <h1>{{ $route.params.ticker }}</h1>
              <Ticker :tickerSym="$route.params.ticker" ref="chartUnique"/>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-for="item in info" :key="item.value" :span="8">
              <p>{{item.indicatorName}}: {{item.value}}</p>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane name="Financials" label="Finanacials">
          COMING SOON....
        </el-tab-pane>
        <el-tab-pane name="Research" label="Research">
          COMING SOON..........
        </el-tab-pane>
      </el-tabs>  
    </div>
      <div v-else>
        loading
      </div>
    </div>
</template>

<script>
import tickerService from '../services/ticker.js'
import Ticker from './ticker/Ticker.vue'

export default {
  name: "StockDetail",
  components: {
    Ticker
  },
  data () {
    return {
      info: false,
      ticker: '',
      height: true,
      tabName: 'Chart'
    }
  },
  methods: {
    getInfo() {
      tickerService.stockInfo(this.ticker).then((data) => {
        this.info = data;
      })
    }
  },
  mounted: function() {
    this.ticker = this.$route.params.ticker
    this.getInfo()
  }
}
</script>

<style>
.stockDetail {
  font-weight: bold;
}
</style>
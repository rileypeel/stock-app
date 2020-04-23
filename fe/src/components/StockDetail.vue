<template>
  <div class="stockDetail">
   
    <div  v-if="info" >
      <el-tabs v-model="tabName" style="margin: 10px;">
        <el-tab-pane name="Chart" label="Chart" >
          <h1>{{ $route.params.ticker }}</h1>
          <h2>Kieran i think the chart would be nice right here :)</h2>
          <el-row>
            <el-col v-for="item in info" :key="item.value" :span="8">
              <p>{{item.indicatorName}}: {{item.value}}</p>
            </el-col>
        
          </el-row>
        </el-tab-pane>
        <el-tab-pane name="Financials" label="Finanacials">
          <BarChart :ticker="ticker"></BarChart>
        </el-tab-pane>
        <el-tab-pane name="Research" label="Research">
        </el-tab-pane>
      </el-tabs>  
    </div>
      <div v-else>
        loading
      </div>
    </div>

</template>

<script>

import BarChart from './BarChart.vue'
import tickerService from '../services/ticker.js'
export default {
  name: "StockDetail",
  components: {

    BarChart
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
        console.log(data);
        this.info = data;
      })
    }
  },
  mounted: function() {
    this.ticker = this.$route.params.ticker
    this.getInfo();
  }
  
}
</script>

<style>
.stockDetail {
  font-weight: bold;
}



</style>
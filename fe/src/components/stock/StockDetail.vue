<template>
  <div class="stockDetail">
    <div v-if="info" > 
      <el-tabs v-model="tabName" style="margin: 10px;">
        <el-tab-pane name="Chart" label="Chart" >
          <el-row>
            <el-col :span="6">
              <h1>{{ ticker.cfg.name }}</h1>
              <h2>{{ ticker.cfg.ticker }}</h2>
              <h3>Latest price: {{ ticker.cfg.stockData.quote }}</h3>
              <h4><router-link to='/transaction'>Trade this stock</router-link></h4>
            </el-col>
            <el-col :span="18">
              <Ticker :ticker="ticker" :size="1" ref="chartUnique" class="ticker-style"/>
            </el-col>
          </el-row>
          <h3 class="header-margin">Basic price and company info</h3>
          <el-row class="data">
            <el-col v-for="(item, name) in ticker.cfg.stockData.info" :key="item.id" :span="8">
              <el-card class="container">{{ name }}: 
                <span class="regular-font">
                  {{ item }}
                </span>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane name="Financials" label="Financials">
          COMING SOON....
        </el-tab-pane>
        <el-tab-pane name="Research" label="Research">
          COMING SOON....
        </el-tab-pane>
      </el-tabs>  
    </div>
      <div v-else>
        <i class="el-icon-loading"></i>
      </div>
    </div>
</template>

<script>
import Stock from '../../services/realTicker'
import Ticker from '../ticker/Ticker.vue'
export default {
  name: "StockDetail",
  components: {
    Ticker
  },
  data () {
    return {
      ticker: '',
      height: true,
      tabName: 'Chart',
      info: true,
      stockData: {
        info: {}
      },
      view: '',
      stockSymbol: ''
    }
  },
  beforeMount: function() {
    this.ticker = Stock(this.$route.params.ticker) 
  }
}
</script>

<style>
.stockDetail {
  font-weight: bold;
}

.grey-border {
  margin: 0px;
  padding: 4px;
  border-style: solid;
  border-width: 1px;
  border-color: grey;
  border-radius: 0px;
}

.container {
  display: flex;
  justify-content: space-between;
  height: 60px;
}

.regular-font {
  font-weight: normal;
}

.header-margin {
  margin: 20px; 
}

.data {
  margin-bottom: 50px;
}

</style>
<template>
  <div class="stockDetail">
    <div v-if="info" > 
      <el-tabs v-model="tabName" style="margin: 10px;">
        <el-tab-pane name="Chart" label="Chart" >
          <el-row>
            <el-col :span="6">
              <h1>{{ $route.params.name }}</h1>
              <h2>{{ $route.params.ticker }}</h2>
              <h3>Latest price: {{ quote }}</h3>
              <h4><router-link to='/transaction'>Trade this stock</router-link></h4>
            </el-col>
            <el-col :span="18">
              <Ticker :tickerSym="$route.params.ticker" ref="chartUnique" class="ticker-style"/>
            </el-col>
          </el-row>
          <h3 class="header-margin">Basic price and company info</h3>
          <el-row class="data">
            <el-col v-for="(item, name) in info" :key="item" :span="8">
              <p class=" container grey-border">{{ name }}: <span class="regular-font">{{ item }}</span></p>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane name="Financials" label="Finanacials">
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
      tabName: 'Chart',
      quote: 'N/A'
    }
  },
  methods: {
    getInfo() {
      tickerService.stockInfo(this.ticker).then((data) => {
        if(data) {
          this.info = data;
        }
      })
    },
    getQuote() {
      tickerService.getQuote(this.ticker).then((data) => {
        this.quote = data['c']
      })
    }
  },
  mounted: function() {
    this.ticker = this.$route.params.ticker
    this.getInfo()
    this.getQuote()
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
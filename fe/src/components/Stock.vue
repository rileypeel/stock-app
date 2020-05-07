<template>
  <div class="stock">
    <div class="sub-title"></div>
    <el-row>
      <el-col :span="24">
        <el-autocomplete
          class="inline-input search"
          v-model="userinput"
          :fetch-suggestions="querySearch"
          placeholder="Stock Symbol"
          :trigger-on-focus="false"
          @select="handleSelect"
        ><template slot-scope="scope"> <span style="font-weight: bold"> {{ scope.item.value }} </span> {{ scope.item.name }} </template></el-autocomplete>
      </el-col>  
    </el-row>
    <el-row>
      <el-col :span="8">
        <Ticker :small="true" :showOptions="false" :tickerSym="'SPY'"/>
      </el-col>
      <el-col :span="16">
        <h4 class="overview">Daily Market Overview</h4>
        <ul v-for="(prices, stockIndex) in indexPrices" :key="stockIndex">
          {{ stockIndex }}: <p v-bind:class="prices.pchange < 0 ? 'red' : 'green' " >{{ prices.pchange.toFixed(3) }} %</p>
        </ul>  
      </el-col>  
    </el-row>
    <h1 class="news">Recent News</h1>
    <el-row>
      <el-col :span="8" v-for="n in news" :key="n.id">
        <el-card class="card" :body-style="{ padding: '0px' }">
          <el-image fit="contain" :src="n.image" class="image"></el-image>
          <div style="padding: 14px;">
            <span><a :href="n.url" >{{ n.headline }}</a></span>
            <div v-if="n.summary.length<100" class="bottom clearfix">
              <p style="font-weight: normal;">{{ n.summary }}</p>
            </div>
            <div v-else class="bottom clearfix">
              <p style="font-weight: normal;">{{ n.summary.slice(0, 100).concat('...') }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>  
</template>

<script>
import Ticker from './ticker/Ticker.vue'
import tickerService from '../services/ticker.js'
export default {
  name: "Stock",
  components: {
    Ticker
  },
  data () {
    return {
      symbol: '',
      stock: '',
      message: '',
      userinput: '',
      news: '',
      indexPrices: ''
    }
  },
  methods: {
    search(symbol) {
      tickerService.getTicker(symbol).then((data) => {
        if(data) {
          this.stock = data
          this.$router.push({ name: 'StockDetail', params: { ticker: data.ticker }})
        } else {
          this.message = 'Symbol not found.'
        }
      })
    },
    querySearch(queryString, callback) {
      tickerService.search(queryString).then((data) => {
        callback(data)
      })
    },
    handleSelect(item) {
      this.$router.push({ name: 'StockDetail', params: { ticker: item.value, name: item.name }})
    },
    getNews() {
      tickerService.stockNews().then((data) => {
        this.news = data.slice(0, 5)
      })
    },
    getIndexQuotes() {
      tickerService.indexQuotes().then((data) => {
        this.indexPrices = data
      })
    }
  },
  mounted() {
    this.getNews()
    this.getIndexQuotes()
  }
}
</script>

<style>
.stock {
  font-weight: bold;
}

.search {
  width: 250px;
  margin: 20px;
}

.card {
  margin: 10px;
}

.news {
  margin: 25px;
  color: black;
}

.overview {
  color: black;
  margin: 20px;
}

.red {
  color: red;
}

.green {
  color: green;
}
</style>
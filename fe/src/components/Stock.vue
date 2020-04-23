<template>
  <div class="stock">
   
    <p>Stocks</p>
    <div class="sub-title">Search</div>
    <el-autocomplete
      class="inline-input"
      v-model="userinput"
      :fetch-suggestions="querySearch"
      placeholder="Stock Symbol"
      :trigger-on-focus="false"
      @select="handleSelect"
    ></el-autocomplete>
  </div>  
</template>

<script>

import tickerService from '../services/ticker.js';
export default {
  name: "Stock",
  data () {
    return {
      symbol: '',
      stock: '',
      message: '',
      userinput: ''
    }
  },
  methods: {
    search(symbol) {
      tickerService.getTicker(symbol).then((data) => {
        if(data) {
          console.log(data)
          this.stock = data;
          this.$router.push({ name: 'StockDetail', params: { ticker: data.ticker }})
          
        } else {
          this.message = 'Symbol not found.'
        }

      })
    },

    querySearch(queryString, callback) {
      console.log("making search call")
      tickerService.search(queryString).then((data) => {
        console.log(data)
        callback(data);
      })
    },
    handleSelect(item) {
      this.$router.push({ name: 'StockDetail', params: { ticker: item.value }})
    }
  }
}
</script>

<style>
.stock {
  font-weight: bold;
}
</style>
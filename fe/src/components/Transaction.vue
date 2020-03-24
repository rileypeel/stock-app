<template>
  <div class="Transaction">
    <el-form status-icon :model="trans" ref='transactionForm'>
      <el-form-item prop="ticker" label="Stock Symbol">
        <el-input  v-model="trans.ticker"></el-input>
      </el-form-item>
      <el-button @click="getQuote()">Get Quote</el-button>
      <el-form-item prop="numberOfShares" label="# of shares">
        <el-input  v-model="trans.numberOfShares"></el-input>
      </el-form-item>  
    </el-form>
  </div>  
</template>

<script>
import tickerService from '../services/ticker.js';
//import portfolioService from '../services/portfolio.js';
export default {
  name: "Transaction",
  data () {
    return {
      trans: {
        numberOfShares: '',
        price: '',
        ticker: '',
        isBuy: '' 
      }
    }
  },

  methods: {
    getQuote() {
      tickerService.getQuote(this.trans.ticker);
    }
  }
}
</script>

<style>
.ticker {
  font-weight: bold;
}
</style>
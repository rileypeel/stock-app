<template>
  <div class="stock">
   <Navigation/>
    <p>Stocks</p>
    <el-form >
      <el-form-item >
        <el-input v-model="symbol"></el-input>
      </el-form-item>
      <el-button @click="search(symbol)">Search!</el-button>
    </el-form>
    <p>{{ message }}</p>
  </div>  
</template>

<script>
import Navigation from './Navigation.vue';
import tickerService from '../services/ticker.js';
export default {
  name: "Stock",
  components : {
    Navigation
  },
  data () {
    return {
      symbol: '',
      stock: '',
      message: ''
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
    }
  }
}
</script>

<style>
.stock {
  font-weight: bold;
}
</style>
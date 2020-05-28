<template>
  <div class="portfolioDetail">
    <h1>{{ portfolio.name }}</h1>
    <router-link to="/transaction">Trade stocks</router-link>
    <h2>Current value: {{ (portfolio.cash + portfolio.value).toFixed(2) }} </h2>
    <el-collapse accordion>
      <el-collapse-item title="Portfolio Holdings">
        <el-table v-if="portfolio.holdings.length"
          :data="portfolio.holdings"
          stripe
          style="width: 100%">
          <el-table-column
            label="Stock"
            width="100">
            <template slot-scope="scope">
              <router-link :to="{ name: 'StockDetail', params: { ticker: scope.row.stock }}"> {{ scope.row.stock }} </router-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="number_of_shares"
            label="Amount"
            width="100">
          </el-table-column>
          <el-table-column
            prop="bookCost"
            label="Book Cost"
            width="100">
          </el-table-column>
          <el-table-column
            prop="latestPrice"
            label="Latest Price"
            width="100">
          </el-table-column>
          <el-table-column
            prop="marketValue"
            label="Market Value"
            width="110">
          </el-table-column>
          <el-table-column
            label="% Change"
            width="100">
            <template slot-scope="scope">
              <p :class="scope.row.percentChange < 0 ? 'red': 'green'"> {{ scope.row.percentChange }} %</p>
            </template>
          </el-table-column>
        </el-table>
        <p v-else>
          You currently have no holdings in this portfolio.
        </p>
      </el-collapse-item>
      <el-collapse-item title="Transactions">
        <el-table v-if="portfolio.transactions.length"
          :data="portfolio.transactions"
          stripe
          style="width: 100%"
          >
          <el-table-column
            prop="time_stamp"
            label="Date"
            width="180">
          </el-table-column>
          <el-table-column
            prop="stock"
            label="Stock"
            width="100">
          </el-table-column>
          <el-table-column
            label="Buy or Sell"
            width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.is_buy">Buy</p>
              <p v-else>Sell</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="number_of_shares"
            label="Amount"
            width="100">
          </el-table-column>
          <el-table-column
            prop="price"
            label="Price"
            width="100">
            <template slot-scope="scope">
              {{ parseFloat(scope.row.price).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="number_of_shares"
            label="Number of shares"
            width="180">
          </el-table-column>
        </el-table>
        <p v-else>
          No transactions in this portfolio.
        </p> 
      </el-collapse-item>
    </el-collapse>
  </div>  
</template>

<script>
//import tickerService from '../../services/ticker.js'
//import portfolioService from '../../services/portfolioHttp.js'
import Portfolios from '../../services/view/portfolio'
export default {
  name: "PortfolioDetail",
  data() {
    return {
      noTrans: true,
      noHoldings: true,
      portfolios: '',
      portfolio: {}
    }
  },
  beforeMount: function() {
    this.portfolios = Portfolios()
    this.portfolios.getPortfolioDetail(this.$route.params.id)
    this.portfolio = this.portfolios.currentPortfolio
  }
}
</script>

<style>
.portfolioDetail {
  font-weight: bold;
}

.red {
  color: red;
}

.green {
  color: green;
}
</style>
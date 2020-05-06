<template>
  <div class="portfolioDetail">
    <h1>{{ portfolioName }}</h1>
    <router-link to="/transaction"> Trade stocks</router-link>
    <h2>Current value: {{ cashBalance + currentValue }} </h2>
    <el-collapse accordion>
      <el-collapse-item title="Portfolio Holdings">
        <el-table v-if="noHoldings"
          :data="holdings"
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
            prop="average_cost"
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
        <el-table v-if="noTrans"
          :data="transactions"
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
import tickerService from '../services/ticker.js'
import portfolioService from '../services/portfolio.js';

export default {
  name: "PortfolioDetail",
  data() {
    return {
      portfolioName: this.$route.query.name,
      cashBalance: 0,
      currentValue: 0,
      transactions: [],
      holdings: [],
      portfolioId: this.$route.params.id,
      noTrans: false,
      noHoldings: false
    }
  },
  methods: {
    getTransactions() {
      portfolioService.getTransactions(this.portfolioId).then((data) => {
        this.transactions = data;
        this.noTrans = this.transactions.length
      })
    },
    getHoldings() {
      portfolioService.getHoldings(this.portfolioId).then((data) => {
        this.currentValue = 0
        this.holdings = data
        this.holdings.forEach((holding) => {
          tickerService.getQuote(holding.stock).then((data) => {
            this.noHoldings = this.holdings.length
            holding['latestPrice'] = data['c']
            holding['marketValue'] = holding.number_of_shares*data['c']
            holding['percentChange'] = (holding['marketValue'] - holding['average_cost'])/holding['average_cost']*100;
            holding['percentChange'] = holding['percentChange'].toFixed(2);
            this.currentValue += holding['marketValue']
            holding['marketValue'] = holding['marketValue'].toFixed(2)
          });
        });
      });
    },
    getPortfolioDetail() {
      portfolioService.getPortfolio(this.portfolioId).then((data) => {
        this.portfolioName = data['name']
        this.cashBalance = parseInt(data['balance'])
      });   
    }
  },
  mounted: function() {
    this.getTransactions();
    this.getHoldings();
    this.getPortfolioDetail();
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
<template>
  <div class="portfolioDetail">
    <h1>{{ portfolioName }}</h1>
    <router-link to="/transaction"> Buy/Sell</router-link>
    <el-collapse accordion>
      <el-collapse-item title="Portfolio Holdings">
        <el-table v-if="noHoldings"
          :data="holdings"
          stripe
          style="width: 100%">
          <el-table-column
            prop="stock"
            label="Stock"
            width="100">
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
            width="100">
          </el-table-column>
          <el-table-column
            prop="percentChange"
            label="Change"
            width="100">
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
  components : {

  },
  data() {
    return {
      portfolioName: this.$route.query.name,
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
        if(this.transactions.length == 0) {
          this.noTrans = false;
        } else {
          this.noTrans = true;
        }
      })
    },
    getHoldings() {
      portfolioService.getHoldings(this.portfolioId).then((data) => {
        this.holdings = data;
        this.holdings.forEach((holding) => {
          tickerService.getQuote(holding.stock).then((data) => {
            if(this.holdings.length == 0) {
              this.noHoldings = false
            } else {
              this.noHoldings = true
            }
            holding['latestPrice'] = data.close_price
            holding['marketValue'] = holding.number_of_shares*data.close_price;
            holding['percentChange'] = (holding['marketValue'] - holding['average_cost'])/holding['average_cost']*100;
            holding['percentChange'] = holding['percentChange'].toFixed(2);
          });
        });
      });
    },
    getPortfolioDetail() {
      portfolioService.getPortfolio(this.portfolioId).then((data) => {
        this.portfolioName = data['name']
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
</style>
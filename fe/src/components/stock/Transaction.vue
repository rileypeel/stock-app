<template>
  <div class="transaction">
    <h1>Buy or Sell shares</h1>  
    <el-form  class="grey-border form" label-width="120px" status-icon :rules="rules" :model="trans" ref='transactionForm'>
      <el-row> 
        <el-col :span="10">
          <el-form-item label="Buy or Sell" prop="is_buy">
            <el-radio-group v-model="trans.is_buy" size="medium">
              <el-radio border label="Buy"></el-radio>
              <el-radio border label="Sell"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item prop="portfolioId">
            <el-select v-model="portfolioId" placeholder="Select a portfolio">
              <el-option
                v-for="portfolio in portfolios.portfolios"
                :key="portfolio.id"
                :label="portfolio.name"
                :value="portfolio.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    <el-row>
      <el-col :span="14">
        <el-row>
          <el-col :span="16">
            <el-form-item prop="ticker" label="Stock Symbol">
              <el-input  v-model="trans.ticker"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button @click="getQuote()">Get Quote</el-button> 
          </el-col>
        </el-row>  
      </el-col>  
      <el-col :span="10">
        <div >
          <div v-if="loadingQuote">
            <i class="el-icon-loading"></i>
          </div>
          <div v-if="showQuote" class="grey-border">
            <el-row><p> {{ quoteSym }}</p></el-row>
            <el-row><p>Last price: {{ quote }}</p></el-row>
          </div>
          <div v-if="quoteErr">
            <p>Stock symbol not found.</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item prop="number_of_shares" label="# of shares">
          <el-input  v-model="trans.number_of_shares"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
      <el-row>
        <el-col :span="10" >
          <el-form-item label="Order Type" prop="order_type">
            <el-radio-group v-model="trans.order_type" @input="limitForm" size="medium">
              <el-radio border label="Market"></el-radio>
              <el-radio disabled border @click="limitForm()" label="Limit"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item v-if="showLimit" prop="limit_price" label="limit price">
            <el-input  v-model="trans.limit_price"></el-input>
          </el-form-item> 
        </el-col>
      </el-row>
       <el-button @click="submit()">Submit!</el-button> 
    </el-form>
  </div>  
</template>

<script>
import tickerService from '../../services/ticker.js'
import portfolioService from '../../services/portfolioHttp.js'
import Portfolios from '../../services/view/portfolio'
import View from '../../services/view/view'
export default {
  name: "Transaction",
  components: {
  },
  data () {
    var selectValidate = (rule, value, callback) => {
      if (this.portfolioId == '') {
        callback(new Error("Please select a portfolio."))
      }
      callback()
    }
    var tickerValidate = (rule, value, callback) => {
      tickerService.getTicker(value).then((res) => {
        if (res) {
          callback()
        } else {
          callback(new Error("Symbol not found"))
        }
      })
    }
    var posIntValidate = (rule, value, callback) => {
      if (Number.isInteger(parseInt(value))) {
        if (value > 0) {
          callback()
        }
      }
      callback(new Error("Please enter a number greater than 0."))
    }
    var limitValidate = (rule, value, callback) => {
      if (this.trans.orderType == 'Limit') {
        if (!value) {
          callback(new Error("Please enter a limit price."))
        }
      }
      callback()
    }
    return {
      portfolios: '',
      trans: {
        number_of_shares: '',
        price: '',
        ticker: '',
        is_buy: '',
        order_type: '',
        limit_price: 0
      },
      quote:'',
      quoteSym: '',
      showLimit: false,
      showQuote: false,
      loadingQuote: false,
      quoteErr: false,
      portfolioId: '',
      value:'',
      rules: {
        portfolioId: [
          { validator: selectValidate, trigger: 'change' }
        ],
        ticker: [
          { required: true, message: "Please provide a stock symbol", trigger: 'blur' },
          { validator: tickerValidate, trigger: 'input' }
        ],
        number_of_shares: [
          { required: true, message: "Please enter the number of shares you would like to trade.", trigger: 'blur' },
          { validator: posIntValidate, trigger: 'blur' }
        ],
        order_type: [
          { required: true, message: "Please enter the type of order.", trigger: 'blur' } 
        ],
        is_buy: [
          { required: true, message: "Would you like to buy or sell?", trigger: 'blur' }
        ],
        limit_price: [
          { validator: limitValidate, trigger: 'blur' },
          { validator: posIntValidate, trigger: 'blur'}
        ]
      }
    }
  },
  mounted: function() {
    this.portfolios = Portfolios(true)
    this.view = View()
    var id = this.portfolios.currentPortfolio.id
    var ticker = this.view.cfg.ticker
    if (id) this.portfolioId = id
    if (ticker) this.trans.ticker = ticker
  },
  methods: {
    getQuote() {
      this.quoteErr = false
      this.showQuote = false
      this.loadingQuote = true
      tickerService.getQuote(this.trans.ticker).then((data) => {
        if (data) {
          this.quote = data.quote 
          this.loadingQuote = false
          this.quoteSym = data.ticker
          this.showQuote = true
        } else {
          this.loadingQuote = false
          this.quoteErr = true
        }
      })
    },
    convertType() {
      this.trans.number_of_shares = parseInt(this.trans.number_of_shares)
      this.trans.is_buy = this.trans.is_buy == 'Buy' ? true : false
    },
    confirm() {
      return this.$confirm(`<p>Please confirm the transaction: </br>${this.trans.order_type} Order </br>${this.trans.is_buy} ${this.trans.number_of_shares} shares of ${this.trans.ticker}</p>`, 'Confirmation', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'info',
        dangerouslyUseHTMLString: true })
    },
    notify(type, message) {
      this.$notify({
        title: `${type.charAt(0).toUpperCase()}${type.slice(1)}`,
        message: message,
        type: type,
        duration: 2000
      })
    },
    submit() {
      this.$refs['transactionForm'].validate((valid) => {
        if (valid) {
          this.confirm()
          .then(() => {
            this.convertType()
            portfolioService.newTransaction(this.trans, this.portfolioId)
            .then((res) => {
              if (res == 201) {
                this.notify('success', 'You have succesfully placed an order.')
                this.$router.push({ name: 'PortfolioDetail', params: { id: this.portfolioId } })
              } else {
                var message = res.non_field_errors.length > 0 ? res.non_field_errors[0] : "Error"
                this.notify('error', message)
              }
            })
          }).catch(() => {
            console.log("cancel")
          })
        } else {
          this.notify('error', 'Invalid form input')
        }
      })
    },
    limitForm() {
      this.showLimit = this.trans.order_type == 'Limit' ? true : false 
    }
  }
}
</script>

<style>
.transaction {
  font-weight: bold;
}

.left {
  justify-content: flex-start;
}

.grey-border { 
  border-style: solid;
  border-width: 1px;
  border-color: grey;
  border-radius: 5px;
}

.form{
  margin-top: 50px;
  margin-left: 10px;
  margin-right: 10px;
  padding-top: 25px;
  padding-bottom: 25px;
}

</style>
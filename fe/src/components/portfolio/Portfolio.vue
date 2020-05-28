<template>
  <div class="portfolio">
    <div v-if="portfolios.notLoaded" class="loading">
      <i class="el-icon-loading"></i>
    </div>
    <div v-else class="content">
      <h1 class="portfolio-header">Portfolios</h1>
        <el-dialog custom-class="dialog" title="Portfolio" :visible.sync="dialogFormVisible">
          <el-form :model="newPortfolio">
            <el-form-item label="Portfolio Name" :label-width="formLabelWidth">
              <el-input v-model="newPortfolio.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Initial Balance" :label-width="formLabelWidth">
              <el-input v-model="newPortfolio.balance" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">Cancel</el-button>
            <el-button class="button" type="primary" @click="submitForm(); dialogFormVisible=false">Confirm</el-button>
          </span>
        </el-dialog>
        <el-table
          :data="portfolios.portfolios"
          stripe
          style="width: 100%">
          <el-table-column
            prop="name"
            label="Name"
            width="180">
            <template slot-scope="scope">
              <router-link :to="{ name: 'PortfolioDetail', params: { id: portfolios.portfolios[scope.$index].id  }}">
                {{ scope.row.name }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="balance"
            label="Cash Balance"
            width="180">
            <template slot-scope="scope">
              {{ parseFloat(scope.row.balance).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="">
            <template slot-scope="scope">
              <el-button
                @click="deletePortfolio(scope.$index)"
                type="text"
                size="small">
                Delete 
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="dialogFormVisible = true">Create new portfolio</el-button>
        </div>      
    </div>
  </div>
</template>

<script>
import Portfolios from '../../services/view/portfolio.js'
import portfolioService from '../../services/portfolioHttp.js'
export default {
  name: "Portfolio",
  data () {
    return {
      portfolios: null,
      newPortfolio: {},
      loading: true,
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    notify(type, message) {
      this.$notify({
        title: `${type.charAt(0).toUpperCase()}${type.slice(1)}`,
        message: message,
        type: type,
        duration: 2000
      })
    },
    submitForm() {
      portfolioService.newPortfolio(this.newPortfolio).then((success) => {
        if (success) {
          this.portfolios.getPortfolios() 
          this.notify('success', 'Portfolio successfully created.')
        } else this.notify('error', 'Error: portfolio was not created.')
      }).catch((err) => {
        console.log(err)
      })
    },
    deletePortfolio(index) {
      this.$confirm('This will permanently delete the portfolio. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
      .then(() => {
        portfolioService.delPortfolio(this.portfolios.portfolios[index].id)
        .then((res) => {
          if (res.status == 200) this.notify('success', 'Portfolio deleted')
          else this.notify('error', 'Delete failed')
          this.portfolios.getPortfolios()
        })
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }, 
  beforeMount: function() {
    this.portfolios = Portfolios(true)
  }
}

</script>

<style>
.portfolio{
  font-weight: bold;
}
.content {
  margin-top: 80px;
  margin-left: 10px;
  margin-right: 10px;
}
.dialog{
  background-color: rgba(255,255,255,.3);
  border-radius: 20px;
}

</style>
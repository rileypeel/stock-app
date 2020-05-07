<template>
  <div class="portfolio">
    <div v-if="loading" class="loading">
      <i class="el-icon-loading"></i>
    </div>
    <div class="content">
      <h1>Portfolios</h1>
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
            <el-button class="button" type="primary" @click="submitForm(); dialogFormVisible = false">Confirm</el-button>
          </span>
        </el-dialog>
        <el-table
          :data="portfolios"
          stripe
          style="width: 100%">
          <el-table-column
            prop="name"
            label="Name"
            width="180">
            <template slot-scope="scope"><router-link :to="{ name: 'PortfolioDetail', params: { id: portfolios[scope.$index].id }} ">{{ scope.row.name }}</router-link></template>
          </el-table-column>
          <el-table-column
            prop="balance"
            label="Cash Balance"
            width="180">
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
import portfolioService from '../services/portfolio.js';
export default {
  name: "Portfolio",
  data () {
    return {
      portfolios: null,
      loading: true,
      newPortfolio: {
        name: '',
        balance: ''
      },
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    submitForm() {
      portfolioService.newPortfolio(this.newPortfolio).then((success) => {
        if(success) {
          this.updatePortfolios()
        } else {
          this.$notify({
            title: 'Error',
            message: 'Error, portfolio not created.',
            type: 'error',
            duration: 2000
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    updatePortfolios() {
      portfolioService.getPortfolios().then((result) => {
        this.portfolios = result;
        this.loading = false;
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
        portfolioService.delPortfolio(this.portfolios[index].id)
        .then((res) => {
          if(res.status == 200) {
            this.$message({
              type: 'success',
              message: 'Delete completed',
              offset: 100
            })
            this.$router.go()
          } else {
            this.$message({
              type: 'error',
              message: 'Delete not completed',
              offset: 100
            })
          }
        })
      })
      .catch(() => {
        console.log("Delete cancelled")
      })
    }
  }, 
  mounted: function() {
    this.updatePortfolios()
  }
}

</script>

<style>
.portfolio{
  font-weight: bold;
}

.dialog{
  background-color: rgba(255,255,255,.3);
  border-radius: 20px;
}
</style>
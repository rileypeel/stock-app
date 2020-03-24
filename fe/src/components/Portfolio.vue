<template>
  <div id="Portfolio">
    <Navigation/>
    <div v-if="loading" class="loading">
    Loading...
    </div>
    <div v-if="portfolios" class="content">
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
            <template slot-scope="scope"><router-link :to="{ name: 'PortfolioDetail', params: { id: portfolios[scope.$index].id }}">{{ scope.row.name }}</router-link></template>
          </el-table-column>
          <el-table-column
            prop="balance"
            label="Balance"
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
import Navigation from './Navigation.vue';

import portfolioService from '../services/portfolio.js';

export default {
  name: "Portfolio",
  components: { 
    Navigation
  },
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
      });
    },
    updatePortfolios() {
      console.log(
      portfolioService.getPortfolios().then((result) => {
        this.portfolios = result;
        this.loading = null;
      })
      )
    },
    deletePortfolio(index) {
      console.log(index)
      //portfolioService.deletePortfolio(this.portfolios[index].id);
    }
  }, 
  mounted: function() {
    this.updatePortfolios()
  }
}

</script>


<style>
.dialog{
  background-color: rgba(255,255,255,.3);
  border-radius: 20px;
}
</style>
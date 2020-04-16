<template>
  <div class="barChart">
    BARCHART
    <div id="chart" v-if="loaded">
    </div>
    <div v-else>

      loading...
    </div>
  </div>
</template>

<script>
import tickerService from '../services/ticker.js';
import barChart from '../services/barchart.js';
export default {
  name: "BarChart",
  data () {
    return {
      loaded: false
    }
  },
  props: {
    ticker: String
  },
  mounted: function() {
    tickerService.stockRecommend(this.ticker).then((data) => {
      barChart([data[0]]);
      this.loaded = true;
    })
  }
  
}

</script>


<style>

</style>
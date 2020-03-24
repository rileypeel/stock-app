<template>
  <div class="stockDetail">
   <Navigation/>
    <p>{{ $route.params.ticker }}</p>
  </div>  
</template>

<script>
import Navigation from './Navigation.vue';
export default {
  name: "StockDetail",
  components : {
    Navigation
  },
  
}
</script>

<style>
.stockDetail {
  font-weight: bold;
}
</style>
<template>
  <div class="stock">
   <Navigation/>
    <p>Stocks</p>
  </div>  
</template>

<script>
import Navigation from './Navigation.vue';
export default {
  name: "Stock",
  components : {
    Navigation
  },
  
}
</script>

<style>
.stock {
  font-weight: bold;
}
</style>
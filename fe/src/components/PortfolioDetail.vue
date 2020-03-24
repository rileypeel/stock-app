<template>
  <div class="portfolioDetail">
   <Navigation/>
    <p>{{ $route.params.id }}</p>
    <router-link to='/transaction'>Transacttion</router-link>
  </div>  
</template>

<script>
import Navigation from './Navigation.vue';
export default {
  name: "PortfolioDetail",
  components : {
    Navigation
  },
  
}
</script>

<style>
.user {
  font-weight: bold;
}
</style>
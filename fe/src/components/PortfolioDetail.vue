<template>
  <div class="portfolioDetail">
   <Navigation/>
    <p>{{ $route.params.id }}</p>
  </div>  
</template>

<script>
import Navigation from './Navigation.vue';
export default {
  name: "PortfolioDetail",
  components : {
    Navigation
  },
  props: {
    portfolio: Object
  }
}
</script>

<style>
.user {
  font-weight: bold;
}
</style>
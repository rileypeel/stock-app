<template>
  <div class="user">
   <Navigation/>
    User
  </div>  
</template>

<script>
import Navigation from './Navigation.vue';
export default {
  name: "User",
  components : {
    Navigation
  }
}
</script>

<style>
.user {
  font-weight: bold;
}
</style>
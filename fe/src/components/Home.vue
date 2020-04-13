<template>
  <div id="Home">
    <Navigation/>
    <h1>Home Page</h1>
    <p>Already have an account? Login <router-link to='/login'>here</router-link></p>
    <p>Don't have an account? Register <router-link to='/register'>here</router-link></p>
    <p>Stock list <router-link to='/stock'>here</router-link></p>
  </div>  
</template>

<script>
import Navigation from './Navigation.vue'

export default {
  name: "Home",
  components: { 
    Navigation
  }
}

</script>


<style>

</style>
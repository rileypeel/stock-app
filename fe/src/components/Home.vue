<template>
  <div id="Home">
    <h1>Home Page</h1>
    <p>Already have an account? Login <router-link to='/login'>here</router-link></p>
    <p>Don't have an account? Register <router-link to='/register'>here</router-link></p>
    <p>Stock list <router-link to='/stock'>here</router-link></p>
  </div>  
</template>

<script>


export default {
  name: "Home",
  components: { 
  }
}

</script>


<style>

</style>
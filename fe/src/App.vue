<template>
  <div class="app">
    <Navigation />
    <router-view/>
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'
export default {
  name: 'App',
  components: {
    Navigation
  }
}
</script>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

button, 
input, 
select, 
textarea {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
}

* {
  margin: 0;
  padding: 0;
}

.button{
  border-radius:30px;
  background-color:rgba(37,33,83,.6);
  border-color:rgba(37,33,83,.6);
}
</style>

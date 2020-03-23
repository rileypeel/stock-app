<template>
  <div class="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
 
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
</style>

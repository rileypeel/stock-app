<template>
  <div class="header">
    <span class="stock">
      <span class="exchange"></span>
      <span class="delimiter"> : </span>
      <span class="ticker"></span>
    </span>
    <span class="date"></span>
    <span class="period"></span>
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style>
.header {
  padding: 5px;
  width: 590px;
  font-size: 14px;
  background: black;
}

.date {
  float: right;
  color: white;
}

.period {
  font-size: 10px;
  float: right;
  color: grey;
}

.stock {
  letter-spacing: 2px;
}

.ticker {
  color: aqua;
}
</style>
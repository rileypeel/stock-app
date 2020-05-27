<template>
  <div class="header" v-bind:style="styleObject">
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
  name: 'Header',
  props: {
    size: {
      type: Number,
      default: 1
    }
  },
  computed: { 
    styleObject: function() {
      var width = 600 * this.size - 10
      return {
        width: `${width}px`
      }
    }
  }
}
</script>

<style>
.header {
  height: 30px;
  padding: 5px;
  font-size: 14px;
  background: black;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 8);
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
<template>
  <div class="header" v-bind:class="classObject">
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
    small: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classObject: function() {
      return {
        'lg-header': !this.small,
        'sml-header': this.small
      }
    }
  }
}
</script>

<style>
.header {
  height: 30px;
  padding: 5px;
  width: 590px;
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

.lg-header {
  padding: 5px;
  width: 590px;
}

.sml-header {
  padding: 5px;
  width: 390px;
}
</style>
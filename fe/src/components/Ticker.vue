<template>
  <div id="view">
    <div id="header">
      <span id="stock">
        <span id="exchange"></span>
        <span id="delimiter"> : </span>
        <span id="ticker"></span>
      </span>
      <span id="date"></span>
    </div>
    <svg id="canvas"></svg>
  </div>
</template>

<script>
import View from '../services/view'
import Ticker from '../services/ticker'

export default {
  name: "Ticker",
  mounted() {
    Ticker(View())
  }
}
</script>

<style>
#view {
  font-family: 'VT323', monospace;
  color: white;
}

#header {
  padding: 5px;
  width: 590px;
  font-size: 14px;
  background: black;
}

#canvas {
  width: 600px;
  height: 400px;
  background: black;
}

#date {
  float: right;
  color: white;
}

#stock {
  letter-spacing: 2px;
}

#ticker {
  color: aqua;
}
</style>
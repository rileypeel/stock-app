// service for fetching/caching ticker data

// service function, requires a view from ./view.js
//
// this is a fake implementation of a ticker that the view can subscribe to
function FakeTicker(view) {
  var stonks = {
    window: {
      // per 2 seconds
      refreshRate: 5,
      min: 0,
      max: 100,
      periodCount: 50,
      offset: 10,
      date: null,
      exchange: 'NASDAQ',
      ticker: 'RMP',
      data: {
        past: [],
        current: {
          hi: null,
          lo: null,
          y: null,
        }
      }
    },
    getDate() {
      // returns date in "Thu Mar 05 2020 20:28:11" format
      return Date().toLocaleString().split(' ').slice(0, 5).join(' ').toLowerCase()
    },
    refreshDate() {
      // refresh the date every second
      this.window.date = this.getDate()
      view.setDate(this.window.date)
      setTimeout(() => this.refreshDate(), 1000)
    },
    setStock() {
      // set the ticker on the view
      view.setStock(this.window.exchange, this.window.ticker)
    },
    runTicker(index = 0) {
      // loop for running the ticker
      // replace this with getStock call to an API
      var nextIndex = ++index % this.window.refreshRate
      this.simulateStock()
      this.updateEntry()
      if (!nextIndex) {
        this.newEntry()
      }
      setTimeout(() => this.runTicker(nextIndex), 1000 / this.window.refreshRate)
    },
    newEntry() {
      // add a new entry to the data
      var past = this.window.data.past
      var current = this.window.data.current

      if (past.length > this.window.periodCount - this.window.offset) {
        past = past.slice(1)
      }
      past = past.concat({ ...current})
      view.setPastData(past)

      this.window.data.current = { hi: current.y, lo: current.y, y: current.y}
      this.window.data.past = past
    },
    updateEntry() {
      // update the current entry on the view
      view.setCurrentData(this.window.data.current)
    },
    simulateStock() {
      // simulate a stock object, with a current value (y), high, and low
      var data = this.window.data.current
      if (!data.y) {
        data.y = 50
        data.hi = 50
        data.lo = 50
      } else {
        var oldY = data.y
        var newY = (oldY - 5) + (Math.random() * 10)
        newY = newY > this.window.max
          ? this.window.max : newY < this.window.min
          ? this.window.min : newY
        data.hi = data.hi < newY ? newY : data.hi
        data.lo = data.lo > newY ? newY : data.lo
        data.y = newY
      }
    },
    start() {
      // start the stonks service
      this.refreshDate()
      this.setStock()
      this.runTicker()
    },
  }

  stonks.start()

  return stonks

}

export default FakeTicker
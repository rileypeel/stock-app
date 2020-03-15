// service for fetching/caching ticker data

// service function, requires a view from ./view.js
//
// this is a fake implementation of a ticker that the view can subscribe to

var subscriber

function FakeTicker() {
  var stonks = {
    cfg: {
      // per 2 seconds
      refreshRate: 5,
      min: 0,
      max: 100,
      periodCount: 50,
      offset: 10,
      date: null,
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
      // TODO(kieran) move this into a date service
      return Date().toLocaleString().split(' ').slice(0, 5).join(' ').toLowerCase()
    },
    getCurrentData() {
      // return the current data
      return this.cfg.data.current
    },
    getPastData() {
      // return the previous data
      return this.cfg.data.past
    },
    refreshDate() {
      // refresh the date every second
      this.cfg.date = this.getDate()
      subscriber && subscriber.setDate(this.cfg.date)
      setTimeout(() => this.refreshDate(), 1000)
    },
    runTicker(index = 0) {
      // loop for running the ticker
      // replace this with getStock call to an API
      var nextIndex = ++index % this.cfg.refreshRate
      this.simulateStock()
      this.updateEntry()
      if (!nextIndex) {
        this.newEntry()
      }
      setTimeout(() => this.runTicker(nextIndex), 1000 / this.cfg.refreshRate)
    },
    newEntry() {
      // add a new entry to the data
      var past = this.cfg.data.past
      var current = this.cfg.data.current

      if (past.length > this.cfg.periodCount - this.cfg.offset) {
        past = past.slice(1)
      }

      past = past.concat({ ...current})

      subscriber && subscriber.setPastData(past)

      this.cfg.data.current = { hi: current.y, lo: current.y, y: current.y}
      this.cfg.data.past = past
    },
    updateEntry() {
      // update the current entry on the view
      subscriber && subscriber.setCurrentData(this.cfg.data.current)
    },
    simulateStock() {
      // simulate a stock object, with a current value (y), high, and low
      var data = this.cfg.data.current
      if (!data.y) {
        data.y = 50
        data.hi = 50
        data.lo = 50
      } else {
        var oldY = data.y
        var newY = (oldY - 5) + (Math.random() * 10)
        newY = newY > this.cfg.max
          ? this.cfg.max : newY < this.cfg.min
          ? this.cfg.min : newY
        data.hi = data.hi < newY ? newY : data.hi
        data.lo = data.lo > newY ? newY : data.lo
        data.y = newY
      }
    },
    start() {
      // start the stonks service
      this.refreshDate()
      this.runTicker()
    },
    subscribe(view) {
      // provide a view to subscribe to the service
      //
      // must have { setCurrentData(data), setPastData(data) } methods
      subscriber = view
      this.refreshDate()
    }
  }

  stonks.start()

  return stonks
}

export default FakeTicker
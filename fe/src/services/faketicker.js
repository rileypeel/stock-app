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
      exchange: 'NASDAQ',
      ticker: 'RMP',
      data: {
        past: [],
        current: {
          hi: 50,
          lo: 50,
          y: 50,
          all: [50],
          avg: 50,
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
    setStock() {
      // set the ticker on the view
      subscriber && subscriber.setStock(this.cfg.exchange, this.cfg.ticker)
    },
    runTicker(index = -1) {
      // loop for running the ticker
      // replace this with getStock call to an API
      var nextIndex = ++index % this.cfg.refreshRate
      this.simulateStock()
      this.updateEntry()
      if (!nextIndex) {
        this.newEntry()
      }
      var past = this.window.data.past
      var current = this.window.data.current
      
      view.setData(past.concat({ ...current }))
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

      // subscriber && subscriber.setPastData(past)

      this.cfg.data.current = {
        hi: current.y,
        lo: current.y,
        y: current.y,
        avg: current.y,
        all: [current.y]
      }

      this.cfg.data.past = past
    },
    updateEntry() {
      // update the current entry on the view
      // subscriber && subscriber.setCurrentData(this.cfg.data.current)
    },
    simulateStock() {
      // simulate a stock object, with a current value (y), high, and low
      var data = this.cfg.data.current
      var oldY = data.y
      // randomize off of oldY
      var newY = (oldY - 5) + (Math.random() * 10)
      // make sure it doesn't go out of bounds
      newY = newY > this.cfg.max
        ? this.cfg.max : newY < this.cfg.min
        ? this.cfg.min : newY
      // add newY to all dataset
      data.all.push(newY)
      // get new max/min
      data.hi = Math.max(...data.all)
      data.lo = Math.min(...data.all)
      // get the average
      data.avg = data.all.reduce((a, b) => a + b, 0) / data.all.length
      // set Y
      data.y = newY
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
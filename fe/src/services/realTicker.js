// service for fetching/caching ticker data

// service function, requires a view from ./view.js
//
// this is a fake implementation of a ticker that the view can subscribe to
import tickerService from './ticker.js';
import * as constants from '../constants/view'

var subscriber
var timeout
function Ticker(symbol) {

  var stonks = {
    cfg: {
      // per 2 seconds
      refreshRate: 2,
      min: 0,
      max: 250,
      periodCount: 50,
      offset: 10,
      date: null,
      exchange: 'NASDAQ',
      ticker: symbol,
      startDate: '2020-01-01-0-0-0',
      period: constants.PERIOD_DAILY,
      data: {
        past: [],
        current: {
          hi: 0,
          lo: 10000,
          y: 0,
          close: 0,
          avg: 0,
          open: 0,
          timestamp: ''
        }
      }
    },

    parseTimestamp(timestamp) {
      var d = new Date(timestamp);
      return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`
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

    loadHistoricalData() {
      var params = {
        'resolution': constants.RESOLUTIONS[this.cfg.period],
        'from': this.cfg.startDate
      }
      
      this.cfg.data.past = []
      
      this.getData(params)

      //log last time stamp then make from call after timeout is over and update the data
      if(this.cfg.period != constants.PERIOD_DAILY && this.cfg.period != constants.PERIOD_MONTHLY && this.cfg.period != constants.PERIOD_YEARLY) {
        timeout = setTimeout(() => {
          var params = {
            'resolution': constants.RESOLUTIONS[this.cfg.period],
            'from': this.cfg.data.current.timestamp
          }
          this.getData(params)
        }, 1000*constants.TIMEOUTS[this.cfg.period])
        //add new data 
      }
    },

    getData(params) {
      //get data from API
      tickerService.getCandleData(this.cfg.ticker, params).then((candleData) => {
        if(candleData) {
          var past
          for(var d in candleData) {
            this.addData(candleData[d])
            past = this.cfg.data.past
          }
          var current = this.cfg.current
          subscriber && subscriber.setData(past.concat({ ...current }))
        } 
      })
    },
    addData(candleData) {
      var past = this.cfg.data.past
      var current = this.cfg.data.current
      var copy = Object.assign({}, current)
      past.push(copy)
      current.hi = parseFloat(candleData.high_price)
      current.lo = parseFloat(candleData.low_price)
      current.close = parseFloat(candleData.close_price)
      current.y = parseFloat(candleData.close_price)
      current.avg = (current.hi + current.lo) / 2
      current.open = parseFloat(candleData.open_price)
      current.timestamp = this.parseTimestamp(candleData.time_stamp)
    },
    start() {
      // start the stonks service
      this.refreshDate()
      this.loadHistoricalData()
      
      //this.runTicker()
    },
    halt() {
      //RILEY remember to clear the timeout
      clearTimeout(timeout)
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

export default Ticker
// service for fetching/caching ticker data

// service function, requires a view from ./view.js
//
// this is a fake implementation of a ticker that the view can subscribe to
import tickerService from './ticker.js'
import * as constants from '../constants/view'
import timeService from './datetime'

var subscriber
function Stock(stockSymbol, initStockData = true) {

  var stonks = {
    cfg: {
      ticker: stockSymbol,
      name: '',
      chartData: {
        date: null,
        period: constants.PERIOD_DAILY,
        timeframe: constants.ONE_YEAR,
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
      },
      stockData: {
        quote: 0,
        info: {}
      }
    },
    getDate() {
      // returns date in "Thu Mar 05 2020 20:28:11" format
      // TODO(kieran) move this into a date service
      return Date().toLocaleString().split(' ').slice(0, 5).join(' ').toLowerCase()
    },
    getCurrentData() {
      // return the current data
      return this.cfg.chartData.current
    },
    getPastData() {
      // return the previous data
      return this.cfg.chartData.past
    },
    refreshDate() {
      // refresh the date every second
      this.cfg.chartData.date = this.getDate()
      subscriber && subscriber.setDate(this.cfg.chartData.date)
      setTimeout(() => this.refreshDate(), 1000)
    },
    setStock() {
      // set the ticker on the view
      subscriber && subscriber.setStock(this.cfg.ticker)
    },
    getStockDetail() {
      tickerService.getTicker(this.cfg.ticker).then((data) => {
        this.cfg.name = data.name
      })
    },
    getQuote() {
      tickerService.getQuote(this.cfg.ticker).then((data) => {
        this.cfg.stockData.quote = data['quote']
      })
    },
    getInfo() {
      tickerService.stockInfo(this.cfg.ticker).then((data) => {
        this.cfg.stockData.info = data
      })
    },
    loadData() {
      var from = 0
      if (this.cfg.chartData.timeframe != constants.MAX) 
        from = timeService.getStartDate(this.cfg.chartData.timeframe)
      var params = {
        'resolution': constants.RESOLUTIONS[this.cfg.chartData.period],
        'from': from
      }
      this.cfg.chartData.past = []
      this.getData(params)
    },
    getData(params) {
      //get data from API
      tickerService.getCandleData(this.cfg.ticker, params).then((candleData) => {
        if (candleData) {
          for(var d in candleData) {
            this.addData(candleData[d])
          }
          subscriber && subscriber.setData(this.cfg.chartData.past.concat({ ...this.cfg.chartData.current }))
        } 
      })
      //Leave out the real-time calls to API for now 
      /* 
      if (![constants.PERIOD_DAILY, constants.PERIOD_MONTHLY].includes(this.cfg.period)) {
        timeout = setTimeout(() => {
          var params = {
            'resolution': constants.RESOLUTIONS[this.cfg.period],
            'from': this.cfg.chartData.current.timestamp
          }
          this.getData(params)
        }, 1000*constants.TIMEOUTS[this.cfg.period])
      }
      */
    },
    addData(candleData) {
      //add data to the current entry and update past 
      if (this.cfg.chartData.current.timestamp == candleData.time_stamp) return
      var past = this.cfg.chartData.past
      var current = this.cfg.chartData.current
      var copy = Object.assign({}, current)
      past.push(copy)
      current.hi = parseFloat(candleData.high_price)
      current.lo = parseFloat(candleData.low_price)
      current.close = parseFloat(candleData.close_price)
      current.y = parseFloat(candleData.close_price)
      current.avg = (current.hi + current.lo) / 2
      current.open = parseFloat(candleData.open_price)
      current.timestamp = candleData.time_stamp
    },
    start(init) {
      // start the stonks service
      this.refreshDate()
      if (init) {
        this.getStockDetail()
        this.getQuote()
        this.getInfo()
        this.loadData()
      }
      
    },/* FOR REAL TIME 
    halt() {
      //clearTimeout(timeout)
    }, */
    subscribe(view) {
      // provide a view to subscribe to the service
      subscriber = view
      //subscriber.update()
      subscriber.cfg.startDate = this.cfg.chartData.startDate // do this in the view buddy
      subscriber.cfg.period = this.cfg.chartData.period
      this.setStock()
    }
  }
  //stonks.init()
  stonks.start(initStockData)
  return stonks
}

export default Stock
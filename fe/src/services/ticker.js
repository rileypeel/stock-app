// service for fetching/caching ticker data

// constants

// private variables and functions
import httpService from '../services/http.js';


// service object
const tickerService = {
  async getTickers() {
    var tickers = await httpService.get('api/portfolio/stocks');
    return tickers;
  },
  async getTicker(name) {
    var ticker = await httpService.get('api/portfolio/stocks/'.concat(name));
    return ticker; 
  },
  
  async getDaily(ticker) {
    var data = await httpService.get('api/stockdata/'.concat(ticker));
    return data;
  },

  async getMinute(ticker, params) {
    var data = await httpService.get('api/stockdata/.'.concat(ticker), params)
    return data;
  },
  
  async quote(ticker) {
    var quote = await httpService.get('api/stockdata/quote/'.concat(ticker));
    return quote;
  }
}

export default tickerService 
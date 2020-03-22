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

  //Need to create and endpoint for quotes on the backend first 
  //async quote(ticker) {
  //var quote = await httpService.get('api/portfolio/stocks/'.concat(ticker, '/quote'));
  //return quote;
  //}
}

export default tickerService 
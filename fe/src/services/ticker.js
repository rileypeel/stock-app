
// service for fetching/caching ticker data

// constants

// private variables and functions
import httpService from './http.js'
import { INDICATOR_MAPPING } from '../constants/view.js'

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
  
  async getCandleData(ticker, params) {
    var data = await httpService.get('api/stockdata/fhdata/'.concat(ticker), params)
    return data
  },

  async getQuote(ticker) {
    var quote = await httpService.get('api/stockdata/quote/'.concat(ticker));
    return quote;
  },
  async search(search_str) {
    var result = await httpService.get('api/stockdata/search/'.concat(search_str));
    var data = [];
    if(result) {
      for(var i=0;i<result.length;i++) {
        data.push({'value': result[i].ticker, 'name': result[i].name})
      }
    }
    return data;
  },
  async stockInfo(ticker) {
    var result = await httpService.get('api/stockdata/company-info/'.concat(ticker));
    var fundamentalData = {
      'Number of Employees': 'N/A',
      'Year Founded': 'N/A',
      'Market Cap': 'N/A',
      'Shares Outstanding': 'N/A',
      'Revenues': 'N/A',
      'Total Assets': 'N/A',
      'P/B': 'N/A',
      'Price to Free Cash flow': 'N/A',
      'P/E': 'N/A',
      'Dividends per Share': 'N/A',
      'Book Value per Share': 'N/A',
      'EPS': 'N/A'
    }
    if(result) {
      for(var r in result) {
        var ind = result[r].indicatorId
        if(ind in INDICATOR_MAPPING){
          fundamentalData[INDICATOR_MAPPING[ind]] = result[r].value
        }
      }
    }
    return fundamentalData;
  },
  async stockRecommend(ticker) {
    var result = await httpService.get('api/stockdata/recommendation-data/'.concat(ticker))
    return result
  },
  async stockNews() {
    var result = await httpService.get('api/stockdata/news')
    return result
  },
  async indexQuotes() {
    var result = await httpService.get('api/stockdata/index-quote')
    return result
  }
}

export default tickerService;
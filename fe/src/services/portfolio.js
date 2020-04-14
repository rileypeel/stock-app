// service for managing portfolios and transactions for the current user

// constants

// private variables and functions
import httpService from '../services/http.js';
// service object
const portfolioService = {
  async getPortfolios() {
    var portfolios = await httpService.get('api/portfolio');
    return portfolios;
  },
  async getPortfolio(id) {
    // get a portfolio by its id
    var portfolio = await httpService.get('api/portfolio/'.concat(id));
    console.log(portfolio)
    console.log("getting portfolio")
    return portfolio;
  },
  async getHoldings(id) {
    //return holdings for a portfolio
    var holdings = await httpService.get('api/portfolio/'.concat(id, '/holdings'))
    return holdings
  },

  async newPortfolio(payload) {
    // make a new portfolio
   var response = await httpService.post('api/portfolio/', payload);
   console.log(response.status)
   if(response.status == 201) {
     return true;
   } else {
     return false;
   }
  },
  async delPortfolio(id) {
    //delete a portfolio 
    //TODO
    console.log(id)
  },
  async getTransactions(portfolioId) {
    // return a list of transactions for a specific portfolio
    var transactions = await httpService.get('api/portfolio/'.concat(portfolioId, '/transaction'));
    return transactions;
  },
  async newTransaction(payload, portfolioId) {
    // make a new transaction
    var response = await httpService.post('api/portfolio/'.concat(portfolioId, '/transaction'), payload);
    if(response.status == 201) {
      return true;
    } else {
      return false;
    }
  },
}

export default portfolioService 
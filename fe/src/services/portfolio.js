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
    return portfolio;
  },
  async newPortfolio(name, balance) {
    // make a new portfolio
    var payload = {
      name: name,
      balance: balance
    }
    httpService.post('api/portfolio/', payload)
  },
  async getTransactions(portfolioId) {
    // return a list of transactions for a specific portfolio
    var transactions = await httpService.get('api/portfolio/'.concat(portfolioId, '/transaction'));
    return transactions;
  },
  async newTransaction(tickerId, portfolioId, amount, isBuy, price) {
    // make a new transaction
    var payload = {
      is_buy: isBuy,
      number_of_shares: amount,
      price_per_share: price, 
      stock_id: tickerId,
      portfolio_id: portfolioId
    }
    httpService.post('api/portfolio/'.concat(portfolioId, '/transaction'), payload);
  },
}

export default portfolioService 
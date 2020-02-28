// service for managing portfolios and transactions for the current user

// constants

// private variables and functions

// service object
const portfolioService = {
  async getPortfolios(user) {
    // get a list of portfolios of a user
    return []
  },
  async getPortfolio(id) {
    // get a portfolio by its id
    return {}
  },
  async newPortfolio(name) {
    // make a new portfolio
  },
  async getTransactions(portfolioId) {
    // return a list of transactions for a specific portfolio
    return []
  },
  async newTransaction(tickerId, portfolioId, amount, time) {
    // make a new transaction
  },
}

export default portfolioService 
import portfolioService from '../portfolioHttp'
import tickerService from '../ticker'

var obj
function Portfolios(init = false) {
  obj = obj || {
    portfolios: [],
    notLoaded: true,
    currentPortfolio: {
      id: '',
      name: '',
      value: 0,
      holdings: [],
      transactions: [],
      cash: 0
    },
    getPortfolios() {
      portfolioService.getPortfolios().then((portfolios) => {
        this.portfolios = portfolios
        this.notLoaded = false
      })
    },
    getPortfolioDetail(portfolioId) {
      this.currentPortfolio.id = portfolioId
      portfolioService.getPortfolio(portfolioId).then((data) => {
        this.currentPortfolio.name = data['name']
        this.currentPortfolio.cash = parseFloat(data['balance'])
      })
      
      this.getHoldings()
      this.getTransactions()
    },
    getHoldings() {
      portfolioService.getHoldings(this.currentPortfolio.id).then((data) => {
        this.currentPortfolio.value = 0
        this.currentPortfolio.holdings = data
        this.currentPortfolio.holdings.forEach((holding) => {
          tickerService.getQuote(holding.stock).then((data) => {
            holding['latestPrice'] = data['quote']
            holding['marketValue'] = holding.number_of_shares * data['quote']
            holding['bookCost'] = holding.average_cost * holding.number_of_shares
            holding['percentChange'] = (holding['marketValue'] - holding['bookCost']) / holding['bookCost'] * 100
            holding['percentChange'] = holding['percentChange'].toFixed(2)
            this.currentPortfolio.value += holding['marketValue']
            holding['marketValue'] = holding['marketValue'].toFixed(2)
            holding['bookCost'] = holding['bookCost'].toFixed(2)
          })
        })
      })
    },
    getTransactions() {
      portfolioService.getTransactions(this.currentPortfolio.id).then((data) => {
        this.currentPortfolio.transactions = data
      })
    },
    init() {
      this.getPortfolios()
    }
  }
  if (init) obj.init()
  return obj
}

export default Portfolios


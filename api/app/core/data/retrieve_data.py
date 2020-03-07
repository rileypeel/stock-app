from requests import get
from core.data.api_keys import ALPHA_VANTAGE_KEY
from time import sleep

lees_tickers = ["GILD", "BCRX", "DAL", "JNJ", "EKSO", "WFC","FL", "VXRT", "PPG", "TEVA", "INNT"]

def get_quote(ticker):
	res = get(f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={ticker}&outputsize=full&apikey={ALPHA_VANTAGE_KEY}&datatype=csv')

def get_name(ticker):
	"""Given a ticker make an API call to get the companies name"""
	#TODO

def get_historical_daily(ticker):	
	"""Call AlphaVantage Api and get 20 years of daily price data for ticker,
	save this data in a file csv/ticker.csv"""

	res = get(f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={ticker}&outputsize=full&apikey={ALPHA_VANTAGE_KEY}&datatype=csv')
	if res.status_code == 200:
		f = open(f"core/data/csv/{ticker}.csv", "w+")
		f.write(res.text)
		f.close()
		print(f"Successfully retrieved historical data for {ticker}")


def run():

	for t in lees_tickers:
		get_historical_daily(t)
		sleep(15)
	
	get_historical_daily("MSFT")
	
import json, requests, datetime, pytz
from core.data.api_urls import FINNHUB_URL
from core.data.api_keys import FINNHUB_KEY
from core.models import Stock

def datetime_to_unix(date_time):
	"""Convert datetime object to unix timestamp"""
	start_time = pytz.utc.localize(datetime.datetime(1970,1,1))
	return int((date_time-start_time).total_seconds())

def unix_to_datetime(unix_time):
	"""Convert unix timestamp to datetime object"""
	return pytz.utc.localize(datetime.datetime.fromtimestamp(unix_time))

def get_exchange_list():
	"""Get list of exchanges from finnhub api"""
	params = {
		'token': FINNHUB_KEY
	}
	try: 
		res = requests.get(url=f"{FINNHUB_URL}exchange", params=params)
	except:
		return None
	print(res)
	if res.status_code == 200:
		return json.loads(res.text)
	else:
		return None

def get_stock_list(exchange):
	"""Get list of all stocks supported by finnhub api"""

	params = {
		'exchange': exchange,
		'token': FINNHUB_KEY
	}
	try:
		res = requests.get(url=f"{FINNHUB_URL}symbol", params=params)
	except:
		return None
	print(res)
	if res.status_code == 200:
		return res.json()
	else:
		print(res.text)
		return None

def get_data_fh(ticker, time_from, time_to, resolution):
    """Get historical daily data from world trading data api"""
    params = {
    	'symbol': ticker,
    	'to': datetime_to_unix(time_to),
    	'from': datetime_to_unix(time_from),
    	'resolution': resolution,
    	'token': FINNHUB_KEY
    }
    try:
        res = requests.get(url=f"{FINNHUB_URL}candle", params=params)
    except:
        return None

    if res.status_code == 200:
        return json.loads(res.text)
    else:
        return None

def get_recommend(ticker):
	"""get analyst recommendation data from finnhub api"""
	params = {
		'symbol': ticker,
		'token': FINNHUB_KEY,
	}
	try:
		res = requests.get(url=f"{FINNHUB_URL}recommendation", params=params)
	except:
		return None

	if res.status_code == 200:
		return res.json()
	else:

		return None

def format_data(data):
	"""Change the format of the candle data to timestamped list of dicts"""
	formatted_data = []
	for index in range(len(data['t'])):
		formatted_data.append({
			'time_stamp': unix_to_datetime(data['t'][index]),
			'close_price': data['c'][index],
			'open_price': data['o'][index] ,
			'high_price': data['h'][index],
			'low_price': data['l'][index],
			'volume': data['v'][index]
		})	
		index+=1
	return formatted_data


def get_data(ticker, *args):
	"""get data from finnhub api and return"""
	data = get_data_fh(ticker, *args)
	return format_data(data)



def add_stock_list():
	"""Retrieve list of stocks supported by finnhub api and add them to the db"""
	stock_exchanges = ['US', 'TO', 'CN']
	tickers_added = 0
	for ex in stock_exchanges:
		stocks = get_stock_list(ex)
		for ticker in stocks:
			try:
				stock = Stock.objects.get(ticker=ticker['symbol'])
			except Stock.DoesNotExist:
				s = Stock.objects.create(
					ticker=ticker['symbol'],
					name=ticker['description']
				)
				tickers_added += 1 
		
	print(f"Added {tickers_added} to the database.")

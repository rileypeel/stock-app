import json, requests, datetime, pytz
from core.data.api_urls import FINNHUB_URL, FINNHUB_QUOTE_URL, FINNHUB_BASE_URL
from core.data.api_keys import FINNHUB_KEY
from core.models import Stock
from app.utils.exceptions import APIException

INDICES = {'S&P 500': '^GSPC', 'DOW JONES': '^DJI', 'NASDAQ': '^IXIC', 'S&P/TSX Composite': '^GSPTSE'}

def get_exchange_list():
    """Get list of exchanges from finnhub api"""
    params = {
        'token': FINNHUB_KEY,
        'category': 'general'
    }
    try: 
        res = requests.get(url=f"{FINNHUB_URL}exchange", params=params)
    except requests.exceptions.RequestException:
        raise APIException("Failed to connect to Finnhub API")

    if res.status_code == 200:
        return json.loads(res.text)
    raise APIException("Failed to retrieve exchanges from Finnhub API")

def get_stock_list(exchange):
    """Get list of all stocks supported by finnhub api"""
    params = {
        'exchange': exchange,
        'token': FINNHUB_KEY
    }

    try:
        res = requests.get(url=f"{FINNHUB_URL}symbol", params=params)
    except requests.exceptions.RequestException:
        raise APIException("Failed to connect to Finnhub API")
        
    if res.status_code == 200:
        return res.json()
    raise APIException(f"Failed to retrieve data from Finnhub API. Code: {res.status_code}")

def get_data_fh(ticker, time_from, time_to, resolution):
    """Get historical daily data from world trading data api"""
    params = {
        'symbol': ticker,
        'to': time_to,
        'from': time_from,
        'resolution': resolution,
        'token': FINNHUB_KEY
    }
    try:
        res = requests.get(url=f"{FINNHUB_URL}candle", params=params)
    except requests.exceptions.RequestException:
        raise APIException("Failed to connect to Finnhub API")

    if res.status_code == 200:
        return json.loads(res.text)
    raise APIException(f"Failed to retrieve data from Finnhub API. Code: {res.status_code}")

def get_fh_quote(ticker):
    """Get quote for a ticker from finnhub api"""
    params = {
        'symbol': ticker,
        'token': FINNHUB_KEY
    }
    try:
        res = requests.get(url=f"{FINNHUB_QUOTE_URL}", params=params)
    except requests.exceptions.RequestException:
        raise APIException("Failed to connect to Finnhub API")

    if res.status_code == 200:
        return json.loads(res.text)
    raise APIException(f"Failed to retrieve data from Finnhub API. Code: {res.status_code}")

def get_indices_quote():
    """Get quotes for list of major indices"""
    quote_data = {}
    for key in INDICES.keys(): 
        quote_data[key] = get_fh_quote(INDICES[key])
        qd = quote_data[key]
        if qd:
            qd['pchange'] = (qd['c'] - qd['pc'])/qd['pc'] * 100
    return quote_data 

def get_news():
    """Get some general news from finnhub api"""
    params = {
        'token': FINNHUB_KEY
    }
    try: 
        res = requests.get(url=f"{FINNHUB_BASE_URL}news", params=params)
    except requests.exceptions.RequestException as ex:
        raise APIException("Failed to connect to Finnhub API")

    if res.status_code == 200:
        return res.json()
    raise APIException(f"Failed to retrieve data from Finnhub API. Code: {res.status_code}")

def get_recommend(ticker):
    """get analyst recommendation data from finnhub api"""
    params = {
        'symbol': ticker,
        'token': FINNHUB_KEY,
    }
    try:
        res = requests.get(url=f"{FINNHUB_URL}recommendation", params=params)
    except requests.exceptions.RequestException:
        raise APIException("Failed to connect to Finnhub API")

    if res.status_code == 200:
        return res.json()
    else:
        print(f"Error: status code {res.status_code}")

def format_data(data):
    """Change the format of the candle data to timestamped list of dicts"""
    formatted_data = []
    if data['s'] == 'no_data': 
        return formatted_data
    for index in range(len(data['t'])):
        formatted_data.append({
            'time_stamp': data['t'][index],
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

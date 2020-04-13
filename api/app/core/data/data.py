from core.models import Stock, DailyPrice, MinutePrice
import datetime
import pytz
import json
import requests

from core.data.api_keys import ALPHA_VANTAGE_KEY, WORLD_TRADING_DATA_KEY, FINNHUB_KEY
from time import sleep
from core.data.api_urls import TIME_SERIES_URL, QUOTE_URL, INTRADAY_TIME_SERIES_URL, FINNHUB_CANDLE_URL


default_stock_list = ['GE', 'GIS', 'GOOG', 'MSFT', 'AAPL', 'TSLA', 'MMM', 'HD',
                      'JNJ', 'MCD', 'NKE', 'PEP', 'INNT', 'CODX', 'LIFE', 'BA', 'DIS', 'VXRT',
                      'EKSO', 'AMD', 'LMT'
                      ]
intraday_stocks = ['GOOG', 'EKSO']

def check_data(data):
    """Check to make sure data returned from API is valid"""
    if 'Time Series (Daily)' not in data:
        if 'Time Series (1min)' not in data:
            return False
    return True

def is_intraday(stock):
    """Returns true if stock has intraday data."""
    if stock.ticker in intraday_stocks:
        return True
    return False


def get_datetime(date):
    """helper function which takes a date as a string and returns a non naive datetime"""
    timestamp = datetime.datetime.strptime(date, '%Y-%m-%d')
    return pytz.utc.localize(timestamp)


def get_intraday_datetime(date):
    """helper function which takes a date as a string and returns a non naive datetime"""
    timestamp = datetime.datetime.strptime(date, '%Y-%m-%d %H:%M:%S')
    return pytz.utc.localize(timestamp)


def is_full(date):
    """helper function checks if you need to call api with full or compact param"""
    if date:
        delta = pytz.utc.localize(datetime.datetime.now()) - date
        if delta.days < 100:
            return False
    return True


def is_full_intra(last_time):
    """Helper function checks if you need to call api with full of compact param"""
    if last_time:
        delta = pytz.utc.localize(datetime.datetime.now()) - last_time
        if (delta.seconds/60) < 100:
            return False
    return True


def get_intraday(ticker, all_data, interval):
    """Get intraday data from alphavantage"""
    data_size = 'full'
    if not all_data:
        data_size = 'compact'
    try:
        res = requests.get(
            f"""{INTRADAY_TIME_SERIES_URL}&outputsize={data_size}&symbol={ticker}&interval={interval}&apikey={ALPHA_VANTAGE_KEY}&datatype=json""")
    except requests.exception.RequestExceptions:
        return None
    data = json.loads(res.text)
    if res.status_code == 200 and check_data(data):
        return data
    else:
        print(f"Error retrieving intraday data for {ticker}")
        return None


def get_quote(ticker):
    """Get stock quote from alphavantage"""
    try:
        res = requests.get(f"""{QUOTE_URL}&symbol={ticker}&outputsize=full&apikey={ALPHA_VANTAGE_KEY}&datatype=json"""
                  )
    except:

        return None

    if res.status_code == 200:
        return json.loads(res.text)
    else:
        return None


def get_fundamentals(ticker):
    """Given a ticker make an API call to get the companies name and fundamental info"""
    pass

def get_daily_alpha(ticker, all_data):
    """Get historical daily price data from alphavantage"""

    data_size = 'full'
    if not all_data:
        data_size = 'compact'

    try:
        res = requests.get(
            f"{TIME_SERIES_URL}&symbol={ticker}&outputsize={data_size}&apikey={ALPHA_VANTAGE_KEY}&datatype=json")
    except requests.exception.RequestExceptions:
        print(f"Error retrieving data for {ticker}")
    data = json.loads(res.text)
    if res.status_code == 200 and check_data(data):
        return data
    else:
        print(f"Error retrieving data for {ticker}")
        return None


def add_stock_to_db(ticker):
    """Add stock to db if it does not already exist"""

    try:
        Stock.objects.get(ticker=ticker)
        print(f"{ticker} already exists in db.")
    except Stock.DoesNotExist:
        stock = Stock.objects.create(ticker=ticker)
        print(f"Added {ticker} to db.")
        add_daily_data(stock)
        sleep(15)
        if ticker in intraday_stocks:
            add_intraday_data(stock)
            sleep(15)


def update_daily_price(stock, timestamp, data):
    """Update an instance of DailyPrice"""

    try:
        daily_price = DailyPrice.objects.get(stock=stock, time_stamp=timestamp)
    except:
        return
    # TODO use serializer here as well
    daily_price.open_price = data['1. open']
    daily_price.close_price = data['4. close']
    daily_price.high_price = data['2. high']
    daily_price.low_price = data['3. low']
    daily_price.volume = data['6. volume']
    daily_price.save()


def add_daily_price(stock, timestamp, data):
    """Add a daily price object to the db"""

    # TODO use serializer instead of doing manually
    if data is not None:
        DailyPrice.objects.create(
            stock=stock,
            time_stamp=timestamp,
            open_price=float(data['1. open']),
            close_price=float(data['4. close']),
            high_price=float(data['2. high']),
            low_price=float(data['3. low']),
            volume=int(data['6. volume'])
        )


def add_minute_price(stock, timestamp, data):
    """Add intraday minute price data"""

    # TODO use serializer instead of doing manually
    if data is not None:
        minute_price = MinutePrice.objects.create(
            stock=stock,
            time_stamp=timestamp,
            open_price=float(data['1. open']),
            close_price=float(data['4. close']),
            high_price=float(data['2. high']),
            low_price=float(data['3. low']),
            volume=int(data['5. volume'])
        )


def add_daily_data(stock, last_date=None):
    """Add DailyPrice objects for given stock up to the last date stored in the db. 
    If last_date is none then all the data available will be stored in db.
    Update the last date stored in the db as well in case it has changed.
    """

    all_data = is_full(last_date)

    data = get_daily_alpha(stock.ticker, all_data)
    if data is None:
        return
    data = data['Time Series (Daily)']
    for key in data.keys():
        timestamp = get_datetime(key)
        if last_date:
            if timestamp <= last_date:
                update_daily_price(stock, timestamp, data[key])
                break

        add_daily_price(stock, timestamp, data[key])

    if last_date is None:
        print(f"Added data for {stock}.")
    else:
        print(f"Daily price data for {stock} is up to date.")


def add_intraday_data(stock, last_time=None):
    """Add MinutePrice objects for given stock up to the last date stored in the db. 
    If last_date is none then all the data available will be stored in db.
    Update the last date stored in the db as well in case it has changed.
    """
    all_data = is_full_intra(last_time)
    data = get_intraday(stock, all_data, '1min')
    if data is None:
        return
    data = data['Time Series (1min)']

    for key in data.keys():
        timestamp = get_intraday_datetime(key)
        if last_time:
            if timestamp <= last_time:
                break
        add_minute_price(stock, timestamp, data[key])

    if last_time is None:
        print(f"Added intraday data for {stock}.")
    else:
        print(f"Intraday price data for {stock} is up to date.")


def add_stocks(ticker, default):
    """Add stocks to database, price history will be added automatically"""
    if ticker:
        for t in ticker:
            add_stock_to_db(t)

    if default:
        for t in default_stock_list:
            add_stock_to_db(t)


def update_prices():
    """Update the latest price data for every stock in database"""

    stocks = Stock.objects.all()
    for s in stocks:
        latest_price = DailyPrice.objects.filter(stock=s).latest('time_stamp')
        add_daily_data(s, last_date=latest_price.time_stamp)
        #sleep(15)
        if s.ticker in intraday_stocks:
            latest_intra_price = MinutePrice.objects.filter(
                stock=s).latest('time_stamp')
            add_intraday_data(s, last_time=latest_intra_price.time_stamp)
           # sleep(15)


def update_stock(stock):
    """Update the latest price data for given ticker"""

    latest_price = DailyPrice.objects.filter(stock=stock).latest('time_stamp')
    add_daily_data(stock, latest_price.time_stamp)

    if stock.ticker in intraday_stocks:
        latest_intra_price = MinutePrice.objects.filter(
            stock=stock).latest('time_stamp')
        add_intraday_data(stock, latest_intra_price.time_stamp)

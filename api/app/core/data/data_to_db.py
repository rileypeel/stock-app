from django.db import connections
from django.db.utils import OperationalError
from core.models import Stock, DailyPrice
from time import sleep
import datetime
from requests import get
from core.data.retrieve_data import lees_tickers
import csv



def add_stock(ticker):
	"""Add stock to db if it does not already exist"""
	try:
		Stock.objects.get(ticker=ticker)
		print(f"{ticker} already exists in db.")
	except Stock.DoesNotExist:
		#name = retrieve_data.get_name(ticker)
		stock = Stock.objects.create(ticker=ticker)
		stock.save()
		print(f"Added {ticker} to db.")


def add_historical_data(ticker):
	"""Add the price history for the stock into the db"""

	try:
		stock = Stock.objects.get(ticker=ticker)
	except Stock.DoesNotExist:
		print(f"{ticker} does not exist in the database.")
		return 

	try:
		f = open(f"core/data/csv/{ticker}.csv")
		data = csv.DictReader(f)

		for row in data:
			timestamp = datetime.datetime.strptime(row['timestamp'], '%Y-%m-%d')
			daily_price = DailyPrice.objects.create(
				stock=stock,
				time_stamp=timestamp,
				close_price=row['adjusted_close'],
				volume=row['volume']

			)
			daily_price.save()
			
		print(f"Added historical data for {ticker}")

	except IOError:
		print(f"CSV data not found for {ticker}")


def run_add_stock():

	for t in lees_tickers:
		add_stock(t)

def run_add_historical():
	"""
	for t in lees_tickers:
		add_historical_data(t)
	"""
	add_historical_data("GILD")


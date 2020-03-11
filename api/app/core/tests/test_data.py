from django.test import TestCase
from django.db.utils import IntegrityError
from unittest.mock import patch
import json
import datetime, pytz, decimal
from requests import get
from core.models import Stock, DailyPrice, MinutePrice
from core.data.data import update_prices, add_stocks, update_stock
import time


"""TODO CLEANUP AND WRITE MORE TESTS"""

ekso_intra_data = json.loads(open('core/tests/eksointradata.json').read())
tsla_data = json.loads(open('core/tests/tsladata.json').read())
msft_data = json.loads(open('core/tests/msftdata.json').read())
msft_tsla_update_data = json.loads(open('core/tests/teslaupdate2.json').read())
tsla_update_data2 = json.loads(open('core/tests/teslaupdate2.json').read())
tsla_update_data1 = json.loads(open('core/tests/teslaupdate1.json').read())

def str_to_datetime(date_str):

	timestamp = datetime.datetime.strptime(date_str, '%Y-%m-%d')
	return pytz.utc.localize(timestamp)

def datetime_to_str(dt):
	return datetime.datetime.strftime(dt, '%Y-%m-%d')

def datetime_to_str_minute(mt):
	return datetime.datetime.strftime(mt, '%Y-%m-%d %H:%M:%S')

def str_to_decimal(str):
	dec = decimal.Decimal(str)
	return round(dec, 2)

class DailyData(TestCase):
	"""Test adding and updating daily stock data"""

	def setUp(self):
		pass

	@patch('core.data.data.get_daily', return_value=tsla_data)
	def test_adding_stock(self, gd):
		"""Test adding stock automatically adds daily price history"""

		add_stocks(['TSLA'], False)
		stock_exists = True
		prices_exist = True
		try:
			stock = Stock.objects.get(ticker='TSLA')
		except Stock.DoesNotExist:
			stock_exists = False

		try:
			daily_data = DailyPrice.objects.filter(stock=stock)
		except DailyPrice.DoesNotExist:
			prices_exist = False

		self.assertTrue(stock_exists)
		self.assertTrue(prices_exist)

		data = tsla_data['Time Series (Daily)']
		for dp in daily_data:
			self.assertEqual(str_to_decimal(data[datetime_to_str(dp.time_stamp)]['1. open']), dp.open_price)
			self.assertEqual(str_to_decimal(data[datetime_to_str(dp.time_stamp)]['4. close']), dp.close_price)
			self.assertEqual(str_to_decimal(data[datetime_to_str(dp.time_stamp)]['3. low']), dp.low_price)
			self.assertEqual(str_to_decimal(data[datetime_to_str(dp.time_stamp)]['2. high']), dp.high_price)
			self.assertEqual(str_to_decimal(data[datetime_to_str(dp.time_stamp)]['6. volume']), dp.volume)

	@patch('core.data.data.get_daily', return_value=tsla_data)
	def test_violate_unique_together(self, gd):
		"""Test adding two daily prices with the same time_stamp
		for the same ticker raises and exception"""
		add_stocks(['TSLA'], False)

		stock = Stock.objects.get(ticker='TSLA')
		timestamp = DailyPrice.objects.filter(stock=stock).latest('time_stamp').time_stamp
		unique_error = False
		try:
			DailyPrice.objects.create(
				stock=stock,
    			time_stamp=timestamp,
    			open_price=10.00,
    			close_price=10.00,
    			high_price=10.00,
    			low_price=10.00,
    			volume=10
			)
		except IntegrityError:
			unique_error = True
		self.assertTrue(unique_error)

	@patch('time.sleep', return_value=True)
	def test_update_all(self, ts):
		"""Test updating daily data for all stocks"""
		with patch('core.data.data.get_daily', return_value=tsla_data) as gd:
			add_stocks(['TSLA'], False)
		with patch('core.data.data.get_daily', return_value=msft_data) as gd:
			add_stocks(['MSFT'], False)

		tsla = Stock.objects.get(ticker='TSLA')
		msft = Stock.objects.get(ticker='MSFT')

		msft_last_price = DailyPrice.objects.filter(stock=msft).latest('time_stamp')

		with patch('core.data.data.get_daily', return_value=msft_tsla_update_data) as gd:
			update_prices()

		

		tsla_prices = DailyPrice.objects.filter(stock=tsla)
		msft_prices = DailyPrice.objects.filter(stock=msft)
		data = msft_tsla_update_data['Time Series (Daily)']

		for mp in msft_prices:
			print(f"timestamp {mp.time_stamp}")
			print(f"msft close price {mp.close_price}")


		for key in data.keys():
			try:
				dp = DailyPrice.objects.get(stock=tsla, time_stamp=str_to_datetime(key))
				self.assertEqual(str_to_decimal(data[key]['1. open']), dp.open_price)
				self.assertEqual(str_to_decimal(data[key]['4. close']), dp.close_price)
				self.assertEqual(str_to_decimal(data[key]['3. low']), dp.low_price)
				self.assertEqual(str_to_decimal(data[key]['2. high']), dp.high_price)
				self.assertEqual(int(data[key]['6. volume']), int(dp.volume))
			except DailyPrice.DoesNotExist:
				self.assertTrue(False)
		print(f" last price {msft_last_price}")
		for key in data.keys():
			print(f"key {key}")
			try:
				dp = DailyPrice.objects.get(stock=msft, time_stamp=str_to_datetime(key))
				self.assertEqual(str_to_decimal(data[key]['1. open']), dp.open_price)
				self.assertEqual(str_to_decimal(data[key]['4. close']), dp.close_price)
				self.assertEqual(str_to_decimal(data[key]['3. low']), dp.low_price)
				self.assertEqual(str_to_decimal(data[key]['2. high']), dp.high_price)
				self.assertEqual(int(data[key]['6. volume']), int(dp.volume))
			except DailyPrice.DoesNotExist:
				self.assertTrue(False)
			if msft_last_price.time_stamp == str_to_datetime(key):
				break


	def test_update_stock(self):
		"""Test updating history of a stock for multiple days"""
		
		with patch('core.data.data.get_daily', return_value=tsla_data) as gd:
			add_stocks(['TSLA'], False)
		tsla = Stock.objects.get(ticker='TSLA')
		with patch('core.data.data.get_daily', return_value=tsla_data) as gd:
			update_stock(tsla)


		tsla_prices = DailyPrice.objects.filter(stock=tsla)

	def test_updating_last_day(self):
		"""Test updating the last day of a stock only"""
		
		with patch('core.data.data.get_daily', return_value=tsla_data) as gd:
			add_stocks(['TSLA'], False)
		tsla = Stock.objects.get(ticker='TSLA')
		with patch('core.data.data.get_daily', return_value=tsla_update_data1) as gd:
			update_stock(tsla)

		tsla_prices = DailyPrice.objects.filter(stock=tsla)
		for dp in tsla_prices:
			self.assertIn(datetime_to_str(dp.time_stamp), tsla_update_data1['Time Series (Daily)'].keys())

		with patch('core.data.data.get_daily', return_value=tsla_update_data2) as gd:
			update_stock(tsla)



		

		tsla_prices = DailyPrice.objects.filter(stock=tsla)


class IntradayData(TestCase):
	"""Test adding and updating intraday data"""

	@patch('core.data.data.get_intraday', return_value=ekso_intra_data)
	def test_adding_intraday_stock(self, gi):
		"""Test adding stock automatically adds daily price history"""

		add_stocks(['EKSO'], False)
		stock_exists = True
		prices_exist = True
		try:
			stock = Stock.objects.get(ticker='EKSO')
		except Stock.DoesNotExist:
			stock_exists = False

		try:
			intra_data = MinutePrice.objects.filter(stock=stock)
		except DailyPrice.DoesNotExist:
			prices_exist = False

		self.assertTrue(stock_exists)
		self.assertTrue(prices_exist)

		data = ekso_intra_data['Time Series (1min)']
		for ip in intra_data:
			self.assertEqual(str_to_decimal(data[datetime_to_str_minute(ip.time_stamp)]['1. open']), ip.open_price)
			self.assertEqual(str_to_decimal(data[datetime_to_str_minute(ip.time_stamp)]['4. close']), ip.close_price)
			self.assertEqual(str_to_decimal(data[datetime_to_str_minute(ip.time_stamp)]['3. low']), ip.low_price)
			self.assertEqual(str_to_decimal(data[datetime_to_str_minute(ip.time_stamp)]['2. high']), ip.high_price)
			self.assertEqual(int(data[datetime_to_str_minute(ip.time_stamp)]['5. volume']), int(ip.volume))


	def test_update_stock(self):
		"""Test updating history of a stock for multiple days"""
		
		with patch('core.data.data.get_daily', return_value=tsla_data) as gd:
			add_stocks(['TSLA'], False)
		tsla = Stock.objects.get(ticker='TSLA')
		with patch('core.data.data.get_daily', return_value=tsla_data) as gd:
			update_stock(tsla)


		tsla_prices = DailyPrice.objects.filter(stock=tsla)

	def test_updating_last_day(self):
		"""Test updating the last day of a stock only"""
		
		with patch('core.data.data.get_daily', return_value=tsla_data) as gd:
			add_stocks(['TSLA'], False)
		tsla = Stock.objects.get(ticker='TSLA')
		with patch('core.data.data.get_daily', return_value=tsla_update_data1) as gd:
			update_stock(tsla)

		tsla_prices = DailyPrice.objects.filter(stock=tsla)
		for dp in tsla_prices:
			self.assertIn(datetime_to_str(dp.time_stamp), tsla_update_data1['Time Series (Daily)'].keys())

		with patch('core.data.data.get_daily', return_value=tsla_update_data2) as gd:
			update_stock(tsla)

		tsla_prices = DailyPrice.objects.filter(stock=tsla)



		
from django.contrib.auth import get_user_model
from django.urls import reverse 
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Stock, Portfolio, Transaction

from portfolio.serializers import StockSerializer, PortfolioSerializer

PORTFOLIO_URL = reverse('portfolio:portfolios')
TRANSACTION_URL = reverse('portfolio:transaction')

def sample_user(email='sandor@thehound.ca', password='chickens'):
	return get_user_model().objects.create_user(email, password)

def sample_portfolio(user, name='rileys portfolio', balance=10000):

	return Portfolio.objects.create(user=user, name=name, balance=balance)

def sample_stock(name='Apple Inc', ticker='AAPL', last_price=100.00):

	return Stock.objects.create(name=name, ticker=ticker, last_price=last_price)

class PublicApiTests(TestCase):
	"""Test API is not available to unauthenticated users"""
	def setUp(self):
		self.client = APIClient()

	def test_get_portfolio(self):
		"""Test that unauthenticated user can not retrieve portfolios"""
		res = self.client.get(PORTFOLIO_URL)
		self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

class PrivateApiTests(TestCase):
	"""Test API available to authenticated users"""

	def setUp(self):
		self.client = APIClient()
		self.user = get_user_model().objects.create_user(
			'jonsnow@westeros.ca',
			'ghost'
		)
		self.client.force_authenticate(self.user)

	def test_get_portfolio(self):
		"""Test getting portfolios for authenticated user only """
		user1 = self.user
		portfolio = sample_portfolio(user1)
		portfolio.holdings.add(sample_stock())
		user2 = sample_user()
		portfolio2 = sample_portfolio(user2, 'Sandors Portfolio')
		portfolio2.holdings.add(sample_stock('Microsoft Inc.', 'MSFT'))

		res = self.client.get(PORTFOLIO_URL)
		portfolios = Portfolio.objects.filter(user=self.user)
		serializer1 = PortfolioSerializer(portfolios, many=True)
		serializer2 = PortfolioSerializer(portfolio2)
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertEqual(res.data, serializer1.data)
		self.assertEqual(len(res.data),1)

	def test_create_portfolio_no_holdings(self):
		"""Test creating an empty portfolio"""
		payload = {
			'name':'Rileys Portfolio',
			'balance':50000
		}
		res = self.client.post(PORTFOLIO_URL, payload)
		self.assertEqual(res.status_code, status.HTTP_201_CREATED)
		portfolio = Portfolio.objects.get(id=res.data['id'])

		for key in payload.keys():
			self.assertEqual(getattr(portfolio, key), payload[key])

	def test_update_portfolio(self):
		pass

	def test_buying_stock(self):
		"""Test user buying a stock"""
		stock = sample_stock()
		portfolio = sample_portfolio(self.user)
		payload = {'is_buy':True, 'price_per_share':150.00, 'number_of_shares':2, 'ticker':'AAPL', 'portfolio':'rileys portfolio'}
		res = self.client.post(TRANSACTION_URL, payload)

		self.assertEqual(res.status_code, status.HTTP_201_CREATED)
		#TODO add more assertions to make sure portfolio is updated and trasaction object is saved correctly

	def test_buying_stock_invalid(self):
		"""Test buying stock with not enough money in portfolio"""
		stock = sample_stock()
		portfolio = sample_portfolio(self.user, balance=100.00)
		payload = {'is_buy':True, 'price_per_share':150.00, 'number_of_shares':2, 'ticker':'AAPL', 'portfolio':'rileys portfolio'}
		res = self.client.post(TRANSACTION_URL, payload)
		print(res.data)
		self.assertEqual(res.status_code, status.HTTP_409_CONFLICT)
		
		#TODO add more assertions to make sure no changes to portfolio and transaction is not saved

	def test_selling_stock(self):
		pass


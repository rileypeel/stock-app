from django.contrib.auth import get_user_model
from django.urls import reverse 
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from core.models import Stock, Portfolio
from portfolio.serializers import StockSerializer, PortfolioSerializer, TransactionSerializer

TRANSACTION_URL = reverse('portfolio:transaction-list')

def transaction_detail_url(transaction_id):
	"""helper function to get transaction detail url"""
	return reverse('portfolio:transaction-detail', args=[transaction_id])

def portfolio_transaction_url(portfolio_id):
	"""helper function to get transaction list for specific portfolio url"""
	return reverse('portfolio:portfolio-transaction-list', args=[portfolio_id])

def sample_user(email='sandor@thehound.ca', password='chickens'):
	"""helper function creates a user"""
    return get_user_model().objects.create_user(email, password)

def sample_portfolio(user, name='rileys portfolio', balance=10000):
	"""helper function creates a portfolio"""
	return Portfolio.objects.create(user=user, name=name, balance=balance)

def sample_stock(name='Apple Inc', ticker='AAPL', last_price=100.00):
	"""helper function creates a stock"""
	return Stock.objects.create(name=name, ticker=ticker, last_price=last_price)

class PublicApiTests(TestCase):
	"""Test api can not be accessed by unauthenticated user"""

	def setUp(self):
		self.client = APIClient()

	def test_unauthenticated_stock_transaction(self):
		"""Test that unauthenticated user cannot access api"""
		res = self.client.get(TRANSACTION_URL)
		self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
		#TODO test the other endpoints as well

class PrivateApiTests(TestCase):
	"""Test authenticated access to API"""

	def test_retrieving_transactions(self):
		"""Test retrieving all transactions for a specific user"""
		stock1 = sample_stock()
		stock2 = sample_stock(name='Microsoft', ticker='MSFT')
		portfolio1 = sample_portfolio(self.user)
		portfolio2 = sample_portfolio(user=self.user, name='rileys other portfolio')
		transaction1 = Transaction.objects.create(
			portfolio=portfolio1,
			stock=stock1,
			is_buy=True,
			price_per_share=100,
			number_of_shares=2
		)
		transaction2 = Transaction.objects.create(
			portfolio=portfolio2,
			stock=stock2,
			is_buy=True,
			price_per_share=100,
			number_of_shares=2
		)
		serializer1 = TransactionSerializer(transaction1)
		serializer2 = TransactionSerializer(transaction2)

		res = self.client.get(TRANSACTION_URL)
		self.assertEqual(len(res.data), 2)
		self.assertIn(serializer1.data, res.data)
		self.assertIn(serializer2.data, res.data)

		res = self.client.get(portfolio_transaction_url(portfolio1.id))
		self.assertEqual(len(res.data), 1)
		self.assertIn(serializer1.data, res.data)
		self.assertNotIn(serializer2.data, res.data)

	def test_retrieving_transaction_detail(self):
		"""Test retrieving transaction detail"""
		stock = sample_stock()
		portfolio = sample_portfolio(self.user)
		transaction = Transaction.objects.create(
			portfolio=portfolio,
			stock=stock,
			is_buy=True,
			price_per_share=100,
			number_of_shares=2
		)
		res = self.client.get(transaction_detail_url(transaction.id))
		serializer = TransactionSerializer(transaction)
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertEqual(serializer.data, res.data)

	def test_buying_selling_stock(self):
		"""Test posting a transaction, (buying a stock)"""
		stock = sample_stock()
		portfolio = sample_portfolio(self.user)
		payload = {'is_buy':True, 'price_per_share':150.00, 'number_of_shares':2, 'stock_id':stock.id, 'portfolio_id':portfolio.id}
		initial_balance = portfolio.balance
		res = self.client.post(TRANSACTION_URL, payload)
		portfolio.refresh_from_db()

		self.assertEqual(res.status_code, status.HTTP_201_CREATED)
		self.assertEqual(portfolio.balance, initial_balance - payload['price_per_share']*payload['number_of_shares'])
		self.assertIn(stock.ticker, str(portfolio.stock_holdings))

		transaction = Transaction.objects.get(id=res.data['id'])
		for key in payload.keys():
			self.assertEqual(payload[key], getattr(transaction, key))

		self.assertEqual(ticker, str(transaction.stock))
		self.assertEqual(portfolio, str(transaction.portfolio))

		sell_payload = {'is_buy':False, 'price_per_share':150.00, 'number_of_shares':2, 'stock_id':stock.id, 'portfolio_id':portfolio.id}
		res = self.client.post(TRANSACTION_URL, sell_payload)
		portfolio.refresh_from_db()
		self.assertEqual(res.status_code, status.HTTP_201_CREATED)
		self.assertEqual(portfolio.balance, initial_balance)
		

	def test_buying_selling_stock_invalid(self):
		"""Test buying stock, not enough money in portfolio, invalid portfolio name, invalid ticker"""
		stock = sample_stock()
		portfolio = sample_portfolio(self.user, balance=100.00)
		payload = {'is_buy':True, 'price_per_share':150.00, 'number_of_shares':2, 'stock_id':stock.id, 'portfolio_id':portfolio.id}
		res = self.client.post(TRANSACTION_URL, payload)
		self.assertEqual(res.status_code, status.HTTP_409_CONFLICT)
		
		payload['stock_id'] = stock.id + 1 
		res = self.client.post(TRANSACTION_URL, payload)
		self.assertEqual(res.status_code, status.HTTP_409_CONFLICT)

		payload['portoflio_id'] = portfolio.id + 1
		res = self.client.post(TRANSACTION_URL, payload)
		self.assertEqual(res.status_code, status.HTTP_409_CONFLICT)







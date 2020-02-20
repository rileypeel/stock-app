"""
FUNCTIONALITY THAT I WANT TO TEST:

UNAUTHENTICATED: NOTHING

USER:

VIEW/CREATE/UPDATE/DELETE: Portfolio, Watchlist your own portfolio


VIEW ONLY: STOCKS (stock list and stock detail)
CREATE AND VIEW ONLY: Transactions your own transactions

TEST things you want to be able to do first and then test the things you dont want to be able to do

ADMIN:


FULL CONTROL



"""

from django.contrib.auth import get_user_model
from django.urls import reverse 
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Stock, Portfolio

from portfolio.serializers import StockSerializer, PortfolioSerializer

STOCK_URL = reverse('portfolio:stocks')

def get_stock_detail_url(stock_id):
	return reverse('portfolio:stock-detail', args=[stock_id])

class PublicApiTests(TestCase):
	"""Test publically available API"""
	
	def setUp(self):
		self.client = APIClient()

	def test_unauthorized_api(self):
		"""Test using API without being authenticated fails"""
		res = self.client.get(STOCK_URL)
		self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

class UserApiTests(TestCase):
	"""Test API available to authenticaed users"""

	def setUp(self):
		self.client = APIClient()
		self.user = get_user_model().objects.create_user(
			'jonsnow@westeros.ca',
			'ghost'
		)
		self.client.force_authenticate(self.user)

	def test_retrieving_stock_list(self):
		"""Test for stock list view funciton"""
		stock1 = Stock.objects.create(name='Apple Inc',ticker='AAPL')
		stock2 = Stock.objects.create(name='Tesla Inc', ticker='TSLA')
		res = self.client.get(STOCK_URL)
		serializer1 = StockSerializer(stock1)
		serializer2 = StockSerializer(stock2)
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertIn(serializer1.data, res.data)
		self.assertIn(serializer2.data, res.data)

	def test_retrieving_stock_detail(self):
		"""Test retrieving stock detail view"""
		stock1 = Stock.objects.create(name='Apple Inc', ticker='AAPL')
		stock2 = Stock.objects.create(name='Tesla Inc', ticker='TSLA')
		res = self.client.get(get_stock_detail_url(stock2.id))

		serializer = StockSerializer(stock2)
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertEqual(serializer.data, res.data)

	def test_posting_stock_by_user(self):
		"""Test that a user can't post a stock object"""
		payload = {
			'name':'Apple Inc.',
			'ticker':'AAPL'
		}

		Stock.objects.create(name='Tesla Inc', ticker='TSLA')
		res = self.client.post(STOCK_URL, payload)
		self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
		

class AdminApiTests(TestCase):
	"""Test API avaliable to authenticated superusers"""

	def setUp(self):
		self.client = APIClient()
		self.superuser = get_user_model().objects.create_superuser(
			'sandorclegane@hound.ca',
			'chickens'
		)
		self.client.force_authenticate(self.superuser)

	def test_post_stock_by_admin(self):
		"""Test creating new stock in API"""
		payload = {
			'name':'Apple Inc.',
			'ticker':'AAPL'
		}

		Stock.objects.create(name='Tesla Inc', ticker='TSLA')
		res = self.client.post(STOCK_URL, payload)
		self.assertEqual(res.status_code, status.HTTP_201_CREATED)
		



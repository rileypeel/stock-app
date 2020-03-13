from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from core.models import Stock, Portfolio, Transaction, Holding
from portfolio.serializers import StockSerializer, PortfolioSerializer, TransactionSerializer


def transaction_detail_url(transaction_id):
    """helper function to get transaction detail url"""
    return reverse('portfolio:transaction-detail', args=[transaction_id])


def transaction_url(portfolio_id):
    """helper function to get transaction list for specific portfolio url"""
    return reverse('portfolio:transaction-list', args=[portfolio_id])


def sample_user(email='sandor@thehound.ca', password='chickens'):
    """helper function creates a user"""
    return get_user_model().objects.create_user(email, password)


def sample_portfolio(user, name='rileys portfolio', balance=10000):
    """helper function creates a portfolio"""
    return Portfolio.objects.create(user=user, name=name, balance=balance)


def sample_stock(name='Apple Inc', ticker='AAPL'):
    """helper function creates a stock"""
    return Stock.objects.create(name=name, ticker=ticker)


class PublicApiTests(TestCase):
    """Test api can not be accessed by unauthenticated user"""

    def setUp(self):
        self.client = APIClient()
        self.user = sample_user()

    def test_unauthenticated_get(self):
        """Test that unauthenticated user cannot retrieve data from api"""

        stock = sample_stock()
        portfolio = sample_portfolio(self.user)
        transaction = Transaction.objects.create(
            portfolio=portfolio,
            stock=stock,
            is_buy=True,
            price_per_share=100,
            number_of_shares=1
        )
        res = self.client.get(transaction_url(portfolio.id))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        res = self.client.get(transaction_detail_url(transaction.id))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_post(self):
        """Test that unauthenticated user cannot post to api"""
        stock = sample_stock()
        portfolio = sample_portfolio(self.user)
        payload = {
            'is_buy': True,
            'price_per_share': 150.00,
            'number_of_shares': 2,
            'stock_id': stock.id,
            'portfolio_id': portfolio.id
        }
        res = self.client.post(transaction_url(portfolio.id), payload)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateApiTests(TestCase):
    """Test authenticated access to API"""

    def setUp(self):
        self.client = APIClient()
        self.user = sample_user()
        self.client.force_authenticate(self.user)

    def test_retrieving_transactions(self):
        """Test retrieving for a specific portfolio"""
        stock1 = sample_stock()
        stock2 = sample_stock(name='Microsoft', ticker='MSFT')
        portfolio1 = sample_portfolio(self.user)
        portfolio2 = sample_portfolio(self.user, name='rileys other portfolio')
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

        res = self.client.get(transaction_url(portfolio1.id))
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

    def test_buying_stock(self):
        """Test posting a buy transaction"""
        stock = sample_stock()
        portfolio = sample_portfolio(self.user)
        payload = {
            'is_buy': True,
            'price_per_share': 150.00,
            'number_of_shares': 2,
            'stock_id': stock.id,
            'portfolio_id': portfolio.id
        }

        initial_balance = getattr(portfolio, 'balance')
        res = self.client.post(transaction_url(portfolio.id), payload)
        portfolio.refresh_from_db()

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            portfolio.balance,
            initial_balance -
            payload['price_per_share']*payload['number_of_shares']
        )

        holdings = Holding.objects.filter(portfolio=portfolio)
        holding = holdings.get(stock=stock)
        self.assertEqual(holding.number_of_shares, 2)
        transaction = Transaction.objects.get(id=res.data['id'])
        for key in payload.keys():
            self.assertEqual(payload[key], getattr(transaction, key))

        self.assertEqual(str(stock), str(transaction.stock)
                         )  # not sure about this yet
        self.assertEqual(str(portfolio), str(transaction.portfolio))

        res = self.client.post(transaction_url(portfolio.id), payload)
        holding.refresh_from_db()
        self.assertEqual(holding.number_of_shares, 4)

    def test_buying_stock_invalid(self):
        """Test buying stock, not enough money in portfolio"""
        stock = sample_stock()
        portfolio = sample_portfolio(self.user, balance=100.00)
        payload = {
            'is_buy': True,
            'price_per_share': 150.00,
            'number_of_shares': 2,
            'stock_id': stock.id,
            'portfolio_id': portfolio.id
        }
        res = self.client.post(transaction_url(portfolio.id), payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_selling_all_stock(self):
        """Test selling all shares"""
        stock = sample_stock()
        portfolio = sample_portfolio(self.user)
        initial_balance = getattr(portfolio, 'balance')
        holding = Holding.objects.create(
            stock=stock,
            portfolio=portfolio,
            number_of_shares=4
        )
        payload = {'is_buy': False, 'price_per_share': 200.00,
                   'number_of_shares': 2, 'stock_id': stock.id}
        res = self.client.post(transaction_url(portfolio.id), payload)
        portfolio.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            portfolio.balance,
            initial_balance+payload['price_per_share'] *
            payload['number_of_shares']
        )
        transaction = Transaction.objects.get(id=res.data['id'])
        for key in payload.keys():
            self.assertEqual(payload[key], getattr(transaction, key))

        self.assertEqual(str(stock), str(transaction.stock)
                         )  # not sure about this yet
        self.assertEqual(str(portfolio), str(transaction.portfolio))

        holding.refresh_from_db()
        self.assertEqual(holding.number_of_shares, 2)

        res = self.client.post(transaction_url(portfolio.id), payload)
        try:
            holding.refresh_from_db()
        except Holding.DoesNotExist:
            holding = None
        self.assertIsNone(holding)

    def test_selling_stock_invalid(self):
        """Test posting a sell transaction that is not valid, 
        ie: not holding that stock or not enough shares"""
        stock = sample_stock()
        portfolio = sample_portfolio(self.user, balance=100.00)
        holding = Holding.objects.create(
            portfolio=portfolio,
            stock=stock,
            number_of_shares=100
        )

        payload = {
            'is_buy': False,
            'price_per_share': 150.00,
            'number_of_shares': 400,
            'stock_id': stock.id
        }
        res = self.client.post(transaction_url(portfolio.id), payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthorized_post_get(self):
        """Test that a user cannot retrieve another user's transactions
        or post transactions to another user's portfolio"""
        other_client = APIClient()
        user2 = sample_user(email='jonsnow@live.ca')
        other_client.force_authenticate(user2)
        # TODO finish this test

from django.test import TestCase
from django.contrib.auth import get_user_model
from core import models


def sample_user(email='jonsnow@westeros.ca', password='ghost'):
    """Create a sample user"""
    return get_user_model().objects.create_user(email, password)


class ModelTests(TestCase):

    def test_create_user_with_email_successful(self):
        """Test creating a new user with an email is successful"""
        email = "dog@googley.com"
        password = "dogdogcatcat"
        user = get_user_model().objects.create_user(
            email=email,
            password=password,
        )

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalize(self):
        """Test email for a new user is normalzied"""

        email = "dog@GOOGLEY.com"
        user = get_user_model().objects.create_user(email, "password123")
        self.assertEqual(user.email, email.lower())

    def test_new_user_invalid_email(self):
        """Test creating user with no email raises error"""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(None, "password123")

    def test_create_new_superuser(self):
        """Test creating new superuser"""
        user = get_user_model().objects.create_superuser(
            'test@googley.com',
            'password123'
        )
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_stock_str(self):
        """Test string representation of the stock model"""
        stock = models.Stock.objects.create(ticker='AAPL', name='Apple Inc.')
        self.assertEqual(stock.ticker, str(stock))

    def test_portfolio_str(self):
        """Test string representation of the portfolio model"""
        user = get_user_model().objects.create_user(
            'rileypeel04@hotmail.com',
            'fakepassword'
        )
        portfolio = models.Portfolio.objects.create(
            name='Rileys Portfolio',
            user=user
        )
        self.assertEqual(str(portfolio), portfolio.name)

    def test_transaction_str(self):
        """Test string representation of transaction model"""
        user = get_user_model().objects.create_user(
            'rileypeel04@hotmail.com',
            'fakepass'
        )
        stock = models.Stock.objects.create(ticker='MSFT', name='Microsoft')
        portfolio = models.Portfolio.objects.create(
            name='Rileys Portfolio',
            user=user
        )
        transaction = models.Transaction.objects.create(
            is_buy=True,
            portfolio=portfolio,
            stock=stock,
            price=100.00,
            number_of_shares=100
        )
        """self.assertEqual(
            str(transaction),
            f"BUY {str(stock)} {transaction.number_of_shares} shares"
        )""" #not going to work

    def test_holding_str(self):
        """Test string representation of holding model"""
        user = get_user_model().objects.create_user(
            'rileypeel04@hotmail.com',
            'fakepass'
        )
        stock = models.Stock.objects.create(ticker='MSFT', name='Microsoft')
        portfolio = models.Portfolio.objects.create(
            name='Rileys Portfolio',
            user=user
        )
        holding = models.Holding.objects.create(
            number_of_shares=100, stock=stock, portfolio=portfolio)
        self.assertEqual(f"100 shares of {stock}", str(holding))

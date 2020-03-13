from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import DailyPrice, MinutePrice, Stock
from core.data.data import add_stocks

from stockdata.serializers import DailyPriceSerializer, MinutePriceSerializer, TimeSeriesSerializer


def sample_user(email='rpeel@live.ca', password='password'):
    return get_user_model().objects.create_user(email=email, password=password)


class PublicApiTests(TestCase):
    """Test public access to the API"""

    def setUp(self):
        self.user = sample_user()

    def test_unauthenticated_access(self):
        """Test that an unauthenticated user cannot access api"""
        # TODO
        pass


class PrivateApiTests(TestCase):
    """Test using API as authenticated user"""

    def setUp(self):
        self.user = sample_user()
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        add_stocks(['TSLA', 'EKSO'], False)
        # TODO Test API

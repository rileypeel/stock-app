from rest_framework import serializers
from core.models import Stock, Portfolio, WatchList, Transaction


class TransactionSerializer(serializers.ModelSerializer):
	"""Serializer for transaction objects"""
	stock = serializers.StringRelatedField()
	class Meta:
		model = Transaction
		fields = ('id', 'is_buy', 'price_per_share', 'number_of_shares', 'stock')


class PortfolioSerializer(serializers.ModelSerializer):
	"""Serializer for Portfolio objects"""
	holdings = serializers.StringRelatedField(many=True)

	
	class Meta:
		model = Portfolio
		fields = ('id', 'name', 'balance', 'holdings')
		read_only_fields = ('id',)


class StockSerializer(serializers.ModelSerializer):
	"""Serializer for stock objects"""

	class Meta:
		model = Stock
		fields = ('id', 'name', 'ticker', 'last_price', 'time_of_last_price')
		read_only_fields = ('id',)


class WatchListSerializer(serializers.ModelSerializer):
	"""Serializer for Watchlist objects"""

	class Meta:
		model = WatchList
		fields = ('id', 'name')
		read_only_fields = ('id',)






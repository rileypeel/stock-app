from rest_framework import serializers
from core.models import Stock, Portfolio, Transaction, Holding


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for transaction objects"""
    stock = serializers.StringRelatedField()
    portfolio = serializers.StringRelatedField()
    time_stamp = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Transaction
        fields = ('id', 'is_buy', 'price',
                  'number_of_shares', 'stock', 'portfolio', 
                  'limit_price', 'order_type', 'time_stamp',)
        read_only_fields = ('id',)

    def validate(self, data):
        """Validate that there is enough money in the portfolio account,
        and that they have enough shares to sell"""
        portfolio = self.context.get('portfolio')
        stock = self.context.get('stock')
        holding = self.context.get('holding')
        if data['is_buy'] == True:
            if portfolio.balance < data['price']*data['number_of_shares']:
                raise serializers.ValidationError(
                    "Insufficient account balance.")
        else:
            if holding is None:
                raise serializers.ValidationError(
                    "You are not holding this stock.")
            if holding.number_of_shares < data['number_of_shares']:
                raise serializers.ValidationError(
                    "You do not have enough shares to sell")
        return data
        

class PortfolioSerializer(serializers.ModelSerializer):
    """Serializer for Portfolio objects"""

    class Meta:
        model = Portfolio
        fields = ('id', 'name', 'balance')
        read_only_fields = ('id',)

    def validate_balance(self, value):
        if value < 0:
            raise serializers.ValidationError("balance cannot be less than zero")
        return value

class StockSerializer(serializers.ModelSerializer):
    """Serializer for stock objects"""

    class Meta:
        model = Stock
        fields = ('id', 'name', 'ticker')
        read_only_fields = ('id',)

class HoldingSerializer(serializers.ModelSerializer):
    """Serializer for Holding objects"""
    stock = serializers.StringRelatedField()
    portfolio = serializers.StringRelatedField()
    
    class Meta:
        model = Holding
        fields = ('id', 'stock', 'portfolio', 'number_of_shares', 'average_cost')
        read_only_fields = ('id',)

from rest_framework import serializers
from core.models import DailyPrice, MinutePrice


class TimeSeriesSerializer(serializers.Serializer):
    """Serializer for truncated time series data"""
    stock = serializers.IntegerField()
    trunc_time_stamp = serializers.DateTimeField()
    open_price = serializers.DecimalField(max_digits=12, decimal_places=3)
    close_price = serializers.DecimalField(max_digits=12, decimal_places=3)
    high_price = serializers.DecimalField(max_digits=12, decimal_places=3)
    low_price = serializers.DecimalField(max_digits=12, decimal_places=3)
    volume = serializers.IntegerField()


class DailyPriceSerializer(serializers.ModelSerializer):
    """Serializer for DailyPrice objects"""
    class Meta:
        model = DailyPrice
        fields = (
            'id',
            'stock',
            'time_stamp',
            'close_price',
            'open_price',
            'low_price',
            'high_price',
            'volume',
        )
        read_only_fields = ('id',)


class MinutePriceSerializer(serializers.ModelSerializer):
    """Serializer for MinutePrice objects"""
    class Meta:
        model = MinutePrice
        fields = (
            'id',
            'stock',
            'time_stamp',
            'close_price',
            'open_price',
            'low_price',
            'high_price',
            'volume',
        )
        read_only_fields = ('id',)

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models.functions import Trunc
from django.db.models import F, Avg, DateTimeField
import time, json, datetime
from core.models import MinutePrice, DailyPrice, Stock
from stockdata import serializers
from portfolio.serializers import StockSerializer
import core.data.finnhub_data as fh
from core.data.simfin_data import get_data
from app.utils.exceptions import APIException

class DailyPrices(APIView):
    """Endpoint for retrieving daily price stock data from database, not currently used in Application"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, ticker):
        """GET endpoint for daily stock data"""
        try:
            stock = Stock.objects.get(ticker=ticker)
        except Stock.DoesNotExist:
            data = get_daily_fh(ticker)
            if data:
                return Response(data=data, status=status.HTTP_200_OK)
            else:
                return Response(status.HTTP_404_NOT_FOUND)

        start_date = request.GET.get('date', '2000-01-01')
        start_date = parse_date(start_date)

        queryset = DailyPrice.objects.filter(stock=stock).exclude(
            time_stamp__lte=start_date).order_by('-time_stamp')

        weekly = request.GET.get('weekly', False)
        monthly = request.GET.get('monthly', False)
        yearly = request.GET.get('yearly', False)
        trunc_interval = ''
        if weekly == '1':
            trunc_interval = 'week'
        elif monthly == '1':
            trunc_interval = 'month'
        elif yearly == '1':
            trunc_interval = 'year'
        else:
            serializer = serializers.DailyPriceSerializer(queryset, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        aggregated_data = queryset.annotate(
            trunc_time_stamp=Trunc(
                'time_stamp',
                trunc_interval,
                output_field=DateTimeField())
        ).values(
            'trunc_time_stamp'
        ).annotate(
            stock=F('stock'),
            close_price=Avg('close_price'),
            open_price=Avg('open_price'),
            high_price=Avg('high_price'),
            low_price=Avg('low_price'),
            volume=Avg('volume')
        ).order_by('trunc_time_stamp')

        serializer = serializers.TimeSeriesSerializer(
            list(aggregated_data), many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class MinutePrices(APIView):
    """Endpoint for intraday stock data from database, not currently used in application"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        """Get endpoint for intraday prices"""
        try:
            stock = Stock.objects.get(id=id)
        except Stock.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)

        if not is_intraday(stock):
            return Response(status.HTTP_404_NOT_FOUND)

        update_stock(stock)
        start_time = request.GET.get('datetime', '2000-01-01-00-00-00')
        start_time = parse_datetime(start_time)
        queryset = MinutePrice.objects.filter(stock=stock).exclude(
            time_stamp__lte=start_time).order_by('-time_stamp')

        hourly = request.GET.get('hourly', False)
        trunc_interval = ''
        if hourly == '1':
            trunc_interval = 'hour'
        else:
            serializer = serializers.MinutePriceSerializer(queryset, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        aggregated_data = queryset.annotate(
            trunc_time_stamp=Trunc(
                'time_stamp',
                trunc_interval,
                output_field=DateTimeField())
        ).values(
            'trunc_time_stamp'
        ).annotate(
            stock=F('stock'),
            close_price=Avg('close_price'),
            open_price=Avg('open_price'),
            high_price=Avg('high_price'),
            low_price=Avg('low_price'),
            volume=Avg('volume')
        ).order_by('trunc_time_stamp')
        serializer = serializers.TimeSeriesSerializer(
            list(aggregated_data), many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class Quote(APIView):
    """Endpoint for stock quotes."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, ticker):
        """Get quote for ticker"""
        data = fh.get_fh_quote(ticker)
        return Response(data=data, status=status.HTTP_200_OK)

class CompanyInfo(APIView):
    """Endpoint for company info"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, ticker):
        """get info for ticker"""
        data = get_data(ticker)
        if data is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        print(data)
        return Response(status=status.HTTP_200_OK, data=data)


class FinnhubData(APIView):
    """Endpoint for stock price data"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, ticker):
        """Get candlestick data from the finnhub api"""
        time_from = request.GET.get('from', '946684800')
        time_to = request.GET.get('to', str(int(time.time())))
        resolution = request.GET.get('resolution', 'D')
        try:
            data = fh.get_data(ticker, time_from, time_to, resolution)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not len(data):
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = serializers.DataSerializer(data, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class StockSearch(APIView):
    """Endpoint for searching if a stock exists"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, search_str):
        """query database for stocks matching given string"""
        try: 
            tickers = Stock.objects.filter(ticker__istartswith=search_str)
        except Stock.DoesNotExist:
            print("No matching tickers found.")
        else:
            stocks = tickers
        try: 
            names = Stock.objects.filter(name__istartswith=search_str)
        except Stock.DoesNotExist:
            print("No matching company names found.")
        else: 
            stocks = stocks.union(names) if stocks else names

        if not stocks:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = StockSerializer(stocks, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class AnalystRecommendation(APIView):
    """Endpoint for analyst recommendations"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, ticker):
        """Endpoint for analyst reccomendations"""
        try:
            data = fh.get_recommend(ticker)
        except APIException:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_200_OK, data=data)


class StockNews(APIView):
    """Endpoint for getting stock news"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Endpoint for getting news"""
        try:
            data = fh.get_news()
        except APIException:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_200_OK, data=data)

class IndexQuotes(APIView):
    """Endpoint for getting quotes for major indices"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Endpoint for get requests"""
        try:
            data = fh.get_indices_quote()
        except APIException:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(data=data, status=status.HTTP_200_OK)
        
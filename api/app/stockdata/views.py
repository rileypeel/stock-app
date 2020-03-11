from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.db.models.functions import Trunc
from django.db.models import F, Avg, DateTimeField
import pytz, datetime
from core.data.data import update_stock
from core.models import MinutePrice, DailyPrice, Stock
from core.data.data import is_intraday
from stockdata import serializers

def parse_datetime(datetime_str):
	"""helper fucntion for parsing date and times given in query params"""
	try:
		timestamp = datetime.datetime.strptime(datetime_str, '%Y-%m-%d-%H-%M-%S')
	except ValueError:
		timestamp = datetime.datetime(2000, 1, 1, 0, 0, 0)
	return pytz.utc.localize(timestamp)

def parse_date(date_str):
	"""helper fucntion for parsing dates given in query params"""
	try:
		timestamp = datetime.datetime.strptime(date_str, '%Y-%m-%d')
	except ValueError:
		timestamp = datetime.datetime(2000,1,1)
	return pytz.utc.localize(timestamp)
	
class DailyPrices(APIView):
	"""View for retrieving all stocks"""
	authentication_classes = [TokenAuthentication]
	permission_classes = [IsAuthenticated]
	def get(self, request, id):
		"""Return all stocks in the database"""
		try:
			stock = Stock.objects.get(id=id)
		except Stock.DoesNotExist:
			return Response(status.HTTP_404_NOT_FOUND)

		update_stock(stock)
		start_date = request.GET.get('date', '2000-01-01')
		start_date = parse_date(start_date)
	
		queryset = DailyPrice.objects.filter(stock=stock).exclude(time_stamp__lte=start_date).order_by('-time_stamp')

		weekly = request.GET.get('weekly', False)
		monthly = request.GET.get('monthly', False)
		yearly = request.GET.get('yearly', False)
		trunc_interval = ''
		if weekly:
			trunc_interval = 'week'
		elif monthly:
			trunc_interval = 'month'
		elif yearly:
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
		
		serializer = serializers.TimeSeriesSerializer(list(aggregated_data), many=True)
		return Response(data=serializer.data, status=status.HTTP_200_OK)


class MinutePrices(APIView):
	"""View for retrieving all stocks"""
	authentication_classes = [TokenAuthentication]
	permission_classes = [IsAuthenticated]

	def get(self, request, id):
		"""Return all stocks in the database"""
		try:
			stock = Stock.objects.get(id=id)
		except Stock.DoesNotExist:
			return Response(status.HTTP_404_NOT_FOUND)

		if not is_intraday(stock):
			return Response(status.HTTP_404_NOT_FOUND)

		update_stock(stock)

		start_time = request.GET.get('datetime', '2000-01-01-00-00-00')
		start_time = parse_datetime(start_time)

		queryset = MinutePrice.objects.filter(stock=stock).exclude(time_stamp__lte=start_time).order_by('-time_stamp')

		hourly = request.GET.get('hourly', False)
		trunc_interval = ''
		if hourly:
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
		
		serializer = serializers.TimeSeriesSerializer(list(aggregated_data), many=True)
		return Response(data=serializer.data, status=status.HTTP_200_OK)

from rest_framework.decorators import action
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import viewsets, mixins, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from core.models import Stock, Portfolio, WatchList
from portfolio import serializers


class ListStocks(APIView):
	is_admin = IsAdminUser()
	is_authenticated = IsAuthenticated()
	authentication_classes = [TokenAuthentication]
	
	def get(self, request):
		"""Return all stocks in the database"""
		stocks = Stock.objects.all()
		serializer = serializers.StockSerializer(stocks, many=True)
		return Response(data=serializer.data, status=status.HTTP_200_OK)

	def post(self, request):
		"""Create a new stock object in the database"""
		serializer = serializers.StockSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
		return Response(status=status.HTTP_201_CREATED)

	def get_permissions(self):
		"""Override get_permissions so only admins can create new stocks"""
		if self.request.method=='POST':
			return [is_admin]
		else:
			return [is_authenticated]

class StockDetail(APIView):

	authentication_classes = [TokenAuthentication]
	permission_classes = [IsAuthenticated]

	def get(self, request, id):
		"""Return a detail view of a stock"""
		try:
			stock = Stock.objects.get(id=id)
		except Stock.NotFoundError:
			return Response(status=status.HTTP_404_NOT_FOUND)

		serializer = serializers.StockSerializer(stock)
		return Response(data=serializer.data, status=status.HTTP_200_OK)


class PortfolioView(APIView):

	authentication_classes = [TokenAuthentication]
	permission_classes = [IsAuthenticated]

	def get(self, request):
		"""return portfolios assigned to user"""
		portfolios = Portfolio.objects.filter(user=self.request.user).distinct()
		serializer = serializers.PortfolioSerializer(portfolios, many=True)
		return Response(data=serializer.data, status=status.HTTP_200_OK)

	def post(self, request):
		"""Create a new portfolio"""
		serializer = serializers.PortfolioSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save(user=request.user)
			return Response(data=serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)
		
	def patch(self):
		pass

class TransactionView(APIView):

	authentication_classes = [TokenAuthentication]
	permission_classes = [IsAuthenticated]

	def post(self, request):
		"""Allow a user to post transactions aka buy or sell a stock"""
		try:
			portfolio = Portfolio.objects.get(name=request.data['portfolio'])
		except Portfolio.DoesNotExist:
			return Response(status=status.HTTP_404_NOT_FOUND)

		try:
			stock = Stock.objects.get(ticker=request.data['ticker'])
		except Stock.DoesNotExist:
			return Response(status=status.HTTP_404_NOT_FOUND)

		serializer = serializers.TransactionSerializer(data=request.data)

		if serializer.is_valid():
			if request.data['is_buy']:
				if float(request.data['price_per_share'])*int(request.data['number_of_shares'])>portfolio.balance:
					return Response(status=status.HTTP_409_CONFLICT)
			
			portfolio.holdings.add(stock)
			serializer.save(asset=stock, portfolio=portfolio, user=request.user)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)

class WatchListStocks(APIView):
	pass




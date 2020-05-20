from rest_framework.views import APIView
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from core.models import Stock, Portfolio, Holding, Transaction, DailyPrice
from portfolio import serializers
from core.data import finnhub_data as fh
from decimal import Decimal

class ListStocks(APIView):
    """View for retrieving all stocks"""
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
        is_admin = IsAdminUser()
        is_authenticated = IsAuthenticated()
        if self.request.method == 'POST':
            return [is_admin]
        else:
            return [is_authenticated]


class StockDetail(APIView):
    """View for retrieving stock detail"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, ticker):
        """Return a detail view of a stock"""
        try:
            stock = Stock.objects.get(ticker=ticker)
        except Stock.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.StockSerializer(stock)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class PortfolioView(APIView):
    """Create a portfolio and retrieve all portfolios for a user"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """return portfolios assigned to user"""
        portfolios = Portfolio.objects.filter(
            user=self.request.user).distinct()
        serializer = serializers.PortfolioSerializer(portfolios, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
        
    def post(self, request):
        """Create a new portfolio"""
        serializer = serializers.PortfolioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class PortfolioDetailView(APIView):
    """View for retrieving portfolio detail and updating portfolio"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        """get portfolio detail"""
        try:
            portfolio = Portfolio.objects.get(id=id)
        except Portoflio.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)

        if self.request.user != portfolio.user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = serializers.PortfolioSerializer(portfolio)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    def patch(self, request, id):
        """Update name/balance of a portfolio"""
        try:
            portfolio = Portfolio.objects.get(id=id)
        except Portoflio.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)

        if self.request.user != portfolio.user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = serializers.PortfolioSerializer(portfolio, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK, data=serializer.data)
        return Response(status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        """Delete a portfolio"""
        try:
            portfolio = Portfolio.objects.get(id=id)
        except Portfolio.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        portfolio.delete()
        return Response(status=status.HTTP_200_OK)

class TransactionView(APIView):
    """View for retrieving and posting transactions"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        """Return the transactions associated with the portfolio id given"""
        try:
            portfolio = Portfolio.objects.get(user=self.request.user, id=id)
        except Portfolio.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)

        if self.request.user != portfolio.user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        transactions = Transaction.objects.filter(portfolio=portfolio)
        serializer = serializers.TransactionSerializer(transactions, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    def post(self, request, id):
        """Allow a user to post transactions aka buy or sell a stock"""
        
        try:
            portfolio = Portfolio.objects.get(id=id)
        except Portfolio.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if self.request.user != portfolio.user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            stock = Stock.objects.get(ticker=request.data.get('ticker'))
        except Stock.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except KeyError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            holding = Holding.objects.filter(
                portfolio=portfolio).get(stock=stock)
        except Holding.DoesNotExist:
            holding = None
        
        data = request.data.dict()
        if data['order_type'] == 'Market':
            data['price'] = fh.get_fh_quote(stock.ticker)['c']

        context = {'portfolio': portfolio, 'stock': stock, 'holding': holding}
        serializer = serializers.TransactionSerializer(
            data=data, context=context)
        
        if serializer.is_valid():
            
            num_shares = serializer.validated_data['number_of_shares']
            price = serializer.validated_data['price']
            
            if serializer.validated_data['is_buy']:
                if holding is None:
                    Holding.objects.create(
                        portfolio=portfolio,
                        stock=stock,
                        number_of_shares=num_shares,
                        average_cost=price
                    )
                else:
                    holding.number_of_shares = int(
                        holding.number_of_shares) + num_shares
                    holding.average_cost = holding.average_cost + price
                    holding.save()
                portfolio.balance = portfolio.balance - price * num_shares
            else:
                if num_shares == int(holding.number_of_shares):
                    holding.delete()
                else:
                    holding.number_of_shares = int(
                        holding.number_of_shares) - num_shares
                    holding.average_cost -= price * num_shares
                    holding.save()
                portfolio.balance = portfolio.balance + price * num_shares
            serializer.save(stock=stock, portfolio=portfolio)
            portfolio.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionDetailView(APIView):
    """Transaction Detail View"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        """Return transaction detail view for transaction with id"""
        try:
            transaction = Transaction.objects.get(id=id)
        except Transaction.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if self.request.user != transaction.portfolio.user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = serializers.TransactionSerializer(transaction)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

class HoldingView(APIView):
    """Endpoint for holding objects"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        """Return holding objects associated with portfolio_id"""
        try:
            portfolio = Portfolio.objects.get(id=id)
        except Portfolio.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        holdings = Holding.objects.filter(portfolio=portfolio)
        serializer = serializers.HoldingSerializer(holdings, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)



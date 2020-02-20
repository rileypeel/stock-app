from django.urls import path, include 
from portfolio import views
from rest_framework.routers import DefaultRouter

#router = DefaultRouter()
#router.register('stocks', )
app_name = 'portfolio'

urlpatterns = [
	path('stocks', views.ListStocks.as_view(), name='stocks'),
	path('stocks/<int:id>', views.StockDetail.as_view(), name='stock-detail'),
	path('portfolios', views.PortfolioView.as_view(), name='portfolios'),
	path('portfolios/transaction', views.TransactionView().as_view(), name='transaction')
]

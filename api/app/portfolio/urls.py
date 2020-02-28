from django.urls import path, include 
from portfolio import views
from rest_framework.routers import DefaultRouter

app_name = 'portfolio'

urlpatterns = [
	path('stocks', views.ListStocks.as_view(), name='stock-list'),
	path('stocks/<int:id>', views.StockDetail.as_view(), name='stock-detail'),
	path('portfolio', views.PortfolioView.as_view(), name='portfolio-list'),
	path('portfolio/transaction', views.TransactionView().as_view(), name='transaction-list'),
	path('portfolio/<int:id>', views.PortfolioDetailView().as_view(), name='portfolio-detail'),
	path('portfolio/transaction/<int:id>', views.PortfolioDetailView().as_view(), name='transaction-detail'),
	path('portfolio/<int:id>/transaction', views.PortfolioDetailView().as_view(), name='portfolio-transaction-list')
]

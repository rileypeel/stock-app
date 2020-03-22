from django.urls import path, include
from portfolio import views
from rest_framework.routers import DefaultRouter

app_name = 'portfolio'

urlpatterns = [
    path('stocks', views.ListStocks.as_view(), name='stock-list'),
    path('stocks/<str:ticker>', views.StockDetail.as_view(), name='stock-detail'),
    path('', views.PortfolioView.as_view(), name='portfolio-list'),
    path('/<int:id>', views.PortfolioDetailView.as_view(),
         name='portfolio-detail'),
    path('/transaction/<int:id>',
         views.TransactionDetailView.as_view(), name='transaction-detail'),
    path('/<int:id>/transaction',
         views.TransactionView.as_view(), name='transaction-list')
]

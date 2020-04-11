from django.urls import path, include
from stockdata import views

app_name = 'stockdata'

urlpatterns = [
    path('<str:ticker>', views.DailyPrices.as_view(), name='daily-prices'),
    path('intraday/<int:id>', views.MinutePrices.as_view(), name='minute-prices'),
    path('quote/<str:ticker>', views.Quote.as_view(), name='quote'),
]

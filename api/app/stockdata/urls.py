from django.urls import path, include
from stockdata import views

app_name = 'stockdata'

urlpatterns = [
    path('<str:ticker>', views.DailyPrices.as_view(), name='daily-prices'),
    path('intraday/<int:id>', views.MinutePrices.as_view(), name='minute-prices'),
    path('quote/<str:ticker>', views.Quote.as_view(), name='quote'),
    path('company-info/<str:ticker>', views.CompanyInfo.as_view(), name='info'),
    path('fhdata/<str:ticker>', views.FinnhubData.as_view(), name='fh'),
    path('recommendation-data/<str:ticker>', views.AnalystRecommendation.as_view(), name='recommend'),
    path('search/<str:ticker_str>', views.StockSearch.as_view(), name='search')
]

from django.core.management.base import BaseCommand
from core.data.finnhub_data import add_stock_list


class Command(BaseCommand):
    """Django command to add stocks to the database,
    Use -t ticker1 ticker2 .... to add stocks, otherwise giving -d flag will 
    add a default list of stocks.
    """

    def handle(self, *args, **options):
        add_stock_list()

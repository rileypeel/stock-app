from django.core.management.base import BaseCommand
from core.data.data import add_stocks


class Command(BaseCommand):
    """Django command to add stocks to the database,
    Use -t ticker1 ticker2 .... to add stocks, otherwise giving -d flag will 
    add a default list of stocks.
    """

    def add_arguments(self, parser):
        parser.add_argument('-t', '--tickers', nargs='+',
                            help="list of tickers to add to the database")
        parser.add_argument(
            '-d', '--default', action='store_true', help='add default ticker list')

    def handle(self, *args, **options):
        tickers = options['tickers']
        default = options['default']
        add_stocks(tickers, default)

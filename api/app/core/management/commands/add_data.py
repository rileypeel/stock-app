import time 
from django.db import connections
from django.db.utils import OperationalError
from django.core.management.base import BaseCommand
from core.data.data_to_db import run_add_stock, run_add_historical

class Command(BaseCommand):
	"""Django command to pause execution until database is available"""

	def add_arguments(self, parser):
		parser.add_argument('-sd', '--stock_data', action="store_true", help="Add stocks to the database.")
		parser.add_argument('-hd', '--historical_data', action="store_true", help="Add historical stock data to database")


	def handle(self, *args, **options):
		
		stock_data = options['stock_data']
		historical_data = options['historical_data']

		if stock_data:
			run_add_stock()

		if historical_data:
			run_add_historical()
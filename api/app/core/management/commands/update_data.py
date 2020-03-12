
from django.core.management.base import BaseCommand
from core.data.data import update_prices

class Command(BaseCommand):
	"""Django command to update prices of all stocks in the database with most recent data."""

	def handle(self, *args, **options):
		update_prices()
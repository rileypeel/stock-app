import time 
from django.db import connections
from django.db.utils import OperationalError
from django.core.management.base import BaseCommand
from core.data.retrieve_data import run

class Command(BaseCommand):
	"""Django command to pause execution until database is available"""

	def handle(self, *args, **options):
		run()
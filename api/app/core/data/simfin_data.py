import json
import requests
from core.data.api_keys import SIMFIN_KEY
from core.data.api_urls import SIMFIN_ID_URL, SIMFIN_INFO_URL
from app.utils.exceptions import APIException

SIMFIN_INDICATORS = '0-3, 0-5, 0-6, 0-73, 4-11, 0-64, 0-65, 0-66, 1-1, 2-41, 4-16, 4-27, 4-14, 4-29, 4-18, 4-12'
LARGE_NUMBER_INDICATORS = ['2-41', '1-1', '0-64', '4-11'] 

def parse_data(data):
	"""helper function to make long numbers more readable"""
	for d in data:
		if d['indicatorId'] in LARGE_NUMBER_INDICATORS: 
			num = int(int(d['value'])/1000000)
			d['value'] = f' {num:,d} (in millions)'
		elif d['indicatorId'] == '0-3':
			num = int(d['value'])
			d['value'] = f'{num:,d}'
	return data

def get_simfin_id(ticker):
	"""Call simfin api to get the id for the ticker"""
	try:
		res = requests.get(f"{SIMFIN_ID_URL}{ticker}?api-key={SIMFIN_KEY}")
	except requests.exceptions.RequestException:
		raise APIException(f"Error connecting to Simfin API")

	if res.status_code == 200:
		data = json.loads(res.text)
		if not len(data):
			raise APIException(f"No data returned from Simfin API")
		return data[0]['simId']
	raise APIException(f"No data returned from Simfin API")

def get_company_info(simfin_id):
	"""Call simfin api to get the company info for given id"""
	try:
		res = requests.get(f"{SIMFIN_INFO_URL}{simfin_id}/ratios?api-key={SIMFIN_KEY}&indicators={SIMFIN_INDICATORS}")
	except requests.exceptions.RequestException:
		raise APIException(f"Error connecting to Simfin API")

	if res.status_code == 200:
		return res.json()
	raise APIException(f"No data returned from Simfin API")

def get_data(ticker):
	simfin_id = get_simfin_id(ticker)
	if simfin_id:
		data = get_company_info(simfin_id)
		return parse_data(data)
	return None




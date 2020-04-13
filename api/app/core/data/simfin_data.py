
import json
import requests
from core.data.api_keys import SIMFIN_KEY
from core.data.api_urls import SIMFIN_ID_URL, SIMFIN_INFO_URL

SIMFIN_INDICATORS = '0-3, 0-5, 0-6, 0-73, 4-11, 0-64, 0-65, 0-66, 1-1, 2-41, 4-16, 4-27, 4-14, 4-29, 4-18, 4-12'

def get_simfin_id(ticker):
	"""Call simfin api to get the id for the ticker"""
	try:
		res = requests.get(f"{SIMFIN_ID_URL}{ticker}?api-key={SIMFIN_KEY}")
	except e:
		print(e)

	if res.status_code == 200:
		data = json.loads(res.text)
		print(data)
		return data[0]['simId']
	else:
		return None

def get_company_info(simfin_id):
	"""Call simfin api to get the company info for given id"""
	try:
		res = requests.get(f"{SIMFIN_INFO_URL}{simfin_id}/ratios?api-key={SIMFIN_KEY}&indicators={SIMFIN_INDICATORS}")
	except e:
		print(e)

	if res.status_code == 200:
		data = res.json()
		return data
	else:
		return None

def get_data(ticker):

	data = get_company_info(get_simfin_id(ticker))
	return data





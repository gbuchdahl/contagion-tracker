import api
import pytest
import unittest
import requests

from state_codes import STATE_CODES
from country_codes import COUNTRY_CODES

URL_BASE = "http://localhost:5000/{}"

@pytest.fixture()
def client():
    with api.app.test_client() as client:
        api.app.config['TESTING'] = True
        yield client

def test_get_time_with_GET(client):
    r = client.get(URL_BASE.format("time"))
    assert r.status_code == 200
    assert r.is_json
    assert r.get_json().get("time")

def test_get_by_state_with_GET(client):
    r = client.get(URL_BASE.format("us/NY"))
    assert r.status_code == 200
    assert r.is_json
    assert r.get_json().get("state_code") == "NY"

def test_get_by_state_with_POST(client):
    r = client.post(URL_BASE.format("us/NY"))
    assert r.status_code == 405

def test_get_by_state_with_PUT(client):
    r = client.put(URL_BASE.format("us/NY"))
    assert r.status_code == 405

def test_get_by_state_with_DELETE(client):
    r = client.delete(URL_BASE.format("us/NY"))
    assert r.status_code == 405


def test_get_by_state_with_valid_date(client):
    r = client.get(URL_BASE.format("us/NY?date=19_07_2020"))
    assert r.status_code == 200

def test_get_by_state_with_invalid_date(client):
    r = client.get(URL_BASE.format("us/NY?date=asd07_2020"))
    assert r.status_code == 400

def test_get_by_state_with_no_date(client):
    r0 = client.get(URL_BASE.format("us/NY"))
    r1 = client.get(URL_BASE.format("us/NY?date=19_07_2020")) 

    assert r0.get_json().get("date") == r1.get_json().get("date")

def test_get_by_state_with_invalid_state(client):
    r = client.get(URL_BASE.format("us/asdfa"))
    assert r.status_code == 406
    print(r.get_json())

#TODO: remove check for state_code == "AS"
def test_get_by_state_with_all_valid_states(client):
    for code in STATE_CODES:
        if code == "AS":
            continue
        r = client.get(URL_BASE.format("us/{}".format(code)))
        assert r.status_code == 200
        assert r.is_json

def test_get_state_with_date_out_of_range(client):
    r = client.get(URL_BASE.format("us/NY?date=10_05_2100"))
    assert r.status_code == 404


def test_get_dpm_by_state_with_GET(client):
    r = client.get(URL_BASE.format("us-dpm/NY"))
    assert r.status_code == 200
    assert r.is_json
    assert r.get_json().get("new_deaths_per_million") is not None


def test_get_dpm_by_state_with_valid_date(client):
    r = client.get(URL_BASE.format("us-dpm/NY?date=19_07_2020"))
    assert r.status_code == 200
    assert r.is_json

def test_get_dpm_by_state_with_invalid_date(client):
    r = client.get(URL_BASE.format("us-dpm/NY?date=as_as"))
    assert r.status_code == 400

def test_get_dpm_by_state_with_invalid_state(client):
    r = client.get(URL_BASE.format("us-dpm/OhHiMark"))
    assert r.status_code == 406


def test_get_dpm_by_state_with_POST(client):
    r = client.put(URL_BASE.format("us-dpm/NY"))
    assert r.status_code == 405

def test_get_dpm_by_state_with_PUT(client):
    r = client.put(URL_BASE.format("us-dpm/NY"))
    assert r.status_code == 405

def test_get_dpm_by_state_with_DELETE(client):
    r = client.delete(URL_BASE.format("us-dpm/NY"))
    assert r.status_code == 405


def test_get_dpm_by_state_with_date_out_of_range(client):
    r = client.get(URL_BASE.format("us-dpm/NY?date=10_05_2100"))
    assert r.status_code == 404


def test_get_by_country_with_GET(client):
    r = client.get(URL_BASE.format("world/JAM"))
    assert r.status_code == 200

def test_get_by_country_with_POST(client):
    r = client.post(URL_BASE.format("world/JAM"))
    assert r.status_code == 405

def test_get_by_country_with_PUT(client):
    r = client.put(URL_BASE.format("world/JAM"))
    assert r.status_code == 405

def test_get_by_country_with_DELETE(client):
    r = client.delete(URL_BASE.format("world/JAM"))
    assert r.status_code == 405


def test_get_by_country_with_valid_date(client):
    r = client.get(URL_BASE.format("world/GBR?date=20_07_2020"))
    assert r.status_code == 200
    assert r.get_json().get("date")

def test_get_by_country_with_invalid_date(client):
    r = client.get(URL_BASE.format("world/GBR?date=20sdxasdf_07_2020"))
    assert r.status_code == 400

def test_get_by_country_with_invalid_country(client):
    r = client.get(URL_BASE.format("world/GBRaasdf"))
    assert r.status_code == 406

def test_get_by_country_with_date_out_of_range(client):
    r = client.get(URL_BASE.format("world/GBR?date=10_05_2100"))
    assert r.status_code == 404

def test_get_by_country_with_all_valid_states(client):
    for code in COUNTRY_CODES:
        r = client.get(URL_BASE.format("world/{}".format(code)))
        assert r.status_code == 200
        assert r.is_json

def test_get_dpm_by_country_with_GET(client):
    r = client.get(URL_BASE.format("world-dpm/JAM"))
    assert r.status_code == 200

def test_get_dpm_by_country_with_POST(client):
    r = client.post(URL_BASE.format("world-dpm/JAM"))
    assert r.status_code == 405

def test_get_dpm_by_country_with_PUT(client):
    r = client.put(URL_BASE.format("world-dpm/JAM"))
    assert r.status_code == 405 

def test_get_dpm_by_country_with_DELETE(client):
    r = client.delete(URL_BASE.format("world-dpm/JAM"))
    assert r.status_code == 405 

def test_get_dpm_by_country_with_valid_date(client):
    r = client.get(URL_BASE.format("world-dpm/GBR?date=10_3_2020"))
    assert r.status_code == 200
    assert r.get_json().get("date")

def test_get_dpm_by_country_with_invalid_date(client):
    r = client.get(URL_BASE.format("world-dpm/GBR?date=1asdf asd"))
    assert r.status_code == 400

def test_get_dpm_by_country_with_invalid_country(client):
    r = client.get(URL_BASE.format("world-dpm/adfa"))
    assert r.status_code == 406

def test_get_dpm_by_country_with_date_out_of_range(client):
    r = client.get(URL_BASE.format("world-dpm/GBR?date=10_05_2100"))
    assert r.status_code == 404

def test_get_us_dpm_by_date_with_GET(client):
    r = client.get(URL_BASE.format("us-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 200
    assert r.get_json().get("len")

def test_get_us_dpm_by_date_with_POST(client):
    r = client.post(URL_BASE.format("us-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 405

def test_get_us_dpm_by_date_with_PUT(client):
    r = client.put(URL_BASE.format("us-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 405

def test_get_us_dpm_by_date_with_DELETE(client):
    r = client.put(URL_BASE.format("us-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 405

def test_get_us_dpm_by_date_with_invalid_date(client):
    r = client.get(URL_BASE.format("us-dpm-by-date?date=asdfas"))
    assert r.status_code == 400

def test_get_us_dpm_by_date_with_date_out_of_range(client):
    r = client.get(URL_BASE.format("us-dpm-by-date?01_10_2100"))
    assert r.status_code == 200
    assert r.get_json().get("len") == 0

def test_get_world_dpm_by_date_with_GET(client):
    r = client.get(URL_BASE.format("world-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 200
    assert r.is_json
    assert r.get_json().get("len")

def test_get_world_dpm_by_date_with_POST(client):
    r = client.post(URL_BASE.format("world-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 405

def test_get_world_dpm_by_date_with_PUT(client):
    r = client.put(URL_BASE.format("world-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 405

def test_get_world_dpm_by_date_with_DELETE(client):
    r = client.delete(URL_BASE.format("world-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 405

def test_get_world_dpm_by_date_with_invalid_date(client):
    r = client.get(URL_BASE.format("world-dpm-by-date?date=asdfas"))
    assert r.status_code == 400

def test_get_world_dpm_by_date_with_date_out_of_range(client):
    r = client.get(URL_BASE.format("world-dpm-by-date?01_10_2100"))
    assert r.status_code == 200
    assert r.get_json().get("len") == 0


def test_get_world_cpm_avg_by_date_with_GET(client):
    r = client.get(URL_BASE.format("world-cpm-avg-by-date?date=10_05_2020&window=5"))
    assert r.status_code == 200
    assert r.get_json().get("len") != 0

def test_get_world_cpm_avg_by_date_with_POST(client):
    r = client.post(URL_BASE.format("world-cpm-avg-by-date?date=10_05_2020&window=5"))
    assert r.status_code == 405

def test_get_world_cpm_avg_by_date_with_PUT(client):
    r = client.put(URL_BASE.format("world-cpm-avg-by-date?date=10_05_2020&window=5"))
    assert r.status_code == 405

def test_get_world_cpm_avg_by_date_with_DELETE(client):
    r = client.delete(URL_BASE.format("world-cpm-avg-by-date?date=10_05_2020&window=5"))
    assert r.status_code == 405

def test_get_world_cpm_avg_by_date_with_invalid_date(client):
    r = client.get(URL_BASE.format("world-cpm-avg-by-date?date=asdfasd020&window=5"))
    assert r.status_code == 400 

def test_get_world_cpm_avg_by_date_with_date_out_of_range(client):
    r = client.get(URL_BASE.format("world-cpm-avg-by-date?date=10_05_2100&window=5"))
    assert r.status_code == 200 
    assert r.get_json().get("len") == 0

def test_get_world_cpm_avg_by_date_with_invalid_window(client):
    r = client.get(URL_BASE.format("world-cpm-avg-by-date?date=10_05_2020&window=hello"))
    assert r.status_code == 400


def test_get_us_cpm_avg_by_date_with_GET(client):
    r = client.get(URL_BASE.format("us-cpm-avg-by-date?date=10_05_2020&window=5"))
    assert r.status_code == 200
    assert r.get_json().get("len") != 0

def test_get_us_cpm_avg_by_date_with_POST(client):
    r = client.post(URL_BASE.format("us-cpm-avg-by-date?date=10_05_2020&window=5"))
    assert r.status_code == 405

def test_get_us_cpm_avg_by_date_with_PUT(client):
    r = client.put(URL_BASE.format("us-cpm-avg-by-date?date=10_05_2020&window=5"))
    assert r.status_code == 405

def test_get_us_cpm_avg_by_date_with_DELETE(client):
    r = client.delete(URL_BASE.format("us-cpm-avg-by-date?date=10_05_2020&window=5"))
    assert r.status_code == 405

def test_get_us_cpm_avg_by_date_with_invalid_date(client):
    r = client.get(URL_BASE.format("us-cpm-avg-by-date?date=asdfasd020&window=5"))
    assert r.status_code == 400 

def test_get_us_cpm_avg_by_date_with_date_out_of_range(client):
    r = client.get(URL_BASE.format("us-cpm-avg-by-date?date=10_05_2100&window=5"))
    assert r.status_code == 200 
    assert r.get_json().get("len") == 0

def test_get_us_cpm_avg_by_date_with_invalid_window(client):
    r = client.get(URL_BASE.format("us-cpm-avg-by-date?date=10_05_2020&window=hello"))
    assert r.status_code == 400


def test_get_us_cpm_by_date_with_GET(client):
    r = client.get(URL_BASE.format("us-cpm-by-date?date=10_05_2020"))
    assert r.status_code == 200
    assert r.get_json().get("len") != 0

def test_get_us_cpm_by_date_with_POST(client):
    r = client.post(URL_BASE.format("us-cpm-by-date?date=10_05_2020"))
    assert r.status_code == 405

def test_get_us_cpm_by_date_with_PUT(client):
    r = client.put(URL_BASE.format("us-cpm-by-date?date=10_05_2020"))
    assert r.status_code == 405

def test_get_us_cpm_by_date_with_DELETE(client):
    r = client.delete(URL_BASE.format("us-cpm-by-date?date=10_05_2020"))
    assert r.status_code == 405

def test_get_us_cpm_by_date_with_invalid_date(client):
    r = client.get(URL_BASE.format("us-cpm-by-date?date=asdfasd020"))
    assert r.status_code == 400 

def test_get_us_cpm_by_date_with_date_out_of_range(client):
    r = client.get(URL_BASE.format("us-cpm-by-date?date=10_05_2100"))
    assert r.status_code == 200 
    assert r.get_json().get("len") == 0


def test_get_world_cpm_by_date_with_GET(client):
    r = client.get(URL_BASE.format("world-cpm-by-date?date=10_05_2020"))
    assert r.status_code == 200
    assert r.get_json().get("len") != 0

def test_get_world_cpm_by_date_with_POST(client):
    r = client.post(URL_BASE.format("world-cpm-by-date?date=10_05_2020"))
    assert r.status_code == 405

def test_get_world_cpm_by_date_with_PUT(client):
    r = client.put(URL_BASE.format("world-cpm-by-date?date=10_05_2020"))
    assert r.status_code == 405

def test_get_world_cpm_by_date_with_DELETE(client):
    r = client.delete(URL_BASE.format("world-cpm-by-date?date=10_05_2020"))
    assert r.status_code == 405

def test_get_world_cpm_by_date_with_invalid_date(client):
    r = client.get(URL_BASE.format("world-cpm-by-date?date=asdfasd020"))
    assert r.status_code == 400 

def test_get_world_cpm_by_date_with_date_out_of_range(client):
    r = client.get(URL_BASE.format("world-cpm-by-date?date=10_05_2100"))
    assert r.status_code == 200 
    assert r.get_json().get("len") == 0

def test_get_world_hashtag_popularity(client):
    r = client.get(URL_BASE.format("world-hashtag-popularity/GBR?date=05_07_2020&maxSize=100"))
    assert r.status_code == 200
    doc = r.get_json()
    assert doc.get("len") == 100
    assert doc.get("date")
    assert doc.get("val")
    exampleDoc = doc.get("val")[0]
    assert exampleDoc.get("popularity") is not None
    assert exampleDoc.get("hashtag") is not None
    assert exampleDoc.get("region_code") is not None

def test_get_world_hashtags(client):
    r = client.get(URL_BASE.format("world-hashtags/USA?date=05_07_2020"))
    assert r.status_code == 200
    doc = r.get_json()
    assert doc.get("date")
    assert doc.get("len") == 100
    assert doc.get("val")
    exampleDoc = doc.get("val")[0]
    assert exampleDoc.get("hashtag") is not None
    assert exampleDoc.get("frequency_per_thousand") is not None
    assert exampleDoc.get("region_code") is not None

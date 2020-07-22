import api
import pytest
import unittest
import requests

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


def test_root_page_with_GET(client):
    pass
def test_root_page_with_POST(client):
    pass
def test_root_page_with_PUT(client):
    pass
def test_root_page_with_DELETE(client):
    pass



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



def test_get_dpm_by_state_with_GET(client):
    r = client.get(URL_BASE.format("us-dpm/NY"))
    assert r.status_code == 200
    assert r.is_json
    assert r.get_json().get("new_deaths_per_million") is not None

def test_get_dpm_by_state_with_POST(client):
    r = client.put(URL_BASE.format("us-dpm/NY"))
    assert r.status_code == 405

def test_get_dpm_by_state_with_PUT(client):
    r = client.put(URL_BASE.format("us-dpm/NY"))
    assert r.status_code == 405

def test_get_dpm_by_state_with_DELETE(client):
    r = client.delete(URL_BASE.format("us-dpm/NY"))
    assert r.status_code == 405


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


def test_get_us_dpm_by_date_with_GET(client):
    r = client.get(URL_BASE.format("us-dpm-by-date?date=10_06_2020"))

def test_get_us_dpm_by_date_with_POST(client):
    r = client.post(URL_BASE.format("us-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 405

def test_get_us_dpm_by_date_with_PUT(client):
    r = client.put(URL_BASE.format("us-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 405

def test_get_us_dpm_by_date_with_DELETE(client):
    r = client.put(URL_BASE.format("us-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 405

def test_get_world_dpm_by_date_with_GET(client):
    pass

def test_get_world_dpm_by_date_with_POST(client):
    r = client.post(URL_BASE.format("world-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 405

def test_get_world_dpm_by_date_with_PUT(client):
    r = client.put(URL_BASE.format("world-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 405

def test_get_world_dpm_by_date_with_DELETE(client):
    r = client.delete(URL_BASE.format("world-dpm-by-date?date=10_06_2020"))
    assert r.status_code == 405


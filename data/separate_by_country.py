from pymongo import MongoClient
import getpass
import csv
from datetime import datetime

user = "writeuser"
password = getpass.getpass()
uri = "mongodb+srv://{}:{}@data.ybs5g.mongodb.net/?retryWrites=true&w=majority".format(user, password)

client = MongoClient(uri)
covid_world = client.data.covid_world
world_countries = client.data.world_countries

giant_record = covid_world.find_one()
delete_id = giant_record["_id"]
to_insert_world_countries = []
to_insert_covid_world = []

for country_code in giant_record:
    if country_code == "_id": continue

    record = giant_record[country_code]
    case_data = record.pop("data")

    record["country_code"] = country_code
    to_insert_world_countries.append(record)
    for single_data in case_data:
        single_data["country_code"] = country_code
        year, month, day = single_data["date"].split("-")
        single_data["date"] = datetime(int(year), int(month), int(day))
        to_insert_covid_world.append(single_data)

world_countries.insert_many(to_insert_world_countries)
covid_world.insert_many(to_insert_covid_world)
covid_world.delete_one({"_id" : delete_id})

# Create Indices
world_countries.create_index([("country_code", 1)])
world_countries.create_index([("population", 1)])
world_countries.create_index([("hospital_beds_per_thousand", 1)])

covid_world.create_index([("country_code", 1), ("date", 1)])
covid_world.create_index([("country_code", 1), ("new_cases", 1)])


client.close()

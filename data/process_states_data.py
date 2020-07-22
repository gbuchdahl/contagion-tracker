from pymongo import MongoClient
import getpass
import csv
from datetime import datetime

def remove_quotes(arr):
    for i, element in enumerate(arr):
        arr[i] = element.replace("\"", "")

    return arr

user = "root"
password = getpass.getpass()
uri = "mongodb+srv://{}:{}@data.ybs5g.mongodb.net/?retryWrites=true&w=majority".format(user, password)

client = MongoClient(uri)
covid_us = client.data.covid_us
us_states = client.data.us_states
to_insert_covid_us = []
to_insert_us_states = []

# Process Daily CoViD data
with open("covid-data-states.csv", "r") as datafile:
    linecount = 0
    attributes = []

    for line in datafile:
        elements = line[:-1].split(",")

        if linecount == 0: 
            for attribute in elements: attributes.append(attribute)

        else:
            date = elements[0]
            covid_doc = {"date" : datetime(int(date[:4]), int(date[4:6]), int(date[6:]))}

            for i, attribute in enumerate(attributes[1:]): 
                value = elements[i + 1]
                if len(value) == 0: continue
                if attribute != "state_code" and attribute != "data_quality_grade": value = int(value)

                covid_doc[attribute] = value

            to_insert_covid_us.append(covid_doc)

        linecount += 1

covid_us.insert_many(to_insert_covid_us)
covid_us.create_index([("state_code", 1), ("date", 1)])
covid_us.create_index([("state_code", 1), ("new_cases", 1)])

# Import state names
with open("state_abbreviations.csv", "r") as datafile:
    linecount = 0

    for line in datafile:
        linecount += 1
        if linecount == 1: continue

        elements = remove_quotes(line[:-1].split(","))
        to_insert_us_states.append({"state_code" : elements[1], "location" : elements[0]})

us_states.insert_many(to_insert_us_states)
us_states.create_index([("state_code", 1)])

# Import state areas
with open("state_areas.csv", "r") as datafile:
    linecount = 0

    for line in datafile:
        linecount += 1
        if linecount == 1: continue
        
        elements = remove_quotes(line[:-1].split(","))
        state_name = elements[0]; area_sq_miles = int(elements[1])
        us_states.update_one({"location" : state_name}, {"$set": {"area_sq_miles": area_sq_miles}})


#Import state populations
with open("state_populations.csv", "r") as datafile:
    linecount = 0

    for line in datafile:
        linecount += 1
        if linecount == 1: continue

        elements = remove_quotes(line[:-1].split(","))
        state_name = elements[0]; population = int(elements[1])
        state_area = us_states.find_one({"location" : state_name})["area_sq_miles"]
        population_density = population / state_area
        us_states.update_one({"location" : state_name}, {"$set" : {"population" : population, "pop_density_per_sq_mile" : population_density}})

us_states.create_index([("population", 1)])

# Import state hospital stats
with open("state_hospital_data.csv", "r") as datafile:
    linecount = 0

    for line in datafile:
        linecount += 1
        if linecount == 1: continue

        elements = remove_quotes(line[:-1].split(","))
        state_code = elements[0][:2] 
        hospitals = int(elements[1])
        staffed_beds = int(elements[2])
        gpr = int(elements[3][1:-3])

        population = us_states.find_one({"state_code" : state_code})["population"]
        us_states.update_one({"state_code" : state_code}, {"$set" : {"hospitals" : hospitals, "hospital_beds" : staffed_beds, \
            "hospital_beds_per_thousand" : staffed_beds / population * 1000, "gross_patient_revenue_2019_thousands_USD" : gpr}})

us_states.create_index([("hospital_beds_per_thousand", 1)])

client.close()
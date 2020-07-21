from pymongo import MongoClient
import getpass
import csv
from datetime import datetime

user = "root"
password = getpass.getpass()
uri = "mongodb+srv://{}:{}@data.ybs5g.mongodb.net/?retryWrites=true&w=majority".format(user, password)

client = MongoClient(uri)
db = client.data

# Data Parameters
data_prefix = "covid_countries"
scale = 9 # Order of magnitude measurements are in, e.g. 9 is 10^9 = billions

with open("{}.csv".format(data_prefix)) as in_data:
    reader = csv.reader(in_data, delimiter=',')
    linecount = 0
    attributes = []
    quarter_to_month_day = {1 : (3, 31), 2: (6, 30), 3 : (9, 30), 4 : (12, 31)}
    to_insert = {}

    for line in reader:
        if linecount == 0:
            for attribute in line: attributes.append(attribute.lower().replace(" ", "_"))

            for attribute in attributes[1:]:
                current_collections = db.list_collection_names()
                collection_name = "{}_{}".format(data_prefix, attribute)
                if collection_name not in current_collections:
                    db.create_collection(collection_name)

                to_insert[collection_name] = []

        else:
            year = 2000 + int(line[0][-2:])
            quarter = int(line[0][0])
            month = quarter_to_month_day[quarter][0]
            day = quarter_to_month_day[quarter][1]   

            for i, attribute in enumerate(attributes[1:]):
                collection_name = "{}_{}".format(data_prefix, attribute)
                to_insert[collection_name].append({"date" : datetime(year, month, day), "revenue" : float(line[i + 1]), "scale" : 9})           

        linecount += 1

    for collection_name in to_insert.keys():
        collection = getattr(db, collection_name)
        collection.insert_many(to_insert[collection_name])

    


from pymongo import MongoClient
import getpass
import csv
from datetime import datetime

user = "readuser"
password = getpass.getpass()
uri = "mongodb+srv://{}:{}@data.ybs5g.mongodb.net/?retryWrites=true&w=majority".format(user, password)

client = MongoClient(uri)
world_countries = client.data.world_countries

filenames = ["NAMR", "SAMR", "EU", "MENA", "SSAF", "SSEAS", "EAS", "OCN"]

for name in filenames:
    f = open(name + "_countries", "r")

    for country in f:
        print(world_countries.find_one({"location": country[:-1]}))
        world_countries.update_one({"location": country}, {"$set": {"region_code": name}})
    
    f.close()

client.close()

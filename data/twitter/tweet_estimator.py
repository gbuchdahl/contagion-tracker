import GetOldTweets3 as got
import pandas as pd

from pymongo import MongoClient
import getpass
import csv
from datetime import datetime
import datetime
from time import sleep

# Convert datetime to yyyy-mm-dd
def convert_to_string(date):
    return "{}-{}-{}".format(date.year, date.month, date.day)

# Add key to dataset. If key already exists in dataset, increment count
def record(dataset, key):
    if key in dataset: dataset[key] += 1
    else: dataset[key] = 1

# Change Depending on Regions
locations = [("NAMR", "43, -102", "4500km"), ("SAMR", "-25, -61", "4250km"), ("EU", "55, 13", "2550km"), \
             ("MENA", "18.5, 30.4", "3000km"), ("SSAF", "-12, 10.1", "4000km"), ("SSEAS", "17.6, 79.8", "3500km"), \
             ("EAS", "43.1, 124", "3500km"), ("OCN", "-12.5, 136.9", "5000km")]

# MongoDB Connection
user = "root"
password = "contagion"
uri = "mongodb+srv://{}:{}@data.ybs5g.mongodb.net/?retryWrites=true&w=majority".format(user, password)
client = MongoClient(uri)
db = client.data

sample_size = 12000 # Number of tweets to sample
period_size = 10 # Number of days in a data point

for loc_name, coordinates, search_range in locations:

    for start_date in pd.date_range(start="2019-12-31", end="2020-07-20", freq="{}D".format(period_size)):
        to_insert = []
        counts = {}
        total_tweets = 0

        end_date = start_date + datetime.timedelta(days=period_size - 1)
        for day in pd.date_range(start=convert_to_string(start_date), end=convert_to_string(end_date)):
            tomorrow = day + datetime.timedelta(days=1)
            today_string = convert_to_string(day); tomorrow_string = convert_to_string(tomorrow)

            tweetCriteria = got.manager.TweetCriteria().setNear(coordinates).setWithin(search_range).setTopTweets(True).\
                            setSince(today_string).setUntil(tomorrow_string).setMaxTweets(sample_size / period_size)

            tweets = got.manager.TweetManager.getTweets(tweetCriteria)
            total_tweets += len(tweets)

            for tweet in tweets:
                if len(tweet.hashtags) == 0: continue

                hashtags = tweet.hashtags.split(" ")
                for hashtag in hashtags: record(counts, hashtag.lower())
            
        for hashtag in counts: 
            to_insert.append({"region_code" : loc_name, "start_date": start_date, "end_date": end_date, \
                                "hashtag" : hashtag, "frequency_per_thousand": counts[hashtag] * 1000 / total_tweets})

        db.hashtags.insert_many(to_insert)
        sleep(930) # Stop requests for ~15 min to avoid being rate limited

# Create Text Index (comment out if already done)
# db.hashtags.create_index([("start_date", 1), ("region", 1), ("frequency_per_thousand", 1)])
# db.hashtags.create_index([("start_date", 1), ("region", 1), ("hashtag", "text")])

client.close()

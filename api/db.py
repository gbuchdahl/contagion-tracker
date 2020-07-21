from flask_pymongo import PyMongo
import utils

def set_db(app):
    """
    set global variable db_ to the db field of the current PyMongo instance
    if this fails, raise a RuntimeError
    """
    global db_
    db_ = PyMongo(app).db
    if db_ is None:
        raise RuntimeError("db_ not created")


def get_by_state_and_date(stateCode, date):
    """
    return document from db_.covid_us with 'state_code' field
           that matches stateCode and 'date' field that matches date

           if date is None, return most recent document
           with 'state_code' field matching stateCode 
    """
    if not (date is None):
        res = db_.covid_us.find_one(
                {
                    "state_code": stateCode.upper(),
                    "date": date
                })
    else: # return most recent datapoint if date is None
        res = db_.covid_us.aggregate(
                [
                    {"$match": {"state_code": stateCode.upper()}},
                    {"$sort": {"date": -1}},
                    {"$limit": 1}
                ])
        res = res.next()
    if res:
        res["_id"] = str(res["_id"])
        return res
    return utils.DOCUMENT_NOT_FOUND 


def get_by_country_and_date(countryCode, date):
    """
    return document from db_.covid_world with 'country_code' field
           that matches countryCode and 'date' field that matches date

           if date is None, return most recent document
           with 'country_code' field matching countryCode
    """
    if (not date is None):
        res = db_.covid_world.find_one(
                {
                    "country_code": countryCode.upper(),
                    "date": date
                })
    else: # return most recent data point if date is None 
        res = db_.covid_world.aggregate(
                [
                    {"$match": {"country_code": countryCode.upper()}},
                    {"$sort": {"date": -1}},
                    {"$limit": 1}
                ])
        res = res.next()
    if res:
        res["_id"] = str(res["_id"])
        return res
    return utils.DOCUMENT_NOT_FOUND 

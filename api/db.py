from flask_pymongo import PyMongo
import utils

def set_db(app):
    global db_
    db_ = PyMongo(app).db
    if db_ is None:
        raise RuntimeError("db_ not created")

def get_by_state_and_date(stateAbbrv, date):
    res = db_.covid_us.find_one(
            {
                "state_code": stateAbbrv.upper(),
                "date": date
            })

    if res:
        res["_id"] = str(res["_id"])
        return res
    return utils.DOCUMENT_NOT_FOUND 

def get_by_country_and_date(countryCode, date):
    res = db_.covid_world.find_one(
            {
                "country_code": countryCode.upper(),
                "date": date
            })
    if res:
        res["_id"] = str(res["_id"])
        return res
    return utils.DOCUMENT_NOT_FOUND 

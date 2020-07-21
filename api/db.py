from flask_pymongo import PyMongo

def set_db(app):
    global db_
    db_ = PyMongo(app).db

def get_by_state_and_date(stateAbbrv, date):
    return db_.covid_us.find_one(
            {
                "state_abbrv": stateAbbrv.upper(),
                "date": date
            })

def get_by_country_and_date(countryCode, date):
    return db_.covid_world.find_one(
            {
                "country_code": countryCode.upper(),
                "date": date
            })

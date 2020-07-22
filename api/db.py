from flask_pymongo import PyMongo
from exceptions import DocumentNotFoundException
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


def get_us_dpm_by_date(date):
    dateMatch  = {
                    '$match': {
                        'date': date,
                        'new_deaths': {'$type': 'int'}
                        }
                    }
    lookupStage  = {
                        '$lookup': {
                            'from': 'us_states', 
                            'localField': 'state_code', 
                            'foreignField': 'state_code', 
                            'as': 'data'
                        }
                    }
    dataExistsMatch = {
            '$match': {
                '$and': [
                    {'data': {'$size': 1}},
                    {'data.0.population': {'$exists': True}}
                    ]
                }
            }
    
    addDataStage = {
                        '$addFields': {
                            'data': {
                                '$arrayElemAt': [
                                    '$data', 0
                                ]
                            }
                        }
                    }

    projectionStage = {
                        '$project': {
                            'new_deaths_per_million': {
                                '$round': [
                                    {'$multiply': [
                                        {
                                            '$divide': [
                                                '$new_deaths', '$data.population'
                                            ]
                                        }, 1000000
                                    ]}
                                , 3]
                            },
                            'state_code':1,
                            'date':1,
                            '_id': 0
                        }
                    }
    res = db_.covid_us.aggregate(
            [
                dateMatch,
                {"$sort": {"state_code": 1}},
                lookupStage,
                dataExistsMatch,
                addDataStage,
                projectionStage
            ])
    if res:
        resList = list(res)
        rv = {"date": date, "len": len(resList), "val": resList} 
        return rv
    raise DocumentNotFoundException()


# TODO: fix error with aggregation and StopIteration
def get_dpm_by_state_and_date(stateCode, date):
    """
    return document from db_.covid_us with 'state_code' field
           that matches stateCode and 'date' field that matches date
           projecting only the new_deaths_per_million, state_code, date

           if date is None, return most recent document
           with 'state_code' field matching stateCode 
    """
    dateMatch  = {
                    '$match': {
                        'state_code': stateCode.upper(),
                        'date': date,
                        }
                    }
    noDateMatch = {
            '$match': {
                'state_code': stateCode.upper(),
                }
            }
    lookupStage  = {
                        '$lookup': {
                            'from': 'us_states', 
                            'localField': 'state_code', 
                            'foreignField': 'state_code', 
                            'as': 'data'
                        }
                    }
    dataExistsMatch = {
            '$match': {
                '$and': [
                    {'data': {'$size': 1}},
                    {'data.0.population': {'$exists': True}}
                    ]
                }
            }
    addDataStage = {
                        '$addFields': {
                            'data': {
                                '$arrayElemAt': [
                                    '$data', 0
                                ]
                            }
                        }
                    }
    projectionStage = {
                        '$project': {
                            'new_deaths_per_million': {
                                '$round': [
                                    {'$multiply': [
                                        {
                                            '$divide': [
                                                '$new_deaths', '$data.population'
                                            ]
                                        }, 1000000
                                    ]}
                                , 3]
                            },
                            'state_code':1,
                            'date':1,
                            '_id': 0
                        }
                    }
    if date:
        res = db_.covid_us.aggregate(
                [
                    dateMatch,
                    {'$limit': 1}, 
                    lookupStage,
                    dataExistsMatch,
                    addDataStage,
                    projectionStage
                ])
    else: # return most recent datapoint if date is None
        res = db_.covid_us.aggregate(
                [
                    noDateMatch,
                    {'$sort': {'date': -1}},
                    {'$limit': 1}, 
                    lookupStage,
                    dataExistsMatch,
                    addDataStage,
                    projectionStage
                ])
    if res:
        for r in res:
            res = r
            break
        return res
    raise DocumentNotFoundException() 

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
        if res:
            for r in res:
                res = r
                break
    if res:
        res["_id"] = str(res["_id"])
        return res
    raise DocumentNotFoundException() 


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
        if res:
            for r in res:
                res = r
                break
    if res:
        res["_id"] = str(res["_id"])
        return res
    raise DocumentNotFoundException() 


def get_dpm_by_country_and_date(countryCode, date):
    """
    return document from db_.covid_world with 'country_code' field
           that matches countryCode and 'date' field that matches date
           projecting only the new_deaths_per_million, country_code and date

           if date is None, return most recent document
           with 'country_code' field matching countryCode
    """
    dateMatchStage = {'$match': {'country_code': countryCode.upper(), 'date': date}}
    noDateMatchStage = {'$match': {'country_code': countryCode.upper()}}
    projectionStage = {
            '$project': {
                    'new_deaths_per_million': 1,
                    'country_code':1,
                    'date':1,
                    '_id':0
                    }
                }
    if date:
        res = db_.covid_world.aggregate(
                [
                    dateMatchStage,
                    {'$limit': 1},
                    projectionStage
                ])
    else: # return most recent datapoint if date is None
        res = db_.covid_world.aggregate(
                [
                    noDateMatchStage,
                    {'$sort': {'date': -1}},
                    {'$limit': 1}, 
                    projectionStage
                ])

    if res:
        for r in res:
            res = r
            break
        return res
    raise DocumentNotFoundException() 


def get_world_dpm_by_date(date):
    res = db_.covid_world.aggregate(
            [
                {"$match": {"date":date}},
                {"$sort": {"country_code": 1}},
                {"$project": {
                    "new_deaths_per_million": 1,
                    "country_code": 1,
                    "date": 1,
                    "_id": 0
                    }
                }
            ])
    if res:
        resList = list(res)
        rv = {"date": date, "len": len(resList), "val": resList}
        return rv
    raise DocumentNotFoundException()

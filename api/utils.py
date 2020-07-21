import datetime
from flask import request
from country_codes import COUNTRY_CODES
import state_codes

INVALID_STATE_STR ="Error! State code: <b>{}</b> is invalid" 
INVALID_COUNTRY_STR ="Error! Country code: <b>{}</b> is invalid" 
DOCUMENT_NOT_FOUND = {"error": "Document not found"}

def get_date_from_args():
    """
    return -> datetime.datetime containing the date supplied in the url
               if no date is supplied, return None
    """
    date = request.args.get("date", default=None)
    if not (date is None):
        date = datetime.datetime.strptime(date, "%d_%m_%Y")
    return date

def validate_country_code(countryCode):
    """
    return True if countryCode is valid, False otherwise
    """
    return countryCode.upper() in COUNTRY_CODES


def validate_state_code(stateCode):
    """
    return True if stateCode is valid, False otherwise
    """
    return stateCode.upper() in state_codes.STATE_CODES

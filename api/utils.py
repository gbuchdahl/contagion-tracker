import datetime
from flask import request
import country_codes
import state_codes

from exceptions import InvalidDateException, InvalidWindowException

def get_date_from_args():
    """
    return -> datetime.datetime containing the date supplied in the url
               if no date is supplied, return None
    """
    date = request.args.get("date", default=None)
    if date:
        try:
            date = datetime.datetime.strptime(date, "%d_%m_%Y")
        except ValueError:
            raise InvalidDateException()
    return date

def get_window_from_args():
    window = request.args.get("window")
    if window is None:
        raise InvalidWindowException(window)
    
    try:
        window = int(window)
    except ValueError:
        raise InvalidWindowException(window)

    if window < 0:
        raise InvalidWindowException(window)
    return window

#def get_maxSize_from_args():
#    maxSize = requests.args.get("maxSize")
#    if maxSize is None:
#        raise InvalidSizeException(maxSize)


def validate_country_code(countryCode):
    """
    return True if countryCode is valid, False otherwise
    """
    return countryCode.upper() in country_codes.COUNTRY_CODES


def validate_state_code(stateCode):
    """
    return True if stateCode is valid, False otherwise
    """
    return stateCode.upper() in state_codes.STATE_CODES

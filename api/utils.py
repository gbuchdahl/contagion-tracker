import datetime
from flask import request
import country_codes
import state_codes

from exceptions import InvalidDateException, InvalidWindowException


def get_date_from_args():
    """Return datetime.datetime containing date supplied in global
    request object. If no date is supplied return None
    Raises InvalidDateException if date format is incorrect
    :rtype: datetime.datetime
    """
    date = request.args.get("date", default=None)
    if date:
        try:
            date = datetime.datetime.strptime(date, "%d_%m_%Y")
        except ValueError:
            raise InvalidDateException()
    return date


def get_window_from_args():
    """Return int value of window supplied in global request object
    If no window is specified or is not castable to int, raise
    InvalidWindowException.
    :rtype: int
    """
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


def get_maxSize_from_args():
    """Return int value of maxSize supplied in global request object
    If no maxSize is specified or is not castable to int, raise
    InvalidWindowException.
    :rtype: int
    """
    maxSize = request.args.get("maxSize")
    if maxSize is None:
        raise InvalidSizeException(maxSize)

    try:
        maxSize = int(maxSize)
    except ValueError:
        raise InvalidSizeException(maxSize)

    if maxSize < 0:
        raise InvalidSizeException(maxSize)
    return maxSize


def validate_country_code(countryCode):
    """Return True if countryCode is valid, false otherwise
    :param countryCode: ISO 3 code
    :type countryCode: str
    :rtype: bool
    """
    return countryCode.upper() in country_codes.COUNTRY_CODES


def validate_state_code(stateCode):
    """Return True if stateCode is valid, false otherwise
    :param stateCode: 2 letter state code
    :type stateCode: str
    :rtype: bool
    """
    return stateCode.upper() in state_codes.STATE_CODES

import datetime
from flask import Flask, request, render_template_string, render_template, abort, jsonify
import datetime
import re
import sys

import config
import exceptions
import utils
import db

app = Flask(__name__)
app.config["MONGO_URI"] = config.MONGO_URI

try:
    db.set_db(app)
except RuntimeError as e:
    print("Failed to set up database") 
    sys.exit(127)

@app.route("/time")
def get_time(): 
    """
    Return current time (test endpoint)
    """
    return {"time": datetime.datetime.now()}


@app.route("/")
def root_page():
    return render_template("nothing.html")


@app.route("/us/<stateCode>")
def get_by_state(stateCode, methods=["GET"]):
    """
    on GET request, if stateCode is valid, return
    document matching stateCode at the date supplied
    in the arguments

    If stateCode is invalid, respond with code 404
    and present error page

    On any other request respond with code 405
    """
    if request.method == "GET":
        date = utils.get_date_from_args()
        if (utils.validate_state_code(stateCode)):
            res = db.get_by_state_and_date(stateCode, date) 
            return res
        raise exceptions.InvalidStateException(stateCode)
    raise exceptions.InvalidRequestException(request.method)

@app.route("/us-dpm/<stateCode>")
def get_dpm_by_state(stateCode, methods=["GET"]):
    """
    on GET request, if stateCode is valid, return
    document matching stateCode at the date supplied
    in the arguments

    If stateCode is invalid, respond with code 404
    and present error page

    On any other request respond with code 405
    """
    if request.method == "GET":
        date = utils.get_date_from_args()
        if (utils.validate_state_code(stateCode)):
            res = db.get_dpm_by_state_and_date(stateCode, date) 
            return res
        raise exceptions.InvalidStateException(stateCode)
    raise exceptions.InvalidRequestException(request.method)

@app.route("/world/<countryCode>", methods=["GET"])
def get_by_country(countryCode):
    """
    on GET request, if countryCode is valid, return
    document matching countryCode at the date supplied
    in the arguments

    If countryCode is invalid, respond with code 404
    and present error page

    On any other request respond with code 405
    """
    if request.method == "GET":
        date = utils.get_date_from_args()
        if (utils.validate_country_code(countryCode)):
            res = db.get_by_country_and_date(countryCode, date)
            return res
        raise exceptions.InvalidCountryException(countryCode)
    raise exceptions.InvalidRequestException(request.method)

@app.route("/world-dpm/<countryCode>", methods=["GET"])
def get_dpm_by_country(countryCode):
    """
    on GET request, if countryCode is valid, return
    document matching countryCode at the date supplied
    in the arguments projecting only new_deaths_per_million,
    country_code and date

    If countryCode is invalid, respond with code 404
    and present error page

    On any other request respond with code 405
    """
    if request.method == "GET":
        date = utils.get_date_from_args()
        if (utils.validate_country_code(countryCode)):
            res = db.get_dpm_by_country_and_date(countryCode, date)
            return res
        raise exceptions.InvalidCountryException(countryCode)
    raise exceptions.InvalidRequestException(request.method)

@app.route("/us-dpm-by-date", methods=["GET"])
def get_us_dpm_by_date():
    if request.method == "GET":
        date = utils.get_date_from_args()
        res = db.get_us_dpm_by_date(date)
        return res
    raise exceptions.InvalidRequestException(request.method)

@app.route("/us-cpm-by-date", methods=["GET"])
def get_us_cpm_by_date():
    if request.method == "GET":
        date = utils.get_date_from_args()
        res = db.get_us_cpm_by_date(date)
        return res
    raise exceptions.InvalidRequestException(request.method)

@app.route("/world-dpm-by-date", methods=["GET"])
def get_world_dpm_by_date():
    if request.method == "GET":
        date = utils.get_date_from_args()
        res = db.get_world_dpm_by_date(date)
        return res
    raise exceptions.InvalidRequestException(request.method)

@app.route("/world-cpm-by-date", methods=["GET"])
def get_world_cpm_by_date():
    if request.method == "GET":
        date = utils.get_date_from_args()
        res = db.get_world_cpm_by_date(date)
        return res
    raise exceptions.InvalidRequestException(request.method)

@app.route("/world-dpm-avg-by-date", methods=["GET"])
def get_world_dpm_avg_by_date():
    if request.method == "GET":
        date = utils.get_date_from_args()
        window = utils.get_window_from_args()
        res = db.get_world_dpm_avg_by_date(date, window)
        return res
    raise exceptions.InvalidRequestException(request.method)


@app.route("/us-dpm-avg-by-date", methods=["GET"])
def get_us_dpm_avg_by_date():
    if request.method == "GET":
        date = utils.get_date_from_args()
        window = utils.get_window_from_args()
        res = db.get_us_dpm_avg_by_date(date, window)
        return res
    raise exceptions.InvalidRequestException(request.method)


@app.route("/world-cpm-avg-by-date", methods=["GET"])
def get_world_cpm_avg_by_date():
    if request.method == "GET":
        date = utils.get_date_from_args()
        window = utils.get_window_from_args()
        res = db.get_world_cpm_avg_by_date(date, window)
        return res
    raise exceptions.InvalidRequestException(request.method)


@app.route("/us-cpm-avg-by-date", methods=["GET"])
def get_us_cpm_avg_by_date():
    if request.method == "GET":
        date = utils.get_date_from_args()
        window = utils.get_window_from_args()
        res = db.get_us_cpm_avg_by_date(date, window)
        return res
    raise exceptions.InvalidRequestException(request.method)


@app.route("/world-hashtags/<countryCode>", methods=["GET"])
def get_world_hashtags(countryCode):
    if request.method == "GET":
        if utils.validate_country_code(countryCode):
            date = utils.get_date_from_args()
            res = db.get_hashtags_by_country(countryCode, date)
            return res
        raise exceptions.InvalidCountryException(countryCode)
    raise exceptions.InvalidRequestException(request.method)


@app.route("/world-hashtag-popularity/<countryCode>", methods=["GET"])
def get_world_hashtag_popularity(countryCode):
    if request.method == "GET":
        if utils.validate_country_code(countryCode):
            date = utils.get_date_from_args()
            maxSize = utils.get_maxSize_from_args()
            res = db.get_hashtag_pop_by_country(countryCode, date, maxSize)
            return res
        raise exceptions.InvalidCountryException(countryCode)
    raise exceptions.InvalidRequestException(request.method)


@app.errorhandler(exceptions.APIException)
def handle_date_error(error):
    return jsonify(error.to_dict()), error.get_status()


@app.errorhandler(404)
def handle_404(error):
    e = exceptions.UnknownRouteException(request.url)
    return jsonify(e.to_dict()), e.get_status()

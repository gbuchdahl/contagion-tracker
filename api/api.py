import datetime
from flask import Flask, request, render_template_string, render_template, abort
import datetime
import sys

import config
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
        return render_template_string(
                utils.INVALID_STATE_STR.format(stateCode)), 404

    abort(405)


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
        return render_template_string(
                utils.INVALID_STATE_STR.format(stateCode)), 404

    abort(405)


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
        return render_template_string(
                utils.INVALID_COUNTRY_STR.format(countryCode)), 404
    abort(405)


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
        return render_template_string(
                utils.INVALID_COUNTRY_STR.format(countryCode)), 404
    abort(405)

@app.errorhandler(405)
def wrong_request(error):
    return render_template_string(
            "{} request is not valid".format(request.method)), 405


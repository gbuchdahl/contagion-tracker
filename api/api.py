import datetime
from flask import Flask, request, render_template_string, abort
from flask_pymongo import PyMongo

import config
import utils

app = Flask(__name__)
app.config["MONGO_URI"] = config.MONGO_URI
mongo = PyMongo(app)
db = mongo.db


@app.route("/us/<stateAbbrv>")
def get_by_state(stateAbbrv, methods=["GET"]):
    if request.method == "GET":
        date = utils.get_date_from_args()

        if app.config["DEBUG"]:
            res = db["apple_revenue_americas"].find_one(
                    {"state_abbrv": stateAbbrv.upper(), "timestamp": date})
        else:
            res = db["us"].find_one(
                    {"state_abbrv": stateAbbrv.upper(), "timestamp": date})
        if res:
            res["_id"] = str(res["_id"])
            return res
        return {}
    else:
        abort(405)


@app.route("/world/<countryName>", methods=["GET"])
def get_by_country():
    if request.method == "GET":
        date = utils.get_date_from_args()

        if app.config["DEBUG"]:
            res = db["apple_revenue_americas"].find_one(
                    {"name": countryName.upper(), "timestamp": date})
        else:
            res = db["world"].find_one(
                    {"name": countryName.upper(), "timestamp": date})

        if res:
            res["_id"] = str(res["_id"])
            return res
        return {}
    else:
        abort(405)


@app.errorhandler(405)
def wrong_request(error):
    return render_template_string(
            "{} request is not valid".format(request.method)), 405

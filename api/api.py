import datetime
from flask import Flask, request, render_template_string, abort
from flask_pymongo import PyMongo

import config
import utils
import db

app = Flask(__name__)
app.config["MONGO_URI"] = config.MONGO_URI
db.set_db(app)

@app.route("/us/<stateAbbrv>")
def get_by_state(stateAbbrv, methods=["GET"]):
    if request.method == "GET":
        date = utils.get_date_from_args()
        res = db.get_by_state_and_date(stateAbbrv, date) 
        if res:
            res["_id"] = str(res["_id"])
            return res
        return utils.DOCUMENT_NOT_FOUND 
    else:
        abort(405)


@app.route("/world/<countryCode>", methods=["GET"])
def get_by_country(countryCode):
    if request.method == "GET":
        date = utils.get_date_from_args()
        res = db.get_by_country_and_date(countryCode, date)
        print(res)
        if res:
            res["_id"] = str(res["_id"])
            return res
        return utils.DOCUMENT_NOT_FOUND 
    else:
        abort(405)


@app.errorhandler(405)
def wrong_request(error):
    return render_template_string(
            "{} request is not valid".format(request.method)), 405

